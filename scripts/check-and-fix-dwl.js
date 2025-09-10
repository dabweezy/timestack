// Check database and fix DWL user
// Run this with: node scripts/check-and-fix-dwl.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAndFixDWL() {
  try {
    console.log('🔍 Checking database...')
    
    // Check companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
    
    if (companiesError) {
      console.error('❌ Error checking companies:', companiesError.message)
      return
    }

    console.log('📊 Companies in database:')
    companies.forEach(company => {
      console.log(`  - ${company.name} (${company.id})`)
    })

    // Check users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Error checking users:', usersError.message)
      return
    }

    console.log('\n👥 Users in database:')
    users.users.forEach(user => {
      console.log(`  - ${user.email} (${user.user_metadata?.role || 'no role'})`)
    })

    // Find the DWL user
    const dwlUser = users.users.find(user => user.email === 'daban@yahoo.com')
    
    if (dwlUser) {
      console.log('\n🔧 Updating DWL user...')
      
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        dwlUser.id,
        {
          user_metadata: {
            role: 'user',
            company_id: '660e8400-e29b-41d4-a716-446655440003'
          }
        }
      )

      if (updateError) {
        console.error('❌ Error updating user:', updateError.message)
      } else {
        console.log('✅ DWL user updated successfully!')
        console.log('🎯 User should now be able to access the system')
      }
    } else {
      console.log('❌ DWL user not found. Please create the user first.')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

checkAndFixDWL()
