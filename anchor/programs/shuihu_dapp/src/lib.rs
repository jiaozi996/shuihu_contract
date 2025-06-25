#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

use instructions::*;
mod instructions;

// use state::*;
mod state;

// use constants::*;
mod constants;

// use errors::*;
mod errors;

mod events;



declare_id!("GeMsK5Ru78XGVCQoyLkc4ECbpFZEgKkK1ukAiMWadHpc");

#[program]
pub mod shuihu_dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, start_time: u64, team: Pubkey) -> Result<()> {
      process_initialize(ctx, start_time, team)
    }

    pub fn mint(ctx: Context<SHMint>, force: Pubkey) -> Result<()> {
      process_mint(ctx, force)
    }

    pub fn combine(ctx: Context<SHCombine>, force: Pubkey) -> Result<()> {
      process_combine(ctx, force)
    }

    pub fn reveal(ctx: Context<SHReveal>) -> Result<()> {
      process_reveal(ctx)
    }

    pub fn collect(ctx: Context<Collect>) -> Result<()> {
      process_collect(ctx)
    }

    pub fn claim(ctx: Context<ClaimBonus>) -> Result<()> {
      process_claim(ctx)
    }

    // for test
    // pub fn reveal_index(ctx: Context<SHRevealIndex>, index: u8) -> Result<()> {
    //   process_reveal_index(ctx, index)
    // }
}