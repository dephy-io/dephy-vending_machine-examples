import { PublicKey } from '@solana/web3.js'
import { useState } from 'react'
import { AppModal, useTransactionToast } from '../ui/ui-layout'
import { useNamespacesDataAccess } from './namespaces-data-access'
import toast from 'react-hot-toast'
import { web3 } from '@coral-xyz/anchor'
import dayjs from 'dayjs'

export function NamespacesUiModal({ hideModal, show, onCreate }: { hideModal: () => void; show: boolean; onCreate: () => void }) {
  const transactionToast = useTransactionToast()
  const { program, createNamespace } = useNamespacesDataAccess()
  const [name, setName] = useState('')
  const [bot, setBot] = useState('')
  const [treasury, setTreasury] = useState('')
  const [authority, setAuthority] = useState('')

  const isValidSolanaAddress = (address: string): boolean => {
    try {
      new PublicKey(address)
      return true
    } catch {
      return false
    }
  }

  const handleCreateNamespace = async () => {
    if (!program) {
      toast.error('Program not loaded')
      return
    }

    if (name.length <= 3) {
      toast.error('Namespace name must be longer than 3 characters')
      return
    }

    if (!isValidSolanaAddress(bot)) {
      toast.error('Invalid bot address')
      return
    }
    if (!isValidSolanaAddress(treasury)) {
      toast.error('Invalid treasury address')
      return
    }
    if (!isValidSolanaAddress(authority)) {
      toast.error('Invalid authority address')
      return
    }

    try {
      const transactionSignature = await createNamespace({
        name,
        authority: new web3.PublicKey(authority),
        bot: new web3.PublicKey(bot),
        treasury: new web3.PublicKey(treasury),
      })
      console.log('CreateNamespace transaction signature:', transactionSignature)
      transactionToast(transactionSignature)
      toast.success('Namespace created successfully')
      hideModal()
      onCreate()
    } catch (error) {
      toast.error('Failed to create namespace')
      console.error(error)
    }
  }

  return (
    <AppModal
      title={'Create Namespace'}
      hide={hideModal}
      show={show}
      submit={handleCreateNamespace}
      submitLabel="Create"
    >
      <div className="space-y-4">
        <div>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter namespace name"
          />
        </div>

        <div>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={bot}
            onChange={(e) => setBot(e.target.value)}
            placeholder="Enter bot address"
          />
        </div>

        <div>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={treasury}
            onChange={(e) => setTreasury(e.target.value)}
            placeholder="Enter treasury address"
          />
        </div>

        <div>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={authority}
            onChange={(e) => setAuthority(e.target.value)}
            placeholder="Enter authority address"
          />
        </div>
      </div>
    </AppModal>
  )
}

export function NamespacesUiTable({ namespaces }: { namespaces: any[] }) {
  return (
    <div className="space-y-4">
      {namespaces.length === 0 && <div className="text-center py-8 text-gray-500">No namespaces found</div>}

      {namespaces.map((namespace, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-gray-500">ID: {namespace.account.id.toString()}</div>
            <div className="text-sm truncate text-gray-500">{namespace.publicKey.toBase58()}</div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-500">Name</div>
              <div className="text-sm text-gray-900">{namespace.account.name}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500">Authority</div>
              <div className="truncate max-w-full text-sm text-gray-900" title={namespace.account.authority.toBase58()}>
                {namespace.account.authority.toBase58()}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500">Bot</div>
              <div className="truncate max-w-full text-sm text-gray-900" title={namespace.account.bot.toBase58()}>
                {namespace.account.bot.toBase58()}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500">Treasury</div>
              <div className="truncate max-w-full text-sm text-gray-900" title={namespace.account.treasury.toBase58()}>
                {namespace.account.treasury.toBase58()}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500">Created At</div>
              <div className="text-sm text-gray-900">
                {dayjs(namespace.account.createdAt.toNumber() * 1000).format('YYYY-MM-DD HH:mm:ss')} UTC
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500">Updated At</div>
              <div className="text-sm text-gray-900">
                {dayjs(namespace.account.updatedAt.toNumber() * 1000).format('YYYY-MM-DD HH:mm:ss')} UTC
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

