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

-- Create a dedicated images table for better organization
CREATE TABLE IF NOT EXISTS images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Image metadata
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  url TEXT NOT NULL,
  
  -- Image categorization
  category TEXT NOT NULL CHECK (category IN ('profile_picture', 'product_image', 'identification', 'receipt', 'other')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('customer', 'watch', 'order', 'company')),
  entity_id UUID NOT NULL,
  
  -- Image dimensions (optional)
  width INTEGER,
  height INTEGER,
  
  -- Additional metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Indexes for better performance
  CONSTRAINT unique_image_per_entity UNIQUE (entity_type, entity_id, category)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_images_company_id ON images(company_id);
CREATE INDEX IF NOT EXISTS idx_images_entity ON images(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at);

-- Enable RLS on images table
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for images table
CREATE POLICY "Users can view images from their company" ON images
  FOR SELECT USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
  );

CREATE POLICY "Users can insert images for their company" ON images
  FOR INSERT WITH CHECK (
    company_id = (auth.jwt() ->> 'company_id')::uuid
  );

CREATE POLICY "Users can update images from their company" ON images
  FOR UPDATE USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
  );

CREATE POLICY "Users can delete images from their company" ON images
  FOR DELETE USING (
    company_id = (auth.jwt() ->> 'company_id')::uuid
  );

-- Grant permissions
GRANT ALL ON images TO authenticated;
GRANT ALL ON images TO service_role;
