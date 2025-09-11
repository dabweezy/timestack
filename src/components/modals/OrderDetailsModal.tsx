'use client'

import { motion } from 'framer-motion'
import { 
  ClockIcon, 
  UserIcon,
  CreditCardIcon,
  CalendarIcon,
  TagIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import BaseModal from './BaseModal'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { formatCurrency, formatDate } from '@/utils/format'
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

const paymentMethodIcons = {
  'cash': CurrencyDollarIcon,
  'card': CreditCardIcon,
  'bank_transfer': CreditCardIcon
}

export default function OrderDetailsModal() {
  const { modals, closeModal } = useSupabaseStore()
  const order = modals.data as Order

  if (modals.type !== 'order' || !order) return null

  const StatusIcon = statusIcons[order.status]
  const PaymentIcon = paymentMethodIcons[order.paymentMethod] || CreditCardIcon

  return (
    <BaseModal title="Order Details" size="2xl">
      <div className="p-6 space-y-8">
        {/* Order Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {order.orderNumber}
              </h2>
              <div className="flex items-center space-x-4">
                <span className={clsx(
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  statusColors[order.status]
                )}>
                  <StatusIcon className="w-4 h-4 mr-2" />
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className={clsx(
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  order.orderType === 'sale' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                )}>
                  {order.orderType === 'sale' ? (
                    <ArrowUpIcon className="w-4 h-4 mr-2" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 mr-2" />
                  )}
                  {order.orderType === 'sale' ? 'Sale' : 'Purchase'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatCurrency(order.salePrice)}
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(order.timestamp)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-blue-600" />
              Customer Information
            </h3>
            
            {order.customer ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-lg">
                      {order.customer.firstName[0]}{order.customer.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {order.customer.firstName} {order.customer.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">Customer</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{order.customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{order.customer.mobile}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Address</p>
                      <div className="text-sm text-gray-600">
                        <p>{order.customer.address1}</p>
                        {order.customer.address2 && <p>{order.customer.address2}</p>}
                        <p>{order.customer.city}, {order.customer.postcode}</p>
                        <p>{order.customer.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No customer information available</p>
              </div>
            )}
          </div>

          {/* Watch Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-blue-600" />
              Watch Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-10 h-10 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {order.watch.brand} {order.watch.model}
                  </h4>
                  <p className="text-gray-600 font-mono text-sm mb-3">{order.watch.reference}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Condition:</span>
                      <span className="ml-2 font-medium">{order.watch.condition}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Year:</span>
                      <span className="ml-2 font-medium">{order.watch.yearManufactured}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Material:</span>
                      <span className="ml-2 font-medium">{order.watch.material}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Dial:</span>
                      <span className="ml-2 font-medium">{order.watch.dialColor}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Serial:</span>
                      <span className="ml-2 font-medium">{order.watch.serial}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Set:</span>
                      <span className="ml-2 font-medium">{order.watch.set}</span>
                    </div>
                  </div>
                  
                  {order.watch.description && (
                    <div className="mt-3">
                      <span className="text-gray-500 text-sm">Description:</span>
                      <p className="text-sm text-gray-600 mt-1">{order.watch.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCardIcon className="w-5 h-5 mr-2 text-blue-600" />
            Transaction Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Payment Method</p>
                <div className="flex items-center space-x-2">
                  <PaymentIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600 capitalize">
                    {order.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Order Date</p>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.date}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Pricing</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cost Price:</span>
                    <span className="font-medium">{formatCurrency(order.watch.costPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Trade Price:</span>
                    <span className="font-medium">{formatCurrency(order.watch.tradePrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Retail Price:</span>
                    <span className="font-medium">{formatCurrency(order.watch.retailPrice)}</span>
                  </div>
                  <div className="border-t pt-1 flex justify-between text-sm font-semibold">
                    <span className="text-gray-900">Sale Price:</span>
                    <span className="text-green-600">{formatCurrency(order.salePrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Transaction ID</p>
                <div className="flex items-center space-x-2">
                  <TagIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600 font-mono">{order.id}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Timestamp</p>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{formatDate(order.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Notes</p>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={closeModal}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              // You can add download receipt functionality here
              console.log('Download receipt for order:', order.orderNumber)
            }}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Download Receipt
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
