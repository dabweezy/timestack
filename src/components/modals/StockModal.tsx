'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClockIcon, CurrencyDollarIcon, TagIcon, UserIcon, MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import BaseModal from './BaseModal'
import useAppStore from '@/store/useAppStore'
import { generateId } from '@/utils/format'
import type { WatchProduct, StockForm } from '@/types'

const watchBrands = [
  'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Richard Mille', 'Vacheron Constantin',
  'Omega', 'Cartier', 'Jaeger-LeCoultre', 'IWC', 'Panerai', 'Breitling', 'Tudor',
  'Hublot', 'TAG Heuer', 'Zenith', 'Chopard', 'Other'
]

const materials = [
  'Stainless Steel', 'Yellow Gold', 'Rose Gold', 'White Gold', 'Platinum',
  'Two-Tone Steel/Gold', 'Ceramic', 'Titanium', 'Carbon Fiber', 'Other'
]

const dialColors = [
  'Black', 'White', 'Blue', 'Silver', 'Champagne', 'Gold', 'Brown', 'Green',
  'Grey', 'Red', 'Pink', 'Purple', 'Mother of Pearl', 'Other'
]

const conditions = [
  'New', 'Excellent', 'Very Good', 'Good', 'Fair'
]

const sets = [
  'Complete Set (Box & Papers)', 'Box Only', 'Papers Only', 'Watch Only'
]

