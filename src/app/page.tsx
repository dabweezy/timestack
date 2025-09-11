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
  const [authChecked, setAuthChecked] = useState(false)
  const currentPage = useSupabaseStore(state => state.currentPage)
  const { loading, error, loadData } = useSupabaseStore()
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
        setAuthChecked(true)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session)
        setIsLoading(false)
        setAuthChecked(true)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      loadData()
    }
  }, [isAuthenticated, loadData])

  // Don't render anything until auth check is complete
  if (!authChecked) {
    return null
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />
  }

  // No loading screen - show app immediately

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
    </DashboardLayout>
  )
}