'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  UsersIcon, 
  CubeIcon, 
  ChartBarIcon, 
  ShoppingCartIcon,
  ChevronLeftIcon,
  Bars3Icon,
  WifiIcon
} from '@heroicons/react/24/outline'
import useAppStore from '@/store/useAppStore'
import type { NavigationPage } from '@/types'
import clsx from 'clsx'

const navigation = [
  { name: 'Dashboard', page: 'dashboard' as NavigationPage, icon: HomeIcon },
  { name: 'Customer HQ', page: 'customers' as NavigationPage, icon: UsersIcon },
  { name: 'Stock', page: 'stock' as NavigationPage, icon: CubeIcon },
  { name: 'Sales', page: 'sales' as NavigationPage, icon: ChartBarIcon },
  { name: 'Orders', page: 'orders' as NavigationPage, icon: ShoppingCartIcon },
]

interface SidebarProps {
  isMobile?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ isMobile = false, onMobileClose }: SidebarProps) {
  const { currentPage, sidebarCollapsed, setCurrentPage, toggleSidebar, setSidebarCollapsed } = useAppStore()

  const handleNavClick = (page: NavigationPage) => {
    setCurrentPage(page)
    if (isMobile && onMobileClose) {
      onMobileClose()
    }
  }

  const handleToggleSidebar = () => {
    toggleSidebar()
  }

  return (
    <motion.div
      initial={false}
      animate={{
        width: sidebarCollapsed ? 70 : 260,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
      }}
      className={clsx(
        'flex flex-col h-full bg-blue-600',
        'border-r border-blue-500/30 backdrop-blur-xl',
        isMobile && 'fixed inset-y-0 left-0 z-50 w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-500/30">
        <motion.div
          animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <WifiIcon className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="text-white">
              <div className="font-sf-pro font-semibold text-lg">Timestack</div>
              <div className="text-xs text-blue-200">Luxury Inventory</div>
            </div>
          )}
        </motion.div>
        
        {!isMobile && (
          <button
            onClick={handleToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-white/10 text-blue-200 hover:text-white transition-colors"
          >
            <motion.div
              animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </motion.div>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = currentPage === item.page
          return (
            <motion.button
              key={item.name}
              onClick={() => handleNavClick(item.page)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                'w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 relative group',
                isActive
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-white/10 rounded-xl border border-white/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <item.icon className="w-5 h-5 flex-shrink-0 z-10" />
              
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 z-10 font-guaruja"
                >
                  {item.name}
                </motion.span>
              )}

              {sidebarCollapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-blue-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 shadow-lg border border-blue-600">
                  {item.name}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-blue-800 border-l border-t border-blue-600 rotate-45" />
                </div>
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-blue-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-blue-200"
            >
              System Online
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}