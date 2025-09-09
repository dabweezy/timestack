'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ClockIcon, 
  UserIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  CreditCardIcon,
  CalendarIcon,
  TagIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import BaseModal from './BaseModal'
import useAppStore from '@/store/useAppStore'
import { formatCurrency, formatDate, generateId } from '@/utils/format'
import type { WatchProduct, Customer, Order } from '@/types'
import clsx from 'clsx'

export default function SalesModal() {
  const { modals, closeModal, customers, addOrder, updateWatchProduct } = useAppStore()
  const product = modals.data?.product as WatchProduct
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerSearchQuery, setCustomerSearchQuery] = useState('')
  const [salePrice, setSalePrice] = useState<number>(product?.retailPrice || 0)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer'>('card')
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  if (modals.type !== 'sales' || !product) return null

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearchQuery.toLowerCase())
  )

  // Calculate margin
  const margin = salePrice - product.tradePrice
  const marginPercentage = ((margin / product.tradePrice) * 100).toFixed(1)

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
    setCustomerSearchQuery('')
  }

  const handleProcessSale = async () => {
    if (!selectedCustomer) return

    setIsProcessing(true)
    
    try {
      const now = new Date()
      const timestamp = now.toISOString()
      
      // Create order
      const order: Order = {
        id: generateId('order'),
        orderNumber: `SALE-${Date.now()}`,
        orderType: 'sale',
        customer: selectedCustomer,
        watch: product,
        product: product,
        salePrice,
        paymentMethod,
        status: 'completed',
        date: now.toLocaleDateString(),
        timestamp,
        notes
      }

      // Add order to store
      addOrder(order)

      // Update product to mark as sold
      updateWatchProduct(product.id, { 
        assignedCustomer: selectedCustomer.id,
        status: 'sold' 
      })

      // Show success message
      alert(`Sale completed! Order #${order.orderNumber}`)
      
      // Close modal
      closeModal()
    } catch (error) {
      console.error('Error processing sale:', error)
      alert('Error processing sale. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <BaseModal title="Process Sale" size="2xl">
      <div className="p-6 space-y-8">
        {/* Product Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Product Details
          </h3>
          
          <div className="flex items-start space-x-6">
            {/* Product Image */}
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={`${product.brand} ${product.model}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <ClockIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {product.brand} {product.model}
              </h4>
              <p className="text-gray-600 font-mono mb-3">{product.reference}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Condition:</span>
                  <span className="ml-2 font-medium">{product.condition}</span>
                </div>
                <div>
                  <span className="text-gray-500">Year:</span>
                  <span className="ml-2 font-medium">{product.yearManufactured}</span>
                </div>
                <div>
                  <span className="text-gray-500">Material:</span>
                  <span className="ml-2 font-medium">{product.material}</span>
                </div>
                <div>
                  <span className="text-gray-500">Dial:</span>
                  <span className="ml-2 font-medium">{product.dialColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Select Customer
          </h3>
          
          {!selectedCustomer ? (
            <div className="space-y-4">
              {/* Customer Search */}
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

              {/* Customer List */}
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredCustomers.map((customer) => (
                  <motion.div
                    key={customer.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-apple-blue hover:bg-blue-50 cursor-pointer transition-all duration-200"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                        <p className="text-sm text-gray-500">{customer.mobile}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{customer.city}, {customer.country}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add New Customer */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => useAppStore.getState().openModal('customer')}
                  className="flex items-center space-x-2 text-apple-blue hover:text-blue-700 font-medium"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add New Customer</span>
                </button>
              </div>
            </div>
          ) : (
            /* Selected Customer */
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </h4>
                    <p className="text-sm text-green-600 font-medium">Selected Customer</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedCustomer.mobile}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</label>
                    <p className="text-sm text-gray-900 font-medium">
                      {selectedCustomer.address1}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
                    <p className="text-sm text-gray-900 font-medium">
                      {selectedCustomer.city}, {selectedCustomer.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sale Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pricing */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-apple-blue" />
              Pricing
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Price
                </label>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="form-input w-full"
                  min={product.tradePrice}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Trade Price:</span>
                  <span className="ml-2 font-medium">{formatCurrency(product.tradePrice)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Margin:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {formatCurrency(margin)} ({marginPercentage}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCardIcon className="w-5 h-5 mr-2 text-apple-blue" />
              Payment Method
            </h3>
            
            <div className="space-y-3">
              {[
                { value: 'card', label: 'Credit Card', icon: CreditCardIcon },
                { value: 'cash', label: 'Cash', icon: CurrencyDollarIcon },
                { value: 'bank_transfer', label: 'Bank Transfer', icon: CreditCardIcon }
              ].map((method) => (
                <label key={method.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="form-radio text-apple-blue"
                  />
                  <method.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes about this sale..."
            className="form-input w-full h-24 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={closeModal}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleProcessSale}
            disabled={!selectedCustomer || isProcessing}
            className={clsx(
              'px-8 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2',
              selectedCustomer && !isProcessing
                ? 'bg-apple-blue text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                <span>Complete Sale</span>
              </>
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
