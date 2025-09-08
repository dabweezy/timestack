'use client'

import useAppStore from '@/store/useAppStore'
import CustomerModal from './CustomerModal'
import StockModal from './StockModal'

export default function ModalManager() {
  const { modals } = useAppStore()

  if (!modals.isOpen) return null

  return (
    <>
      <CustomerModal />
      <StockModal />
      {/* Additional modals can be added here */}
    </>
  )
}