require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testImageFields() {
  console.log('🧪 Testing image fields...');
  
  try {
    // Test customers table with image fields
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert({
        company_id: '550e8400-e29b-41d4-a716-446655440001',
        first_name: 'Test',
        last_name: 'Customer',
        email: 'test.customer@example.com',
        mobile: '+1234567890',
        address1: '123 Test St',
        city: 'Test City',
        postcode: '12345',
        country: 'USA',
        profile_picture_url: 'https://example.com/profile.jpg',
        identification_documents: [
          {
            filename: 'passport.jpg',
            url: 'https://example.com/passport.jpg',
            uploaded_at: new Date().toISOString()
          },
          {
            filename: 'drivers_license.pdf',
            url: 'https://example.com/drivers_license.pdf',
            uploaded_at: new Date().toISOString()
          }
        ]
      })
      .select();
    
    if (customerError) {
      console.log('❌ Error creating customer with images:', customerError.message);
    } else {
      console.log('✅ Customer with images created successfully:', customerData[0].id);
      console.log('Profile picture URL:', customerData[0].profile_picture_url);
      console.log('Identification documents:', customerData[0].identification_documents);
    }
    
    // Test watches table with multiple images
    const { data: watchData, error: watchError } = await supabase
      .from('watches')
      .insert({
        company_id: '550e8400-e29b-41d4-a716-446655440001',
        brand: 'Rolex',
        model: 'Submariner',
        reference: '116610LN',
        material: 'Stainless Steel',
        dial_color: 'Black',
        condition: 'Excellent',
        year_manufactured: 2020,
        set_type: 'Box & Papers',
        cost_price: 5000,
        trade_price: 5000,
        retail_price: 7500,
        status: 'available',
        image_url: 'https://example.com/watch_main.jpg',
        images: [
          {
            filename: 'watch_front.jpg',
            url: 'https://example.com/watch_front.jpg',
            uploaded_at: new Date().toISOString(),
            is_primary: true
          },
          {
            filename: 'watch_side.jpg',
            url: 'https://example.com/watch_side.jpg',
            uploaded_at: new Date().toISOString(),
            is_primary: false
          },
          {
            filename: 'watch_back.jpg',
            url: 'https://example.com/watch_back.jpg',
            uploaded_at: new Date().toISOString(),
            is_primary: false
          }
        ]
      })
      .select();
    
    if (watchError) {
      console.log('❌ Error creating watch with images:', watchError.message);
    } else {
      console.log('✅ Watch with images created successfully:', watchData[0].id);
      console.log('Main image URL:', watchData[0].image_url);
      console.log('Additional images:', watchData[0].images);
    }
    
    // Test images table
    const { data: imageData, error: imageError } = await supabase
      .from('images')
      .insert({
        company_id: '550e8400-e29b-41d4-a716-446655440001',
        filename: 'test_image.jpg',
        original_name: 'my_watch_photo.jpg',
        file_size: 1024000,
        mime_type: 'image/jpeg',
        url: 'https://example.com/test_image.jpg',
        category: 'product_image',
        entity_type: 'watch',
        entity_id: watchData[0].id,
        width: 1920,
        height: 1080,
        metadata: {
          camera: 'iPhone 13',
          location: 'Studio',
          edited: false
        }
      })
      .select();
    
    if (imageError) {
      console.log('❌ Error creating image record:', imageError.message);
    } else {
      console.log('✅ Image record created successfully:', imageData[0].id);
      console.log('Image metadata:', imageData[0].metadata);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testImageFields();
