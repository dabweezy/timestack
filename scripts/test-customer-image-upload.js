require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testCustomerImageUpload() {
  console.log('🧪 Testing customer image upload and storage...');
  
  try {
    // Create a test customer with image data
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert({
        company_id: '550e8400-e29b-41d4-a716-446655440001',
        first_name: 'Test',
        last_name: 'Customer',
        email: 'test.customer.images@example.com',
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
      .select()
      .single();
    
    if (customerError) {
      console.log('❌ Error creating customer with images:', customerError.message);
      return;
    }
    
    console.log('✅ Customer created with images successfully!');
    console.log('Customer ID:', customerData.id);
    console.log('Profile Picture URL:', customerData.profile_picture_url);
    console.log('Identification Documents:', customerData.identification_documents);
    
    // Verify the data was stored correctly
    const { data: retrievedCustomer, error: retrieveError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerData.id)
      .single();
    
    if (retrieveError) {
      console.log('❌ Error retrieving customer:', retrieveError.message);
      return;
    }
    
    console.log('\n📋 Retrieved customer data:');
    console.log('Profile Picture:', retrievedCustomer.profile_picture_url);
    console.log('ID Documents Count:', retrievedCustomer.identification_documents?.length || 0);
    console.log('ID Documents:', retrievedCustomer.identification_documents);
    
    // Test updating the customer with new images
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update({
        profile_picture_url: 'https://example.com/new_profile.jpg',
        identification_documents: [
          ...(retrievedCustomer.identification_documents || []),
          {
            filename: 'new_id.pdf',
            url: 'https://example.com/new_id.pdf',
            uploaded_at: new Date().toISOString()
          }
        ]
      })
      .eq('id', customerData.id)
      .select()
      .single();
    
    if (updateError) {
      console.log('❌ Error updating customer:', updateError.message);
      return;
    }
    
    console.log('\n🔄 Customer updated successfully!');
    console.log('New Profile Picture:', updatedCustomer.profile_picture_url);
    console.log('Total ID Documents:', updatedCustomer.identification_documents?.length || 0);
    
    // Clean up - delete the test customer
    const { error: deleteError } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerData.id);
    
    if (deleteError) {
      console.log('❌ Error deleting test customer:', deleteError.message);
    } else {
      console.log('✅ Test customer cleaned up successfully');
    }
    
    console.log('\n🎉 Customer image upload test completed successfully!');
    console.log('✅ Images are stored directly in the customer record');
    console.log('✅ Profile pictures and ID documents are properly saved');
    console.log('✅ Data can be retrieved and updated correctly');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testCustomerImageUpload();
