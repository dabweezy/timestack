'use client'

import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { 
  ClockIcon, 
  TagIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  ShoppingCartIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import BaseModal from './BaseModal'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { formatCurrency, formatDate } from '@/utils/format'
import type { WatchProduct, Order } from '@/types'
import clsx from 'clsx'

const conditionColors = {
  'New': 'bg-green-100 text-green-800 border-green-200',
  'Excellent': 'bg-blue-100 text-blue-800 border-blue-200',
  'Very Good': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Good': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Fair': 'bg-orange-100 text-orange-800 border-orange-200'
}

export default function ProductDetailsModal() {
  const { modals, closeModal, orders, customers, openModal, updateWatchProduct } = useSupabaseStore()
  const product = modals.data as WatchProduct
  const [customerSearchQuery, setCustomerSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [localAssignedCustomer, setLocalAssignedCustomer] = useState<string | null>(null)

  if (modals.type !== 'productDetails' || !product) return null

  // Initialize state with product data after null check
  React.useEffect(() => {
    if (product) {
      setSelectedCustomer(product.assignedCustomer || null)
      setLocalAssignedCustomer(product.assignedCustomer || null)
    }
  }, [product])

  // Find orders related to this product
  const productOrders = orders.filter(order => 
    order.watch.brand === product.brand && 
    order.watch.model === product.model && 
    order.watch.reference === product.reference
  )

  // Find the assigned customer (if any)
  const assignedCustomer = localAssignedCustomer ? customers.find(c => c.id === localAssignedCustomer) : null

  // Calculate margin
  const margin = product.retailPrice - product.tradePrice
  const marginPercentage = ((margin / product.tradePrice) * 100).toFixed(1)

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearchQuery.toLowerCase())
  )

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomer(customerId)
  }

  const handleSaveAssignment = () => {
    if (selectedCustomer) {
      const customer = customers.find(c => c.id === selectedCustomer)
      if (customer) {
        // Update the product with the assigned customer
        updateWatchProduct(product.id, { assignedCustomer: selectedCustomer })
        // Update local state immediately to trigger view change
        setLocalAssignedCustomer(selectedCustomer)
        // Clear the selected customer to hide the assignment section
        setSelectedCustomer(null)
      }
    }
  }


  return (
    <BaseModal title="Product Details" size="2xl">
      <div className="p-6 space-y-6">
        {/* Header with Product Image and Basic Info */}
        <div className="flex items-start space-x-6 pb-6 border-b border-gray-100">
          {/* Product Image */}
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={`${product.brand} ${product.model}`}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <ClockIcon className="w-16 h-16 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.brand} {product.model}
                </h2>
                <p className="text-lg text-gray-500 font-mono mb-3">
                  {product.reference}
                </p>
                <div className="flex items-center space-x-3">
                  <span className={clsx(
                    'inline-flex px-3 py-1 text-sm font-medium rounded-full border',
                    conditionColors[product.condition]
                  )}>
                    {product.condition}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.yearManufactured}
                  </span>
                </div>
              </div>
              
              {/* Status Badge and Edit Button */}
              <div className="flex flex-col items-end space-y-3">
                {/* Status Badge */}
                <div>
                  {assignedCustomer ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircleIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Assigned</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <ExclamationTriangleIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Available</span>
                    </div>
                  )}
                </div>
                
                {/* Edit Button */}
                <button
                  onClick={() => openModal('stock', product)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div>
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <ClockIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Product Specifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Brand & Model
              </label>
              <p className="text-gray-900 font-medium">
                {product.brand} {product.model}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Reference Number
              </label>
              <p className="text-gray-900 font-mono text-sm">
                {product.reference}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Serial Number
              </label>
              <p className="text-gray-900 font-mono text-sm">
                {product.serial || 'Not available'}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Material
              </label>
              <p className="text-gray-900">{product.material}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Dial Color
              </label>
              <p className="text-gray-900">{product.dialColor}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Year Manufactured
              </label>
              <p className="text-gray-900">{product.yearManufactured}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Set Completeness
              </label>
              <p className="text-gray-900">{product.set}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Date Added
              </label>
              <p className="text-gray-900">{formatDate(product.dateAdded)}</p>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div>
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <CurrencyDollarIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Pricing Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <label className="block text-sm font-medium text-blue-600 mb-1">
                Trade Price
              </label>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(product.tradePrice)}
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <label className="block text-sm font-medium text-green-600 mb-1">
                Retail Price
              </label>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(product.retailPrice)}
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <label className="block text-sm font-medium text-purple-600 mb-1">
                Margin
              </label>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(margin)}
              </p>
              <p className="text-sm text-purple-600">
                ({marginPercentage}%)
              </p>
            </div>
          </div>
        </div>

        {/* Product Status */}
        <div>
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <ShoppingCartIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Product Status
          </h3>
          
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">
                  {assignedCustomer ? 'Assigned to Customer' : 'Available for Assignment'}
                </h4>
                <p className="text-gray-600">
                  {assignedCustomer 
                    ? `This product is assigned to ${assignedCustomer.firstName} ${assignedCustomer.lastName}`
                    : 'This product is currently available and ready for assignment'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase History */}
        {productOrders.length > 0 && (
          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <CalendarIcon className="w-5 h-5 mr-2 text-apple-blue" />
              Purchase History
            </h3>
            
            <div className="space-y-3">
              {productOrders.map((order, index) => (
                <motion.div
                  key={order.orderNumber}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={clsx(
                        'w-3 h-3 rounded-full',
                        order.orderType === 'sale' ? 'bg-green-500' : 'bg-blue-500'
                      )} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.orderType === 'sale' ? 'Sale' : 'Purchase'} - {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'No Customer'} • {formatDate(order.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {order.salePrice || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.status}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <TagIcon className="w-5 h-5 mr-2 text-apple-blue" />
              Description
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        )}

        {/* Customer Assignment Section */}
        {!assignedCustomer && (
          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <UserIcon className="w-5 h-5 mr-2 text-apple-blue" />
              Assign to Customer
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {/* Customer Search */}
              <div className="mb-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="form-input pl-10 w-full"
                  />
                </div>
              </div>

              {/* Selected Customer Card */}
              {selectedCustomer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <div className="bg-white rounded-lg p-4 border-2 border-apple-blue">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-apple-blue to-apple-purple rounded-lg flex items-center justify-center text-white font-bold">
                          {customers.find(c => c.id === selectedCustomer)?.firstName[0]}{customers.find(c => c.id === selectedCustomer)?.lastName[0]}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {customers.find(c => c.id === selectedCustomer)?.firstName} {customers.find(c => c.id === selectedCustomer)?.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {customers.find(c => c.id === selectedCustomer)?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSaveAssignment}
                          className="btn btn-primary"
                        >
                          Save Assignment
                        </button>
                        <button
                          onClick={() => setSelectedCustomer(null)}
                          className="btn btn-secondary"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Customer List */}
              {!selectedCustomer && (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredCustomers.length === 0 ? (
                    <div className="text-center py-8">
                      <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">
                        {customerSearchQuery ? 'No customers found' : 'No customers available'}
                      </p>
                      {!customerSearchQuery && (
                        <button
                          onClick={() => openModal('customer')}
                          className="btn btn-primary"
                        >
                          Add New Customer
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <motion.div
                        key={customer.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg p-4 border border-gray-200 hover:border-apple-blue transition-colors duration-200 cursor-pointer"
                        onClick={() => handleCustomerSelect(customer.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-apple-blue to-apple-purple rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {customer.firstName[0]}{customer.lastName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {customer.firstName} {customer.lastName}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                              {customer.email}
                            </p>
                            <p className="text-xs text-gray-400">
                              {customer.mobile}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {customer.city}
                            </p>
                            <p className="text-xs text-gray-400">
                              Customer since {formatDate(customer.dateAdded)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {selectedCustomer ? 'Ready to save assignment' : 'Select a customer to assign this product'}
                  </p>
                  <button
                    onClick={() => openModal('customer')}
                    className="text-sm text-apple-blue hover:text-blue-700 font-medium"
                  >
                    Add New Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assigned Customer Display */}
        {assignedCustomer && (
          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <UserIcon className="w-5 h-5 mr-2 text-apple-blue" />
              Assigned Customer
            </h3>
            
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-apple-blue to-apple-purple rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  {assignedCustomer.firstName[0]}{assignedCustomer.lastName[0]}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900">
                    {assignedCustomer.firstName} {assignedCustomer.lastName}
                  </h4>
                  <p className="text-gray-600">{assignedCustomer.email}</p>
                  <p className="text-sm text-gray-500">{assignedCustomer.mobile}</p>
                  <p className="text-sm text-gray-500">{assignedCustomer.city}, {assignedCustomer.country}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-green-600 mb-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Assigned</span>
                  </div>
                  <button
                    onClick={() => {
                      setLocalAssignedCustomer(null)
                      setSelectedCustomer(null)
                    }}
                    className="text-sm text-apple-blue hover:text-blue-700 font-medium"
                  >
                    Reassign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
