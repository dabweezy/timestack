import jsPDF from 'jspdf'
import type { Order, PdfReceiptData, WatchProduct, Customer } from '@/types'
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

export const generatePurchaseReceipt = (product: WatchProduct, customer: Customer): void => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  // Apple-style colors
  const primaryColor = '#007AFF'
  const darkColor = '#1D1D1F'
  const grayColor = '#8E8E93'
  const lightGrayColor = '#F2F2F7'
  const borderColor = '#E5E5EA'
  
  let yPosition = 20

  // Header with company info and receipt details
  pdf.setFillColor(primaryColor)
  pdf.rect(0, 0, pageWidth, 60, 'F')
  
  // Company name
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Timestack', 20, 25)
  
  // Tagline
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Luxury Timepiece Specialists', 20, 35)
  
  // Receipt info
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('PURCHASE RECEIPT', pageWidth - 20, 25, { align: 'right' })
  
  // Receipt number
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`#${product.id}`, pageWidth - 20, 35, { align: 'right' })
  
  // Date
  pdf.text(formatDate(product.dateAdded), pageWidth - 20, 45, { align: 'right' })
  
  yPosition = 80

  // Customer and company addresses
  pdf.setTextColor(darkColor)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Bill To:', 20, yPosition)
  
  // Customer address
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  const customerAddress = [
    `${customer.firstName} ${customer.lastName}`,
    customer.address1,
    customer.city,
    customer.country
  ].filter(Boolean)
  
  customerAddress.forEach((line, index) => {
    pdf.text(line, 20, yPosition + 10 + (index * 5))
  })
  
  // Contact info
  if (customer.email) {
    pdf.text(`Email: ${customer.email}`, 20, yPosition + 10 + (customerAddress.length * 5) + 5)
  }
  if (customer.mobile) {
    pdf.text(`Phone: ${customer.mobile}`, 20, yPosition + 10 + (customerAddress.length * 5) + 10)
  }
  
  // Company address (right side)
  pdf.setFont('helvetica', 'bold')
  pdf.text('From:', pageWidth - 20, yPosition, { align: 'right' })
  
  pdf.setFont('helvetica', 'normal')
  const companyAddress = [
    'Timestack',
    '10B Berkeley St',
    'Mayfair, London W1J 8DR',
    'United Kingdom'
  ]
  
  companyAddress.forEach((line, index) => {
    pdf.text(line, pageWidth - 20, yPosition + 10 + (index * 5), { align: 'right' })
  })
  
  yPosition += 80

  // Product details table
  pdf.setFillColor(lightGrayColor)
  pdf.rect(20, yPosition - 5, pageWidth - 40, 20, 'F')
  
  // Table headers
  pdf.setTextColor(darkColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Product Details', 25, yPosition + 5)
  pdf.text('SKU', 120, yPosition + 5)
  pdf.text('Qty', 160, yPosition + 5)
  pdf.text('Price', pageWidth - 25, yPosition + 5, { align: 'right' })
  
  yPosition += 25

  // Product row
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(darkColor)
  
  // Product description
  const productDescription = `${product.brand} ${product.model}`
  pdf.text(productDescription, 25, yPosition)
  
  // Reference/SKU
  pdf.text(product.reference, 120, yPosition)
  
  // Quantity
  pdf.text('1', 160, yPosition)
  
  // Price
  pdf.text(formatCurrency(product.costPrice), pageWidth - 25, yPosition, { align: 'right' })
  
  yPosition += 15

  // Additional product details
  if (product.material) {
    pdf.setFontSize(10)
    pdf.setTextColor(grayColor)
    pdf.text(`Material: ${product.material}`, 25, yPosition)
    yPosition += 5
  }
  
  if (product.dialColor) {
    pdf.text(`Dial: ${product.dialColor}`, 25, yPosition)
    yPosition += 5
  }
  
  if (product.yearManufactured) {
    pdf.text(`Year: ${product.yearManufactured}`, 25, yPosition)
    yPosition += 5
  }
  
  if (product.condition) {
    pdf.text(`Condition: ${product.condition}`, 25, yPosition)
    yPosition += 5
  }
  
  yPosition += 20

  // Totals section
  const subtotal = product.costPrice
  const shipping = 0
  const total = subtotal + shipping

  // Subtotal
  pdf.setFontSize(11)
  pdf.setTextColor(darkColor)
  pdf.text('Subtotal:', pageWidth - 80, yPosition, { align: 'right' })
  pdf.text(formatCurrency(subtotal), pageWidth - 25, yPosition, { align: 'right' })
  yPosition += 8

  // Shipping
  pdf.text('Shipping:', pageWidth - 80, yPosition, { align: 'right' })
  pdf.text('Free', pageWidth - 25, yPosition, { align: 'right' })
  yPosition += 8

  // Total line
  pdf.setLineWidth(0.5)
  pdf.setDrawColor(borderColor)
  pdf.line(20, yPosition, pageWidth - 20, yPosition)
  yPosition += 10

  // Total
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.text('Total:', pageWidth - 80, yPosition, { align: 'right' })
  pdf.text(formatCurrency(total), pageWidth - 25, yPosition, { align: 'right' })

  yPosition += 30

  // Payment terms
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(grayColor)
  pdf.text('Payment Terms: Net 30 days', 20, yPosition)
  pdf.text('Thank you for your business!', pageWidth - 20, yPosition, { align: 'right' })

  yPosition += 20

  // Footer
  pdf.setFontSize(9)
  pdf.setTextColor(grayColor)
  pdf.text('Timestack Ltd · 10B Berkeley St, Mayfair, London W1J 8DR', pageWidth / 2, pageHeight - 20, { align: 'center' })
  pdf.text('Company No. 15075111 · info@timestack.com', pageWidth / 2, pageHeight - 15, { align: 'center' })

  // Save the PDF
  pdf.save(`purchase_receipt_${product.reference}.pdf`)
}

