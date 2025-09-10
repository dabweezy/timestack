-- Setup master user for testing
-- Run this in your Supabase SQL Editor

-- Create a company first
INSERT INTO companies (id, name, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'My Watch Business', NOW())
ON CONFLICT (id) DO NOTHING;

-- Update the user to be a master user (can see all data)
UPDATE auth.users 
SET raw_user_meta_data = '{"role": "master", "company_id": null}'
WHERE email = 'daban@123.com';

-- Verify the setup
SELECT 
  id,
  email,
  raw_user_meta_data,
  created_at
FROM auth.users 
WHERE email = 'daban@123.com';

-- Check company
SELECT 
  id,
  name,
  created_at
FROM companies 
WHERE id = '550e8400-e29b-41d4-a716-446655440001';
