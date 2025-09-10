const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSetup() {
  console.log('🔍 Testing Supabase Multi-Tenant Setup...\n')can i 
  
  try {
    // Test 1: Check if companies table exists and has data
    console.log('1. Testing companies table...')
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(5)
    
    if (companiesError) {
      console.error('❌ Companies table error:', companiesError.message)
      return
    }
    
    console.log(`✅ Companies table: Found ${companies.length} companies`)
    companies.forEach(company => {
      console.log(`   - ${company.name} (${company.subscription_plan})`)
    })
    
    // Test 2: Check if watches table exists and has data
    console.log('\n2. Testing watches table...')
    const { data: watches, error: watchesError } = await supabase
      .from('watches')
      .select('*')
      .limit(5)
    
    if (watchesError) {
      console.error('❌ Watches table error:', watchesError.message)
      return
    }
    
    console.log(`✅ Watches table: Found ${watches.length} watches`)
    watches.forEach(watch => {
      console.log(`   - ${watch.brand} ${watch.model} (Company: ${watch.company_id})`)
    })
    
    // Test 3: Check if customers table exists and has data
    console.log('\n3. Testing customers table...')
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(5)
    
    if (customersError) {
      console.error('❌ Customers table error:', customersError.message)
      return
    }
    
    console.log(`✅ Customers table: Found ${customers.length} customers`)
    customers.forEach(customer => {
      console.log(`   - ${customer.first_name} ${customer.last_name} (Company: ${customer.company_id})`)
    })
    
    // Test 4: Check if orders table exists
    console.log('\n4. Testing orders table...')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(5)
    
    if (ordersError) {
      console.error('❌ Orders table error:', ordersError.message)
      return
    }
    
    console.log(`✅ Orders table: Found ${orders.length} orders`)
    
    // Test 5: Check if transactions table exists
    console.log('\n5. Testing transactions table...')
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .limit(5)
    
    if (transactionsError) {
      console.error('❌ Transactions table error:', transactionsError.message)
      return
    }
    
    console.log(`✅ Transactions table: Found ${transactions.length} transactions`)
    
    // Test 6: Check RLS policies (this will fail if not authenticated, which is expected)
    console.log('\n6. Testing RLS policies...')
    console.log('   ℹ️  RLS policies require authentication to test properly')
    console.log('   ℹ️  This is expected behavior - data should be filtered by company')
    
    // Test 7: Check if storage buckets exist
    console.log('\n7. Testing storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets()
    
    if (bucketsError) {
      console.error('❌ Storage buckets error:', bucketsError.message)
      return
    }
    
    const bucketNames = buckets.map(bucket => bucket.name)
    console.log(`✅ Storage buckets: Found ${buckets.length} buckets`)
    console.log(`   - Available buckets: ${bucketNames.join(', ')}`)
    
    if (bucketNames.includes('watches') && bucketNames.includes('invoices')) {
      console.log('✅ Required buckets (watches, invoices) are present')
    } else {
      console.log('⚠️  Some required buckets may be missing')
    }
    
    // Test 8: Check helper functions
    console.log('\n8. Testing helper functions...')
    const { data: functions, error: functionsError } = await supabase
      .rpc('get_user_company_id')
      .then(() => ({ data: 'exists', error: null }))
      .catch(err => ({ data: null, error: err }))
    
    if (functionsError) {
      console.log('⚠️  Helper functions may not be accessible without authentication')
    } else {
      console.log('✅ Helper functions are accessible')
    }
    
    console.log('\n🎉 Setup verification complete!')
    console.log('\n📋 Summary:')
    console.log(`   - Companies: ${companies.length}`)
    console.log(`   - Watches: ${watches.length}`)
    console.log(`   - Customers: ${customers.length}`)
    console.log(`   - Orders: ${orders.length}`)
    console.log(`   - Transactions: ${transactions.length}`)
    console.log(`   - Storage Buckets: ${buckets.length}`)
    
    if (companies.length > 0 && watches.length > 0 && customers.length > 0) {
      console.log('\n✅ Multi-tenant setup appears to be working correctly!')
      console.log('✅ You can now proceed with updating your frontend application.')
    } else {
      console.log('\n⚠️  Some tables may be empty or not properly set up.')
      console.log('⚠️  Please check if you ran all the SQL scripts correctly.')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Please check your Supabase setup and try again.')
  }
}

testSetup()
