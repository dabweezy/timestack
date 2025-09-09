// Browser console script to add 20 customers to the database
// Run this in the browser console when the app is loaded

(function() {
  console.log('🚀 Starting customer addition process...')
  
  // Check if we're in the right environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    console.error('❌ This script must be run in a browser environment')
    return
  }

  // Customer data to add
  const customersToAdd = [
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

  // Function to add customers to localStorage
  function addCustomersToDatabase() {
    try {
      const storageKey = 'timestack-storage'
      const existingDataStr = localStorage.getItem(storageKey)
      let existingData = { state: { customers: [] } }
      
      if (existingDataStr) {
        existingData = JSON.parse(existingDataStr)
        if (!existingData.state) {
          existingData.state = {}
        }
        if (!existingData.state.customers) {
          existingData.state.customers = []
        }
      }
      
      const currentCustomers = existingData.state.customers
      const existingIds = new Set(currentCustomers.map(c => c.id))
      const existingEmails = new Set(currentCustomers.map(c => c.email))
      
      // Filter out duplicates
      const newCustomers = customersToAdd.filter(customer => 
        !existingIds.has(customer.id) && !existingEmails.has(customer.email)
      )
      
      if (newCustomers.length === 0) {
        console.log('⚠️  All customers already exist in the database')
        return { added: 0, total: currentCustomers.length }
      }
      
      // Add new customers
      existingData.state.customers = [...currentCustomers, ...newCustomers]
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(existingData))
      
      // Trigger storage event to update UI
      window.dispatchEvent(new StorageEvent('storage', {
        key: storageKey,
        newValue: JSON.stringify(existingData),
        oldValue: existingDataStr
      }))
      
      console.log(`✅ Successfully added ${newCustomers.length} customers to the database!`)
      console.log(`📊 Total customers: ${existingData.state.customers.length}`)
      
      // Log the added customers
      console.log('🆕 Added customers:')
      newCustomers.forEach((customer, i) => {
        console.log(`${i + 1}. ${customer.firstName} ${customer.lastName} (${customer.email})`)
      })
      
      return { 
        added: newCustomers.length, 
        total: existingData.state.customers.length,
        customers: newCustomers
      }
      
    } catch (error) {
      console.error('❌ Error adding customers:', error)
      return { error: error.message }
    }
  }

  // Execute the function
  const result = addCustomersToDatabase()
  
  if (result.error) {
    console.error('❌ Failed to add customers:', result.error)
  } else if (result.added === 0) {
    console.log('ℹ️  No new customers were added (all already exist)')
  } else {
    console.log(`🎉 Process completed! Added ${result.added} customers.`)
    console.log('💡 Refresh the page or navigate to the Customers page to see the new data.')
  }
  
  return result
})()