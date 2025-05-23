import { UiLayout } from '@/components/ui/ui-layout'
import { lazy } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'

const AccountListFeature = lazy(() => import('../components/account/account-list-feature'))
const AccountDetailFeature = lazy(() => import('../components/account/account-detail-feature'))
const ClusterFeature = lazy(() => import('../components/cluster/cluster-feature'))
const NamespacesFeature = lazy(() => import('../components/namespaces/namespaces-feature'))
const ExamplesFeature = lazy(() => import('../components/balance-payment/balance-payment-feature'))
const DashboardFeature = lazy(() => import('../components/dashboard/dashboard-feature'))

const links: { label: string; path: string }[] = [
  { label: 'Solana Account', path: '/account' },
  // { label: 'Clusters', path: '/clusters' },
  { label: 'Namespaces', path: '/namespaces' },
  { label: 'Examples', path: '/examples' },
]

const routes: RouteObject[] = [
  { path: '/account/', element: <AccountListFeature /> },
  { path: '/account/:address', element: <AccountDetailFeature /> },
  { path: '/examples', element: <ExamplesFeature /> },
  { path: '/clusters', element: <ClusterFeature /> },
  { path: '/namespaces', element: <NamespacesFeature /> },
]

export function AppRoutes() {
  const router = useRoutes([
    { index: true, element: <Navigate to={'/dashboard'} replace={true} /> },
    { path: '/dashboard', element: <DashboardFeature /> },
    ...routes,
    { path: '*', element: <Navigate to={'/dashboard'} replace={true} /> },
  ])
  return <UiLayout links={links}>{router}</UiLayout>
}
