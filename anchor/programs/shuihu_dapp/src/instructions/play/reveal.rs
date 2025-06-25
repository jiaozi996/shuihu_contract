use anchor_lang::prelude::*;
use crate::{
    state::{HeroMintState, ShuiHu},
    constants::{
        SHUIHU_SEED, 
        MINT_STATE_SEED, 
        HERO_INFO, 
        HERO_NAME,
        BASE_ASSETS_URI
    },
    errors::ErrorCode,
};

use orao_solana_vrf::{
    RANDOMNESS_ACCOUNT_SEED,
    CONFIG_ACCOUNT_SEED,
    program::OraoVrf,
    state::{
        NetworkState, 
        RandomnessAccountData
    },
};

use mpl_core::{
    accounts::BaseCollectionV1,
    instructions::CreateV1CpiBuilder,
    types::{
        PluginAuthorityPair, 
        PluginAuthority,
        Attribute,
        Plugin,
        Attributes,
    },
    ID as MPL_CORE_ID,
};


#[derive(Accounts)]
pub struct SHReveal<'info> {
    #[account(mut)]
    pub minter: Signer<'info>,

    #[account(mut)]
    pub hero: Signer<'info>,

    #[account(
        mut,
        seeds = [SHUIHU_SEED],
        bump = shuihu.bump,
        has_one = hero_collection,
    )]
    pub shuihu: Account<'info, ShuiHu>,

    #[account(
        mut,
        seeds = [MINT_STATE_SEED, hero.key().as_ref()],
        bump = hero_mint_state.bump,
    )]
    pub hero_mint_state: Account<'info, HeroMintState>,

    #[account(
        mut,
        constraint = hero_collection.update_authority == shuihu.key() @ ErrorCode::InvalidCollectionAuthority,
    )]
    pub hero_collection: Account<'info, BaseCollectionV1>,

    /// CHECK: Treasury
    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    /// CHECK: by orao_solana_vrf
    #[account(
        mut,
        seeds = [RANDOMNESS_ACCOUNT_SEED.as_ref(), hero.key().as_ref()],
        bump,
        seeds::program = orao_solana_vrf::ID
    )]
    pub random: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [CONFIG_ACCOUNT_SEED.as_ref()],
        bump,
        seeds::program = orao_solana_vrf::ID
    )]
    pub config: Account<'info, NetworkState>,

    pub vrf: Program<'info, OraoVrf>,

    #[account(address = MPL_CORE_ID)]
    /// CHECK: This is checked by the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn process_reveal(ctx: Context<SHReveal>) -> Result<()> {
    // 1. 校验
    let hero_mint_state = &mut ctx.accounts.hero_mint_state;
    // 1.1 验证英雄是否已铸造
    require!(!hero_mint_state.minted, ErrorCode::AlreadyMinted);
    // 1.2 验证minter是否一致
    require!(hero_mint_state.minter == ctx.accounts.minter.key(), ErrorCode::InvalidMinter);

    // 2. 获取随机数
    let randomness = get_randomness_data(&ctx.accounts.random)?;
    let Some(randomness) = randomness else {
        return Err(ErrorCode::ResultNotReady.into());
    };

    // 2.1 验证随机数是否全为0（未初始化）
    let is_zero = randomness.iter().all(|&x| x == 0);
    require!(!is_zero, ErrorCode::InvalidRandomness);

    // 3. 计算英雄索引
    let hero_index = calculate_hero_index(randomness)?;
    msg!("Randomness: {:?}", randomness);
    // 4. 更新英雄铸造状态
    hero_mint_state.minted = true;
    hero_mint_state.randomness = randomness;
    hero_mint_state.result = hero_index;

    // 5. mpl-core铸造英雄
    let shuihu_signer_seeds: &[&[&[u8]]] = &[&[
        SHUIHU_SEED,
        &[ctx.accounts.shuihu.bump]
    ]];

    let hero_name = format!("{} #{}", HERO_NAME, hero_index+1);
    let hero_uri = format!("{}{}", BASE_ASSETS_URI, HERO_INFO[hero_index as usize].uri.to_string());
    let hero_star: u8 = HERO_INFO[hero_index as usize].star;

    let attribute_list: Vec<Attribute> = vec![
        Attribute {
            key: "Index".to_string(),
            value: hero_index.to_string(),
        },
        Attribute {
            key: "Star".to_string(),
            value: hero_star.to_string(),
        },
    ];

    let mut hero_plugin: Vec<PluginAuthorityPair> = vec![];
    hero_plugin.push(PluginAuthorityPair {
        plugin: Plugin::Attributes(Attributes { attribute_list }),
        authority: Some(PluginAuthority::UpdateAuthority),
    });

    CreateV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.hero.to_account_info())
    .collection(Some(&ctx.accounts.hero_collection.to_account_info()))
    .payer(&ctx.accounts.minter.to_account_info())
    .authority(Some(&ctx.accounts.shuihu.to_account_info()))
    .owner(Some(&ctx.accounts.minter.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(hero_name)
    .uri(hero_uri)
    .plugins(hero_plugin)
    .invoke_signed(shuihu_signer_seeds)?;

    Ok(())
}

/**
 * @name get_randomness_data
 * @description 获取随机数
 * @param account_info 随机数账户信息
 * @returns 随机数
*/
fn get_randomness_data(account_info: &AccountInfo) -> Result<Option<[u8; 64]>> {
    if account_info.data_is_empty() {
        return Err(ErrorCode::ResultNotReady.into());
    }
    let account = RandomnessAccountData::try_deserialize(&mut &account_info.data.borrow()[..])?;
    Ok(account.fulfilled_randomness().copied())
}
/**
 * @name calculate_hero_index
 * @description 计算英雄索引
 * @param randomness 随机数
 * @returns 英雄索引
*/
fn calculate_hero_index(randomness: [u8; 64]) -> Result<u8> {
    let revealed_random_value_u64 = u64::from_le_bytes(randomness[0..8].try_into().expect("slice with incorrect length"));
    let total_probability: u64 = HERO_INFO.iter().map(|info| info.probability as u64).sum();
    
    if total_probability == 0 {
        return Err(ErrorCode::InvalidHeroIndex.into());
    }

    let remainder = revealed_random_value_u64 % total_probability;
    let mut cumulative_probability = 0;
    let hero_index = HERO_INFO.iter().position(|info| {
        cumulative_probability += info.probability as u64;
        cumulative_probability > remainder
    }).ok_or(ErrorCode::InvalidHeroIndex)?;

    Ok(hero_index as u8)
}