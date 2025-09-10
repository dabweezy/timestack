const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...')
  
  try {
    // Test connection first
    console.log('Testing connection...')
    const { data: testData, error: testError } = await supabase
      .from('customers')
      .select('count')
      .limit(1)
    
    if (testError && testError.code === 'PGRST116') {
      console.log('📋 Database tables not found, creating schema...')
      await createTables()
    } else if (testError) {
      console.error('❌ Connection test failed:', testError)
      return
    } else {
      console.log('✅ Database already set up!')
      return
    }
    
    // Insert sample data
    await insertSampleData()
    
    console.log('🎉 Database setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

async function createTables() {
  console.log('Creating database tables...')
  
  // Note: This is a simplified approach. In production, you'd want to use
  // the Supabase SQL editor or migrations. For now, we'll just test the connection
  // and let you know to run the SQL manually.
  
  console.log('⚠️  Please run the SQL schema manually in your Supabase dashboard:')
  console.log('1. Go to https://supabase.com/dashboard/project/hscxnaplrewvqjdhjlsj')
  console.log('2. Navigate to SQL Editor')
  console.log('3. Copy and paste the contents of supabase-schema.sql')
  console.log('4. Click Run')
}

async function insertSampleData() {
  console.log('Inserting sample data...')
  
  // Sample customers
  const customers = [
    {
      first_name: 'John',
      last_name: 'Smith',
      email: 'john.smith@email.com',
      mobile: '+44 20 7123 4567',
      address1: '123 High Street',
      city: 'London',
      postcode: 'SW1A 1AA',
      country: 'United Kingdom'
    },
    {
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@email.com',
      mobile: '+44 20 7123 4568',
      address1: '456 Queen Street',
      city: 'Manchester',
      postcode: 'M1 1AA',
      country: 'United Kingdom'
    },
    {
      first_name: 'Michael',
      last_name: 'Brown',
      email: 'michael.brown@email.com',
      mobile: '+44 20 7123 4569',
      address1: '789 King Road',
      city: 'Birmingham',
      postcode: 'B1 1AA',
      country: 'United Kingdom'
    }
  ]
  
  try {
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert(customers)
      .select()
    
    if (customerError) {
      console.error('Error inserting customers:', customerError)
    } else {
      console.log(`✅ Inserted ${customerData.length} customers`)
    }
  } catch (error) {
    console.error('Error with customers:', error)
  }
}

setupDatabase()