export const generateSalesReceipt = (order: Order): void => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  // Apple-style colors
  const primaryColor = '#007AFF'
  const darkColor = '#1D1D1F'
  const grayColor = '#8E8E93'
  const lightGrayColor = '#F2F2F7'
  const borderColor = '#E5E5EA'
  
  let yPosition = 20

  // Header with company info and receipt details
  pdf.setFillColor(primaryColor)
  pdf.rect(0, 0, pageWidth, 60, 'F')
  
  // Company name
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Timestack', 20, 25)
  
  // Tagline
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Luxury Timepiece Specialists', 20, 35)
  
  // Receipt info
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('SALES RECEIPT', pageWidth - 20, 25, { align: 'right' })
  
  // Receipt number
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`#${order.orderNumber}`, pageWidth - 20, 35, { align: 'right' })
  
  // Date
  pdf.text(formatDate(order.timestamp), pageWidth - 20, 45, { align: 'right' })
  
  yPosition = 80

  // Customer and company addresses
  pdf.setTextColor(darkColor)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Bill To:', 20, yPosition)
  
  // Customer address
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  const customerAddress = [
    `${order.customer.firstName} ${order.customer.lastName}`,
    order.customer.address1,
    order.customer.city,
    order.customer.country
  ].filter(Boolean)
  
  customerAddress.forEach((line, index) => {
    pdf.text(line, 20, yPosition + 10 + (index * 5))
  })
  
  // Contact info
  if (order.customer.email) {
    pdf.text(`Email: ${order.customer.email}`, 20, yPosition + 10 + (customerAddress.length * 5) + 5)
  }
  if (order.customer.mobile) {
    pdf.text(`Phone: ${order.customer.mobile}`, 20, yPosition + 10 + (customerAddress.length * 5) + 10)
  }
  
  // Company address (right side)
  pdf.setFont('helvetica', 'bold')
  pdf.text('From:', pageWidth - 20, yPosition, { align: 'right' })
  
  pdf.setFont('helvetica', 'normal')
  const companyAddress = [
    'Timestack',
    '10B Berkeley St',
    'Mayfair, London W1J 8DR',
    'United Kingdom'
  ]
  
  companyAddress.forEach((line, index) => {
    pdf.text(line, pageWidth - 20, yPosition + 10 + (index * 5), { align: 'right' })
  })
  
  yPosition += 80

  // Product details table
  pdf.setFillColor(lightGrayColor)
  pdf.rect(20, yPosition - 5, pageWidth - 40, 20, 'F')
  
  // Table headers
  pdf.setTextColor(darkColor)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Product Details', 25, yPosition + 5)
  pdf.text('SKU', 120, yPosition + 5)
  pdf.text('Qty', 160, yPosition + 5)
  pdf.text('Price', pageWidth - 25, yPosition + 5, { align: 'right' })
  
  yPosition += 25

  // Product row
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(darkColor)
  
  // Product description
  const productDescription = `${order.watch.brand} ${order.watch.model}`
  pdf.text(productDescription, 25, yPosition)
  
  // Reference/SKU
  pdf.text(order.watch.reference, 120, yPosition)
  
  // Quantity
  pdf.text('1', 160, yPosition)
  
  // Price
  pdf.text(formatCurrency(order.salePrice), pageWidth - 25, yPosition, { align: 'right' })
  
  yPosition += 15

  // Additional product details
  if (order.watch.material) {
    pdf.setFontSize(10)
    pdf.setTextColor(grayColor)
    pdf.text(`Material: ${order.watch.material}`, 25, yPosition)
    yPosition += 5
  }
  
  if (order.watch.dialColor) {
    pdf.text(`Dial: ${order.watch.dialColor}`, 25, yPosition)
    yPosition += 5
  }
  
  if (order.watch.yearManufactured) {
    pdf.text(`Year: ${order.watch.yearManufactured}`, 25, yPosition)
    yPosition += 5
  }
  
  if (order.watch.condition) {
    pdf.text(`Condition: ${order.watch.condition}`, 25, yPosition)
    yPosition += 5
  }
  
  yPosition += 20

  // Payment method
  if (order.paymentMethod) {
    pdf.setFontSize(11)
    pdf.setTextColor(darkColor)
    pdf.text(`Payment Method: ${order.paymentMethod}`, 25, yPosition)
    yPosition += 15
  }

  // Notes
  if (order.notes) {
    pdf.setFontSize(10)
    pdf.setTextColor(grayColor)
    pdf.text(`Notes: ${order.notes}`, 25, yPosition)
    yPosition += 15
  }

  // Totals section
  const subtotal = order.salePrice
  const shipping = 0
  const total = subtotal + shipping

  // Subtotal
  pdf.setFontSize(11)
  pdf.setTextColor(darkColor)
  pdf.text('Subtotal:', pageWidth - 80, yPosition, { align: 'right' })
  pdf.text(formatCurrency(subtotal), pageWidth - 25, yPosition, { align: 'right' })
  yPosition += 8

  // Shipping
  pdf.text('Shipping:', pageWidth - 80, yPosition, { align: 'right' })
  pdf.text('Free', pageWidth - 25, yPosition, { align: 'right' })
  yPosition += 8

  // Total line
  pdf.setLineWidth(0.5)
  pdf.setDrawColor(borderColor)
  pdf.line(20, yPosition, pageWidth - 20, yPosition)
  yPosition += 10

  // Total
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.text('Total:', pageWidth - 80, yPosition, { align: 'right' })
  pdf.text(formatCurrency(total), pageWidth - 25, yPosition, { align: 'right' })

  yPosition += 30

  // Payment terms
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(grayColor)
  pdf.text('Payment Status: Completed', 20, yPosition)
  pdf.text('Thank you for your purchase!', pageWidth - 20, yPosition, { align: 'right' })

  yPosition += 20

  // Footer
  pdf.setFontSize(9)
  pdf.setTextColor(grayColor)
  pdf.text('Timestack Ltd · 10B Berkeley St, Mayfair, London W1J 8DR', pageWidth / 2, pageHeight - 20, { align: 'center' })
  pdf.text('Company No. 15075111 · info@timestack.com', pageWidth / 2, pageHeight - 15, { align: 'center' })

  // Save the PDF
  pdf.save(`sales_receipt_${order.orderNumber}.pdf`)
}