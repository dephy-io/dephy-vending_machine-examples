import { ReactNode, Suspense, useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Link, useLocation } from 'react-router-dom'

import { AccountChecker } from '../account/account-ui'
import { ClusterChecker, ClusterUiSelect, ExplorerLink } from '../cluster/cluster-ui'
import { WalletButton } from '../solana/solana-provider'

export function UiLayout({ children, links }: { children: ReactNode; links: { label: string; path: string }[] }) {
  const pathname = useLocation().pathname
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="navbar bg-base-300 sticky top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            {isMenuOpen && (
              <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link 
                      className={pathname.startsWith(path) ? 'active' : ''} 
                      to={path}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link className="btn btn-ghost normal-case text-xl" to="/">
            DePHY
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-2">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link className={pathname.startsWith(path) ? 'active' : ''} to={path}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end space-x-2">
          <WalletButton />
          <ClusterUiSelect />
        </div>
      </div>

      <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[50vh]">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster position="bottom-right" />
      </main>

      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl">
          <p>© 2024 Balance Payment. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="https://github.com/solana-developers" target="_blank" rel="noopener noreferrer" className="link">
              GitHub
            </a>
            <a href="https://docs.solana.com" target="_blank" rel="noopener noreferrer" className="link">
              Documentation
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button className="btn btn-xs lg:btn-md btn-primary" onClick={submit} disabled={submitDisabled}>
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title: ReactNode
  subtitle: ReactNode
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? <h1 className="text-5xl font-bold">{title}</h1> : title}
          {typeof subtitle === 'string' ? <p className="py-6">{subtitle}</p> : subtitle}
          {children}
        </div>
      </div>
    </div>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
  }
  return str
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink path={`tx/${signature}`} label={'View Transaction'} className="btn btn-xs btn-primary" />
      </div>,
    )
  }
}
