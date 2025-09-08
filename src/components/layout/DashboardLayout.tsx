'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Sidebar from './Sidebar'
import Header from './Header'
import ModalManager from '../modals/ModalManager'
import useAppStore from '@/store/useAppStore'
import clsx from 'clsx'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { sidebarCollapsed, initializeSampleData } = useAppStore()

  // Initialize sample data on mount
  useEffect(() => {
    initializeSampleData()
  }, [initializeSampleData])

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden"
            >
              <Sidebar isMobile onMobileClose={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-b border-blue-200/50">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-apple-blue to-apple-purple rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <div className="text-blue-900 font-sf-pro font-semibold">Timestack</div>
          </div>
          
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Main Content Container */}
        <motion.div 
          className={clsx(
            'flex-1 flex flex-col transition-all duration-300 ease-in-out',
            'lg:ml-1.5 lg:mr-1.5 lg:mb-1.5'
          )}
        >
          <div className="flex-1 bg-white lg:rounded-4xl shadow-timestack overflow-hidden relative">
            {/* Blue accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-apple-blue via-apple-lightblue to-apple-green" />
            
            {/* Header */}
            <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
            
            {/* Content */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              <motion.div
                key={useAppStore.getState().currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                {children}
              </motion.div>
            </main>
          </div>
        </motion.div>
      </div>
      
      {/* Modal Manager */}
      <ModalManager />
    </div>
  )
}