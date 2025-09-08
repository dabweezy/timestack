'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import DashboardPage from '@/components/pages/DashboardPage'
import CustomersPage from '@/components/pages/CustomersPage'
import StockPage from '@/components/pages/StockPage'
import SalesPage from '@/components/pages/SalesPage'
import OrdersPage from '@/components/pages/OrdersPage'
import useAppStore from '@/store/useAppStore'

const pageComponents = {
  dashboard: DashboardPage,
  customers: CustomersPage,
  stock: StockPage,
  sales: SalesPage,
  orders: OrdersPage,
  profile: DashboardPage, // Fallback for now - Updated for testing
}

export default function Home() {
  const currentPage = useAppStore(state => state.currentPage)
  const CurrentPageComponent = pageComponents[currentPage] || DashboardPage

  return (
    <DashboardLayout>
      <CurrentPageComponent />
    </DashboardLayout>
  )
}