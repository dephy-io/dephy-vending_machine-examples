use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct LockAccount {
    pub namespace_id: u64,
    pub amount: u64,
}