export default function StockModal() {
  const { modals, closeModal, addWatchProduct, updateWatchProduct, customers } = useAppStore()
  const isEditing = modals.data?.id
  const product = modals.data as WatchProduct
  

  const [formData, setFormData] = useState<StockForm>({
    brand: '',
    model: '',
    reference: '',
    serial: '',
    material: '',
    dialColor: '',
    condition: '',
    yearManufactured: new Date().getFullYear().toString(),
    set: '',
    costPrice: '',
    stockType: 'stock',
    description: ''
  })

  const [errors, setErrors] = useState<Partial<StockForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Customer assignment state
  const [customerSearchQuery, setCustomerSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [assignedCustomer, setAssignedCustomer] = useState<string | null>(null)

  useEffect(() => {
    if (isEditing && product) {
      setFormData({
        brand: product.brand || '',
        model: product.model || '',
        reference: product.reference || '',
        serial: product.serial || '',
        material: product.material || '',
        dialColor: product.dialColor || '',
        condition: product.condition || '',
        yearManufactured: product.yearManufactured ? product.yearManufactured.toString() : '',
        set: product.set || '',
        costPrice: product.costPrice ? product.costPrice.toString() : '',
        stockType: product.condition === 'Very Good' ? 'consignment' : 'stock',
        description: product.description || ''
      })
      setAssignedCustomer(product.assignedCustomer || null)
    }
  }, [isEditing, product])

  const handleInputChange = (field: keyof StockForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<StockForm> = {}

    if (!formData.brand.trim()) newErrors.brand = 'Brand is required'
    if (!formData.model.trim()) newErrors.model = 'Model is required'
    if (!formData.reference.trim()) newErrors.reference = 'Reference is required'
    if (!formData.material) newErrors.material = 'Material is required'
    if (!formData.dialColor) newErrors.dialColor = 'Dial color is required'
    if (!formData.condition) newErrors.condition = 'Condition is required'
    if (!formData.yearManufactured) newErrors.yearManufactured = 'Year is required'
    else {
      const year = parseInt(formData.yearManufactured)
      if (isNaN(year) || year < 1800 || year > new Date().getFullYear() + 1) {
        newErrors.yearManufactured = 'Please enter a valid year'
      }
    }
    if (!formData.set) newErrors.set = 'Set information is required'
    if (!formData.costPrice.trim()) newErrors.costPrice = 'Cost price is required'
    else if (isNaN(parseFloat(formData.costPrice)) || parseFloat(formData.costPrice) <= 0) {
      newErrors.costPrice = 'Please enter a valid price'
    }
    if (!formData.stockType) newErrors.stockType = 'Stock type is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const productData: WatchProduct = {
        id: isEditing ? product.id : generateId('watch'),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        reference: formData.reference.trim(),
        serial: formData.serial?.trim(),
        material: formData.material,
        dialColor: formData.dialColor,
        condition: formData.condition as WatchProduct['condition'],
        yearManufactured: parseInt(formData.yearManufactured),
        set: formData.set,
        costPrice: parseFloat(formData.costPrice),
        tradePrice: parseFloat(formData.costPrice), // Keep for backward compatibility
        retailPrice: parseFloat(formData.costPrice) * 1.5, // Auto-calculate retail as 1.5x cost
        description: formData.description?.trim(),
        dateAdded: isEditing ? product.dateAdded : new Date().toISOString(),
        status: formData.stockType === 'consignment' ? 'consignment' : 'available',
        assignedCustomer: assignedCustomer || undefined
      }

      if (isEditing) {
        updateWatchProduct(product.id, productData)
      } else {
        addWatchProduct(productData)
      }

      closeModal()
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Customer assignment functions
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
      setAssignedCustomer(selectedCustomer)
      setSelectedCustomer(null)
      setCustomerSearchQuery('')
    }
  }

  const handleReassign = () => {
    setAssignedCustomer(null)
    setSelectedCustomer(null)
    setCustomerSearchQuery('')
  }

  const assignedCustomerData = assignedCustomer ? customers.find(c => c.id === assignedCustomer) : null

  if (modals.type !== 'stock') return null

  return (
    <BaseModal title={isEditing ? 'Edit Product' : 'Add New Product'} size="xl">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Watch Information */}
        <div>
          <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
            <ClockIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Watch Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <select
                value={formData.brand}
                onChange={handleInputChange('brand')}
                className={`form-input w-full ${errors.brand ? 'border-red-300' : ''}`}
              >
                <option value="">Select brand</option>
                {watchBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              {errors.brand && (
                <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={handleInputChange('model')}
                className={`form-input w-full ${errors.model ? 'border-red-300' : ''}`}
                placeholder="Enter model name"
              />
              {errors.model && (
                <p className="mt-1 text-sm text-red-600">{errors.model}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference *
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={handleInputChange('reference')}
                className={`form-input w-full ${errors.reference ? 'border-red-300' : ''}`}
                placeholder="Enter reference number"
              />
              {errors.reference && (
                <p className="mt-1 text-sm text-red-600">{errors.reference}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serial Number
              </label>
              <input
                type="text"
                value={formData.serial}
                onChange={handleInputChange('serial')}
                className="form-input w-full"
                placeholder="Enter serial number (optional)"
              />
            </div>
          </div>
        </div>

        {/* Physical Specifications */}
        <div>
          <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
            <TagIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Physical Specifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material *
              </label>
              <select
                value={formData.material}
                onChange={handleInputChange('material')}
                className={`form-input w-full ${errors.material ? 'border-red-300' : ''}`}
              >
                <option value="">Select material</option>
                {materials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
              {errors.material && (
                <p className="mt-1 text-sm text-red-600">{errors.material}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dial Color *
              </label>
              <select
                value={formData.dialColor}
                onChange={handleInputChange('dialColor')}
                className={`form-input w-full ${errors.dialColor ? 'border-red-300' : ''}`}
              >
                <option value="">Select dial color</option>
                {dialColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
              {errors.dialColor && (
                <p className="mt-1 text-sm text-red-600">{errors.dialColor}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Manufactured *
              </label>
              <input
                type="number"
                value={formData.yearManufactured}
                onChange={handleInputChange('yearManufactured')}
                className={`form-input w-full ${errors.yearManufactured ? 'border-red-300' : ''}`}
                placeholder="YYYY"
                min="1800"
                max={new Date().getFullYear() + 1}
              />
              {errors.yearManufactured && (
                <p className="mt-1 text-sm text-red-600">{errors.yearManufactured}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={handleInputChange('condition')}
                className={`form-input w-full ${errors.condition ? 'border-red-300' : ''}`}
              >
                <option value="">Select condition</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
              {errors.condition && (
                <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set *
              </label>
              <select
                value={formData.set}
                onChange={handleInputChange('set')}
                className={`form-input w-full ${errors.set ? 'border-red-300' : ''}`}
              >
                <option value="">Select set type</option>
                {sets.map(set => (
                  <option key={set} value={set}>{set}</option>
                ))}
              </select>
              {errors.set && (
                <p className="mt-1 text-sm text-red-600">{errors.set}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing and Stock Information */}
        <div>
          <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
            <CurrencyDollarIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Purchase Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Price (£) *
              </label>
              <input
                type="number"
                value={formData.costPrice}
                onChange={handleInputChange('costPrice')}
                className={`form-input w-full ${errors.costPrice ? 'border-red-300' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.costPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.costPrice}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Type *
              </label>
              <select
                value={formData.stockType}
                onChange={handleInputChange('stockType')}
                className={`form-select w-full ${errors.stockType ? 'border-red-300' : ''}`}
              >
                <option value="stock">Stock</option>
                <option value="consignment">Consignment</option>
              </select>
              {errors.stockType && (
                <p className="mt-1 text-sm text-red-600">{errors.stockType}</p>
              )}
            </div>
          </div>
          
          {formData.costPrice && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                <div>Cost Price: £{parseFloat(formData.costPrice).toFixed(2)}</div>
                <div>Suggested Retail: £{(parseFloat(formData.costPrice) * 1.5).toFixed(2)} (1.5x markup)</div>
                <div>Potential Margin: £{(parseFloat(formData.costPrice) * 0.5).toFixed(2)} (33.3%)</div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={handleInputChange('description')}
            rows={3}
            className="form-input w-full resize-none"
            placeholder="Enter additional details about this watch (optional)"
          />
        </div>

        {/* Customer Assignment */}
        <div>
          <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
            <UserIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Customer Assignment
          </h3>
          
          {!assignedCustomer ? (
            <div className="space-y-4">
              {/* Customer Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Customer
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="form-input pl-10 w-full"
                    placeholder="Search by name or email..."
                  />
                </div>
              </div>

              {/* Customer List */}
              {customerSearchQuery && filteredCustomers.length > 0 && (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer.id)}
                      className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                        selectedCustomer === customer.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                        {selectedCustomer === customer.id && (
                          <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Customer Card */}
              {selectedCustomer && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">
                        {customers.find(c => c.id === selectedCustomer)?.firstName} {customers.find(c => c.id === selectedCustomer)?.lastName}
                      </p>
                      <p className="text-sm text-blue-700">
                        {customers.find(c => c.id === selectedCustomer)?.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveAssignment}
                      className="btn btn-primary btn-sm"
                    >
                      Assign Customer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Assigned Customer Display */
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-900">
                    {assignedCustomerData?.firstName} {assignedCustomerData?.lastName}
                  </p>
                  <p className="text-sm text-green-700">
                    {assignedCustomerData?.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReassign}
                  className="btn btn-secondary btn-sm"
                >
                  Reassign
                </button>
              </div>
            </div>
          )}
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
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
          </motion.button>
        </div>
      </form>
    </BaseModal>
  )
}