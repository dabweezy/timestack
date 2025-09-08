'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  UsersIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import useAppStore from '@/store/useAppStore'
import { formatDate, formatPhone } from '@/utils/format'

export default function CustomersPage() {
  const { customers, openModal } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.mobile.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage your customer relationships and information</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal('customer')}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Customer</span>
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input pl-10 w-full sm:w-96"
        />
      </div>

      {/* Customers Grid */}
      {filteredCustomers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No customers found' : 'No customers yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Start building your customer database by adding your first customer'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={() => openModal('customer')}
              className="btn btn-primary"
            >
              Add Your First Customer
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => openModal('customer', customer)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-apple-blue to-apple-purple rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                  {customer.firstName[0]}{customer.lastName[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Added {formatDate(customer.dateAdded)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 truncate">{customer.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{formatPhone(customer.mobile)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {customer.city}, {customer.country}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats */}
      {customers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-gray-50 rounded-xl p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
              <div className="text-sm text-gray-500">Total Customers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredCustomers.length}
              </div>
              <div className="text-sm text-gray-500">Showing Results</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {customers.filter(c => new Date(c.dateAdded) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-gray-500">Added This Month</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}