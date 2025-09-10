const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  console.log('🚀 Creating database tables...')
  
  try {
    // Create customers table
    console.log('Creating customers table...')
    const { error: customersError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS customers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          mobile TEXT NOT NULL,
          address1 TEXT NOT NULL,
          address2 TEXT,
          city TEXT NOT NULL,
          postcode TEXT NOT NULL,
          country TEXT NOT NULL DEFAULT 'United Kingdom'
        );
      `
    })
    
    if (customersError) {
      console.error('Error creating customers table:', customersError)
    } else {
      console.log('✅ Customers table created')
    }
    
    // Create products table
    console.log('Creating products table...')
    const { error: productsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          brand TEXT NOT NULL,
          model TEXT NOT NULL,
          reference TEXT NOT NULL,
          serial TEXT UNIQUE NOT NULL,
          material TEXT NOT NULL,
          dial_color TEXT NOT NULL,
          condition TEXT NOT NULL CHECK (condition IN ('New', 'Excellent', 'Very Good', 'Good', 'Fair')),
          year_manufactured INTEGER NOT NULL,
          set TEXT NOT NULL,
          cost_price DECIMAL(10,2) NOT NULL,
          trade_price DECIMAL(10,2) NOT NULL,
          retail_price DECIMAL(10,2) NOT NULL,
          description TEXT,
          date_added TIMESTAMP WITH TIME ZONE NOT NULL,
          status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'consignment')),
          assigned_customer UUID REFERENCES customers(id)
        );
      `
    })
    
    if (productsError) {
      console.error('Error creating products table:', productsError)
    } else {
      console.log('✅ Products table created')
    }
    
    // Create orders table
    console.log('Creating orders table...')
    const { error: ordersError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          order_number TEXT UNIQUE NOT NULL,
          order_type TEXT NOT NULL CHECK (order_type IN ('purchase', 'sale')),
          customer_id UUID NOT NULL REFERENCES customers(id),
          product_id UUID NOT NULL REFERENCES products(id),
          sale_price DECIMAL(10,2) NOT NULL,
          payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer')),
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
          date TEXT NOT NULL,
          timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
          notes TEXT
        );
      `
    })
    
    if (ordersError) {
      console.error('Error creating orders table:', ordersError)
    } else {
      console.log('✅ Orders table created')
    }
    
    // Create profiles table
    console.log('Creating profiles table...')
    const { error: profilesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          user_id UUID UNIQUE NOT NULL,
          profile_picture TEXT,
          company_name TEXT NOT NULL,
          mobile_number TEXT NOT NULL,
          email_address TEXT NOT NULL,
          vat_number TEXT NOT NULL,
          registered_address JSONB NOT NULL
        );
      `
    })
    
    if (profilesError) {
      console.error('Error creating profiles table:', profilesError)
    } else {
      console.log('✅ Profiles table created')
    }
    
    console.log('🎉 All tables created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating tables:', error)
  }
}

createTables()
