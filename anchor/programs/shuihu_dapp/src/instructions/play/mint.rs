use anchor_lang::{ 
    prelude::*, 
    system_program::{
        Transfer, transfer
    }
};

use crate::{
    constants::{
        MINT_STATE_SEED, 
        SHUIHU_SEED, 
        TOKEN_MINT_SEED
    }, 
    errors::ErrorCode, 
    events::MintEvent, 
    state::{
        HeroMintState, 
        ShuiHu
    }
};

use orao_solana_vrf::{
    RANDOMNESS_ACCOUNT_SEED,
    CONFIG_ACCOUNT_SEED,
    program::OraoVrf,
    state::NetworkState,
    cpi::{accounts::RequestV2, request_v2} 
};

use anchor_spl::{
    associated_token::AssociatedToken, 
    token_interface::{
        Mint, 
        Token2022, 
        TokenAccount
    },
    token_2022::{mint_to,MintTo},
};

#[derive(Accounts)]
#[instruction(force: Pubkey)]
pub struct SHMint<'info> {
    #[account(mut)]
    pub minter: Signer<'info>,

    #[account(
        mut,
        seeds = [SHUIHU_SEED],
        bump = shuihu.bump,
        has_one = token_mint,
    )]
    pub shuihu: Account<'info, ShuiHu>,

    #[account(mut)]
    pub token_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init_if_needed,
        payer = minter,
        associated_token::mint = token_mint,
        associated_token::authority = minter,
        associated_token::token_program = token_program
    )]
    pub miner_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = minter,
        space = 8 + HeroMintState::INIT_SPACE,
        seeds = [MINT_STATE_SEED, force.as_ref()],
        bump,
    )]
    pub hero_mint_state: Account<'info, HeroMintState>,

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

    pub token_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn process_mint(ctx: Context<SHMint>, force: Pubkey,) -> Result<()> {

    // 1. 校验
    // 1.1 获取铸造英雄状态
    let shuihu: &mut Account<'_, ShuiHu> = &mut ctx.accounts.shuihu;
    // 1.2 获取时间戳
    let clock = Clock::get()?;
    // 1.3 验证活动是否开始
    require!(shuihu.start_time <= clock.unix_timestamp as u64, ErrorCode::MintNotAvailable);

    // 1.4 验证种子是否为空
    require!(force != Pubkey::default(), ErrorCode::VrfSeedIllegal);

    // 2. 保存铸造配置
    let hero_mint_state = &mut ctx.accounts.hero_mint_state;
    hero_mint_state.bump = ctx.bumps.hero_mint_state;
    hero_mint_state.minter = ctx.accounts.minter.key();
    hero_mint_state.hero = force;
    hero_mint_state.randomness = [0_u8;64];
    hero_mint_state.minted = false;

    // 3. 铸造费用支付
    // 3.1 支付铸造英雄费用
    transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.minter.to_account_info(),
                to: shuihu.to_account_info(),
            }
        ),
        shuihu.mint_price  
    )?; 

    // 3.2 奖池记录增加
    shuihu.bonus += shuihu.mint_price;

    // 4. 奖励minter元宝
    let binding_shuihu_key = shuihu.key();
    let token_mint_signer_seeds: &[&[&[u8]]] = &[
        &[
            TOKEN_MINT_SEED,
            binding_shuihu_key.as_ref(),
            &[shuihu.bump_token_mint]
        ]
    ];

    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.token_mint.to_account_info(),
                to: ctx.accounts.miner_token_account.to_account_info(),
                authority: ctx.accounts.token_mint.to_account_info(),
            },
            token_mint_signer_seeds
        ),
        shuihu.mint_price,
    )?;

    // 5. 请求随机数
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


    // 6 emit event 
    emit!(MintEvent {
        round: shuihu.round,
        bonus:  shuihu.bonus,
        minter: ctx.accounts.minter.key()
    });

    Ok(())
}