// Test authentication for DWL user
// Run this with: node scripts/test-auth.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuth() {
  try {
    console.log('🔐 Testing authentication for DWL user...')
    
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'daban@yahoo.com',
      password: 'DWL123'
    })

    if (error) {
      console.error('❌ Authentication failed:', error.message)
      return
    }

    console.log('✅ Authentication successful!')
    console.log('👤 User ID:', data.user.id)
    console.log('📧 Email:', data.user.email)
    console.log('📋 Meta Data:', data.user.user_metadata)

    // Test data access
    console.log('\n📊 Testing data access...')
    
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
    
    if (customersError) {
      console.error('❌ Error accessing customers:', customersError.message)
    } else {
      console.log('✅ Customers accessible:', customers.length, 'records')
    }

    const { data: watches, error: watchesError } = await supabase
      .from('watches')
      .select('*')
    
    if (watchesError) {
      console.error('❌ Error accessing watches:', watchesError.message)
    } else {
      console.log('✅ Watches accessible:', watches.length, 'records')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

testAuth()
