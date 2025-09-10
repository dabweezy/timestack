'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DashboardPage from '@/components/pages/DashboardPage'
import CustomersPage from '@/components/pages/CustomersPage'
import StockPage from '@/components/pages/StockPage'
import SalesPage from '@/components/pages/SalesPage'
import OrdersPage from '@/components/pages/OrdersPage'
import ProfilePage from '@/components/pages/ProfilePage'
import LoginPage from '@/components/pages/LoginPage'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { useSupabaseData } from '@/hooks/useSupabaseData'
import SupabaseStatus from '@/components/SupabaseStatus'
import { supabase } from '@/lib/supabase'

const pageComponents = {
  dashboard: DashboardPage,
  customers: CustomersPage,
  stock: StockPage,
  sales: SalesPage,
  orders: OrdersPage,
  profile: ProfilePage,
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const currentPage = useSupabaseStore(state => state.currentPage)
  const { loading, error } = useSupabaseData()
  const CurrentPageComponent = pageComponents[currentPage] || DashboardPage

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
      } catch (error) {
        console.error('Error checking authentication:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Timestack...</p>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />
  }

  // Show loading screen while loading data
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

  // Show error screen if there's an error (only for actual errors, not empty data)
  if (error && !error.includes('No rows')) {
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

  // Show main application
  return (
    <DashboardLayout>
      <CurrentPageComponent />
      <SupabaseStatus />
    </DashboardLayout>
  )
}