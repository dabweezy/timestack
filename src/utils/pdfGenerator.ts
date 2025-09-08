import jsPDF from 'jspdf'
import type { Order, PdfReceiptData } from '@/types'
import { formatCurrency, formatDate } from './format'

const companyInfo = {
  name: 'Chiefer Jewellery',
  tagline: 'Luxury Timepiece Specialists',
  address: [
    '123 Luxury Lane',
    'Mayfair, London',
    'W1K 5AB, United Kingdom'
  ],
  email: 'info@chieferjewellery.com',
  phone: '+44 (0)20 7123 4567',
  registration: 'Company Reg: 12345678'
}

export const generateOrderReceipt = (order: Order): void => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  // Colors
  const primaryColor = '#007AFF'
  const darkColor = '#1D1D1F'
  const grayColor = '#8E8E93'
  
  let yPosition = 20

  // Company Header
  pdf.setFillColor(0, 122, 255) // Apple blue
  pdf.rect(0, 0, pageWidth, 60, 'F')
  
  // Company Logo Area (placeholder)
  pdf.setFillColor(255, 255, 255)
  pdf.rect(15, 15, 30, 30, 'F')
  pdf.setFontSize(16)
  pdf.setTextColor(0, 122, 255)
  pdf.text('CJ', 30, 35, { align: 'center' })
  
  // Company Name
  pdf.setFontSize(24)
  pdf.setTextColor(255, 255, 255)
  pdf.text(companyInfo.name, 55, 30)
  pdf.setFontSize(12)
  pdf.text(companyInfo.tagline, 55, 40)
  
  yPosition = 80

  // Receipt Title
  pdf.setFontSize(20)
  pdf.setTextColor(darkColor)
  pdf.text(`${order.orderType === 'sale' ? 'SALES' : 'PURCHASE'} RECEIPT`, 15, yPosition)
  
  yPosition += 20

  // Order Details Box
  pdf.setDrawColor(230, 230, 230)
  pdf.setFillColor(248, 248, 248)
  pdf.rect(15, yPosition, pageWidth - 30, 40, 'FD')
  
  pdf.setFontSize(10)
  pdf.setTextColor(grayColor)
  pdf.text('Order Number:', 20, yPosition + 10)
  pdf.text('Date:', 20, yPosition + 20)
  pdf.text('Time:', 20, yPosition + 30)
  pdf.text('Status:', 120, yPosition + 10)
  pdf.text('Type:', 120, yPosition + 20)
  
  pdf.setTextColor(darkColor)
  pdf.setFontSize(11)
  pdf.text(order.orderNumber, 65, yPosition + 10)
  pdf.text(formatDate(order.date), 65, yPosition + 20)
  pdf.text(order.time, 65, yPosition + 30)
  pdf.text(order.status, 145, yPosition + 10)
  pdf.text(order.orderType.toUpperCase(), 145, yPosition + 20)
  
  yPosition += 60

  // Customer Information
  pdf.setFontSize(14)
  pdf.setTextColor(darkColor)
  pdf.text('CUSTOMER INFORMATION', 15, yPosition)
  yPosition += 15
  
  pdf.setDrawColor(230, 230, 230)
  pdf.line(15, yPosition, pageWidth - 15, yPosition)
  yPosition += 10
  
  pdf.setFontSize(10)
  pdf.setTextColor(grayColor)
  pdf.text('Name:', 15, yPosition)
  pdf.text('Email:', 15, yPosition + 10)
  pdf.text('Phone:', 15, yPosition + 20)
  pdf.text('Address:', 15, yPosition + 30)
  
  pdf.setTextColor(darkColor)
  pdf.setFontSize(11)
  pdf.text(order.customer.name, 50, yPosition)
  pdf.text(order.customer.email, 50, yPosition + 10)
  pdf.text(order.customer.phone, 50, yPosition + 20)
  
  // Split address into multiple lines if needed
  const addressLines = pdf.splitTextToSize(order.customer.address, pageWidth - 70)
  pdf.text(addressLines, 50, yPosition + 30)
  
  yPosition += 60

  // Watch Information
  pdf.setFontSize(14)
  pdf.setTextColor(darkColor)
  pdf.text('TIMEPIECE DETAILS', 15, yPosition)
  yPosition += 15
  
  pdf.setDrawColor(230, 230, 230)
  pdf.line(15, yPosition, pageWidth - 15, yPosition)
  yPosition += 10
  
  // Watch details in a structured format
  const watchDetails = [
    ['Brand:', order.watch.brand],
    ['Model:', order.watch.model],
    ['Reference:', order.watch.reference],
    ['Serial:', order.watch.serial || 'N/A'],
    ['Material:', order.watch.material],
    ['Dial Color:', order.watch.dialColor],
    ['Condition:', order.watch.condition],
    ['Year:', order.watch.yearManufactured.toString()]
  ]
  
  watchDetails.forEach((detail, index) => {
    const row = Math.floor(index / 2)
    const col = index % 2
    const x = col === 0 ? 15 : 110
    const y = yPosition + (row * 10)
    
    pdf.setFontSize(10)
    pdf.setTextColor(grayColor)
    pdf.text(detail[0], x, y)
    pdf.setTextColor(darkColor)
    pdf.setFontSize(11)
    pdf.text(detail[1], x + 30, y)
  })
  
  yPosition += 50

  // Pricing Information
  pdf.setFontSize(14)
  pdf.setTextColor(darkColor)
  pdf.text('PRICING DETAILS', 15, yPosition)
  yPosition += 15
  
  pdf.setDrawColor(230, 230, 230)
  pdf.line(15, yPosition, pageWidth - 15, yPosition)
  yPosition += 15
  
  // Pricing box
  pdf.setDrawColor(0, 122, 255)
  pdf.setFillColor(247, 251, 255)
  pdf.rect(15, yPosition, pageWidth - 30, 30, 'FD')
  
  pdf.setFontSize(12)
  pdf.setTextColor(grayColor)
  
  if (order.orderType === 'sale') {
    if (order.pricing.costPrice) {
      pdf.text('Cost Price:', 20, yPosition + 10)
      pdf.text(order.pricing.costPrice, pageWidth - 50, yPosition + 10, { align: 'right' })
    }
    pdf.text('Sale Price:', 20, yPosition + 20)
    pdf.setFontSize(16)
    pdf.setTextColor(primaryColor)
    pdf.text(order.pricing.salePrice || '£0.00', pageWidth - 50, yPosition + 20, { align: 'right' })
  } else {
    pdf.text('Purchase Price:', 20, yPosition + 15)
    pdf.setFontSize(16)
    pdf.setTextColor(primaryColor)
    pdf.text(order.pricing.costPrice, pageWidth - 50, yPosition + 15, { align: 'right' })
  }
  
  yPosition += 50

  // Payment Information
  if (order.payment) {
    pdf.setFontSize(14)
    pdf.setTextColor(darkColor)
    pdf.text('PAYMENT INFORMATION', 15, yPosition)
    yPosition += 15
    
    pdf.setDrawColor(230, 230, 230)
    pdf.line(15, yPosition, pageWidth - 15, yPosition)
    yPosition += 10
    
    pdf.setFontSize(10)
    pdf.setTextColor(grayColor)
    pdf.text('Method:', 15, yPosition)
    pdf.text('Status:', 15, yPosition + 10)
    pdf.text('Reference:', 15, yPosition + 20)
    
    pdf.setTextColor(darkColor)
    pdf.setFontSize(11)
    pdf.text(order.payment.method, 60, yPosition)
    pdf.text(order.payment.status, 60, yPosition + 10)
    pdf.text(order.payment.reference, 60, yPosition + 20)
    
    yPosition += 40
  }

  // Footer
  const footerY = pageHeight - 60
  pdf.setDrawColor(230, 230, 230)
  pdf.line(15, footerY, pageWidth - 15, footerY)
  
  pdf.setFontSize(8)
  pdf.setTextColor(grayColor)
  pdf.text(companyInfo.name, 15, footerY + 10)
  pdf.text(companyInfo.address.join(', '), 15, footerY + 18)
  pdf.text(`Email: ${companyInfo.email} | Phone: ${companyInfo.phone}`, 15, footerY + 26)
  pdf.text(companyInfo.registration, 15, footerY + 34)
  
  pdf.text('Thank you for your business!', pageWidth - 15, footerY + 20, { align: 'right' })
  pdf.text(`Generated on ${formatDate(new Date().toISOString(), 'long')}`, pageWidth - 15, footerY + 28, { align: 'right' })

  // Save the PDF
  const filename = `${order.orderType}_receipt_${order.orderNumber}.pdf`
  pdf.save(filename)
}

