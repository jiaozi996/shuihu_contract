use anchor_lang::prelude::*;

use crate::constants::HERO_INFO;

#[account]
#[derive(InitSpace)]
pub struct ShuiHu {
    pub round: u8, // 轮次
    pub mint_price: u64, // 铸币价格
    pub bonus: u64, // 奖励数量
    pub bump: u8, // bump

    pub token_mint: Pubkey, // 代币地址
    pub bump_token_mint: u8, // 代币bump
    pub hero_collection: Pubkey, // 英雄集合地址
    pub start_time: u64, // 开始时间

    pub team: Pubkey, // 团队账户地址
}

#[account]
#[derive(InitSpace)]
pub struct HeroMintState {
    pub bump: u8,
    pub minter: Pubkey,
    pub hero: Pubkey,
    pub randomness: [u8;64],
    pub result: u8,  
    pub minted: bool,
}

#[account]
#[derive(InitSpace)]
pub struct UserCollection {
    pub minter: Pubkey,
    pub bump: u8,
    pub collection: [u8; HERO_INFO.len()]
}

#[account]
#[derive(InitSpace)]
pub struct RoundClaim {
    pub bump: u8,
    pub round: u8,
    pub minter: Pubkey,
    pub claimed_amount: u64,
    pub timestamp: i64,
}