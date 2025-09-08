'use client'

import { motion } from 'framer-motion'
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  CubeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import useAppStore from '@/store/useAppStore'
import { formatCurrency, formatNumber } from '@/utils/format'
import clsx from 'clsx'

const statsConfig = [
  {
    id: 'revenue',
    name: 'Total Revenue',
    icon: CurrencyDollarIcon,
    color: 'from-green-500 to-emerald-600',
    getValue: (orders: any[]) => {
      const total = orders
        .filter(order => order.status === 'Completed')
        .reduce((sum, order) => {
          const price = parseFloat(order.pricing.salePrice?.replace(/[£,]/g, '') || order.pricing.costPrice.replace(/[£,]/g, ''))
          return sum + price
        }, 0)
      return formatCurrency(total)
    }
  },
  {
    id: 'orders',
    name: 'Total Orders',
    icon: ShoppingCartIcon,
    color: 'from-blue-500 to-blue-600',
    getValue: (orders: any[]) => formatNumber(orders.length)
  },
  {
    id: 'customers',
    name: 'Active Customers',
    icon: UsersIcon,
    color: 'from-purple-500 to-purple-600',
    getValue: (orders: any[], customers: any[]) => formatNumber(customers.length)
  },
  {
    id: 'stock',
    name: 'Stock Items',
    icon: CubeIcon,
    color: 'from-orange-500 to-orange-600',
    getValue: (orders: any[], customers: any[], products: any[]) => formatNumber(products.length)
  }
]

export default function DashboardPage() {
  const { orders, customers, watchProducts, setCurrentPage } = useAppStore()
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const recentOrders = orders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const topProducts = watchProducts
    .slice(0, 3)
    .sort((a, b) => b.tradePrice - a.tradePrice)

  return (
    <div className="space-y-8">
      {/* Greeting Message */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl px-6 py-4"
      >
        <div className="flex items-center space-x-3">
          <div className="text-2xl">👋</div>
          <div>
            <h2 className="text-xl font-semibold text-blue-900">{getGreeting()}!</h2>
            <p className="text-blue-700 text-sm">Welcome back to your Timestack dashboard</p>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.getValue(orders, customers, watchProducts)}
                  </p>
                </div>
                <div className={clsx(
                  'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r',
                  stat.color
                )}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+12.5%</span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <button
                  onClick={() => setCurrentPage('orders')}
                  className="text-apple-blue hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCartIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                  <button
                    onClick={() => setCurrentPage('sales')}
                    className="mt-4 btn btn-primary"
                  >
                    Create your first sale
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <motion.div
                      key={order.orderNumber}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={clsx(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          order.orderType === 'purchase' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-blue-100 text-blue-600'
                        )}>
                          {order.orderType === 'purchase' ? (
                            <ArrowDownIcon className="w-5 h-5" />
                          ) : (
                            <ArrowUpIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {order.pricing.salePrice || order.pricing.costPrice}
                        </p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Top Products */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                <button
                  onClick={() => setCurrentPage('stock')}
                  className="text-apple-blue hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {topProducts.length === 0 ? (
                <div className="text-center py-12">
                  <CubeIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No products yet</p>
                  <button
                    onClick={() => setCurrentPage('stock')}
                    className="mt-4 btn btn-primary"
                  >
                    Add your first product
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                      className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-apple-blue to-apple-purple rounded-xl flex items-center justify-center">
                        <ClockIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.brand} {product.model}</p>
                        <p className="text-sm text-gray-500">{product.reference}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(product.tradePrice)}
                        </p>
                        <p className="text-sm text-gray-500">{product.condition}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        className="bg-gradient-to-r from-apple-blue to-apple-purple rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
            <p className="text-blue-100">Add your first luxury watch to the inventory</p>
          </div>
          <button
            onClick={() => setCurrentPage('stock')}
            className="bg-white text-apple-blue px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
          >
            <CubeIcon className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}