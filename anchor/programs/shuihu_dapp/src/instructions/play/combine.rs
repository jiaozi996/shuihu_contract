use anchor_lang::prelude::*;

use crate::{
    constants::{SHUIHU_SEED,MINT_STATE_SEED}, 
    errors::ErrorCode, 
    state::{ShuiHu,HeroMintState}
};

use mpl_core::{
    accounts::{BaseAssetV1, BaseCollectionV1},
    instructions::  BurnV1CpiBuilder,
    types::UpdateAuthority,
    ID as MPL_CORE_ID,
};

use orao_solana_vrf::{
    RANDOMNESS_ACCOUNT_SEED,
    CONFIG_ACCOUNT_SEED,
    program::OraoVrf,
    state::NetworkState,
    cpi::{accounts::RequestV2, request_v2} 
};

#[derive(Accounts)]
#[instruction(force: Pubkey)]
pub struct SHCombine<'info> {
    #[account(mut)]
    pub minter: Signer<'info>,

    #[account(
        mut,
        seeds = [SHUIHU_SEED],
        bump = shuihu.bump,
        has_one = hero_collection,
    )]
    pub shuihu: Account<'info, ShuiHu>,

    #[account(
        init,
        payer = minter,
        space = 8 + HeroMintState::INIT_SPACE,
        seeds = [MINT_STATE_SEED, force.as_ref()],
        bump,
    )]
    pub hero_mint_state: Account<'info, HeroMintState>,

    #[account(
        mut,
        constraint = hero1.update_authority == UpdateAuthority::Collection(hero_collection.key()) @ ErrorCode::InvalidCollectionAuthority,
        constraint = hero1.owner == minter.key() @ ErrorCode::InvalidHeroOwner,
    )]
    pub hero1: Account<'info, BaseAssetV1>,

    #[account(
        mut,
        constraint = hero2.update_authority == UpdateAuthority::Collection(hero_collection.key()) @ ErrorCode::InvalidCollectionAuthority,
        constraint = hero2.owner == minter.key() @ ErrorCode::InvalidHeroOwner,
    )]
    pub hero2: Account<'info, BaseAssetV1>,

    #[account(
        mut,
        constraint = hero_collection.update_authority == shuihu.key() @ ErrorCode::InvalidCollectionAuthority,
    )]
    pub hero_collection: Account<'info, BaseCollectionV1>,

    /// CHECK: by orao_solana_vrf
    #[account(
        mut,
        seeds = [RANDOMNESS_ACCOUNT_SEED.as_ref(), force.as_ref()],
        bump,
        seeds::program = orao_solana_vrf::ID
    )]
    pub random: AccountInfo<'info>,

    /// CHECK: by orao_solana_vrf
    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [CONFIG_ACCOUNT_SEED],
        bump,
        seeds::program = orao_solana_vrf::ID
    )]
    pub config: Account<'info, NetworkState>,

    /// CHECK: by orao_solana_vrf
    pub vrf: Program<'info, OraoVrf>,

    #[account(address = MPL_CORE_ID)]
    /// CHECK: This is checked by the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,

}

pub fn process_combine(ctx: Context<SHCombine>, force: Pubkey,) -> Result<()> {
    // 1. 校验
    // 1.1 验证种子是否为空
    require!(force != Pubkey::default(), ErrorCode::VrfSeedIllegal);
    // 1.2. 验证英雄1, 英雄2是否为同一集合
    require!(
        ctx.accounts.hero1.key() != ctx.accounts.hero2.key(),
        ErrorCode::SameHeroNotAllowed
    );
    // 2. 销毁英雄1, 英雄2
    BurnV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.hero1.to_account_info())
    .collection(Some(&ctx.accounts.hero_collection.to_account_info()))
    .payer(&ctx.accounts.minter.to_account_info())
    .system_program(Some(&ctx.accounts.system_program.to_account_info()))
    .invoke()?;

    BurnV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.hero2.to_account_info())
    .collection(Some(&ctx.accounts.hero_collection.to_account_info()))
    .payer(&ctx.accounts.minter.to_account_info())
    .system_program(Some(&ctx.accounts.system_program.to_account_info()))
    .invoke()?;

    // 3. 保存铸造配置
    let hero_mint_state = &mut ctx.accounts.hero_mint_state;
    hero_mint_state.bump = ctx.bumps.hero_mint_state;
    hero_mint_state.minter = ctx.accounts.minter.key();
    hero_mint_state.hero = force;
    hero_mint_state.randomness = [0_u8;64];
    hero_mint_state.minted = false;

    // 4. 请求随机数
    let vrf_cpi_program = ctx.accounts.vrf.to_account_info();
    let vrf_cpi_accounts = RequestV2 {
        payer: ctx.accounts.minter.to_account_info(),
        network_state: ctx.accounts.config.to_account_info(),
        treasury: ctx.accounts.treasury.to_account_info(),
        request: ctx.accounts.random.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };
    let vrf_cpi_ctx = CpiContext::new(vrf_cpi_program, vrf_cpi_accounts);

    request_v2(vrf_cpi_ctx, force.to_bytes())?;
    
    Ok(())
}