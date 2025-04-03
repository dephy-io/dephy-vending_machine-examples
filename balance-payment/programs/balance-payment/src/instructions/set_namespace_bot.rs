use crate::errors::CustomError;
use crate::state::NamespaceAccount;
use anchor_lang::prelude::*;

pub fn set_namespace_bot(ctx: Context<SetNamespaceBot>, _namespace_id: u64) -> Result<()> {
    let namespace_account = &mut ctx.accounts.namespace_account;
    namespace_account.bot = ctx.accounts.bot.key();
    Ok(())
}

#[derive(Accounts)]
#[instruction(namespace_id: u64)]
pub struct SetNamespaceBot<'info> {
    #[account(mut, has_one = authority @ CustomError::Unauthorized, seeds = [b"NAMESPACE", namespace_id.to_le_bytes().as_ref()], bump)]
    pub namespace_account: Account<'info, NamespaceAccount>,
    pub authority: Signer<'info>,
    /// CHECK:
    #[account(constraint = bot.data_is_empty())]
    pub bot: UncheckedAccount<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
}
