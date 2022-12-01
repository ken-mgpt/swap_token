use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::{token};
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, TokenAccount};
use solana_program::program::{invoke_signed};
use crate::utils::caculate_token_sended;

#[derive(Accounts)]
pub struct SwapToken<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
    mut,
    constraint = mint.freeze_authority.unwrap() == admin_wallet.key()
    )]
    pub mint: Account<'info, Mint>,
    #[account(
    init_if_needed,
    payer = payer,
    associated_token::mint = mint,
    associated_token::authority = payer
    )]
    pub user_token_ata: Account<'info, TokenAccount>,
    /// CHECK: Just a pure account
    #[account(
    seeds = [b"mint_to".as_ref(), &mint.key().to_bytes()],
    bump
    )]
    pub mint_authority_pubkey: AccountInfo<'info>,
    /// CHECK: Just a pure account
    #[account(mut)]
    pub admin_wallet: AccountInfo<'info>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn exec(ctx: Context<SwapToken>, sol_payed: u64) -> Result<()> {
    let admint_wallet = &ctx.accounts.admin_wallet;
    let mint = &ctx.accounts.mint;
    let payer = &ctx.accounts.payer;
    let mint_authority = &ctx.accounts.mint_authority_pubkey;
    let user_token_ata = &ctx.accounts.user_token_ata;
    let token_program_id = &ctx.accounts.token_program;
    let program_id = &ctx.program_id;

    let cpi_tranfer_to_owner = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: payer.to_account_info(),
            to: admint_wallet.to_account_info(),
        },
    );
    system_program::transfer(cpi_tranfer_to_owner, sol_payed)?;

    let token_sended = caculate_token_sended(sol_payed);

    let (_, bump) = Pubkey::find_program_address(&[b"mint_to", mint.key().as_ref()], &program_id.key());

    let seeds: &[&[&[u8]]] = &[&[
        "mint_to".as_ref(),
        &mint.key().to_bytes(),
        &[bump],
    ]];

    let mint_to_idx = spl_token::instruction::mint_to(
        token_program_id.key,
        &mint.key(),
        &user_token_ata.key(),
        &mint_authority.key(),
        &[],
        token_sended)?;
    invoke_signed(
        &mint_to_idx,
        &[
            token_program_id.to_account_info(),
            mint.to_account_info(),
            user_token_ata.to_account_info(),
            payer.to_account_info(),
            mint_authority.to_account_info(),
        ],
        seeds,
    )?;

    Ok(())
}
