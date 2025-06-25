use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid collection authority")]
    InvalidCollectionAuthority,
    #[msg("Invalid hero index")]
    InvalidHeroIndex,
    #[msg("Invalid hero owner")]
    InvalidHeroOwner,
    #[msg("Hero already collected")]
    HeroAlreadyCollected,
    #[msg("Collect not completed")]
    CollectNotCompleted,
    #[msg("Invalid collection length")]
    InvalidCollectionLen,
    #[msg("Round Already Claimed")]
    RoundAlreadyClaimed,
    #[msg("Empty Bonus")]
    EmptyBonus,
    #[msg("Mint not available")]
    MintNotAvailable,
    #[msg("VRF seed is illegal, can not be zero")]
    VrfSeedIllegal,
    #[msg("Same Hero Not Allow to Combine")]
    SameHeroNotAllowed,
    #[msg("Minter Insufficient Funds")]
    MinterInsufficientFunds,
    #[msg("Result not ready")]
    ResultNotReady,
    #[msg("Already minted")]
    AlreadyMinted,
    #[msg("Invalid Minter")]
    InvalidMinter,
    #[msg("Invalid Randomness")]
    InvalidRandomness,
    #[msg("Math Overflow")]
    MathOverflow,
    #[msg("Invalid round")]
    InvalidRound,
    #[msg("Max round exceeded")]
    MaxRoundExceeded,
    #[msg("Invalid team account")]
    InvalidTeamAccount
}