export const generateCustomerList = (customers: any[]): void => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  
  let yPosition = 20

  // Header
  pdf.setFillColor(0, 122, 255)
  pdf.rect(0, 0, pageWidth, 40, 'F')
  
  pdf.setFontSize(18)
  pdf.setTextColor(255, 255, 255)
  pdf.text('CUSTOMER LIST', 15, 25)
  
  yPosition = 60

  // Table headers
  pdf.setFontSize(10)
  pdf.setTextColor(60, 60, 60)
  pdf.text('NAME', 15, yPosition)
  pdf.text('EMAIL', 80, yPosition)
  pdf.text('PHONE', 140, yPosition)
  
  pdf.setDrawColor(200, 200, 200)
  pdf.line(15, yPosition + 3, pageWidth - 15, yPosition + 3)
  
  yPosition += 15

  // Customer data
  customers.forEach((customer, index) => {
    if (yPosition > 250) {
      pdf.addPage()
      yPosition = 20
    }
    
    pdf.setFontSize(9)
    pdf.setTextColor(80, 80, 80)
    pdf.text(`${customer.firstName} ${customer.lastName}`, 15, yPosition)
    pdf.text(customer.email, 80, yPosition)
    pdf.text(customer.mobile, 140, yPosition)
    
    yPosition += 12
  })

  pdf.save('customer_list.pdf')
}

export const generateStockList = (products: any[]): void => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  
  let yPosition = 20

  // Header
  pdf.setFillColor(0, 122, 255)
  pdf.rect(0, 0, pageWidth, 40, 'F')
  
  pdf.setFontSize(18)
  pdf.setTextColor(255, 255, 255)
  pdf.text('STOCK LIST', 15, 25)
  
  yPosition = 60

  // Table headers
  pdf.setFontSize(10)
  pdf.setTextColor(60, 60, 60)
  pdf.text('WATCH', 15, yPosition)
  pdf.text('REF', 80, yPosition)
  pdf.text('CONDITION', 120, yPosition)
  pdf.text('PRICE', 160, yPosition)
  
  pdf.setDrawColor(200, 200, 200)
  pdf.line(15, yPosition + 3, pageWidth - 15, yPosition + 3)
  
  yPosition += 15

  // Product data
  products.forEach((product, index) => {
    if (yPosition > 250) {
      pdf.addPage()
      yPosition = 20
    }
    
    pdf.setFontSize(9)
    pdf.setTextColor(80, 80, 80)
    pdf.text(`${product.brand} ${product.model}`, 15, yPosition)
    pdf.text(product.reference, 80, yPosition)
    pdf.text(product.condition, 120, yPosition)
    pdf.text(formatCurrency(product.retailPrice), 160, yPosition)
    
    yPosition += 12
  })

  pdf.save('stock_list.pdf')
}