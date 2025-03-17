import { useWallet } from '@solana/wallet-adapter-react'
import { AppHero } from '../ui/ui-layout'
import { WalletButton } from '../solana/solana-provider'

const features = [
  {
    title: "Send & Receive SOL",
    description: "Transfer SOL tokens between wallets easily and securely",
    icon: "💸"
  },
  {
    title: "Track Balances", 
    description: "Monitor your SOL and SPL token balances in real-time",
    icon: "📊"
  },
  {
    title: "View History",
    description: "See all your transaction history in one place",
    icon: "📝"
  }
]

const resources = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Exchange', href: 'https://solana.stackexchange.com/' },
]

export default function DashboardFeature() {
  const { publicKey } = useWallet()

  return (
    <div className="container mx-auto px-4">
      <AppHero 
        title="Welcome to Balance Payment"
        subtitle={
          <div className="space-y-4">
            <p className="text-lg">A simple and secure way to manage your Solana wallet</p>
            {!publicKey && (
              <div className="flex justify-center">
                <WalletButton />
              </div>
            )}
          </div>
        }
      />

      <div className="grid md:grid-cols-3 gap-6 my-12">
        {features.map((feature, i) => (
          <div key={i} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h2 className="card-title">{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="divider">RESOURCES</div>
      
      <div className="flex flex-wrap justify-center gap-4 my-8">
        {resources.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
