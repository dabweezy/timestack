'use client'

import { motion } from 'framer-motion'
import { BellIcon, Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import useAppStore from '@/store/useAppStore'
import clsx from 'clsx'

const pageNames = {
  dashboard: 'Dashboard',
  customers: 'Customer HQ', 
  stock: 'Stock Management',
  sales: 'Sales Analytics',
  orders: 'Order Management',
  profile: 'Profile Settings'
}

interface HeaderProps {
  onMobileMenuToggle?: () => void
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const { currentPage, user } = useAppStore()
  
  const currentPageName = pageNames[currentPage] || 'Timestack'

  return (
    <header className="bg-white border-b border-gray-200 px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* TIMESTACK Logo with Light Trace */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative inline-block"
          >
            {/* Light Trace Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 opacity-75 blur-sm animate-pulse"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 opacity-50 animate-ping"></div>
            
            {/* Logo Card */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl px-6 py-3 shadow-lg">
              <div className="flex items-center space-x-3">
                {/* Logo Icon - 4 circles */}
                <div className="flex items-center space-x-1">
                  {/* Three solid circles in triangle formation */}
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full -ml-1.5 -mt-1"></div>
                  {/* Hollow circle */}
                  <div className="w-3 h-3 border-2 border-white rounded-full -ml-1.5 -mt-1"></div>
                </div>
                
                {/* TIMESTACK Text */}
                <span className="text-white font-bold text-xl tracking-wide">
                  TIMESTACK
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200 relative"
          >
            <BellIcon className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-apple-red rounded-full"></span>
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <Cog6ToothIcon className="w-6 h-6" />
          </motion.button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-500">{user.role}</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-apple-blue to-apple-purple text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <UserCircleIcon className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  )
}

function getPageSubtitle(page: string): string {
  const subtitles = {
    dashboard: 'Overview of your luxury watch inventory',
    customers: 'Manage your customer relationships',
    stock: 'Track and manage your watch inventory',
    sales: 'Analyze your sales performance and trends',
    orders: 'Process and track customer orders',
    profile: 'Manage your account settings'
  }
  return subtitles[page as keyof typeof subtitles] || 'Welcome to Timestack'
}