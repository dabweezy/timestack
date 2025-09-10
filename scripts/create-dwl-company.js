// Create DWL company using service role
// Run this with: node scripts/create-dwl-company.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createDWLCompany() {
  try {
    console.log('🏢 Creating DWL company...')
    
    // Create the company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        id: '660e8400-e29b-41d4-a716-446655440003',
        name: 'DWL',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (companyError) {
      console.error('❌ Error creating company:', companyError.message)
      return
    }

    console.log('✅ Company created successfully!')
    console.log('📋 Company ID:', company.id)
    console.log('🏢 Company Name:', company.name)

    // Update the user
    console.log('👤 Updating user metadata...')
    const { error: userError } = await supabase.auth.admin.updateUserById(
      'daban@yahoo.com', // This might need to be the actual user ID
      {
        user_metadata: {
          role: 'user',
          company_id: '660e8400-e29b-41d4-a716-446655440003'
        }
      }
    )

    if (userError) {
      console.error('❌ Error updating user:', userError.message)
      console.log('ℹ️  You may need to update the user manually in the dashboard')
    } else {
      console.log('✅ User updated successfully!')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

createDWLCompany()
