'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import BaseModal from './BaseModal'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import { generateId } from '@/utils/format'
import type { Customer, CustomerForm } from '@/types'

export default function CustomerModal() {
  const { modals, closeModal, addCustomer, updateCustomer } = useSupabaseStore()
  const isEditing = modals.data?.id
  const customer = modals.data as Customer

  const [formData, setFormData] = useState<CustomerForm>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    sortCode: '',
    accountNumber: '',
    bankName: '',
    iban: '',
    swift: ''
  })

  const [errors, setErrors] = useState<Partial<CustomerForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (isEditing && customer) {
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        mobile: customer.mobile,
        address1: customer.address1,
        address2: customer.address2 || '',
        city: customer.city,
        postcode: customer.postcode,
        country: customer.country,
        sortCode: customer.sortCode || '',
        accountNumber: customer.accountNumber || '',
        bankName: customer.bankName || '',
        iban: customer.iban || '',
        swift: customer.swift || ''
      })
    }
  }, [isEditing, customer])

  const handleInputChange = (field: keyof CustomerForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerForm> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required'
    if (!formData.address1.trim()) newErrors.address1 = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const customerData: Customer = {
        id: isEditing ? customer.id : generateId('customer'),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        address1: formData.address1.trim(),
        address2: formData.address2?.trim(),
        city: formData.city.trim(),
        postcode: formData.postcode.trim(),
        country: formData.country,
        sortCode: formData.sortCode?.trim(),
        accountNumber: formData.accountNumber?.trim(),
        bankName: formData.bankName?.trim(),
        iban: formData.iban?.trim(),
        swift: formData.swift?.trim(),
        dateAdded: isEditing ? customer.dateAdded : new Date().toISOString()
      }

      if (isEditing) {
        await updateCustomer(customer.id, customerData)
      } else {
        await addCustomer(customerData)
      }

      // Show success animation
      setIsSubmitting(false)
      setIsSuccess(true)
      setTimeout(() => {
        closeModal()
      }, 1000) // Show success state for 1 second
    } catch (error) {
      console.error('Error saving customer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (modals.type !== 'customer') return null

  return (
    <BaseModal title={isEditing ? 'Edit Customer' : 'Add New Customer'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
            <UserIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                className={`form-input w-full ${errors.firstName ? 'border-red-300' : ''}`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                className={`form-input w-full ${errors.lastName ? 'border-red-300' : ''}`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
            <EnvelopeIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className={`form-input w-full ${errors.email ? 'border-red-300' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={handleInputChange('mobile')}
                className={`form-input w-full ${errors.mobile ? 'border-red-300' : ''}`}
                placeholder="Enter mobile number"
              />
              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
            <MapPinIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Address Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 *
              </label>
              <input
                type="text"
                value={formData.address1}
                onChange={handleInputChange('address1')}
                className={`form-input w-full ${errors.address1 ? 'border-red-300' : ''}`}
                placeholder="Enter address line 1"
              />
              {errors.address1 && (
                <p className="mt-1 text-sm text-red-600">{errors.address1}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.address2}
                onChange={handleInputChange('address2')}
                className="form-input w-full"
                placeholder="Enter address line 2 (optional)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange('city')}
                  className={`form-input w-full ${errors.city ? 'border-red-300' : ''}`}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode *
                </label>
                <input
                  type="text"
                  value={formData.postcode}
                  onChange={handleInputChange('postcode')}
                  className={`form-input w-full ${errors.postcode ? 'border-red-300' : ''}`}
                  placeholder="Enter postcode"
                />
                {errors.postcode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postcode}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={handleInputChange('country')}
                  className="form-input w-full"
                >
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Ireland">Ireland</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                  <option value="Switzerland">Switzerland</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Banking Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Banking Information (Optional)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={handleInputChange('bankName')}
                className="form-input w-full"
                placeholder="Enter bank name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Code
              </label>
              <input
                type="text"
                value={formData.sortCode}
                onChange={handleInputChange('sortCode')}
                className="form-input w-full"
                placeholder="00-00-00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={handleInputChange('accountNumber')}
                className="form-input w-full"
                placeholder="Enter account number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IBAN
              </label>
              <input
                type="text"
                value={formData.iban}
                onChange={handleInputChange('iban')}
                className="form-input w-full"
                placeholder="Enter IBAN"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SWIFT/BIC
              </label>
              <input
                type="text"
                value={formData.swift}
                onChange={handleInputChange('swift')}
                className="form-input w-full"
                placeholder="Enter SWIFT code"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={closeModal}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={isSubmitting || isSuccess}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`btn ${isSuccess ? 'btn-success' : 'btn-primary'}`}
            animate={isSuccess ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {isSuccess ? (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Saved!</span>
              </div>
            ) : isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              isEditing ? 'Update Customer' : 'Add Customer'
            )}
          </motion.button>
        </div>
      </form>
    </BaseModal>
  )
}