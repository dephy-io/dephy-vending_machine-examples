use crate::{
    constants::DISCRIMINATOR_SIZE,
    errors::CustomError,
    state::{LockAccount, NamespaceAccount, UserAccount},
    utils,
};
use anchor_lang::{prelude::*, solana_program::keccak};
use bs58;

pub fn lock(
    ctx: Context<Lock>,
    namespace_id: u64,
    recover_info: ED25519RecoverInfo,
    amount: u64,
) -> Result<()> {
    let namespace_account = &ctx.accounts.namespace_account;
    let user_account = &mut ctx.accounts.user_account;
    let lock_account = &mut ctx.accounts.lock_account;

    recover_info.verify(
        namespace_id,
        namespace_account.name.clone(),
        user_account.nonce,
        &ctx.accounts.user.key(),
    )?;

    require!(
        ctx.accounts.vault.get_lamports() - user_account.locked_amount >= amount,
        CustomError::InsufficientFunds
    );

    user_account.nonce += 1;
    user_account.locked_amount += amount;

    lock_account.namespace_id = namespace_id;
    lock_account.amount = amount;

    Ok(())
}

#[derive(Accounts)]
#[instruction(namespace_id: u64)]
pub struct Lock<'info> {
    #[account(has_one = bot @ CustomError::Unauthorized, seeds = [b"NAMESPACE", namespace_id.to_le_bytes().as_ref()], bump)]
    pub namespace_account: Account<'info, NamespaceAccount>,
    #[account(mut, seeds = [b"USER", user.key.as_ref()], bump)]
    pub user_account: Account<'info, UserAccount>,
    /// CHECK:
    #[account(mut)]
    pub user: UncheckedAccount<'info>,
    #[account(
        init,
        payer = payer,
        space = DISCRIMINATOR_SIZE + LockAccount::INIT_SPACE,
        seeds = [b"LOCK", user.key().as_ref(), user_account.nonce.to_le_bytes().as_ref()],
        bump,
    )]
    pub lock_account: Account<'info, LockAccount>,
    /// CHECK:
    #[account(seeds = [b"VAULT", user.key().as_ref()], bump)]
    pub vault: UncheckedAccount<'info>,
    pub bot: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ED25519RecoverInfo {
    pub signature: [u8; 64],
    pub payload: [u8; 64],
    pub deadline: i64,
}

impl ED25519RecoverInfo {
    pub fn verify(
        &self,
        namespace_id: u64,
        namespace_name: String,
        nonce: u64,
        pubkey: &Pubkey,
    ) -> Result<()> {
        let message = {
            let mut data = self.payload.to_vec();
            data.extend_from_slice(&namespace_id.to_le_bytes());
            data.extend_from_slice(&nonce.to_le_bytes());
            data.extend_from_slice(&self.deadline.to_le_bytes());
            data
        };

        let hashed_message = {
            let mut hasher = keccak::Hasher::default();
            hasher.hash(&message);
            hasher.result().to_bytes()
        };

        let hashed_message_base58 = bs58::encode(&hashed_message).into_vec();

        let sign_message_prefix = utils::get_sign_message_prefix(namespace_name.as_ref());
        let digest = {
            let mut data = sign_message_prefix.to_vec();
            data.extend_from_slice(&hashed_message_base58);
            data
        };

        let valid = utils::verify_signature(pubkey, &self.signature, &digest)
            .map_err(|_| CustomError::SignatureFormatInvalid)?;

        require!(valid, CustomError::SignatureMismatch);

        let clock = Clock::get()?;
        require!(
            clock.unix_timestamp <= self.deadline,
            CustomError::SignatureExpired
        );

        Ok(())
    }
}
