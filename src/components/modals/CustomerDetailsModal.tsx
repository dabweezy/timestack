'use client'

import { motion } from 'framer-motion'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import BaseModal from './BaseModal'
import useAppStore from '@/store/useAppStore'
import { formatDate, formatPhone } from '@/utils/format'
import type { Customer } from '@/types'

export default function CustomerDetailsModal() {
  const { modals, closeModal } = useAppStore()
  const customer = modals.data as Customer

  if (modals.type !== 'customerDetails' || !customer) return null

  return (
    <BaseModal title="Customer Details" size="xl">
      <div className="p-6 space-y-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-center space-x-4 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-apple-blue to-apple-purple rounded-xl flex items-center justify-center text-white font-bold text-xl">
            {customer.firstName[0]}{customer.lastName[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h2>
            <p className="text-gray-500">
              Customer since {formatDate(customer.dateAdded)}
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <UserIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Full Name
              </label>
              <p className="text-gray-900 font-medium">
                {customer.firstName} {customer.lastName}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Customer ID
              </label>
              <p className="text-gray-900 font-mono text-sm">
                {customer.id}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <EnvelopeIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email Address
              </label>
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{customer.email}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Mobile Number
              </label>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{formatPhone(customer.mobile)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <MapPinIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Address Information
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Address
              </label>
              <div className="flex items-start space-x-2">
                <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-900">{customer.address1}</p>
                  {customer.address2 && (
                    <p className="text-gray-900">{customer.address2}</p>
                  )}
                  <p className="text-gray-900">
                    {customer.city}, {customer.postcode}
                  </p>
                  <p className="text-gray-900">{customer.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banking Information */}
        {(customer.sortCode || customer.accountNumber || customer.iban || customer.swift) && (
          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
              <CreditCardIcon className="w-5 h-5 mr-2 text-apple-blue" />
              Banking Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customer.bankName && (
                <div className="bg-gray-50 rounded-lg p-4 group">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Bank Name
                  </label>
                  <div className="relative">
                    <p className="text-gray-900 font-medium group-hover:opacity-0 transition-opacity duration-200">
                      {customer.bankName.replace(/./g, '*')}
                    </p>
                    <p className="absolute inset-0 text-gray-900 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {customer.bankName}
                    </p>
                  </div>
                </div>
              )}
              
              {customer.sortCode && (
                <div className="bg-gray-50 rounded-lg p-4 group">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Sort Code
                  </label>
                  <div className="relative">
                    <p className="text-gray-900 font-mono group-hover:opacity-0 transition-opacity duration-200">
                      {customer.sortCode.replace(/./g, '*')}
                    </p>
                    <p className="absolute inset-0 text-gray-900 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {customer.sortCode}
                    </p>
                  </div>
                </div>
              )}
              
              {customer.accountNumber && (
                <div className="bg-gray-50 rounded-lg p-4 group">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Account Number
                  </label>
                  <div className="relative">
                    <p className="text-gray-900 font-mono group-hover:opacity-0 transition-opacity duration-200">
                      {customer.accountNumber.replace(/./g, '*')}
                    </p>
                    <p className="absolute inset-0 text-gray-900 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {customer.accountNumber}
                    </p>
                  </div>
                </div>
              )}
              
              {customer.iban && (
                <div className="bg-gray-50 rounded-lg p-4 group">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    IBAN
                  </label>
                  <div className="relative">
                    <p className="text-gray-900 font-mono text-sm group-hover:opacity-0 transition-opacity duration-200">
                      {customer.iban.replace(/./g, '*')}
                    </p>
                    <p className="absolute inset-0 text-gray-900 font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {customer.iban}
                    </p>
                  </div>
                </div>
              )}
              
              {customer.swift && (
                <div className="bg-gray-50 rounded-lg p-4 group">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    SWIFT/BIC
                  </label>
                  <div className="relative">
                    <p className="text-gray-900 font-mono group-hover:opacity-0 transition-opacity duration-200">
                      {customer.swift.replace(/./g, '*')}
                    </p>
                    <p className="absolute inset-0 text-gray-900 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {customer.swift}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Information */}
        <div>
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <CalendarIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Account Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Date Added
              </label>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <p className="text-gray-900">{formatDate(customer.dateAdded)}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Status
              </label>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p className="text-gray-900">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={closeModal}
            className="btn btn-secondary"
          >
            Close
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              closeModal()
              useAppStore.getState().openModal('customer', customer)
            }}
            className="btn btn-primary"
          >
            Edit Customer
          </motion.button>
        </div>
      </div>
    </BaseModal>
  )
}
