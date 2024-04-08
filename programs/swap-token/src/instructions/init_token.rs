use anchor_lang::prelude::*;
use anchor_spl::{token};
use anchor_spl::token::Mint;
use solana_program::program::invoke;
use spl_token::instruction::AuthorityType;

#[derive(Accounts)]
#[instruction(decimals: u8)]
pub struct InitToken<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
    init,
    payer = payer,
    mint::decimals = decimals,
    mint::authority = payer,
    mint::freeze_authority = payer,
    )]
    pub mint: Account<'info, Mint>,
    /// CHECK: Just a pure account
    #[account(
    seeds = [b"mint_to".as_ref(), &mint.key().to_bytes()],
    bump
    )]
    pub mint_authority_pubkey: AccountInfo<'info>,
    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn exec(ctx: Context<InitToken>, _decimals: u8) -> Result<()> {
    let mint = &ctx.accounts.mint;
    let payer = &ctx.accounts.payer.key();
    let mint_authority = &ctx.accounts.mint_authority_pubkey;
    let token_program_id = &ctx.accounts.token_program;
    let set_mint_authority = spl_token::instruction::set_authority(
        token_program_id.key,
        &mint.key(),
        Some(mint_authority.key),
        AuthorityType::MintTokens,
        payer,
        &[payer])?;
    invoke(
        &set_mint_authority,
        &[
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.mint_authority_pubkey.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
        ],
    )?;
    Ok(())
}
