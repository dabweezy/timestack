const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('Setting up Supabase database...')
  
  try {
    // Read the SQL schema file
    const fs = require('fs')
    const path = require('path')
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`)
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error)
          // Continue with other statements
        } else {
          console.log(`✓ Statement ${i + 1} executed successfully`)
        }
      }
    }
    
    console.log('Database setup completed!')
    
    // Test the connection by fetching customers
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .limit(1)
    
    if (customerError) {
      console.error('Error testing connection:', customerError)
    } else {
      console.log('✓ Database connection test successful')
      console.log(`Found ${customers?.length || 0} customers in database`)
    }
    
  } catch (error) {
    console.error('Setup failed:', error)
    process.exit(1)
  }
}

setupDatabase()
