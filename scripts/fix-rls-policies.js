const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies...')
  
  try {
    // Drop existing policies
    console.log('Dropping existing policies...')
    await supabase.rpc('exec', {
      sql: `
        DROP POLICY IF EXISTS "Allow all operations on customers" ON customers;
        DROP POLICY IF EXISTS "Allow all operations on products" ON products;
        DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
        DROP POLICY IF EXISTS "Allow all operations on profiles" ON profiles;
      `
    })

    // Create new multi-tenant policies
    console.log('Creating new multi-tenant policies...')
    
    // Customers policies
    await supabase.rpc('exec', {
      sql: `
        CREATE POLICY "Users can view customers from their company" ON customers
          FOR SELECT USING (
            company_id = (auth.jwt() ->> 'company_id')::uuid OR
            (auth.jwt() ->> 'role') = 'master'
          );
        
        CREATE POLICY "Users can insert customers to their company" ON customers
          FOR INSERT WITH CHECK (
            company_id = (auth.jwt() ->> 'company_id')::uuid OR
            (auth.jwt() ->> 'role') = 'master'
          );
        
        CREATE POLICY "Users can update customers from their company" ON customers
          FOR UPDATE USING (
            company_id = (auth.jwt() ->> 'company_id')::uuid OR
            (auth.jwt() ->> 'role') = 'master'
          );
        
        CREATE POLICY "Users can delete customers from their company" ON customers
          FOR DELETE USING (
            company_id = (auth.jwt() ->> 'company_id')::uuid OR
            (auth.jwt() ->> 'role') = 'master'
          );
      `
    })

    // Watches policies
    await supabase.rpc('exec', {
      sql: `
        CREATE POLICY "Users can view watches from their company" ON watches
          FOR SELECT USING (
            company_id = (auth.jwt() ->> 'company_id')::uuid OR
            (auth.jwt() ->> 'role') = 'master'
          );
        
        CREATE POLICY "Users can insert watches to their company" ON watches
          FOR INSERT WITH CHECK (
            company_id = (auth.jwt() ->> 'company_id')::uuid OR
            (auth.jwt() ->> 'role') = 'master'
          );
        
        CREATE POLICY "Users can update watches from their company" ON watches
          FOR UPDATE USING (
            company_id = (auth.jwt() ->> 'company_id')::uuid OR
            (auth.jwt() ->> 'role') = 'master'
          );
        
        CREATE POLICY "Users can delete watches from their company" ON watches
          FOR DELETE USING (
            company_id = (auth.jwt() ->> 'company_id')::uuid OR
            (auth.jwt() ->> 'role') = 'master'
          );
      `
    })

    // Orders policies
    await supabase.rpc('exec', {
      sql: `
        CREATE POLICY "Users can view orders from their company" ON orders
          FOR SELECT USING (
            company_id = (auth.jwt() ->> 'company_id')::uuid OR
            (auth.jwt() ->> 'role') = 'master'
          );
        
        CREATE POLICY "Users can insert orders to their company" ON orders
          FOR INSERT WITH CHECK (
            company_id = (auth.jwt() ->> 'company_id')::uuid OR
            (auth.jwt() ->> 'role') = 'master'
          );
        
        CREATE POLICY "Users can update orders from their company" ON orders
          FOR UPDATE USING (
            company_id = (auth.jwt() ->> 'company_id')::uuid OR
            (auth.jwt() ->> 'role') = 'master'
          );
        
        CREATE POLICY "Users can delete orders from their company" ON orders
          FOR DELETE USING (
            company_id = (auth.jwt() ->> 'company_id')::uuid OR
            (auth.jwt() ->> 'role') = 'master'
          );
      `
    })

    console.log('✅ RLS policies updated successfully!')
    
  } catch (error) {
    console.error('❌ Error fixing RLS policies:', error)
  }
}

fixRLSPolicies()
