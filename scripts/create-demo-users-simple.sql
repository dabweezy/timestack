-- =============================================
-- Create Demo Users for Timestack (Simple Version)
-- =============================================
-- This script creates demo users using Supabase's built-in functions
-- Run this in your Supabase SQL Editor

-- First, let's create the users using Supabase's auth functions
-- Note: You may need to create these users through the Supabase Dashboard Auth section instead

-- Create Master User
-- Go to Authentication > Users > Add User in Supabase Dashboard
-- Email: master@timestack.com
-- Password: master123
-- Raw User Meta Data: {"role": "master", "company_id": null}

-- Create Company User  
-- Go to Authentication > Users > Add User in Supabase Dashboard
-- Email: user@luxurywatch.com
-- Password: user123
-- Raw User Meta Data: {"role": "user", "company_id": "550e8400-e29b-41d4-a716-446655440000"}

-- Alternative: Use Supabase's signup function (if you have the right permissions)
-- This might not work due to RLS policies, but worth trying:

-- SELECT auth.signup('master@timestack.com', 'master123', '{"role": "master", "company_id": null}');
-- SELECT auth.signup('user@luxurywatch.com', 'user123', '{"role": "user", "company_id": "550e8400-e29b-41d4-a716-446655440000"}');

-- Check if users exist
SELECT 
  id,
  email,
  raw_user_meta_data,
  created_at
FROM auth.users 
WHERE email IN ('master@timestack.com', 'user@luxurywatch.com')
ORDER BY created_at;
