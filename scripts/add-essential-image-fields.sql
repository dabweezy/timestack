-- Add essential image fields to existing tables only
-- This script only adds the fields you need for customer images

-- Add image fields to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS identification_documents JSONB DEFAULT '[]'::jsonb;

-- Add multiple image support to watches table  
ALTER TABLE watches 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Add image support to orders table (for receipts, etc.)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS receipt_url TEXT,
ADD COLUMN IF NOT EXISTS additional_documents JSONB DEFAULT '[]'::jsonb;
