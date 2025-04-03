use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

use instructions::*;

declare_id!("GguVKxU88NUe3GLtns7Uaa6a8Pjb9USKq3WD1rjZnPS9");

#[program]
pub mod balance_payment {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize(ctx)
    }

    pub fn create_namespace(ctx: Context<CreateNamespace>, name: String) -> Result<()> {
        instructions::create_namespace(ctx, name)
    }

    pub fn set_namespace_bot(ctx: Context<SetNamespaceBot>, _namespace_id: u64) -> Result<()> {
        instructions::set_namespace_bot(ctx, _namespace_id)
    }

    pub fn set_namespace_treasury(ctx: Context<SetNamespaceTreasury>, _namespace_id: u64) -> Result<()> {
        instructions::set_namespace_treasury(ctx, _namespace_id)
    }

    pub fn register(ctx: Context<Register>) -> Result<()> {
        instructions::register(ctx)
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::deposit(ctx, amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        instructions::withdraw(ctx, amount)
    }

    pub fn lock(ctx: Context<Lock>, namespace_id: u64, recover_info: ED25519RecoverInfo, amount: u64) -> Result<()> {
        instructions::lock(ctx, namespace_id, recover_info, amount)
    }

    pub fn settle(ctx: Context<Settle>, _nonce: u64, amount_to_transfer: u64) -> Result<()> {
        instructions::settle(ctx, _nonce, amount_to_transfer)
    }

    pub fn pay(ctx: Context<Pay>, namespace_id: u64, recover_info: ED25519RecoverInfo, amount_to_transfer: u64) -> Result<()> {
        instructions::pay(ctx, namespace_id, recover_info, amount_to_transfer)
    }
}
