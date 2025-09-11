import { create } from 'zustand'
import { customerService, productService, orderService } from '@/lib/database'
import type { Customer, WatchProduct, Order, NavigationPage, ModalState } from '@/types'

interface SupabaseStore {
  // Data
  customers: Customer[]
  watchProducts: WatchProduct[]
  orders: Order[]
  
  // UI State
  currentPage: NavigationPage
  sidebarCollapsed: boolean
  modals: ModalState
  
  // User
  user: {
    name: string
    email: string
    role: string
  }
  
  // Loading states
  loading: boolean
  error: string | null
  
  // Actions
  setCurrentPage: (page: NavigationPage) => void
  toggleSidebar: () => void
  openModal: (type: ModalState['type'], data?: any) => void
  closeModal: () => void
  
  // Data actions
  loadData: () => Promise<void>
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<Customer>
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<Customer>
  deleteCustomer: (id: string) => Promise<void>
  
  addWatchProduct: (product: Omit<WatchProduct, 'id'>) => Promise<WatchProduct>
  updateWatchProduct: (id: string, updates: Partial<WatchProduct>) => Promise<WatchProduct>
  deleteWatchProduct: (id: string) => Promise<void>
  
  addOrder: (order: Omit<Order, 'id'>) => Promise<Order>
  
  // Initialize sample data (fallback)
  initializeSampleData: () => void
  
  // Authentication
  signOut: () => Promise<void>
}

// Get initial page from localStorage or default to dashboard
const getInitialPage = (): NavigationPage => {
  if (typeof window !== 'undefined') {
    const savedPage = localStorage.getItem('timestack-current-page')
    if (savedPage && ['dashboard', 'customers', 'stock', 'sales', 'orders', 'profile'].includes(savedPage)) {
      return savedPage as NavigationPage
    }
  }
  return 'dashboard'
}

// Get initial sidebar state from localStorage
const getInitialSidebarState = (): boolean => {
  if (typeof window !== 'undefined') {
    const savedSidebar = localStorage.getItem('timestack-sidebar-collapsed')
    return savedSidebar === 'true'
  }
  return false
}

export const useSupabaseStore = create<SupabaseStore>((set, get) => ({
  // Initial state
  customers: [],
  watchProducts: [],
  orders: [],
  currentPage: getInitialPage(),
  sidebarCollapsed: getInitialSidebarState(),
  modals: { type: null, data: null, isOpen: false },
  user: {
    name: 'Admin User',
    email: 'admin@timestack.com',
    role: 'Administrator',
  },
  loading: false,
  error: null,

  // UI actions
  setCurrentPage: (page) => {
    set({ currentPage: page })
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('timestack-current-page', page)
    }
  },
  toggleSidebar: () => set((state) => {
    const newState = !state.sidebarCollapsed
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('timestack-sidebar-collapsed', newState.toString())
    }
    return { sidebarCollapsed: newState }
  }),
  openModal: (type, data) => set({ modals: { type, data, isOpen: true } }),
  closeModal: () => set({ modals: { type: null, data: null, isOpen: false } }),

  // Data loading
  loadData: async () => {
    set({ loading: true, error: null })
    
    try {
      const [customers, watchProducts, orders] = await Promise.all([
        customerService.getAll(),
        productService.getAll(),
        orderService.getAll()
      ])
      
      // Handle empty data gracefully - no error, just empty arrays
      set({ 
        customers: customers || [], 
        watchProducts: watchProducts || [], 
        orders: orders || [], 
        loading: false 
      })
    } catch (error) {
      console.error('Error loading data:', error)
      // Only show error for actual connection issues, not empty data
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data'
      if (errorMessage.includes('No rows') || errorMessage.includes('not found')) {
        // Empty data is fine, just set empty arrays
        set({ 
          customers: [], 
          watchProducts: [], 
          orders: [], 
          loading: false 
        })
      } else {
        set({ 
          error: errorMessage,
          loading: false 
        })
      }
    }
  },

  // Customer actions
  addCustomer: async (customer) => {
    try {
      const newCustomer = await customerService.create(customer)
      set((state) => ({ customers: [newCustomer, ...state.customers] }))
      return newCustomer
    } catch (error) {
      console.error('Error adding customer:', error)
      throw error
    }
  },

  updateCustomer: async (id, updates) => {
    try {
      const updatedCustomer = await customerService.update(id, updates)
      set((state) => ({
        customers: state.customers.map(c => c.id === id ? updatedCustomer : c)
      }))
      return updatedCustomer
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    }
  },

  deleteCustomer: async (id) => {
    try {
      await customerService.delete(id)
      set((state) => ({ customers: state.customers.filter(c => c.id !== id) }))
    } catch (error) {
      console.error('Error deleting customer:', error)
      throw error
    }
  },

  // Product actions
  addWatchProduct: async (product) => {
    try {
      console.log('🔄 Store: Adding product...', product)
      const newProduct = await productService.create(product)
      console.log('✅ Store: Product created, updating state...', newProduct)
      set((state) => ({ watchProducts: [newProduct, ...state.watchProducts] }))
      console.log('✅ Store: State updated successfully')
      return newProduct
    } catch (error) {
      console.error('❌ Store: Error adding product:', error)
      throw error
    }
  },

  updateWatchProduct: async (id, updates) => {
    try {
      const updatedProduct = await productService.update(id, updates)
      set((state) => ({
        watchProducts: state.watchProducts.map(p => p.id === id ? updatedProduct : p)
      }))
      return updatedProduct
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  deleteWatchProduct: async (id) => {
    try {
      await productService.delete(id)
      set((state) => ({ watchProducts: state.watchProducts.filter(p => p.id !== id) }))
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },

  // Order actions
  addOrder: async (order) => {
    try {
      console.log('🔄 Store: Adding order...', order)
      const newOrder = await orderService.create(order)
      console.log('✅ Store: Order created, updating state...', newOrder)
      set((state) => ({ orders: [newOrder, ...state.orders] }))
      console.log('✅ Store: Order state updated successfully')
      return newOrder
    } catch (error) {
      console.error('❌ Store: Error adding order:', error)
      throw error
    }
  },

  // Fallback sample data (for when Supabase is not available)
  initializeSampleData: () => {
    // This is a fallback - in production, you'd want to handle this differently
    console.log('Using fallback sample data - Supabase not available')
  },

  // Authentication
  signOut: async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      await supabase.auth.signOut()
      // Clear the store state
      set({
        customers: [],
        watchProducts: [],
        orders: [],
        user: { name: '', email: '', role: '' },
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }
}))
