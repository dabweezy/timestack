-- File Storage Setup for Multi-Tenant SaaS
-- Run this in your Supabase SQL Editor after the main schema

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Create watches bucket for watch images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'watches',
  'watches',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create invoices bucket for PDF receipts
INSERT INTO storage.buckets (id, name, public, false, file_size_limit, allowed_mime_types)
VALUES (
  'invoices',
  'invoices',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf']
);

-- =============================================
-- STORAGE RLS POLICIES
-- =============================================

-- Watches bucket policies
CREATE POLICY "Master users can access all watch images" ON storage.objects
  FOR ALL USING (bucket_id = 'watches' AND is_master_user());

CREATE POLICY "Users can access watch images from their company" ON storage.objects
  FOR ALL USING (
    bucket_id = 'watches' 
    AND (storage.foldername(name))[1] = get_user_company_id()::text
  );

-- Invoices bucket policies
CREATE POLICY "Master users can access all invoices" ON storage.objects
  FOR ALL USING (bucket_id = 'invoices' AND is_master_user());

CREATE POLICY "Users can access invoices from their company" ON storage.objects
  FOR ALL USING (
    bucket_id = 'invoices' 
    AND (storage.foldername(name))[1] = get_user_company_id()::text
  );

-- =============================================
-- HELPER FUNCTIONS FOR FILE MANAGEMENT
-- =============================================

-- Function to get company-specific file path
CREATE OR REPLACE FUNCTION get_company_file_path(company_id UUID, filename TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN company_id::text || '/' || filename;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upload watch image
CREATE OR REPLACE FUNCTION upload_watch_image(
  watch_id UUID,
  file_data BYTEA,
  filename TEXT,
  content_type TEXT
)
RETURNS TEXT AS $$
DECLARE
  company_id UUID;
  file_path TEXT;
  file_url TEXT;
BEGIN
  -- Get company_id from watch
  SELECT w.company_id INTO company_id
  FROM watches w
  WHERE w.id = watch_id;
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Watch not found';
  END IF;
  
  -- Check if user has access to this company
  IF NOT (is_master_user() OR company_id = get_user_company_id()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Create file path
  file_path := get_company_file_path(company_id, filename);
  
  -- Upload file
  INSERT INTO storage.objects (bucket_id, name, owner, metadata)
  VALUES ('watches', file_path, auth.uid(), jsonb_build_object('contentType', content_type));
  
  -- Get file URL
  SELECT storage.public_url('watches', file_path) INTO file_url;
  
  -- Update watch with image URL
  UPDATE watches 
  SET image_url = file_url
  WHERE id = watch_id;
  
  RETURN file_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upload invoice
CREATE OR REPLACE FUNCTION upload_invoice(
  order_id UUID,
  file_data BYTEA,
  filename TEXT
)
RETURNS TEXT AS $$
DECLARE
  company_id UUID;
  file_path TEXT;
  file_url TEXT;
BEGIN
  -- Get company_id from order
  SELECT o.company_id INTO company_id
  FROM orders o
  WHERE o.id = order_id;
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;
  
  -- Check if user has access to this company
  IF NOT (is_master_user() OR company_id = get_user_company_id()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Create file path
  file_path := get_company_file_path(company_id, filename);
  
  -- Upload file
  INSERT INTO storage.objects (bucket_id, name, owner, metadata)
  VALUES ('invoices', file_path, auth.uid(), jsonb_build_object('contentType', 'application/pdf'));
  
  -- Get file URL
  SELECT storage.public_url('invoices', file_path) INTO file_url;
  
  -- Update order with invoice URL
  UPDATE orders 
  SET invoice_url = file_url
  WHERE id = order_id;
  
  RETURN file_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
