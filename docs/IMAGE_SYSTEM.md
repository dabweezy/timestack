# Timestack Image System

This document explains how the image system works in Timestack and how to set it up.

## Overview

The Timestack system now supports comprehensive image storage and management for:
- **Customer Profile Pictures** - Profile photos for customers
- **Identification Documents** - Passports, driving licenses, etc.
- **Product Images** - Multiple images per watch/product
- **Receipt Images** - PDF receipts and invoices

## Database Schema

### New Fields Added

#### Customers Table
- `profile_picture_url` (TEXT) - URL to customer's profile picture
- `identification_documents` (JSONB) - Array of identification document metadata

#### Watches Table
- `images` (JSONB) - Array of product image metadata (in addition to existing `image_url`)

#### Orders Table
- `receipt_url` (TEXT) - URL to receipt/invoice PDF
- `additional_documents` (JSONB) - Array of additional document metadata

### New Images Table
A dedicated table for comprehensive image management:

```sql
CREATE TABLE images (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Image metadata
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  url TEXT NOT NULL,
  
  -- Categorization
  category TEXT CHECK (category IN ('profile_picture', 'product_image', 'identification', 'receipt', 'other')),
  entity_type TEXT CHECK (entity_type IN ('customer', 'watch', 'order', 'company')),
  entity_id UUID NOT NULL,
  
  -- Optional metadata
  width INTEGER,
  height INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb
);
```

## Storage Structure

Images are stored in Supabase Storage with the following structure:

```
timestack-images/
├── {company_id}/
│   ├── profile_picture/
│   │   └── customer_{id}_{timestamp}.jpg
│   ├── product_image/
│   │   └── watch_{id}_{timestamp}.jpg
│   ├── identification/
│   │   └── customer_{id}_{timestamp}.pdf
│   └── receipt/
│       └── order_{id}_{timestamp}.pdf
```

## Setup Instructions

### 1. Run Database Migration
Execute the SQL in `scripts/add-image-fields.sql` in your Supabase SQL editor:

```sql
-- Add image fields to existing tables
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS identification_documents JSONB DEFAULT '[]'::jsonb;

ALTER TABLE watches 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS receipt_url TEXT,
ADD COLUMN IF NOT EXISTS additional_documents JSONB DEFAULT '[]'::jsonb;

-- Create images table (see full SQL in the file)
```

### 2. Set Up Storage Bucket
Run the storage setup script:

```bash
node scripts/setup-image-storage.js
```

This will:
- Create the `timestack-images` storage bucket
- Set up RLS policies for multi-tenant security
- Configure file size limits (10MB) and allowed MIME types

### 3. Test the System
Run the test script to verify everything works:

```bash
node scripts/test-image-fields.js
```

## API Usage

### Image Service

The `imageService` provides methods for image management:

```typescript
import { imageService } from '@/lib/database'

// Upload an image
const imageUrl = await imageService.uploadImage(
  file,                    // File object
  'profile_picture',       // Category
  'customer',             // Entity type
  customerId              // Entity ID
)

// Get images for an entity
const images = await imageService.getImages('customer', customerId)

// Delete an image
await imageService.deleteImage(imageId)
```

### Customer Service Updates

The customer service now includes image fields:

```typescript
const customer = {
  // ... existing fields
  profilePicture: 'https://...',
  identificationDocuments: [
    {
      filename: 'passport.jpg',
      url: 'https://...',
      uploaded_at: '2024-01-01T00:00:00Z'
    }
  ]
}
```

## Security

- **Multi-tenant**: Each company can only access their own images
- **RLS Policies**: Row-level security ensures data isolation
- **File Validation**: Only allowed MIME types and file sizes
- **Secure URLs**: Images are served through Supabase's CDN

## File Limits

- **Maximum file size**: 10MB
- **Allowed types**: JPEG, PNG, GIF, WebP, PDF
- **Storage**: Supabase Storage with CDN
- **Retention**: Images are kept until manually deleted

## Frontend Integration

The existing FileUpload component automatically handles:
- Image preview
- File validation
- Upload progress
- Error handling
- Multi-file support

## Troubleshooting

### Common Issues

1. **Storage bucket not found**: Run `setup-image-storage.js`
2. **Permission denied**: Check RLS policies are set up correctly
3. **File too large**: Check file size limits in bucket settings
4. **Invalid MIME type**: Ensure file type is in allowed list

### Debug Commands

```bash
# Check storage bucket
node -e "console.log(await supabase.storage.listBuckets())"

# Test image upload
node scripts/test-image-fields.js

# Check database schema
node -e "console.log(await supabase.from('images').select('*').limit(1))"
```
