'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  CubeIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import useAppStore from '@/store/useAppStore'
import { formatCurrency, formatDate } from '@/utils/format'
import clsx from 'clsx'

const conditionColors = {
  'New': 'bg-green-100 text-green-800',
  'Excellent': 'bg-blue-100 text-blue-800',
  'Very Good': 'bg-indigo-100 text-indigo-800',
  'Good': 'bg-yellow-100 text-yellow-800',
  'Fair': 'bg-orange-100 text-orange-800'
}

export default function StockPage() {
  const { watchProducts, openModal } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = watchProducts.filter(product =>
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.material.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stock Management</h2>
          <p className="text-gray-600">Manage your luxury watch inventory</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal('stock')}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Product</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>
        
        <select className="form-input w-full sm:w-48">
          <option value="">All Brands</option>
          <option value="rolex">Rolex</option>
          <option value="patek">Patek Philippe</option>
          <option value="omega">Omega</option>
        </select>
        
        <select className="form-input w-full sm:w-48">
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="excellent">Excellent</option>
          <option value="very-good">Very Good</option>
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <CubeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms or filters' 
              : 'Start building your inventory by adding your first luxury watch'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={() => openModal('stock')}
              className="btn btn-primary"
            >
              Add Your First Product
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => openModal('product', product)}
            >
              {/* Product Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <ClockIcon className="w-16 h-16 text-gray-400" />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {product.brand} {product.model}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                      {product.reference}
                    </p>
                  </div>
                  
                  <span className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    conditionColors[product.condition as keyof typeof conditionColors]
                  )}>
                    {product.condition}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <TagIcon className="w-4 h-4 mr-2 text-gray-400" />
                    {product.material} • {product.dialColor}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                    {product.yearManufactured} • {product.set}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(product.tradePrice)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Trade Price
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">
                      {formatCurrency(product.retailPrice)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Retail Price
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats */}
      {watchProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-gray-50 rounded-xl p-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{watchProducts.length}</div>
              <div className="text-sm text-gray-500">Total Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(watchProducts.reduce((sum, p) => sum + p.tradePrice, 0))}
              </div>
              <div className="text-sm text-gray-500">Total Value</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {new Set(watchProducts.map(p => p.brand)).size}
              </div>
              <div className="text-sm text-gray-500">Brands</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {filteredProducts.length}
              </div>
              <div className="text-sm text-gray-500">Showing</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}