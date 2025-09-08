/**
 * Format currency values
 */
export function formatCurrency(value: number, currency: string = 'GBP', locale: string = 'en-GB'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format numbers with commas
 */
export function formatNumber(value: number, locale: string = 'en-GB'): string {
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Format dates
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
    short: { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    },
    long: { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    },
    time: { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    }
  }
  
  const options = formatOptions[format]
  
  return new Intl.DateTimeFormat('en-GB', options).format(dateObj)
}

/**
 * Format phone numbers
 */
export function formatPhone(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if it's a UK number
  if (cleaned.startsWith('44')) {
    const number = cleaned.substring(2)
    return `+44 ${number.substring(0, 4)} ${number.substring(4, 7)} ${number.substring(7)}`
  }
  
  // Default formatting
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.substring(0, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`
  }
  
  return phone
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2)
  return `${prefix}${prefix ? '-' : ''}${timestamp}-${random}`
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert string to URL slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
    .trim()
}