const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function clearAllData() {
  console.log('🧹 Clearing all data from Supabase...')
  
  try {
    // Clear all tables in the correct order (respecting foreign key constraints)
    // 1. Clear transactions first (references orders)
    console.log('📊 Clearing transactions...')
    const { error: transactionsError } = await supabase
      .from('transactions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all transactions
    
    if (transactionsError) {
      console.error('❌ Error clearing transactions:', transactionsError)
    } else {
      console.log('✅ Transactions cleared')
    }

    // 2. Clear orders (references customers and watches)
    console.log('📊 Clearing orders...')
    const { error: ordersError } = await supabase
      .from('orders')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all orders
    
    if (ordersError) {
      console.error('❌ Error clearing orders:', ordersError)
    } else {
      console.log('✅ Orders cleared')
    }

    // 3. Clear watches (no dependencies)
    console.log('📊 Clearing watches...')
    const { error: watchesError } = await supabase
      .from('watches')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all watches
    
    if (watchesError) {
      console.error('❌ Error clearing watches:', watchesError)
    } else {
      console.log('✅ Watches cleared')
    }

    // 4. Clear customers (no dependencies)
    console.log('📊 Clearing customers...')
    const { error: customersError } = await supabase
      .from('customers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all customers
    
    if (customersError) {
      console.error('❌ Error clearing customers:', customersError)
    } else {
      console.log('✅ Customers cleared')
    }

    console.log('🎉 All data cleared successfully!')
    console.log('📋 Your Timestack system is now empty and ready for real data.')
    
  } catch (error) {
    console.error('❌ Error clearing data:', error)
  }
}

clearAllData()
