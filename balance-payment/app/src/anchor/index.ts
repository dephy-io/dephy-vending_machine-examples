// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import BalancePaymentIDL from './balance_payment.json'
import type { BalancePayment } from './balance_payment'

// Re-export the generated IDL and type
export { BalancePayment, BalancePaymentIDL }

// The programId is imported from the program IDL.
export const BALANCE_PAYMENT_PROGRAM_ID = new PublicKey(BalancePaymentIDL.address)

// This is a helper function to get the BalancePayment Anchor program.
export function getBalancePaymentProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...BalancePaymentIDL, address: address ? address.toBase58() : BalancePaymentIDL.address } as BalancePayment, provider)
}

// This is a helper function to get the program ID for the BalancePayment program depending on the cluster.
export function getBalancePaymentProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return BALANCE_PAYMENT_PROGRAM_ID
  }
}
