use anchor_lang::error_code;

#[error_code]
pub enum CustomError {
    #[msg("Name must be at least 3 characters long")]
    NameTooShort,
    #[msg("No fields to update")]
    NoUpdateFields,
    #[msg("Invalid public key")]
    InvalidPubkey,
    #[msg("Unauthorized access.")]
    Unauthorized,
    #[msg("Insufficient funds.")]
    InsufficientFunds,
    #[msg("The signature format or recovery ID is incorrect.")]
    SignatureFormatInvalid,
    #[msg("Failed to recover public key from signature.")]
    SignatureRecoveryFailed,
    #[msg("The recovered public key does not match the user's public key.")]
    SignatureMismatch,
    #[msg("The signature is expired.")]
    SignatureExpired,
}
