const fs = require('fs')
const path = require('path')

// Generate unique customer data
const generateCustomers = () => {
  const firstNames = ['Sarah', 'Michael', 'Emma', 'James', 'Sophie', 'David', 'Jennifer', 'Robert', 'Lisa', 'Christopher', 'Amanda', 'William', 'Jessica', 'Daniel', 'Michelle', 'Anthony', 'Nicole', 'Kevin', 'Rachel', 'Thomas']
  const lastNames = ['Johnson', 'Brown', 'Wilson', 'Taylor', 'Anderson', 'Martinez', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Thompson', 'White', 'Martin', 'Lee', 'Clark', 'Lewis', 'Walker', 'Hall', 'Young', 'King']
  const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Edinburgh', 'Cardiff', 'Bristol', 'Liverpool', 'Sheffield', 'Newcastle']
  const streets = ['Royal Avenue', 'Crown Street', 'Victoria Road', 'Parliament Hill', 'Castle Lane', 'Oxford Street', 'Regent Street', 'Piccadilly', 'Bond Street', 'Knightsbridge', 'Chelsea Road', 'Mayfair Street', 'Belgravia Square', 'Notting Hill', 'Hampstead Heath', 'Richmond Park', 'Greenwich Village', 'Canary Wharf', 'Shoreditch High Street', 'Kensington Palace Gardens']
  const countries = ['United Kingdom']
  
  return Array.from({ length: 20 }, (_, i) => {
    const customerId = `customer-${String(i + 2).padStart(3, '0')}`
    const firstName = firstNames[i]
    const lastName = lastNames[i]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`
    const mobile = `+44 7700 ${String(900124 + i)}`
    const streetNumber = Math.floor(Math.random() * 900) + 100
    const address1 = `${streetNumber} ${streets[i]}`
    const address2 = Math.random() > 0.5 ? ['Suite 12', 'Flat 8', 'Unit 15', 'Floor 3', 'Shop 21', 'Penthouse', 'Mews House', 'Garden Flat', 'Loft 7'][i % 9] : undefined
    const city = cities[i % cities.length]
    const postcode = `${['SW1A', 'M1', 'B1', 'LS1', 'EH1', 'CF1', 'W1D', 'W1B', 'W1J', 'W1S', 'SW1X', 'SW3', 'W1K', 'SW1W', 'W11', 'NW3', 'SW15', 'SE10', 'E14', 'E1', 'W8'][i % 21]} ${Math.floor(Math.random() * 9) + 1}${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]}${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]}`
    const country = 'United Kingdom'
    
    // Optional banking details (some customers have them, others don't)
    const hasBankingDetails = Math.random() > 0.4
    let sortCode, accountNumber, iban, swift
    
    if (hasBankingDetails) {
      const sortCodes = ['20-00-00', '40-00-00', '60-00-00', '80-00-00', '16-00-00', '23-00-00', '30-00-00', '77-00-00']
      sortCode = sortCodes[i % sortCodes.length]
      accountNumber = String(Math.floor(Math.random() * 90000000) + 10000000)
      
      if (Math.random() > 0.5) {
        const swiftCodes = ['NWBKGB2L', 'HBUKGB4B', 'BARCGB22', 'LOYDGB2L', 'MIDLGB22', 'SANCGB22', 'TSBCGB22', 'CITIGB2L']
        iban = `GB29 ${['NWBK', 'HSBC', 'BARC', 'LLOY', 'MIDL', 'SANC', 'TSBC', 'CITI'][i % 8]} ${String(Math.floor(Math.random() * 9000) + 1000)} ${String(Math.floor(Math.random() * 9000) + 1000)} ${String(Math.floor(Math.random() * 90) + 10)}`
        swift = swiftCodes[i % swiftCodes.length]
      }
    }
    
    return {
      id: customerId,
      firstName,
      lastName,
      email,
      mobile,
      address1,
      address2,
      city,
      postcode,
      country,
      sortCode,
      accountNumber,
      iban,
      swift,
      dateAdded: new Date().toISOString(),
    }
  })
}

// Generate the customers
const customers = generateCustomers()

// Create the add-customers script content
const scriptContent = `// Auto-generated customer addition script
// Run this in the browser console or as a Node.js script

const customersToAdd = ${JSON.stringify(customers, null, 2)}

// Function to add customers to Zustand store via localStorage
function addCustomersToLocalStorage() {
  try {
    // Get existing data from localStorage
    const storageKey = 'timestack-storage'
    const existingDataStr = localStorage.getItem(storageKey)
    let existingData = {}
    
    if (existingDataStr) {
      existingData = JSON.parse(existingDataStr)
    }
    
    // Initialize state if it doesn't exist
    if (!existingData.state) {
      existingData.state = {}
    }
    
    // Get current customers or initialize empty array
    const currentCustomers = existingData.state.customers || []
    
    // Check if customers already exist to avoid duplicates
    const existingIds = new Set(currentCustomers.map(c => c.id))
    const newCustomers = customersToAdd.filter(c => !existingIds.has(c.id))
    
    if (newCustomers.length === 0) {
      console.log('All customers already exist in the database')
      return currentCustomers
    }
    
    // Add new customers
    const updatedCustomers = [...currentCustomers, ...newCustomers]
    
    // Update the store data
    existingData.state.customers = updatedCustomers
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(existingData))
    
    console.log(\`Successfully added \${newCustomers.length} new customers to the database!\`)
    console.log(\`Total customers: \${updatedCustomers.length}\`)
    
    // If running in a React app, trigger a storage event to update the UI
    window.dispatchEvent(new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(existingData)
    }))
    
    return updatedCustomers
  } catch (error) {
    console.error('Error adding customers:', error)
    throw error
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { customersToAdd, addCustomersToLocalStorage }
}

// Auto-execute if running in browser
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  console.log('Adding customers to database...')
  addCustomersToLocalStorage()
} else {
  console.log('Customer data ready. Run addCustomersToLocalStorage() to add them.')
}
`

// Write the script file
fs.writeFileSync(path.join(__dirname, '..', 'add-customers-to-db.js'), scriptContent)

console.log('✅ Generated 20 customer records')
console.log('📝 Created add-customers-to-db.js script')
console.log('🚀 To add customers to database:')
console.log('   1. Start the development server: npm run dev')
console.log('   2. Open the app in browser')
console.log('   3. Run in browser console: ')
console.log('      fetch("/add-customers-to-db.js").then(r=>r.text()).then(eval)')
console.log('   OR')
console.log('   4. Copy and run the contents of add-customers-to-db.js in browser console')

// Also output the customers for verification
console.log('\\n📋 Generated customers:')
customers.forEach((customer, i) => {
  console.log(`${i + 1}. ${customer.firstName} ${customer.lastName} (${customer.email})`)
})