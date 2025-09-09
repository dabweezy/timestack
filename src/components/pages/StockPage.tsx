'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  CubeIcon,
  ClockIcon,
  TagIcon,
  Squares2X2Icon,
  TableCellsIcon
} from '@heroicons/react/24/outline'
import useAppStore from '@/store/useAppStore'
import { formatCurrency, formatDate } from '@/utils/format'
import clsx from 'clsx'

const statusColors = {
  'available': 'bg-green-100 text-green-800',
  'consignment': 'bg-blue-100 text-blue-800',
  'sold': 'bg-red-100 text-red-800',
  'reserved': 'bg-yellow-100 text-yellow-800'
}

export default function StockPage() {
  const { watchProducts, openModal } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'stock' | 'consignment' | 'sold'>('all')

  const filteredProducts = watchProducts.filter(product => {
    const matchesSearch = 
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.material.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = (() => {
      switch (statusFilter) {
        case 'available':
          return product.status === 'available'
        case 'stock':
          return product.status === 'available'
        case 'consignment':
          return product.status === 'consignment'
        case 'sold':
          return product.status === 'sold'
        case 'all':
        default:
          return true
      }
    })()
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Asset Value & Product Breakdown */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-start gap-24 mr-8">
          {/* Total Asset Value Section */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full flex items-center justify-center border-2 border-purple-400">
              <span className="text-blue-800 text-lg font-bold">£</span>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                TOTAL ASSET VALUE
              </div>
              <div className="text-4xl text-gray-900 font-mono">
                {formatCurrency(watchProducts.reduce((sum, p) => sum + p.retailPrice, 0))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-16 bg-gray-300"></div>

          {/* Products Breakdown Section */}
          <div className="flex-1 lg:max-w-md">
            {/* Product Count */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl font-bold text-gray-900">{watchProducts.length}</span>
              <span className="text-gray-600 font-medium">products</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div className="flex h-full">
                <div 
                  className="bg-teal-400 h-full" 
                  style={{ width: `${(watchProducts.filter(p => p.status === 'available').length / watchProducts.length) * 100}%` }}
                ></div>
                <div 
                  className="bg-orange-400 h-full" 
                  style={{ width: `${(watchProducts.filter(p => p.status === 'consignment').length / watchProducts.length) * 100}%` }}
                ></div>
                <div 
                  className="bg-red-400 h-full" 
                  style={{ width: `${(watchProducts.filter(p => p.status === 'sold').length / watchProducts.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Stock: {watchProducts.filter(p => p.status === 'available').length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Consignment: {watchProducts.filter(p => p.status === 'consignment').length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Sold: {watchProducts.filter(p => p.status === 'sold').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter and Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Status Filter Radio Buttons */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Status</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { value: 'all', label: 'All Products', count: watchProducts.length },
                { value: 'available', label: 'Available', count: watchProducts.filter(p => p.status === 'available').length },
                { value: 'stock', label: 'Stock', count: watchProducts.filter(p => p.status === 'available').length },
                { value: 'consignment', label: 'Consignment', count: watchProducts.filter(p => p.status === 'consignment').length },
                { value: 'sold', label: 'Sold', count: watchProducts.filter(p => p.status === 'sold').length }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="statusFilter"
                    value={option.value}
                    checked={statusFilter === option.value}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="form-radio text-apple-blue"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {option.label} ({option.count})
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {/* View Toggle and Add Product */}
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={clsx(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  viewMode === 'card'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Squares2X2Icon className="w-4 h-4" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={clsx(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <TableCellsIcon className="w-4 h-4" />
                <span>Table</span>
              </button>
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
        </div>
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

      {/* Products Display */}
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
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => openModal('productDetails', product)}
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
                  
                  <div className="flex flex-col space-y-1">
                    <span className={clsx(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      statusColors[product.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                    )}>
                      {product.status === 'available' ? 'Stock' : 
                       product.status === 'consignment' ? 'Consignment' : 
                       product.status === 'sold' ? 'SOLD' :
                       product.status === 'reserved' ? 'Reserved' : 'Stock'}
                    </span>
                  </div>
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
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trade Price
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retail Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    onClick={() => openModal('productDetails', product)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-4">
                          <ClockIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.brand} {product.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.dialColor}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        {product.reference}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={clsx(
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          statusColors[product.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                        )}>
                          {product.status === 'available' ? 'Stock' : 
                           product.status === 'consignment' ? 'Consignment' : 
                           product.status === 'sold' ? 'SOLD' :
                           product.status === 'reserved' ? 'Reserved' : 'Stock'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.material}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.yearManufactured}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {formatCurrency(product.tradePrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-700">
                      {formatCurrency(product.retailPrice)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
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