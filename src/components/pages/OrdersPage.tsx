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
import useAppStore from '@/store/useAppStore'
import { formatCurrency, formatDate } from '@/utils/format'
import clsx from 'clsx'
import type { Order } from '@/types'

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Processing': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800'
}

const statusIcons = {
  'Pending': ClockIcon,
  'Processing': ArrowUpIcon,
  'Completed': CheckCircleIcon,
  'Cancelled': XCircleIcon
}

export default function OrdersPage() {
  const { orders, openModal } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.watch.model.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === '' || order.status === statusFilter
    const matchesType = typeFilter === '' || order.orderType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const sortedOrders = filteredOrders.sort((a, b) => 
    new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime()
  )

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    completed: orders.filter(o => o.status === 'Completed').length,
    sales: orders.filter(o => o.orderType === 'sale').length,
    purchases: orders.filter(o => o.orderType === 'purchase').length
  }

  const handleViewOrder = (order: Order) => {
    openModal('order', order)
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
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
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
                            {order.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">{order.customer.name}</span> • 
                          <span className="ml-1">{order.watch.brand} {order.watch.model}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {order.pricing.salePrice || order.pricing.costPrice}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(order.date)} • {order.time}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <DocumentArrowDownIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {order.payment.status !== 'Paid' && (
                    <div className="mt-3 flex items-center text-sm">
                      <div className={clsx(
                        'w-2 h-2 rounded-full mr-2',
                        order.payment.status === 'Pending' ? 'bg-yellow-400' :
                        order.payment.status === 'Partial' ? 'bg-orange-400' :
                        'bg-red-400'
                      )} />
                      <span className="text-gray-600">
                        Payment: {order.payment.status}
                      </span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}