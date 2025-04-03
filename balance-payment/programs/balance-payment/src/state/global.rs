use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct GlobalAccount {
    pub namespace_nonce: u64,
}
