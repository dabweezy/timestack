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
          },
          {
            id: 'watch-003',
            brand: 'Omega',
            model: 'Speedmaster',
            reference: '310.30.42.50.01.001',
            serial: 'OM123456',
            material: 'Stainless Steel',
            dialColor: 'Black',
            condition: 'Very Good',
            yearManufactured: 2022,
            set: 'Watch Only',
            tradePrice: 3200,
            retailPrice: 4800,
            description: 'Classic Speedmaster Professional Moonwatch',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-004',
            brand: 'Audemars Piguet',
            model: 'Royal Oak',
            reference: '15202ST.OO.1240ST.01',
            serial: 'AP789012',
            material: 'Stainless Steel',
            dialColor: 'Blue',
            condition: 'Excellent',
            yearManufactured: 2021,
            set: 'Complete Set',
            tradePrice: 38000,
            retailPrice: 55000,
            description: 'Iconic Royal Oak with blue dial, perfect condition',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-005',
            brand: 'Tudor',
            model: 'Black Bay',
            reference: '79230B',
            serial: 'TD345678',
            material: 'Stainless Steel',
            dialColor: 'Blue',
            condition: 'Very Good',
            yearManufactured: 2023,
            set: 'Complete Set',
            tradePrice: 2100,
            retailPrice: 3200,
            description: 'Popular Tudor Black Bay in blue, excellent value',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-006',
            brand: 'Cartier',
            model: 'Santos',
            reference: 'WSSA0009',
            serial: 'CA901234',
            material: 'Stainless Steel',
            dialColor: 'White',
            condition: 'Excellent',
            yearManufactured: 2022,
            set: 'Complete Set',
            tradePrice: 4200,
            retailPrice: 6500,
            description: 'Elegant Santos de Cartier, medium size',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-007',
            brand: 'Rolex',
            model: 'Datejust',
            reference: '126234',
            serial: 'R567890',
            material: 'Steel/White Gold',
            dialColor: 'Blue',
            condition: 'New',
            yearManufactured: 2024,
            set: 'Complete Set',
            tradePrice: 7800,
            retailPrice: 11000,
            description: 'Brand new Datejust 36mm with fluted bezel',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-008',
            brand: 'Jaeger-LeCoultre',
            model: 'Reverso',
            reference: 'Q3988482',
            serial: 'JL123890',
            material: 'Stainless Steel',
            dialColor: 'Silver',
            condition: 'Excellent',
            yearManufactured: 2020,
            set: 'Complete Set',
            tradePrice: 6500,
            retailPrice: 9800,
            description: 'Classic Reverso Classic Medium Thin',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-009',
            brand: 'Panerai',
            model: 'Luminor',
            reference: 'PAM00005',
            serial: 'PN456123',
            material: 'Stainless Steel',
            dialColor: 'Black',
            condition: 'Good',
            yearManufactured: 2019,
            set: 'Watch Only',
            tradePrice: 3800,
            retailPrice: 5500,
            description: 'Iconic Luminor Marina with manual wind movement',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-010',
            brand: 'IWC',
            model: 'Portuguese',
            reference: 'IW371446',
            serial: 'IW789456',
            material: 'Stainless Steel',
            dialColor: 'White',
            condition: 'Very Good',
            yearManufactured: 2021,
            set: 'Complete Set',
            tradePrice: 5200,
            retailPrice: 7800,
            description: 'Portuguese Chronograph, classic design',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-011',
            brand: 'Breitling',
            model: 'Navitimer',
            reference: 'A23322121B2A1',
            serial: 'BR159753',
            material: 'Stainless Steel',
            dialColor: 'Black',
            condition: 'Excellent',
            yearManufactured: 2022,
            set: 'Complete Set',
            tradePrice: 4100,
            retailPrice: 6200,
            description: 'Aviation legend Navitimer with slide rule bezel',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-012',
            brand: 'TAG Heuer',
            model: 'Monaco',
            reference: 'CAW2111.FC6183',
            serial: 'TH753159',
            material: 'Stainless Steel',
            dialColor: 'Blue',
            condition: 'Very Good',
            yearManufactured: 2020,
            set: 'Complete Set',
            tradePrice: 2800,
            retailPrice: 4200,
            description: 'Iconic square-cased Monaco chronograph',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-013',
            brand: 'Vacheron Constantin',
            model: 'Patrimony',
            reference: '81180/000R-9159',
            serial: 'VC987321',
            material: 'Rose Gold',
            dialColor: 'Silver',
            condition: 'Excellent',
            yearManufactured: 2021,
            set: 'Complete Set',
            tradePrice: 28000,
            retailPrice: 42000,
            description: 'Elegant Patrimony in rose gold, dress watch perfection',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-014',
            brand: 'Hublot',
            model: 'Big Bang',
            reference: '301.SB.131.RX',
            serial: 'HB456789',
            material: 'Steel/Ceramic',
            dialColor: 'Black',
            condition: 'Good',
            yearManufactured: 2018,
            set: 'Complete Set',
            tradePrice: 6800,
            retailPrice: 10500,
            description: 'Bold Big Bang with ceramic bezel and rubber strap',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-015',
            brand: 'Zenith',
            model: 'El Primero',
            reference: '03.2040.400/69.C494',
            serial: 'ZE147258',
            material: 'Stainless Steel',
            dialColor: 'White',
            condition: 'Excellent',
            yearManufactured: 2023,
            set: 'Complete Set',
            tradePrice: 4800,
            retailPrice: 7200,
            description: 'High-frequency El Primero chronograph movement',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-016',
            brand: 'Grand Seiko',
            model: 'Heritage',
            reference: 'SBGJ203',
            serial: 'GS369852',
            material: 'Stainless Steel',
            dialColor: 'Blue',
            condition: 'New',
            yearManufactured: 2024,
            set: 'Complete Set',
            tradePrice: 3200,
            retailPrice: 4800,
            description: 'Japanese precision with GMT complication',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-017',
            brand: 'Chopard',
            model: 'Mille Miglia',
            reference: '168589-3002',
            serial: 'CH258741',
            material: 'Stainless Steel',
            dialColor: 'Silver',
            condition: 'Very Good',
            yearManufactured: 2020,
            set: 'Complete Set',
            tradePrice: 2400,
            retailPrice: 3600,
            description: 'Racing-inspired chronograph with tire-tread strap',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-018',
            brand: 'Longines',
            model: 'Master Collection',
            reference: 'L2.793.4.97.6',
            serial: 'LG741963',
            material: 'Stainless Steel',
            dialColor: 'Black',
            condition: 'Excellent',
            yearManufactured: 2022,
            set: 'Complete Set',
            tradePrice: 1800,
            retailPrice: 2700,
            description: 'Elegant dress watch with moon phase complication',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-019',
            brand: 'Oris',
            model: 'Aquis',
            reference: '01 733 7730 4157-07 4 24 66EB',
            serial: 'OR852741',
            material: 'Stainless Steel',
            dialColor: 'Green',
            condition: 'Very Good',
            yearManufactured: 2023,
            set: 'Complete Set',
            tradePrice: 1400,
            retailPrice: 2100,
            description: 'Swiss dive watch with ceramic bezel and green dial',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'watch-020',
            brand: 'Rolex',
            model: 'GMT-Master II',
            reference: '126710BLNR',
            serial: 'R963741',
            material: 'Stainless Steel',
            dialColor: 'Black',
            condition: 'Excellent',
            yearManufactured: 2023,
            set: 'Complete Set',
            tradePrice: 12500,
            retailPrice: 18000,
            description: 'Batman GMT with blue/black ceramic bezel',
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
            sortCode: '20-00-00',
            accountNumber: '12345678',
            bankName: 'Barclays Bank',
            iban: 'GB29BARC20000012345678',
            swift: 'BARCGB22',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-002',
            firstName: 'Emma',
            lastName: 'Johnson',
            email: 'emma.johnson@example.com',
            mobile: '+44 7700 900124',
            address1: '456 Mayfair Street',
            address2: 'Penthouse Suite',
            city: 'London',
            postcode: 'W1K 1AB',
            country: 'United Kingdom',
            sortCode: '40-02-26',
            accountNumber: '87654321',
            bankName: 'HSBC UK',
            iban: 'GB15HBUK40127612345678',
            swift: 'HBUKGB4B',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-003',
            firstName: 'Michael',
            lastName: 'Williams',
            email: 'michael.williams@example.com',
            mobile: '+44 7700 900125',
            address1: '789 Knightsbridge',
            address2: 'Floor 12',
            city: 'London',
            postcode: 'SW1X 7RL',
            country: 'United Kingdom',
            sortCode: '16-00-30',
            accountNumber: '11223344',
            bankName: 'Lloyds Bank',
            iban: 'GB33LOYD16003011223344',
            swift: 'LOYDGB2L',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-004',
            firstName: 'Sarah',
            lastName: 'Brown',
            email: 'sarah.brown@example.com',
            mobile: '+44 7700 900126',
            address1: '321 Belgravia Square',
            address2: 'Apartment 8A',
            city: 'London',
            postcode: 'SW1W 8BD',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-005',
            firstName: 'David',
            lastName: 'Jones',
            email: 'david.jones@example.com',
            mobile: '+44 7700 900127',
            address1: '654 Chelsea Harbour',
            address2: 'Marina View',
            city: 'London',
            postcode: 'SW10 0XG',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-006',
            firstName: 'Lisa',
            lastName: 'Garcia',
            email: 'lisa.garcia@example.com',
            mobile: '+44 7700 900128',
            address1: '987 Kensington Palace Gardens',
            address2: 'Villa 3',
            city: 'London',
            postcode: 'W8 4QE',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-007',
            firstName: 'James',
            lastName: 'Miller',
            email: 'james.miller@example.com',
            mobile: '+44 7700 900129',
            address1: '147 Hampstead Heath',
            address2: 'The Lodge',
            city: 'London',
            postcode: 'NW3 1AA',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-008',
            firstName: 'Anna',
            lastName: 'Davis',
            email: 'anna.davis@example.com',
            mobile: '+44 7700 900130',
            address1: '258 Regent Street',
            address2: 'Suite 15',
            city: 'London',
            postcode: 'W1B 3AH',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-009',
            firstName: 'Robert',
            lastName: 'Rodriguez',
            email: 'robert.rodriguez@example.com',
            mobile: '+44 7700 900131',
            address1: '369 Bond Street',
            address2: 'Apartment 22',
            city: 'London',
            postcode: 'W1S 1AA',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-010',
            firstName: 'Maria',
            lastName: 'Martinez',
            email: 'maria.martinez@example.com',
            mobile: '+44 7700 900132',
            address1: '741 Oxford Street',
            address2: 'Floor 5',
            city: 'London',
            postcode: 'W1D 1BS',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-011',
            firstName: 'Christopher',
            lastName: 'Hernandez',
            email: 'chris.hernandez@example.com',
            mobile: '+44 7700 900133',
            address1: '852 Piccadilly',
            address2: 'Apartment 7B',
            city: 'London',
            postcode: 'W1J 0BT',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-012',
            firstName: 'Jennifer',
            lastName: 'Lopez',
            email: 'jennifer.lopez@example.com',
            mobile: '+44 7700 900134',
            address1: '963 Covent Garden',
            address2: 'Studio 12',
            city: 'London',
            postcode: 'WC2E 8RF',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-013',
            firstName: 'William',
            lastName: 'Gonzalez',
            email: 'william.gonzalez@example.com',
            mobile: '+44 7700 900135',
            address1: '174 Soho Square',
            address2: 'Penthouse',
            city: 'London',
            postcode: 'W1D 3QN',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-014',
            firstName: 'Linda',
            lastName: 'Wilson',
            email: 'linda.wilson@example.com',
            mobile: '+44 7700 900136',
            address1: '285 Camden Market',
            address2: 'Loft 4',
            city: 'London',
            postcode: 'NW1 8AF',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-015',
            firstName: 'Richard',
            lastName: 'Anderson',
            email: 'richard.anderson@example.com',
            mobile: '+44 7700 900137',
            address1: '396 Notting Hill',
            address2: 'Townhouse',
            city: 'London',
            postcode: 'W11 2QA',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-016',
            firstName: 'Patricia',
            lastName: 'Taylor',
            email: 'patricia.taylor@example.com',
            mobile: '+44 7700 900138',
            address1: '507 Shoreditch',
            address2: 'Warehouse Conversion',
            city: 'London',
            postcode: 'E1 6JQ',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-017',
            firstName: 'Joseph',
            lastName: 'Thomas',
            email: 'joseph.thomas@example.com',
            mobile: '+44 7700 900139',
            address1: '618 Canary Wharf',
            address2: 'Tower 1, Floor 45',
            city: 'London',
            postcode: 'E14 5AB',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-018',
            firstName: 'Barbara',
            lastName: 'Jackson',
            email: 'barbara.jackson@example.com',
            mobile: '+44 7700 900140',
            address1: '729 Greenwich',
            address2: 'Riverside Apartment',
            city: 'London',
            postcode: 'SE10 9NN',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-019',
            firstName: 'Thomas',
            lastName: 'White',
            email: 'thomas.white@example.com',
            mobile: '+44 7700 900141',
            address1: '830 Richmond',
            address2: 'Mansion Block',
            city: 'London',
            postcode: 'TW9 1RE',
            country: 'United Kingdom',
            dateAdded: new Date().toISOString(),
          },
          {
            id: 'customer-020',
            firstName: 'Elizabeth',
            lastName: 'Harris',
            email: 'elizabeth.harris@example.com',
            mobile: '+44 7700 900142',
            address1: '941 Wimbledon',
            address2: 'Victorian House',
            city: 'London',
            postcode: 'SW19 4UE',
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