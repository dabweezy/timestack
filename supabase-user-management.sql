-- User Management Examples for Multi-Tenant SaaS
-- Run this in your Supabase SQL Editor

-- =============================================
-- USER CREATION EXAMPLES
-- =============================================

-- Example 1: Create Master User (System Owner)
-- This user can access all companies and data
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@timestack.com',
  crypt('master_password_123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "master", "company_id": null, "name": "System Administrator"}'
);

-- Example 2: Create Company User (Luxury Watches Ltd)
-- This user can only access their company's data
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'staff@luxurywatches.com',
  crypt('company_password_123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "user", "company_id": "22222222-2222-2222-2222-222222222222", "name": "Luxury Watches Staff"}'
);

-- Example 3: Create Another Company User (Timepiece Co)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'staff@timepiece.com',
  crypt('company_password_456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "user", "company_id": "33333333-3333-3333-3333-333333333333", "name": "Timepiece Co Staff"}'
);

-- =============================================
-- HELPER FUNCTIONS FOR USER MANAGEMENT
-- =============================================

-- Function to create a new company user
CREATE OR REPLACE FUNCTION create_company_user(
  user_email TEXT,
  user_password TEXT,
  company_id UUID,
  user_name TEXT
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Check if caller is master user
  IF NOT is_master_user() THEN
    RAISE EXCEPTION 'Only master users can create company users';
  END IF;
  
  -- Check if company exists
  IF NOT EXISTS (SELECT 1 FROM companies WHERE id = company_id) THEN
    RAISE EXCEPTION 'Company not found';
  END IF;
  
  -- Generate new user ID
  new_user_id := uuid_generate_v4();
  
  -- Create user
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    new_user_id,
    user_email,
    crypt(user_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object(
      'role', 'user',
      'company_id', company_id::text,
      'name', user_name
    )
  );
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user company
CREATE OR REPLACE FUNCTION update_user_company(
  user_id UUID,
  new_company_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Check if caller is master user
  IF NOT is_master_user() THEN
    RAISE EXCEPTION 'Only master users can update user companies';
  END IF;
  
  -- Check if company exists
  IF NOT EXISTS (SELECT 1 FROM companies WHERE id = new_company_id) THEN
    RAISE EXCEPTION 'Company not found';
  END IF;
  
  -- Update user metadata
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('company_id', new_company_id::text)
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- EXAMPLE QUERIES
-- =============================================

-- Query 1: Master user can see all companies
-- (Run this as master user)
SELECT 
  c.id,
  c.name,
  c.subscription_plan,
  c.subscription_status,
  COUNT(DISTINCT cu.id) as customer_count,
  COUNT(DISTINCT w.id) as watch_count,
  COUNT(DISTINCT o.id) as order_count
FROM companies c
LEFT JOIN customers cu ON cu.company_id = c.id
LEFT JOIN watches w ON w.company_id = c.id
LEFT JOIN orders o ON o.company_id = c.id
GROUP BY c.id, c.name, c.subscription_plan, c.subscription_status
ORDER BY c.created_at DESC;

-- Query 2: Company user can only see their own data
-- (Run this as company user - will be filtered by RLS)
SELECT 
  c.name as company_name,
  COUNT(DISTINCT cu.id) as customer_count,
  COUNT(DISTINCT w.id) as watch_count,
  COUNT(DISTINCT o.id) as order_count,
  SUM(CASE WHEN o.order_type = 'sale' THEN o.sale_price ELSE 0 END) as total_sales,
  SUM(CASE WHEN o.order_type = 'purchase' THEN o.sale_price ELSE 0 END) as total_purchases
FROM companies c
LEFT JOIN customers cu ON cu.company_id = c.id
LEFT JOIN watches w ON w.company_id = c.id
LEFT JOIN orders o ON o.company_id = c.id
GROUP BY c.id, c.name;

-- Query 3: Get all watches for a company (filtered by RLS)
SELECT 
  w.brand,
  w.model,
  w.reference,
  w.serial,
  w.condition,
  w.status,
  w.cost_price,
  w.retail_price,
  cu.first_name || ' ' || cu.last_name as assigned_customer
FROM watches w
LEFT JOIN customers cu ON cu.id = w.assigned_customer_id
ORDER BY w.created_at DESC;

-- Query 4: Get recent orders with customer details (filtered by RLS)
SELECT 
  o.order_number,
  o.order_type,
  o.sale_price,
  o.payment_method,
  o.status,
  o.timestamp,
  cu.first_name || ' ' || cu.last_name as customer_name,
  w.brand || ' ' || w.model as watch_details
FROM orders o
JOIN customers cu ON cu.id = o.customer_id
JOIN watches w ON w.id = o.watch_id
ORDER BY o.timestamp DESC
LIMIT 10;

-- Query 5: Financial summary (filtered by RLS)
SELECT 
  DATE_TRUNC('month', o.timestamp) as month,
  COUNT(CASE WHEN o.order_type = 'sale' THEN 1 END) as sales_count,
  SUM(CASE WHEN o.order_type = 'sale' THEN o.sale_price ELSE 0 END) as sales_revenue,
  COUNT(CASE WHEN o.order_type = 'purchase' THEN 1 END) as purchases_count,
  SUM(CASE WHEN o.order_type = 'purchase' THEN o.sale_price ELSE 0 END) as purchase_cost,
  SUM(CASE WHEN o.order_type = 'sale' THEN o.sale_price ELSE 0 END) - 
  SUM(CASE WHEN o.order_type = 'purchase' THEN o.sale_price ELSE 0 END) as profit
FROM orders o
WHERE o.timestamp >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', o.timestamp)
ORDER BY month DESC;

-- =============================================
-- REAL-TIME SUBSCRIPTION EXAMPLES
-- =============================================

-- Example: Subscribe to watch updates for current company
-- (This would be used in your frontend application)
/*
const { data, error } = await supabase
  .channel('watches')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'watches' 
    }, 
    (payload) => {
      console.log('Watch updated:', payload)
      // Update your UI with the new data
    }
  )
  .subscribe()
*/

-- Example: Subscribe to order updates for current company
/*
const { data, error } = await supabase
  .channel('orders')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'orders' 
    }, 
    (payload) => {
      console.log('Order updated:', payload)
      // Update your UI with the new data
    }
  )
  .subscribe()
*/
