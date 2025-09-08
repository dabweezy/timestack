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
  
  // Initialize with sample data
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
        watchProducts: [...state.watchProducts, product]
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

      // Initialize with sample data
      initializeSampleData: () => set({
        watchProducts: [
          {
            id: 'watch-001',
            brand: 'Rolex',
            model: 'Submariner',
            reference: '126610LN',
            serial: 'S123456789',
            material: 'Stainless Steel',
            dialColor: 'Black',
            condition: 'Excellent',
            yearManufactured: 2023,
            set: 'Complete Set',
            tradePrice: 8500,
            retailPrice: 12000,
            description: 'Pristine condition Submariner with complete box and papers',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-002',
            brand: 'Patek Philippe',
            model: 'Aquanaut',
            reference: '5167A-001',
            serial: 'PP987654321',
            material: 'Stainless Steel',
            dialColor: 'Black',
            condition: 'New',
            yearManufactured: 2024,
            set: 'Complete Set',
            tradePrice: 45000,
            retailPrice: 65000,
            description: 'Brand new Aquanaut with full warranty',
            dateAdded: new Date().toISOString(),
          }
        ],
        customers: [
          {
            id: 'customer-001',
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com',
            mobile: '+44 7700 900123',
            address1: '123 Luxury Lane',
            address2: 'Apartment 4B',
            city: 'London',
            postcode: 'SW1A 1AA',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          }
        ],
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
      }),
    }
  )
)

export default useAppStore