'use client'

import { motion } from 'framer-motion'
import { BellIcon, Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import clsx from 'clsx'

const pageNames = {
  dashboard: 'Dashboard',
  customers: 'Customer HQ', 
  stock: 'Stock Management',
  sales: 'Sales Management',
  orders: 'Order Management',
  profile: 'Profile Settings'
}

interface HeaderProps {
  onMobileMenuToggle?: () => void
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const { currentPage, user, setCurrentPage } = useSupabaseStore()
  
  const currentPageName = pageNames[currentPage] || 'Timestack'

  return (
    <header className="bg-white border-b border-gray-200 px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div className="flex-1">
          <motion.h1 
            key={currentPage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-sf-pro font-bold text-timestack-dark"
          >
            {currentPageName}
          </motion.h1>
          <motion.p 
            key={`${currentPage}-subtitle`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-sm text-timestack-gray mt-1"
          >
            {getPageSubtitle(currentPage)}
          </motion.p>
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
              onClick={() => setCurrentPage('profile')}
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
    sales: 'Process sales and manage transactions',
    orders: 'Process and track customer orders',
    profile: 'Manage your account settings'
  }
  return subtitles[page as keyof typeof subtitles] || 'Welcome to Timestack'
}