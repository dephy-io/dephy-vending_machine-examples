use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct NamespaceAccount {
    pub id: u64,
    #[max_len(50)]
    pub name: String,
    pub authority: Pubkey,
    pub bot: Pubkey,
    pub treasury: Pubkey,
    pub created_at: i64,
    pub updated_at: i64
}
