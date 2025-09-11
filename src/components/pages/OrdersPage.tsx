'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { formatCurrency, formatDate } from '@/utils/format'
import { generatePurchaseReceipt, generateSalesReceipt } from '@/utils/pdfGenerator'
import clsx from 'clsx'
import type { Order } from '@/types'

const statusColors = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'processing': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800'
}

const statusIcons = {
  'pending': ClockIcon,
  'processing': ArrowUpIcon,
  'completed': CheckCircleIcon,
  'cancelled': XCircleIcon
}

export default function OrdersPage() {
  const { orders, openModal, customers } = useSupabaseStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.watch.model.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === '' || order.status === statusFilter
    const matchesType = typeFilter === '' || order.orderType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const sortedOrders = filteredOrders.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    sales: orders.filter(o => o.orderType === 'sale').length,
    purchases: orders.filter(o => o.orderType === 'purchase').length
  }

  const handleViewOrder = (order: Order) => {
    openModal('order', order)
  }

  const handleDownloadReceipt = (order: Order) => {
    if (order.orderType === 'purchase') {
      // Purchase receipt - only available if customer is assigned
      if (order.watch.assignedCustomer) {
        const customer = customers.find(c => c.id === order.watch.assignedCustomer)
        if (customer) {
          generatePurchaseReceipt(order.watch, customer)
        } else {
          alert('Customer information not found. Please ensure the product is assigned to a customer.')
        }
      } else {
        alert('Purchase receipt is only available for products assigned to customers.')
      }
    } else if (order.orderType === 'sale') {
      // Sales receipt - always available for sales
      generateSalesReceipt(order)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600">Track and manage all sales and purchase orders</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
            </div>
            <ShoppingCartIcon className="w-8 h-8 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{orderStats.completed}</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sales/Purchases</p>
              <p className="text-2xl font-bold text-blue-600">{orderStats.sales}/{orderStats.purchases}</p>
            </div>
            <ArrowUpIcon className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input w-full sm:w-48"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-input w-full sm:w-48"
          >
            <option value="">All Types</option>
            <option value="sale">Sales</option>
            <option value="purchase">Purchases</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {sortedOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter || typeFilter ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter || typeFilter
                ? 'Try adjusting your search terms or filters'
                : 'Orders will appear here once you start processing sales'
              }
            </p>
            {!searchQuery && !statusFilter && !typeFilter && (
              <button
                onClick={() => openModal('sales')}
                className="btn btn-primary"
              >
                Create First Order
              </button>
            )}
          </motion.div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedOrders.map((order, index) => {
              const StatusIcon = statusIcons[order.status]
              return (
                <motion.div
                  key={order.orderNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={clsx(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        order.orderType === 'purchase' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                      )}>
                        {order.orderType === 'purchase' ? (
                          <ArrowDownIcon className="w-5 h-5" />
                        ) : (
                          <ArrowUpIcon className="w-5 h-5" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-gray-900">{order.orderNumber}</h4>
                          <span className={clsx(
                            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                            statusColors[order.status]
                          )}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">{order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'No Customer'}</span> • 
                          <span className="ml-1">{order.watch.brand} {order.watch.model}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(order.salePrice)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(order.timestamp)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDownloadReceipt(order)}
                          className={clsx(
                            'p-2 transition-colors',
                            (order.orderType === 'sale' || (order.orderType === 'purchase' && order.watch.assignedCustomer))
                              ? 'text-blue-600 hover:text-blue-800'
                              : 'text-gray-300 cursor-not-allowed'
                          )}
                          disabled={order.orderType === 'purchase' && !order.watch.assignedCustomer}
                          title={
                            order.orderType === 'sale'
                              ? 'Download Sales Receipt'
                              : order.orderType === 'purchase' && order.watch.assignedCustomer
                              ? 'Download Purchase Receipt'
                              : 'Purchase receipt only available for products assigned to customers'
                          }
                        >
                          <DocumentArrowDownIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center text-sm">
                    <div className="w-2 h-2 rounded-full mr-2 bg-green-400" />
                    <span className="text-gray-600">
                      Payment Method: {order.paymentMethod.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}