use anchor_lang::prelude::*;

use crate::constants::DISCRIMINATOR_SIZE;
use crate::state::GlobalAccount;

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let global_account = &mut ctx.accounts.global_account;
    global_account.namespace_nonce = 0;
    Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = DISCRIMINATOR_SIZE + GlobalAccount::INIT_SPACE, seeds = [b"GLOBAL"], bump)]
    pub global_account: Account<'info, GlobalAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
