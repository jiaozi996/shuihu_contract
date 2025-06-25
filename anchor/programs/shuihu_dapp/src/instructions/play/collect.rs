use anchor_lang::prelude::*;

use mpl_core::{
    accounts::{
        BaseAssetV1, 
        BaseCollectionV1
    },
    fetch_plugin,
    instructions::BurnV1CpiBuilder,
    types::{
        Attributes, 
        UpdateAuthority
    },
    ID as MPL_CORE_ID,
};

use crate::{
    constants::{
        HERO_INFO, 
        SHUIHU_SEED, 
        USER_COLLECTION_SEED
    }, 
    errors::ErrorCode, 
    events::CollectEvent, 
    state::{
        ShuiHu, 
        UserCollection
    }
};

#[derive(Accounts)]
pub struct Collect<'info> {
    #[account(mut)]
    pub minter: Signer<'info>,

    #[account(
        init_if_needed,
        payer = minter,
        space = 8 + UserCollection::INIT_SPACE,
        seeds = [USER_COLLECTION_SEED, minter.key().as_ref()],
        bump,
    )]
    pub user_hero_collection: Account<'info, UserCollection>,

    #[account(
        mut,
        seeds = [SHUIHU_SEED],
        bump = shuihu.bump,
        has_one = hero_collection,
    )]
    pub shuihu: Account<'info, ShuiHu>,

    #[account(
        mut,
        constraint = hero.update_authority == UpdateAuthority::Collection(hero_collection.key()) @ ErrorCode::InvalidCollectionAuthority,
        constraint = hero.owner == minter.key() @ ErrorCode::InvalidHeroOwner,
    )]
    pub hero: Account<'info, BaseAssetV1>,

    #[account(
        mut,
        constraint = hero_collection.update_authority == shuihu.key() @ ErrorCode::InvalidCollectionAuthority,
    )]
    pub hero_collection: Account<'info, BaseCollectionV1>,

    #[account(address = MPL_CORE_ID)]
    /// CHECK: This is checked by the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn process_collect(ctx: Context<Collect>) -> Result<()> {

    // 1. 初始化用户英雄集合
    if ctx.accounts.user_hero_collection.minter == Pubkey::default() {
        ctx.accounts.user_hero_collection.minter = ctx.accounts.minter.key();
        ctx.accounts.user_hero_collection.bump = ctx.bumps.user_hero_collection;
        ctx.accounts.user_hero_collection.collection = [0_u8; HERO_INFO.len()];
    }

    // 2. 更新用户英雄集合
    match fetch_plugin::<BaseAssetV1, Attributes>(
        &ctx.accounts.hero.to_account_info(), 
        mpl_core::types::PluginType::Attributes
    ) {
        Ok((_, fetched_attribute_list, _)) => {

            for attribute in fetched_attribute_list.attribute_list {
                // get No attribute
                if attribute.key == "Index" {
                    // get hero number
                    let hero_index = attribute.value.parse::<u8>().map_err(|_| ErrorCode::InvalidHeroIndex)?;
                    if ctx.accounts.user_hero_collection.collection[hero_index as usize] == 1 {
                        return Err(ErrorCode::HeroAlreadyCollected.into());
                    } else {
                        ctx.accounts.user_hero_collection.collection[hero_index as usize] = 1;
                        // 4. emit event
                        emit!(CollectEvent {
                            hero_index: hero_index,
                            collector: ctx.accounts.minter.key(),
                        });
                    }
                }
            }
        },
        Err(_) => {
           return Err(ErrorCode::InvalidHeroIndex.into());
        }
    }

    // 3.销毁英雄
    BurnV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
     .asset(&ctx.accounts.hero.to_account_info())
     .collection(Some(&ctx.accounts.hero_collection.to_account_info()))
     .payer(&ctx.accounts.minter.to_account_info())
     .system_program(Some(&ctx.accounts.system_program.to_account_info()))
     .invoke()?;

    Ok(())
}