pub mod instructions;
mod errors;
mod utils;

pub use instructions::*;

use anchor_lang::prelude::*;

declare_id!("62ztfPnBnder4D8cgmztnQjWFFwbB18EkhRRgeYpoMoG");

#[program]
pub mod swap_token {
    use super::*;

    pub fn init_token(ctx: Context<InitToken>, decimals: u8) -> Result<()> {
        init_token::exec(ctx, decimals)
    }

    pub fn swap_token(ctx: Context<SwapToken>, sol_payed: u64) -> Result<()> {
        mint_to_token::exec(ctx, sol_payed)
    }
}

