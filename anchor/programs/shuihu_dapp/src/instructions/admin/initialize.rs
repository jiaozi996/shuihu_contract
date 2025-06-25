use anchor_lang::{
    prelude::*, 
    system_program::{transfer, Transfer},
    solana_program::rent::{
        DEFAULT_EXEMPTION_THRESHOLD, DEFAULT_LAMPORTS_PER_BYTE_YEAR
    }
};

use anchor_spl::token_interface::{
    token_metadata_initialize, Mint, Token2022, TokenMetadataInitialize,
};

use mpl_core::{
    instructions::CreateCollectionV1CpiBuilder,
    ID as MPL_CORE_ID,
};

use spl_token_metadata_interface::state::TokenMetadata;
use spl_type_length_value::variable_len_pack::VariableLenPack;

use crate::{
    state::ShuiHu, 
    constants::{
        SHUIHU_SEED, 
        TOKEN_MINT_SEED, 
        MINT_DECIMALS, 
        START_ROUND, 
        START_MINT_PRICE, 
        HERO_COL_NAME, 
        HERO_COL_URI,
        TOKEN_NAME,
        TOKEN_SYMBOL,
        TOKEN_URI,
        BASE_ASSETS_URI
    }
};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + ShuiHu::INIT_SPACE,
        seeds = [SHUIHU_SEED],
        bump
    )]
    pub shuihu: Account<'info, ShuiHu>,

    #[account(
        init,
        payer = payer,
        seeds = [TOKEN_MINT_SEED, shuihu.key().as_ref()],
        bump,
        mint::decimals = MINT_DECIMALS,
        mint::authority = token_mint,
        extensions::metadata_pointer::authority = payer,
        extensions::metadata_pointer::metadata_address = token_mint,
    )]
    pub token_mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub hero_collection: Signer<'info>,

    #[account(address = MPL_CORE_ID)]
    /// CHECK: This is checked by the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn process_initialize(ctx: Context<Initialize>, start_time: u64, team: Pubkey) -> Result<()> {

    // 1. 初始化配置账户
    *ctx.accounts.shuihu = ShuiHu {
        round: START_ROUND,
        mint_price: START_MINT_PRICE,
        bump: ctx.bumps.shuihu,
        start_time: start_time,
        token_mint: ctx.accounts.token_mint.key(),
        bump_token_mint: ctx.bumps.token_mint,
        hero_collection: ctx.accounts.hero_collection.key(),
        bonus: 0,
        team: team,
    };

    // 2. 初始化英雄合集
    CreateCollectionV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .collection(&ctx.accounts.hero_collection.to_account_info())
    .update_authority(Some(&ctx.accounts.shuihu.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(HERO_COL_NAME.to_string())
    .uri(format!("{}{}", BASE_ASSETS_URI, HERO_COL_URI))
    .plugins(vec![])
    .invoke()?;

    // 3. 初始化元宝token元数据
    let token_metadata = TokenMetadata {
        name: TOKEN_NAME.to_string(),
        symbol: TOKEN_SYMBOL.to_string(),
        uri: format!("{}{}", BASE_ASSETS_URI, TOKEN_URI),
        ..Default::default()
    };
    
    // 3.1 计算数据长度
    let data_len = 4 + token_metadata.get_packed_len()?;
    let rent_lamports =
        data_len as u64 * DEFAULT_LAMPORTS_PER_BYTE_YEAR * DEFAULT_EXEMPTION_THRESHOLD as u64;
   
    // 3.2 向代币账户转移租金
    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.token_mint.to_account_info(),
            },
        ),
        rent_lamports,
    )?;

     // 4. 初始化元宝的metadata
    let binding_shuihu_key = ctx.accounts.shuihu.key();

    let signer_seeds: &[&[&[u8]]] = &[
        &[
            TOKEN_MINT_SEED, 
            binding_shuihu_key.as_ref(),
            &[ctx.bumps.token_mint]
        ]
    ];

    token_metadata_initialize(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            TokenMetadataInitialize {
                token_program_id: ctx.accounts.token_program.to_account_info(),
                mint: ctx.accounts.token_mint.to_account_info(),
                metadata: ctx.accounts.token_mint.to_account_info(),
                mint_authority: ctx.accounts.token_mint.to_account_info(),
                update_authority: ctx.accounts.shuihu.to_account_info(),
            },
            &signer_seeds,
        ),
        TOKEN_NAME.to_string(),
        TOKEN_SYMBOL.to_string(),
        format!("{}{}", BASE_ASSETS_URI, TOKEN_URI),
    )?;

    Ok(())
}