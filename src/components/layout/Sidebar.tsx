'use client'

import { useState } from 'react'
import BorderBeam from '@/components/BorderBeam'
import { 
  HomeIcon, 
  UsersIcon, 
  CubeIcon, 
  ChartBarIcon, 
  ShoppingCartIcon,
  ChevronLeftIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import type { NavigationPage } from '@/types'
import { supabase } from '@/lib/supabase'
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
  const { currentPage, sidebarCollapsed, setCurrentPage, toggleSidebar } = useSupabaseStore()
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
      <div className="p-4 border-b border-blue-500/30 flex items-center justify-center -ml-1">
        {/* Logo with BorderBeam */}
        <div className="relative rounded-lg p-2 bg-blue-600 overflow-hidden flex items-center justify-center">
          <img
            src="https://i.ibb.co/C3Lttm0S/logv2.png"
            alt="Timestack Logo"
            className="w-auto h-auto max-w-[180px] max-h-[40px] object-contain block relative z-10"
          />
          <BorderBeam
            size={250}
            duration={8}
            delay={6}
            borderWidth={2}
            colorFrom="#ffffff"
            colorTo="#f8fafc"
          />
        </div>
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

        {/* Admin User Section */}
        <div className="mt-auto p-4 border-t border-blue-500/20 space-y-2">
          <button
            onClick={() => setCurrentPage('profile')}
            className={clsx(
              'w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-blue-500/10 group',
              currentPage === 'profile' ? 'bg-blue-500/20' : ''
            )}
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-blue-100">Administrator</p>
              </div>
            )}
          </button>
          
          <button
            onClick={async () => {
              const { error } = await supabase.auth.signOut()
              if (error) console.error('Error signing out:', error)
            }}
            className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-red-500/10 group"
          >
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-red-300">Sign Out</p>
                <p className="text-xs text-red-200">Logout</p>
              </div>
            )}
          </button>
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