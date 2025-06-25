use anchor_lang::prelude::*;

use crate::{
    constants::{
        HERO_INFO, 
        ROUND_CLAIM_SEED, 
        SHUIHU_SEED, 
        START_MINT_PRICE, 
        USER_COLLECTION_SEED
    }, 
    errors::ErrorCode, 
    events::ClaimEvent, 
    state::{
        RoundClaim, 
        ShuiHu, 
        UserCollection
    }
};

#[derive(Accounts)]
pub struct ClaimBonus<'info> {
    #[account(mut)]
    pub minter: Signer<'info>,

    #[account(
        mut,
        seeds = [SHUIHU_SEED],
        bump = shuihu.bump,
        has_one = team,
    )]
    pub shuihu: Account<'info, ShuiHu>,

    #[account(
        init,
        payer = minter,
        space = 8 + RoundClaim::INIT_SPACE,
        seeds = [ROUND_CLAIM_SEED, &[shuihu.round]],
        bump,
    )]
    pub round_claim: Account<'info, RoundClaim>,

    #[account(
        mut,
        seeds = [USER_COLLECTION_SEED, minter.key().as_ref()],
        bump = user_collection.bump,
    )]
    pub user_collection: Account<'info, UserCollection>,

    #[account(mut)]
    pub team: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}


pub fn process_claim(ctx: Context<ClaimBonus>) -> Result<()> {

    let user_collection = &mut ctx.accounts.user_collection;
    let shuihu = &mut ctx.accounts.shuihu;

    // 1. 检查是否收集完成
    require!(
        user_collection.collection.iter().all(|&x| x == 1),
        ErrorCode::CollectNotCompleted
    );

    // 1.1 检查collection长度是否正确
    require!(
        user_collection.collection.len() == HERO_INFO.len(),
        ErrorCode::InvalidCollectionLen
    );

    // 1.2 检查本轮是否领取过奖励
    require!(
        ctx.accounts.round_claim.minter == Pubkey::default(),
        ErrorCode::RoundAlreadyClaimed
    );
    
    // 1.3 检查奖励是否为空
    require!(shuihu.bonus > 0, ErrorCode::EmptyBonus);

    // 2.1 计算奖金
    let bonus_amount = shuihu.bonus.checked_div(2).ok_or(ErrorCode::MathOverflow)?;

    // 2.2 团队是总额的0.5% 即 total_bonus_amount * 0.01
    let team_bonus_amount = bonus_amount
    .checked_div(100)
    .ok_or(ErrorCode::MathOverflow)?;

    // 2.3 用户 49.5%
    let user_bonus_amount = bonus_amount
        .checked_sub(team_bonus_amount)
        .ok_or(ErrorCode::MathOverflow)?;

    // 4. 真正发放奖励
    **shuihu.to_account_info().lamports.borrow_mut() -= bonus_amount;
    **ctx.accounts.minter.to_account_info().lamports.borrow_mut() += user_bonus_amount;
    **ctx.accounts.team.to_account_info().lamports.borrow_mut() += team_bonus_amount;

    // 3.1 更新 round_claim状态
    let current_round = shuihu.round;
    *ctx.accounts.round_claim = RoundClaim {
        bump: ctx.bumps.round_claim,
        round: current_round,
        minter: ctx.accounts.minter.key(),
        claimed_amount: user_bonus_amount,
        timestamp: Clock::get()?.unix_timestamp as i64,
    };

    // 3.2 更新shuihu状态
    shuihu.bonus = shuihu.bonus.checked_sub(bonus_amount).ok_or(ErrorCode::MathOverflow)?;
    shuihu.round += 1;
    shuihu.mint_price = cal_mint_price(shuihu.round)?;

    // 3.3 更新 玩家 hero_collection状态
    user_collection.collection = [0; HERO_INFO.len()];

    // 5. emit event
    emit!(ClaimEvent {
        round: shuihu.round,
        claim_amount: user_bonus_amount,
        claimer: ctx.accounts.minter.key(),
    });

    Ok(())
}

fn cal_mint_price(round: u8) -> Result<u64> {
    require!(round > 0, ErrorCode::InvalidRound);

    // 计算 power
    let power = round.checked_sub(1)
        .ok_or(ErrorCode::MathOverflow)?;

    require!(
        power < 64, // Prevent excessive multiplication
        ErrorCode::MaxRoundExceeded
    );

    // 计算 multiplier
    let multiplier = 2u64
        .checked_pow(power as u32)
        .ok_or(ErrorCode::MathOverflow)?;

    // 计算 mint price
    let mint_price = START_MINT_PRICE
        .checked_mul(multiplier)
        .ok_or(ErrorCode::MathOverflow)?;

    Ok(mint_price)
} 
