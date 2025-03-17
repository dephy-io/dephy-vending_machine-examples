import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { ExplorerLink } from '../cluster/cluster-ui'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { AccountBalance, AccountButtons, AccountTokens, AccountTransactions } from './account-ui'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function AccountDetailFeature() {
  const params = useParams() as { address?: string }
  const address = useMemo(() => {
    if (!params.address) return
    try {
      return new PublicKey(params.address)
    } catch (e) {
      console.log(`Invalid public key`, e)
      return
    }
  }, [params])

  if (!address) {
    return (
      <div className="hero min-h-[50vh]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Invalid Account</h1>
            <p className="py-6">The provided account address is invalid.</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <AppHero
        title={<AccountBalance address={address} />}
        subtitle={
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm opacity-70">Address:</span>
              <ExplorerLink path={`account/${address}`} label={ellipsify(address.toString())} />
              <button 
                className="btn btn-xs btn-ghost"
                onClick={() => {
                  navigator.clipboard.writeText(address.toString())
                  toast.success('Address copied!')
                }}
              >
                📋
              </button>
            </div>
            <AccountButtons address={address} />
          </div>
        }
      />

      <div className="grid md:grid-cols-2 gap-8 my-8">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Token Accounts</h2>
            <AccountTokens address={address} />
          </div>
        </div>
        
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Transactions</h2>
            <AccountTransactions address={address} />
          </div>
        </div>
      </div>
    </div>
  )
}
