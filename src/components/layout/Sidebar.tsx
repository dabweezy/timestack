'use client'

import { Fragment, useState } from 'react'
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
  const [showStatusTooltip, setShowStatusTooltip] = useState(false)

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
      {/* TIMESTACK Logo Header */}
      <div className="p-4 border-b border-blue-500/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Light Trace Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 opacity-75 blur-sm animate-pulse"></div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 opacity-50 animate-ping"></div>
          
          {/* Logo Card */}
          <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl px-4 py-3 shadow-lg">
            <div className="flex items-center space-x-3">
              {/* Logo Icon - 4 circles */}
              <div className="flex items-center space-x-1">
                {/* Three solid circles in triangle formation */}
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-white rounded-full -ml-1 -mt-1"></div>
                {/* Hollow circle */}
                <div className="w-2.5 h-2.5 border-2 border-white rounded-full -ml-1 -mt-1"></div>
              </div>
              
              {/* TIMESTACK Text */}
              <motion.span 
                animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="text-white font-bold text-lg tracking-wide"
              >
                TIMESTACK
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
        
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
      <div className="p-4 border-t border-blue-500/30 relative">
        <div 
          className="flex items-center space-x-3 cursor-help"
          onMouseEnter={() => setShowStatusTooltip(true)}
          onMouseLeave={() => setShowStatusTooltip(false)}
        >
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

        {/* Status Tooltip */}
        {showStatusTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={clsx(
              'absolute bottom-full mb-2 p-3 bg-blue-800 rounded-lg shadow-lg border border-blue-600 z-50',
              sidebarCollapsed ? 'left-full ml-2' : 'left-0'
            )}
          >
            <div className="text-xs text-white space-y-2 whitespace-nowrap">
              <div className="font-medium text-blue-100 mb-2">System Status Colors:</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Online - All systems operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full" />
                <span>Under Maintenance - Limited functionality</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span>System Down - Service unavailable</span>
              </div>
            </div>
            {/* Tooltip arrow */}
            <div className={clsx(
              'absolute w-2 h-2 bg-blue-800 border-r border-b border-blue-600 rotate-45',
              sidebarCollapsed ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1' : 'bottom-0 left-4 translate-y-1'
            )} />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}