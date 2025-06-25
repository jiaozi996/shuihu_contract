use anchor_lang::prelude::*;

#[event]
pub struct ClaimEvent {
    pub round: u8,
    pub claimer: Pubkey,
    pub claim_amount: u64,
}

#[event]
pub struct MintEvent {
    pub round: u8,
    pub bonus: u64,
    pub minter: Pubkey,
}

#[event]
pub struct CollectEvent {
    pub hero_index: u8,
    pub collector: Pubkey,
}

#[event]
pub struct CombineEvent {
    pub hero_index_1: u8,
    pub hero_index_2: u8,
    pub combiner: Pubkey,
}

