//! This code was AUTOGENERATED using the codama library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun codama to update it.
//!
//! <https://github.com/codama-idl/codama>
//!

use num_derive::FromPrimitive;
use thiserror::Error;

#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum BalancePaymentError {
    /// 6000 - Name must be at least 3 characters long
    #[error("Name must be at least 3 characters long")]
    NameTooShort = 0x1770,
    /// 6001 - No fields to update
    #[error("No fields to update")]
    NoUpdateFields = 0x1771,
    /// 6002 - Invalid public key
    #[error("Invalid public key")]
    InvalidPubkey = 0x1772,
    /// 6003 - Unauthorized access.
    #[error("Unauthorized access.")]
    Unauthorized = 0x1773,
    /// 6004 - Insufficient funds.
    #[error("Insufficient funds.")]
    InsufficientFunds = 0x1774,
    /// 6005 - The signature format or recovery ID is incorrect.
    #[error("The signature format or recovery ID is incorrect.")]
    SignatureFormatInvalid = 0x1775,
    /// 6006 - Failed to recover public key from signature.
    #[error("Failed to recover public key from signature.")]
    SignatureRecoveryFailed = 0x1776,
    /// 6007 - The recovered public key does not match the user's public key.
    #[error("The recovered public key does not match the user's public key.")]
    SignatureMismatch = 0x1777,
    /// 6008 - The signature is expired.
    #[error("The signature is expired.")]
    SignatureExpired = 0x1778,
}

impl solana_program::program_error::PrintProgramError for BalancePaymentError {
    fn print<E>(&self) {
        solana_program::msg!(&self.to_string());
    }
}

impl<T> solana_program::decode_error::DecodeError<T> for BalancePaymentError {
    fn type_of() -> &'static str {
        "BalancePaymentError"
    }
}
