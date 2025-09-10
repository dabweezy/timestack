import { useEffect } from 'react'
import { useSupabaseStore } from '@/store/useSupabaseStore'

export const useSupabaseData = () => {
  const { loadData, loading, error } = useSupabaseStore()

  useEffect(() => {
    // Load data when the hook is first used
    loadData()
  }, [loadData])

  return { loading, error }
}
