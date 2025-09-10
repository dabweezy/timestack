'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import DashboardPage from '@/components/pages/DashboardPage'
import CustomersPage from '@/components/pages/CustomersPage'
import StockPage from '@/components/pages/StockPage'
import SalesPage from '@/components/pages/SalesPage'
import OrdersPage from '@/components/pages/OrdersPage'
import ProfilePage from '@/components/pages/ProfilePage'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { useSupabaseData } from '@/hooks/useSupabaseData'
import SupabaseStatus from '@/components/SupabaseStatus'

const pageComponents = {
  dashboard: DashboardPage,
  customers: CustomersPage,
  stock: StockPage,
  sales: SalesPage,
  orders: OrdersPage,
  profile: ProfilePage,
}

export default function Home() {
  const currentPage = useSupabaseStore(state => state.currentPage)
  const { loading, error } = useSupabaseData()
  const CurrentPageComponent = pageComponents[currentPage] || DashboardPage

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data from Supabase...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️</div>
            <p className="text-red-600 mb-2">Failed to load data from Supabase</p>
            <p className="text-gray-600 text-sm">{error}</p>
            <p className="text-gray-500 text-xs mt-2">
              Please check your database setup and try again.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <CurrentPageComponent />
      <SupabaseStatus />
    </DashboardLayout>
  )
}