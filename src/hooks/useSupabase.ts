import { useState, useEffect } from 'react'
import { customerService, productService, orderService } from '@/lib/database'
import type { Customer, WatchProduct, Order } from '@/types'

export const useSupabase = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<WatchProduct[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load all data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [customersData, productsData, ordersData] = await Promise.all([
          customerService.getAll(),
          productService.getAll(),
          orderService.getAll()
        ])
        
        setCustomers(customersData)
        setProducts(productsData)
        setOrders(ordersData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Customer operations
  const addCustomer = async (customer: Omit<Customer, 'id'>) => {
    try {
      const newCustomer = await customerService.create(customer)
      setCustomers(prev => [newCustomer, ...prev])
      return newCustomer
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add customer')
      throw err
    }
  }

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const updatedCustomer = await customerService.update(id, updates)
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c))
      return updatedCustomer
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer')
      throw err
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      await customerService.delete(id)
      setCustomers(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer')
      throw err
    }
  }

  // Product operations
  const addProduct = async (product: Omit<WatchProduct, 'id'>) => {
    try {
      const newProduct = await productService.create(product)
      setProducts(prev => [newProduct, ...prev])
      return newProduct
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product')
      throw err
    }
  }

  const updateProduct = async (id: string, updates: Partial<WatchProduct>) => {
    try {
      const updatedProduct = await productService.update(id, updates)
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p))
      return updatedProduct
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
      throw err
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await productService.delete(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
      throw err
    }
  }

  // Order operations
  const addOrder = async (order: Omit<Order, 'id'>) => {
    try {
      const newOrder = await orderService.create(order)
      setOrders(prev => [newOrder, ...prev])
      return newOrder
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add order')
      throw err
    }
  }

  // Refresh data
  const refreshData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [customersData, productsData, ordersData] = await Promise.all([
        customerService.getAll(),
        productService.getAll(),
        orderService.getAll()
      ])
      
      setCustomers(customersData)
      setProducts(productsData)
      setOrders(ordersData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data')
      console.error('Error refreshing data:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    // Data
    customers,
    products,
    orders,
    loading,
    error,
    
    // Customer operations
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    // Product operations
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Order operations
    addOrder,
    
    // Utility
    refreshData
  }
}
