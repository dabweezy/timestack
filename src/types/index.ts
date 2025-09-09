// Core data types
export interface WatchProduct {
  id: string
  brand: string
  model: string
  reference: string
  serial?: string
  material: string
  dialColor: string
  condition: 'New' | 'Excellent' | 'Very Good' | 'Good' | 'Fair'
  yearManufactured: number
  set: string
  costPrice: number
  tradePrice: number
  retailPrice: number
  images?: string[]
  description?: string
  dateAdded: string
  assignedCustomer?: string // Customer ID who this product is assigned to
  status?: 'available' | 'sold' | 'reserved' | 'consignment' // Product status
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  address1: string
  address2?: string
  city: string
  postcode: string
  country: string
  sortCode?: string
  accountNumber?: string
  bankName?: string
  iban?: string
  swift?: string
  dateAdded: string
}

export interface Order {
  orderNumber: string
  orderType: 'purchase' | 'sale'
  customer: Customer
  watch: WatchProduct
  salePrice: number
  paymentMethod: 'cash' | 'card' | 'bank_transfer'
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  date: string
  timestamp: string
  notes?: string
}

// UI/State types
export type NavigationPage = 'dashboard' | 'customers' | 'stock' | 'sales' | 'orders' | 'profile'

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalStock: number
  recentOrders: Order[]
  topProducts: WatchProduct[]
  salesTrends: {
    period: string
    sales: number
    orders: number
  }[]
}

export interface SalesData {
  period: string
  revenue: number
  orders: number
  customers: number
  avgOrderValue: number
}

// Modal types
export interface ModalState {
  isOpen: boolean
  type: 'customer' | 'customerDetails' | 'stock' | 'order' | 'sales' | 'product' | 'productDetails' | null
  data?: any
}

// Form types
export interface StockForm {
  brand: string
  model: string
  reference: string
  serial: string
  material: string
  dialColor: string
  condition: string
  yearManufactured: string
  set: string
  costPrice: string
  stockType: 'stock' | 'consignment'
  description: string
}

export interface CustomerForm {
  firstName: string
  lastName: string
  email: string
  mobile: string
  address1: string
  address2: string
  city: string
  postcode: string
  country: string
  sortCode: string
  accountNumber: string
  bankName: string
  iban: string
  swift: string
}

export interface SalesForm {
  productId: string
  customerId?: string
  salePrice: number
  isGuestCheckout: boolean
  guestCustomer?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    addToDatabase: boolean
  }
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// PDF generation types
export interface PdfReceiptData {
  order: Order
  company: {
    name: string
    tagline: string
    address: string[]
    email: string
    phone: string
    registration: string
  }
}

// Search and filter types
export interface SearchFilters {
  query: string
  brand?: string
  condition?: string
  priceRange?: [number, number]
  yearRange?: [number, number]
}

export interface SortOptions {
  field: keyof WatchProduct | keyof Customer | keyof Order
  direction: 'asc' | 'desc'
}

// Store types (for state management)
export interface AppState {
  currentPage: NavigationPage
  sidebarCollapsed: boolean
  modals: ModalState
  user: {
    name: string
    email: string
    role: string
  }
}