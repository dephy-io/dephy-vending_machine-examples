use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct NamespaceAccount {
    #[max_len(50)]
    pub name: String,
    pub authority: Pubkey,
    pub bot: Pubkey,
    pub treasury: Pubkey,
}
