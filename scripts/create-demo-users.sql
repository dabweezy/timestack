-- =============================================
-- Create Demo Users for Timestack
-- =============================================
-- This script creates demo users in Supabase Auth
-- Run this in your Supabase SQL Editor

-- Create Master User (System Owner)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'master@timestack.com',
  crypt('master123', gen_salt('bf')),
  NOW(),
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "master", "company_id": null}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Create Company User (Luxury Watch Co.)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'user@luxurywatch.com',
  crypt('user123', gen_salt('bf')),
  NOW(),
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "user", "company_id": "550e8400-e29b-41d4-a716-446655440000"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Verify users were created
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'company_id' as company_id,
  created_at
FROM auth.users 
WHERE email IN ('master@timestack.com', 'user@luxurywatch.com')
ORDER BY created_at;