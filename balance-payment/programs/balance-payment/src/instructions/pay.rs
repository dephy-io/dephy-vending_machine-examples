use anchor_lang::prelude::*;
use anchor_lang::system_program;

use super::ED25519RecoverInfo;
use crate::errors::CustomError;
use crate::state::NamespaceAccount;
use crate::state::UserAccount;

pub fn pay(
    ctx: Context<Pay>,
    namespace_id: u64,
    recover_info: ED25519RecoverInfo,
    amount_to_transfer: u64,
) -> Result<()> {
    let namespace_account = &ctx.accounts.namespace_account;
    let user_account = &mut ctx.accounts.user_account;

    recover_info.verify(
        namespace_id,
        namespace_account.name.clone(),
        user_account.nonce,
        &ctx.accounts.user.key(),
    )?;

    require!(
        ctx.accounts.vault.get_lamports() - user_account.locked_amount >= amount_to_transfer,
        CustomError::InsufficientFunds
    );

    system_program::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
            },
            &[&[b"VAULT", ctx.accounts.user.key().as_ref(), &[ctx
                .bumps
                .vault]]],
        ),
        amount_to_transfer,
    )?;

    user_account.nonce += 1;

    Ok(())
}

#[derive(Accounts)]
#[instruction(namespace_id: u64)]
pub struct Pay<'info> {
    #[account(has_one = bot @ CustomError::Unauthorized, seeds = [b"NAMESPACE", namespace_id.to_le_bytes().as_ref()], bump)]
    pub namespace_account: Account<'info, NamespaceAccount>,
    #[account(mut, seeds = [b"USER", user.key.as_ref()], bump)]
    pub user_account: Account<'info, UserAccount>,
    /// CHECK:
    #[account(mut)]
    pub user: UncheckedAccount<'info>,
    /// CHECK:
    #[account(mut, constraint = treasury.key() == namespace_account.treasury)]
    pub treasury: UncheckedAccount<'info>,
    /// CHECK:
    #[account(mut, seeds = [b"VAULT", user.key().as_ref()], bump)]
    pub vault: UncheckedAccount<'info>,
    pub bot: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
