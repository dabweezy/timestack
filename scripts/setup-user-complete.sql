-- Complete setup for user daban@123.com
-- Run this in your Supabase SQL Editor

-- First, let's create the company (this should work even with RLS)
INSERT INTO companies (id, name, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'My Watch Business', NOW())
ON CONFLICT (id) DO NOTHING;

-- Update the user's meta data
UPDATE auth.users 
SET raw_user_meta_data = '{"role": "user", "company_id": "550e8400-e29b-41d4-a716-446655440001"}'
WHERE email = 'daban@123.com';

-- Verify the setup worked
SELECT 
  id,
  email,
  raw_user_meta_data,
  created_at
FROM auth.users 
WHERE email = 'daban@123.com';

-- Check if company was created
SELECT 
  id,
  name,
  created_at
FROM companies 
WHERE id = '550e8400-e29b-41d4-a716-446655440001';
