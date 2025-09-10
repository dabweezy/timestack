'use client'

import { useSupabaseData } from '@/hooks/useSupabaseData'
import { useSupabaseStore } from '@/store/useSupabaseStore'

export default function SupabaseStatus() {
  const { loading, error } = useSupabaseData()
  const { customers, watchProducts, orders } = useSupabaseStore()

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3 z-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 text-sm">Loading from Supabase...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-300 rounded-lg p-3 z-50">
        <div className="flex items-center space-x-2">
          <span className="text-red-600">⚠️</span>
          <span className="text-red-800 text-sm">Supabase Error: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 bg-green-100 border border-green-300 rounded-lg p-3 z-50">
      <div className="flex items-center space-x-2">
        <span className="text-green-600">✅</span>
        <span className="text-green-800 text-sm">
          Supabase Connected - {customers.length} customers, {watchProducts.length} products, {orders.length} orders
        </span>
      </div>
    </div>
  )
}
