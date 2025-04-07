use crate::errors::CustomError;
use crate::state::NamespaceAccount;
use anchor_lang::prelude::*;

pub fn update_namespace(
    ctx: Context<UpdateNamespace>,
    _namespace_id: u64,
    new_name: Option<String>,
    new_authority: Option<Pubkey>,
    new_bot: Option<Pubkey>,
    new_treasury: Option<Pubkey>,
) -> Result<()> {
    require!(
        new_name.is_some()
            || new_authority.is_some()
            || new_bot.is_some()
            || new_treasury.is_some(),
        CustomError::NoUpdateFields
    );

    let namespace = &mut ctx.accounts.namespace_account;
    let clock = Clock::get()?;

    if let Some(name) = new_name {
        require!(name.len() >= 3, CustomError::NameTooShort);
        namespace.name = name;
    }

    if let Some(authority) = new_authority {
        require!(authority != Pubkey::default(), CustomError::InvalidPubkey);
        namespace.authority = authority;
    }

    if let Some(bot) = new_bot {
        require!(bot != Pubkey::default(), CustomError::InvalidPubkey);
        namespace.bot = bot;
    }

    if let Some(treasury) = new_treasury {
        require!(treasury != Pubkey::default(), CustomError::InvalidPubkey);
        namespace.treasury = treasury;
    }

    namespace.updated_at = clock.unix_timestamp;

    Ok(())
}

#[derive(Accounts)]
#[instruction(namespace_id: u64)]
pub struct UpdateNamespace<'info> {
    #[account(mut, has_one = authority @ CustomError::Unauthorized, seeds = [b"NAMESPACE", namespace_id.to_le_bytes().as_ref()], bump)]
    pub namespace_account: Account<'info, NamespaceAccount>,
    pub authority: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
}
