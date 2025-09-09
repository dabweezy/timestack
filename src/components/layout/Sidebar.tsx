'use client'

import { useState } from 'react'
import { 
  HomeIcon, 
  UsersIcon, 
  CubeIcon, 
  ChartBarIcon, 
  ShoppingCartIcon,
  ChevronLeftIcon,
  ClockIcon
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
  const { currentPage, sidebarCollapsed, setCurrentPage, toggleSidebar } = useAppStore()
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
    <div
      className={clsx(
        'flex flex-col h-full bg-blue-600 transition-all duration-300',
        'border-r border-blue-500/30 backdrop-blur-xl',
        isMobile && 'fixed inset-y-0 left-0 z-50 w-64',
        sidebarCollapsed ? 'w-[70px]' : 'w-[260px]'
      )}
    >
      {/* TIMESTACK Logo Header */}
      <div className="p-4 border-b border-blue-500/30 relative">
        <div className="relative">
          {/* Card Background with Glow Effect */}
          <div className="relative bg-card rounded-lg shadow-lg border border-white/20 backdrop-blur-sm overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-blue-500/60 to-purple-600/80" />
            
            {/* Animated Border Glow */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 opacity-50 blur-sm animate-pulse" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/30 via-purple-600/30 to-blue-500/30 animate-ping" />
            
            {/* Logo Content */}
            <div className="relative px-4 py-3 flex items-center space-x-3">
              {/* Logo Icon - Timestack Symbol */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Main Clock Icon */}
                  <ClockIcon className="w-8 h-8 text-white" />
                  {/* Stack Effect */}
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-white/30 rounded-full border border-white/50" />
                  <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-white/20 rounded-full" />
                </div>
              </div>
              
              {/* TIMESTACK Text */}
              <div 
                className={clsx(
                  'text-white transition-opacity duration-200',
                  sidebarCollapsed ? 'opacity-0' : 'opacity-100'
                )}
              >
                <div className="font-bold text-lg tracking-wide">TIMESTACK</div>
                <div className="text-xs text-blue-100 opacity-90">Luxury Watch Inventory</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Collapse Toggle Button */}
        {!isMobile && (
          <button
            onClick={handleToggleSidebar}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-blue-200 hover:text-white transition-colors z-10"
          >
            <ChevronLeftIcon 
              className={clsx(
                'w-4 h-4 transition-transform duration-300',
                sidebarCollapsed ? 'rotate-180' : 'rotate-0'
              )} 
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = currentPage === item.page
          return (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.page)}
              className={clsx(
                'w-full flex items-center px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 relative group',
                isActive
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              
              {!sidebarCollapsed && (
                <span className="ml-3 font-guaruja">
                  {item.name}
                </span>
              )}

              {sidebarCollapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-blue-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 shadow-lg border border-blue-600">
                  {item.name}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-blue-800 border-l border-t border-blue-600 rotate-45" />
                </div>
              )}
            </button>
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
            <div className="text-xs text-blue-200">
              System Online
            </div>
          )}
        </div>

        {/* Status Tooltip */}
        {showStatusTooltip && (
          <div
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
          </div>
        )}
      </div>
    </div>
  )
}