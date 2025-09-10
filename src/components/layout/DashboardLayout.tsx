'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import Sidebar from './Sidebar'
import Header from './Header'
import ModalManager from '../modals/ModalManager'
import BorderBeam from '@/components/BorderBeam'
import { useSupabaseStore } from '@/store/useSupabaseStore'
import clsx from 'clsx'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { sidebarCollapsed } = useSupabaseStore()

  return (
    <div className="h-screen flex bg-blue-600 p-1.5">
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
              className="fixed inset-0 bg-blue-600/80 backdrop-blur-sm z-40 lg:hidden"
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
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-center p-4 bg-blue-600 backdrop-blur-xl border-b border-blue-500/30 relative -ml-1">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="absolute left-4 p-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 bg-gradient-to-br from-apple-blue to-apple-purple rounded-lg flex items-center justify-center overflow-hidden">
              <span className="text-white text-sm font-bold relative z-10">T</span>
              <BorderBeam
                size={50}
                duration={5}
                delay={3}
                borderWidth={1.5}
                colorFrom="#ffffff"
                colorTo="#f8fafc"
              />
            </div>
            <div className="text-white font-sf-pro font-semibold">Timestack</div>
          </div>
        </div>

        {/* Main Content Container */}
        <motion.div 
          className="flex-1 flex flex-col min-h-0 transition-all duration-300 ease-in-out"
        >
          <div className="flex-1 bg-white rounded-4xl shadow-timestack overflow-hidden relative flex flex-col min-h-0">
            {/* Header */}
            <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
            
            {/* Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 min-h-0">
              <motion.div
                key={useSupabaseStore.getState().currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {children}
              </motion.div>
            </main>
          </div>
        </motion.div>
      </div>
      
      {/* Modal Manager */}
      <ModalManager />

      {/* Sidebar Toggle Button - Positioned outside all containers */}
      <div className="fixed left-[260px] top-1/2 -translate-y-1/2 z-[9999] transition-all duration-300" 
           style={{left: sidebarCollapsed ? '57px' : '247px'}}>
        <div className="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
          <button
            onClick={() => useSupabaseStore.getState().toggleSidebar()}
            className="w-8 h-8 bg-blue-600 rounded-full shadow-lg border-2 border-white flex items-center justify-center hover:shadow-xl hover:bg-blue-700 transition-all duration-300 group"
          >
            <ChevronLeftIcon 
              className={clsx(
                'w-4 h-4 text-white transition-transform duration-300',
                sidebarCollapsed ? 'rotate-180' : 'rotate-0'
              )} 
            />
            <div className="absolute inset-0 bg-blue-800 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  )
}