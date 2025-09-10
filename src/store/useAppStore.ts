'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NavigationPage, ModalState, WatchProduct, Customer, Order } from '@/types'

interface AppState {
  // Navigation
  currentPage: NavigationPage
  sidebarCollapsed: boolean
  
  // Modal management
  modals: ModalState
  
  // Data
  watchProducts: WatchProduct[]
  customers: Customer[]
  orders: Order[]
  
  // User
  user: {
    name: string
    email: string
    role: string
  }
  
  // Actions
  setCurrentPage: (page: NavigationPage) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Modal actions
  openModal: (type: ModalState['type'], data?: any) => void
  closeModal: () => void
  
  // Data actions
  addWatchProduct: (product: WatchProduct) => void
  updateWatchProduct: (id: string, updates: Partial<WatchProduct>) => void
  removeWatchProduct: (id: string) => void
  
  addCustomer: (customer: Customer) => void
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  removeCustomer: (id: string) => void
  
  addOrder: (order: Order) => void
  updateOrder: (orderNumber: string, updates: Partial<Order>) => void
  removeOrder: (orderNumber: string) => void
  
  // Search and filter
  searchProducts: (query: string) => WatchProduct[]
  searchCustomers: (query: string) => Customer[]
  
  // Initialize with empty data
  initializeSampleData: () => void
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentPage: 'dashboard',
      sidebarCollapsed: false,
      modals: {
        isOpen: false,
        type: null,
      },
      watchProducts: [],
      customers: [],
      orders: [],
      user: {
        name: 'Admin User',
        email: 'admin@chieferjewellery.com',
        role: 'Administrator',
      },

      // Navigation actions
      setCurrentPage: (page) => set({ currentPage: page }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Modal actions
      openModal: (type, data) => set({ 
        modals: { isOpen: true, type, data } 
      }),
      closeModal: () => set({ 
        modals: { isOpen: false, type: null, data: undefined } 
      }),

      // Watch product actions
      addWatchProduct: (product) => set((state) => ({
        watchProducts: [product, ...state.watchProducts] // Add at the top for chronological order
      })),
      
      updateWatchProduct: (id, updates) => set((state) => ({
        watchProducts: state.watchProducts.map(product =>
          product.id === id ? { ...product, ...updates } : product
        )
      })),
      
      removeWatchProduct: (id) => set((state) => ({
        watchProducts: state.watchProducts.filter(product => product.id !== id)
      })),

      // Customer actions
      addCustomer: (customer) => set((state) => ({
        customers: [...state.customers, customer]
      })),
      
      updateCustomer: (id, updates) => set((state) => ({
        customers: state.customers.map(customer =>
          customer.id === id ? { ...customer, ...updates } : customer
        )
      })),
      
      removeCustomer: (id) => set((state) => ({
        customers: state.customers.filter(customer => customer.id !== id)
      })),

      // Order actions
      addOrder: (order) => set((state) => ({
        orders: [...state.orders, order]
      })),
      
      updateOrder: (orderNumber, updates) => set((state) => ({
        orders: state.orders.map(order =>
          order.orderNumber === orderNumber ? { ...order, ...updates } : order
        )
      })),
      
      removeOrder: (orderNumber) => set((state) => ({
        orders: state.orders.filter(order => order.orderNumber !== orderNumber)
      })),

      // Search functions
      searchProducts: (query) => {
        const { watchProducts } = get()
        const searchText = query.toLowerCase()
        return watchProducts.filter(product =>
          product.brand.toLowerCase().includes(searchText) ||
          product.model.toLowerCase().includes(searchText) ||
          product.reference.toLowerCase().includes(searchText) ||
          product.material.toLowerCase().includes(searchText) ||
          product.dialColor.toLowerCase().includes(searchText) ||
          product.condition.toLowerCase().includes(searchText) ||
          product.yearManufactured.toString().includes(searchText)
        )
      },

      searchCustomers: (query) => {
        const { customers } = get()
        const searchText = query.toLowerCase()
        return customers.filter(customer =>
          customer.firstName.toLowerCase().includes(searchText) ||
          customer.lastName.toLowerCase().includes(searchText) ||
          customer.email.toLowerCase().includes(searchText) ||
          customer.mobile.toLowerCase().includes(searchText)
        )
      },

      // Initialize with empty data
      initializeSampleData: () => set({
        watchProducts: [],
        customers: [],
        orders: []
      }),
    }),
    {
      name: 'timestack-storage',
      partialize: (state) => ({
        currentPage: state.currentPage,
        sidebarCollapsed: state.sidebarCollapsed,
        watchProducts: state.watchProducts,
        customers: state.customers,
        orders: state.orders,
        user: state.user,
      }),
    }
  )
)

export default useAppStore