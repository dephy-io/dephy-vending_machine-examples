use crate::constants::DISCRIMINATOR_SIZE;
use crate::state::{GlobalAccount, NamespaceAccount};
use crate::errors::CustomError;
use anchor_lang::prelude::*;

pub fn create_namespace(ctx: Context<CreateNamespace>, name: String) -> Result<()> {
    require!(name.len() >= 3, CustomError::NameTooShort);

    let clock = Clock::get()?;

    let global_account = &mut ctx.accounts.global_account;

    let namespace_account = &mut ctx.accounts.namespace_account;
    namespace_account.id = global_account.namespace_nonce;
    namespace_account.name = name;
    namespace_account.authority = ctx.accounts.authority.key();
    namespace_account.bot = ctx.accounts.bot.key();
    namespace_account.treasury = ctx.accounts.treasury.key();
    namespace_account.created_at = clock.unix_timestamp;
    namespace_account.updated_at = clock.unix_timestamp;

    global_account.namespace_nonce += 1;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateNamespace<'info> {
    #[account(mut, seeds = [b"GLOBAL"], bump)]
    pub global_account: Account<'info, GlobalAccount>,
    #[account(init, payer = payer, space = DISCRIMINATOR_SIZE + NamespaceAccount::INIT_SPACE, seeds = [b"NAMESPACE", global_account.namespace_nonce.to_le_bytes().as_ref()], bump)]
    pub namespace_account: Account<'info, NamespaceAccount>,
    /// CHECK:
    #[account(constraint = authority.data_is_empty())]
    pub authority: UncheckedAccount<'info>,
    /// CHECK:
    #[account(constraint = treasury.data_is_empty())]
    pub treasury: UncheckedAccount<'info>,
    /// CHECK:
    #[account(constraint = bot.data_is_empty())]
    pub bot: UncheckedAccount<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
