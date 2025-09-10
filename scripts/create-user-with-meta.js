// Create user with proper meta data
// Run this with: node scripts/create-user-with-meta.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createUserWithMeta() {
  try {
    console.log('🔐 Creating user with meta data...')
    
    // Create user with admin privileges
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@luxurywatch.com',
      password: 'test123',
      user_metadata: {
        role: 'user',
        company_id: '550e8400-e29b-41d4-a716-446655440001'
      },
      email_confirm: true
    })

    if (error) {
      console.error('❌ Error creating user:', error.message)
      return
    }

    console.log('✅ User created successfully!')
    console.log('📧 Email:', data.user.email)
    console.log('🆔 User ID:', data.user.id)
    console.log('📋 Meta Data:', data.user.user_metadata)
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

createUserWithMeta()
