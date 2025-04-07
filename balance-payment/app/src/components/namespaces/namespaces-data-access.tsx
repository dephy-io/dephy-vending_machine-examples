import { getBalancePaymentProgram, getBalancePaymentProgramId } from '../../anchor'
import { Cluster } from '@solana/web3.js'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { web3 } from '@coral-xyz/anchor'

export function useNamespacesDataAccess() {
  const { cluster } = useCluster()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getBalancePaymentProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getBalancePaymentProgram(provider, programId), [provider, programId])

  const getAllNamespaceAccounts = async () => {
    const namespaceAccounts = await program.account.namespaceAccount.all()
    return namespaceAccounts
  }

  const createNamespace = async ({
    name,
    authority,
    bot,
    treasury,
  }: {
    name: string
    authority: web3.PublicKey
    bot: web3.PublicKey
    treasury: web3.PublicKey
  }) => {
    const transactionSignature = await program.methods
      .createNamespace(name)
      .accountsPartial({
        authority,
        bot,
        treasury,
      })
      .rpc()
    return transactionSignature
  }

  return {
    program,
    programId,
    getAllNamespaceAccounts,
    createNamespace,
  }
}
