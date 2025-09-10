-- Minimal setup for new user
-- Run this in your Supabase SQL Editor

-- Create a company for the user
INSERT INTO companies (id, name, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'My Watch Business', NOW())
ON CONFLICT (id) DO NOTHING;

-- Update the user's meta data
UPDATE auth.users 
SET raw_user_meta_data = '{"role": "user", "company_id": "550e8400-e29b-41d4-a716-446655440001"}'
WHERE email = 'test@luxurywatch.com';
