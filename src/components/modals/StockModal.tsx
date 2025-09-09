'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClockIcon, CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/outline'
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
  const { modals, closeModal, addWatchProduct, updateWatchProduct } = useAppStore()
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
    tradePrice: '',
    retailPrice: '',
    description: ''
  })

  const [errors, setErrors] = useState<Partial<StockForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        tradePrice: product.tradePrice ? product.tradePrice.toString() : '',
        retailPrice: product.retailPrice ? product.retailPrice.toString() : '',
        description: product.description || ''
      })
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
    if (!formData.tradePrice.trim()) newErrors.tradePrice = 'Trade price is required'
    else if (isNaN(parseFloat(formData.tradePrice)) || parseFloat(formData.tradePrice) <= 0) {
      newErrors.tradePrice = 'Please enter a valid price'
    }
    if (!formData.retailPrice.trim()) newErrors.retailPrice = 'Retail price is required'
    else if (isNaN(parseFloat(formData.retailPrice)) || parseFloat(formData.retailPrice) <= 0) {
      newErrors.retailPrice = 'Please enter a valid price'
    }

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
        tradePrice: parseFloat(formData.tradePrice),
        retailPrice: parseFloat(formData.retailPrice),
        description: formData.description?.trim(),
        dateAdded: isEditing ? product.dateAdded : new Date().toISOString()
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

        {/* Pricing Information */}
        <div>
          <h3 className="flex items-center text-lg font-medium text-gray-900 mb-4">
            <CurrencyDollarIcon className="w-5 h-5 mr-2 text-apple-blue" />
            Pricing Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trade Price (£) *
              </label>
              <input
                type="number"
                value={formData.tradePrice}
                onChange={handleInputChange('tradePrice')}
                className={`form-input w-full ${errors.tradePrice ? 'border-red-300' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.tradePrice && (
                <p className="mt-1 text-sm text-red-600">{errors.tradePrice}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retail Price (£) *
              </label>
              <input
                type="number"
                value={formData.retailPrice}
                onChange={handleInputChange('retailPrice')}
                className={`form-input w-full ${errors.retailPrice ? 'border-red-300' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.retailPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.retailPrice}</p>
              )}
            </div>
          </div>
          
          {formData.tradePrice && formData.retailPrice && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                Margin: £{(parseFloat(formData.retailPrice) - parseFloat(formData.tradePrice)).toFixed(2)} 
                ({(((parseFloat(formData.retailPrice) - parseFloat(formData.tradePrice)) / parseFloat(formData.retailPrice)) * 100).toFixed(1)}%)
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