require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function setupImageStorage() {
  console.log('🖼️ Setting up image storage for Timestack...');
  
  try {
    // Create storage bucket for images
    const { data: bucket, error: bucketError } = await supabase.storage
      .createBucket('timestack-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      });
    
    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Storage bucket "timestack-images" already exists');
      } else {
        console.log('❌ Error creating storage bucket:', bucketError.message);
        return;
      }
    } else {
      console.log('✅ Storage bucket "timestack-images" created successfully');
    }
    
    // Set up RLS policies for storage
    const { error: policyError } = await supabase.rpc('exec', {
      sql: `
        -- Create policy for authenticated users to upload images
        CREATE POLICY "Users can upload images to their company folder" ON storage.objects
          FOR INSERT WITH CHECK (
            bucket_id = 'timestack-images' AND
            auth.role() = 'authenticated' AND
            (storage.foldername(name))[1] = (auth.jwt() ->> 'company_id')
          );
        
        -- Create policy for authenticated users to view images from their company
        CREATE POLICY "Users can view images from their company" ON storage.objects
          FOR SELECT USING (
            bucket_id = 'timestack-images' AND
            auth.role() = 'authenticated' AND
            (storage.foldername(name))[1] = (auth.jwt() ->> 'company_id')
          );
        
        -- Create policy for authenticated users to update their images
        CREATE POLICY "Users can update images from their company" ON storage.objects
          FOR UPDATE USING (
            bucket_id = 'timestack-images' AND
            auth.role() = 'authenticated' AND
            (storage.foldername(name))[1] = (auth.jwt() ->> 'company_id')
          );
        
        -- Create policy for authenticated users to delete their images
        CREATE POLICY "Users can delete images from their company" ON storage.objects
          FOR DELETE USING (
            bucket_id = 'timestack-images' AND
            auth.role() = 'authenticated' AND
            (storage.foldername(name))[1] = (auth.jwt() ->> 'company_id')
          );
      `
    });
    
    if (policyError) {
      console.log('❌ Error creating storage policies:', policyError.message);
    } else {
      console.log('✅ Storage RLS policies created successfully');
    }
    
    // Test image upload
    console.log('🧪 Testing image upload...');
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('timestack-images')
      .upload('test/test.txt', testFile);
    
    if (uploadError) {
      console.log('❌ Error testing upload:', uploadError.message);
    } else {
      console.log('✅ Test upload successful:', uploadData.path);
      
      // Clean up test file
      await supabase.storage
        .from('timestack-images')
        .remove(['test/test.txt']);
      console.log('✅ Test file cleaned up');
    }
    
    console.log('\n🎉 Image storage setup complete!');
    console.log('📁 Bucket: timestack-images');
    console.log('🔒 RLS policies: Enabled');
    console.log('📏 File size limit: 10MB');
    console.log('📄 Allowed types: Images (JPEG, PNG, GIF, WebP) and PDFs');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

setupImageStorage();
