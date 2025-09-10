const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setUserMetadata() {
  console.log('🔧 Setting user metadata...')
  
  try {
    // Update the user's metadata
    const { data, error } = await supabase.auth.admin.updateUserById(
      'USER_ID_HERE', // Replace with actual user ID
      {
        user_metadata: {
          role: 'user',
          company_id: '550e8400-e29b-41d4-a716-446655440001'
        }
      }
    )
    
    if (error) {
      console.error('❌ Error updating user metadata:', error)
    } else {
      console.log('✅ User metadata updated successfully!')
      console.log('User:', data.user.email)
      console.log('Metadata:', data.user.user_metadata)
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Alternative: Update by email
async function setUserMetadataByEmail(email) {
  console.log(`🔧 Setting metadata for user: ${email}`)
  
  try {
    // First, get the user by email
    const { data: users, error: fetchError } = await supabase.auth.admin.listUsers()
    
    if (fetchError) {
      console.error('❌ Error fetching users:', fetchError)
      return
    }
    
    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      console.error(`❌ User with email ${email} not found`)
      return
    }
    
    console.log(`Found user: ${user.email} (ID: ${user.id})`)
    
    // Update the user's metadata
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          role: 'user',
          company_id: '550e8400-e29b-41d4-a716-446655440001'
        }
      }
    )
    
    if (error) {
      console.error('❌ Error updating user metadata:', error)
    } else {
      console.log('✅ User metadata updated successfully!')
      console.log('User:', data.user.email)
      console.log('Metadata:', data.user.user_metadata)
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the function
// Replace 'admin@timestack.com' with the email you created
setUserMetadataByEmail('admin@timestack.com')
