'use client'

import { useSupabaseStore } from '@/store/useSupabaseStore'
import CustomerModal from './CustomerModal'
import CustomerDetailsModal from './CustomerDetailsModal'
import StockModal from './StockModal'
import ProductDetailsModal from './ProductDetailsModal'
import SalesModal from './SalesModal'
import OrderDetailsModal from './OrderDetailsModal'

export default function ModalManager() {
  const { modals } = useSupabaseStore()

  if (!modals.type) return null

  return (
    <>
      {modals.type === 'customer' && <CustomerModal />}
      {modals.type === 'customerDetails' && <CustomerDetailsModal />}
      {modals.type === 'stock' && <StockModal />}
      {modals.type === 'productDetails' && <ProductDetailsModal />}
      {modals.type === 'sales' && <SalesModal />}
      {modals.type === 'order' && <OrderDetailsModal />}
      {/* Additional modals can be added here */}
    </>
  )
}