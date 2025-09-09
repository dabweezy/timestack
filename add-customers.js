#!/usr/bin/env node

// Script to add 20 sample customers to the database
// This will add customers directly to the Zustand store via localStorage

const customers = [
  {
    id: 'customer-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    mobile: '+44 7700 900124',
    address1: '456 Royal Avenue',
    address2: 'Suite 12',
    city: 'Manchester',
    postcode: 'M1 2AA',
    country: 'United Kingdom',
    sortCode: '20-00-00',
    accountNumber: '12345678',
    iban: 'GB29 NWBK 6016 1331 9268 19',
    swift: 'NWBKGB2L',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-003',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    mobile: '+44 7700 900125',
    address1: '789 Crown Street',
    city: 'Birmingham',
    postcode: 'B1 3AA',
    country: 'United Kingdom',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-004',
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@example.com',
    mobile: '+44 7700 900126',
    address1: '321 Victoria Road',
    address2: 'Flat 8',
    city: 'Leeds',
    postcode: 'LS1 4BB',
    country: 'United Kingdom',
    sortCode: '40-00-00',
    accountNumber: '87654321',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-005',
    firstName: 'James',
    lastName: 'Taylor',
    email: 'james.taylor@example.com',
    mobile: '+44 7700 900127',
    address1: '654 Parliament Hill',
    city: 'Edinburgh',
    postcode: 'EH1 5CC',
    country: 'United Kingdom',
    iban: 'GB29 HSBC 4021 4531 9268 20',
    swift: 'HBUKGB4B',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-006',
    firstName: 'Sophie',
    lastName: 'Anderson',
    email: 'sophie.anderson@example.com',
    mobile: '+44 7700 900128',
    address1: '987 Castle Lane',
    address2: 'Unit 15',
    city: 'Cardiff',
    postcode: 'CF1 6DD',
    country: 'United Kingdom',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-007',
    firstName: 'David',
    lastName: 'Martinez',
    email: 'david.martinez@example.com',
    mobile: '+44 7700 900129',
    address1: '147 Oxford Street',
    city: 'London',
    postcode: 'W1D 7EE',
    country: 'United Kingdom',
    sortCode: '60-00-00',
    accountNumber: '11223344',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-008',
    firstName: 'Jennifer',
    lastName: 'Garcia',
    email: 'jennifer.garcia@example.com',
    mobile: '+44 7700 900130',
    address1: '258 Regent Street',
    address2: 'Floor 3',
    city: 'London',
    postcode: 'W1B 8FF',
    country: 'United Kingdom',
    iban: 'GB29 BARC 2000 0000 5555 55',
    swift: 'BARCGB22',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-009',
    firstName: 'Robert',
    lastName: 'Miller',
    email: 'robert.miller@example.com',
    mobile: '+44 7700 900131',
    address1: '369 Piccadilly',
    city: 'London',
    postcode: 'W1J 9GG',
    country: 'United Kingdom',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-010',
    firstName: 'Lisa',
    lastName: 'Davis',
    email: 'lisa.davis@example.com',
    mobile: '+44 7700 900132',
    address1: '741 Bond Street',
    address2: 'Shop 21',
    city: 'London',
    postcode: 'W1S 7HH',
    country: 'United Kingdom',
    sortCode: '80-00-00',
    accountNumber: '99887766',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-011',
    firstName: 'Christopher',
    lastName: 'Rodriguez',
    email: 'chris.rodriguez@example.com',
    mobile: '+44 7700 900133',
    address1: '852 Knightsbridge',
    city: 'London',
    postcode: 'SW1X 9II',
    country: 'United Kingdom',
    iban: 'GB29 LLOY 3093 4400 1212 12',
    swift: 'LOYDGB2L',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-012',
    firstName: 'Amanda',
    lastName: 'Thompson',
    email: 'amanda.thompson@example.com',
    mobile: '+44 7700 900134',
    address1: '963 Chelsea Road',
    address2: 'Penthouse',
    city: 'London',
    postcode: 'SW3 5JJ',
    country: 'United Kingdom',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-013',
    firstName: 'William',
    lastName: 'White',
    email: 'william.white@example.com',
    mobile: '+44 7700 900135',
    address1: '159 Mayfair Street',
    city: 'London',
    postcode: 'W1K 8KK',
    country: 'United Kingdom',
    sortCode: '16-00-00',
    accountNumber: '55443322',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-014',
    firstName: 'Jessica',
    lastName: 'Martin',
    email: 'jessica.martin@example.com',
    mobile: '+44 7700 900136',
    address1: '357 Belgravia Square',
    city: 'London',
    postcode: 'SW1W 9LL',
    country: 'United Kingdom',
    iban: 'GB29 MIDL 4000 5555 1234 56',
    swift: 'MIDLGB22',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-015',
    firstName: 'Daniel',
    lastName: 'Lee',
    email: 'daniel.lee@example.com',
    mobile: '+44 7700 900137',
    address1: '486 Notting Hill',
    address2: 'Mews House',
    city: 'London',
    postcode: 'W11 1MM',
    country: 'United Kingdom',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-016',
    firstName: 'Michelle',
    lastName: 'Clark',
    email: 'michelle.clark@example.com',
    mobile: '+44 7700 900138',
    address1: '624 Hampstead Heath',
    city: 'London',
    postcode: 'NW3 6NN',
    country: 'United Kingdom',
    sortCode: '23-00-00',
    accountNumber: '77665544',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-017',
    firstName: 'Anthony',
    lastName: 'Lewis',
    email: 'anthony.lewis@example.com',
    mobile: '+44 7700 900139',
    address1: '735 Richmond Park',
    city: 'London',
    postcode: 'SW15 5OO',
    country: 'United Kingdom',
    iban: 'GB29 SANC 6000 7777 8888 99',
    swift: 'SANCGB22',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-018',
    firstName: 'Nicole',
    lastName: 'Walker',
    email: 'nicole.walker@example.com',
    mobile: '+44 7700 900140',
    address1: '846 Greenwich Village',
    address2: 'Garden Flat',
    city: 'London',
    postcode: 'SE10 8PP',
    country: 'United Kingdom',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-019',
    firstName: 'Kevin',
    lastName: 'Hall',
    email: 'kevin.hall@example.com',
    mobile: '+44 7700 900141',
    address1: '957 Canary Wharf',
    city: 'London',
    postcode: 'E14 5QQ',
    country: 'United Kingdom',
    sortCode: '30-00-00',
    accountNumber: '13579246',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-020',
    firstName: 'Rachel',
    lastName: 'Young',
    email: 'rachel.young@example.com',
    mobile: '+44 7700 900142',
    address1: '168 Shoreditch High Street',
    address2: 'Loft 7',
    city: 'London',
    postcode: 'E1 6RR',
    country: 'United Kingdom',
    iban: 'GB29 TSBC 0000 1111 2222 33',
    swift: 'TSBCGB22',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'customer-021',
    firstName: 'Thomas',
    lastName: 'King',
    email: 'thomas.king@example.com',
    mobile: '+44 7700 900143',
    address1: '279 Kensington Palace Gardens',
    city: 'London',
    postcode: 'W8 4SS',
    country: 'United Kingdom',
    sortCode: '77-00-00',
    accountNumber: '24681357',
    iban: 'GB29 CITI 1800 0000 9876 54',
    swift: 'CITIGB2L',
    dateAdded: new Date().toISOString(),
  }
]

// Function to update localStorage with new customers
function addCustomersToStore() {
  try {
    // Get existing data from localStorage
    const existingData = JSON.parse(localStorage.getItem('timestack-storage') || '{}')
    
    // Get current customers or initialize empty array
    const currentCustomers = existingData.state?.customers || []
    
    // Add new customers
    const updatedCustomers = [...currentCustomers, ...customers]
    
    // Update the store data
    const updatedData = {
      ...existingData,
      state: {
        ...existingData.state,
        customers: updatedCustomers
      }
    }
    
    // Save back to localStorage
    localStorage.setItem('timestack-storage', JSON.stringify(updatedData))
    
    console.log(`Successfully added ${customers.length} customers to the database!`)
    console.log(`Total customers: ${updatedCustomers.length}`)
    
    return updatedCustomers
  } catch (error) {
    console.error('Error adding customers:', error)
    throw error
  }
}

// If running in Node.js environment, export the data
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { customers, addCustomersToStore }
} else if (typeof window !== 'undefined') {
  // If running in browser, add to global scope
  window.addCustomersToDatabase = addCustomersToStore
  window.customerData = customers
}

console.log('Customer data prepared. Run addCustomersToDatabase() to add them to the store.')