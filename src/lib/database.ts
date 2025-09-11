import { supabase } from './supabase'
import type { Customer, WatchProduct, Order } from '@/types'

// Image upload service
export const imageService = {
  async uploadImage(file: File, category: string, entityType: string, entityId: string): Promise<string> {
    // Get current user's company_id
    const { data: { user } } = await supabase.auth.getUser()
    const companyId = user?.user_metadata?.company_id || '550e8400-e29b-41d4-a716-446655440001'
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${entityType}_${entityId}_${Date.now()}.${fileExt}`
    const filePath = `${companyId}/${category}/${fileName}`
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('timestack-images')
      .upload(filePath, file)
    
    if (error) throw error
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('timestack-images')
      .getPublicUrl(filePath)
    
    // Save image metadata to database
    const { error: dbError } = await supabase
      .from('images')
      .insert({
        company_id: companyId,
        filename: fileName,
        original_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        url: publicUrl,
        category,
        entity_type: entityType,
        entity_id: entityId
      })
    
    if (dbError) throw dbError
    
    return publicUrl
  },

  async getImages(entityType: string, entityId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async deleteImage(imageId: string): Promise<void> {
    // Get image record first
    const { data: image, error: fetchError } = await supabase
      .from('images')
      .select('*')
      .eq('id', imageId)
      .single()
    
    if (fetchError) throw fetchError
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('timestack-images')
      .remove([image.filename])
    
    if (storageError) throw storageError
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId)
    
    if (dbError) throw dbError
  }
}

// Customer operations
export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data?.map(customer => ({
      id: customer.id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      mobile: customer.mobile,
      address1: customer.address1,
      address2: customer.address2,
      city: customer.city,
      postcode: customer.postcode,
      country: customer.country,
      sortCode: customer.sort_code,
      accountNumber: customer.account_number,
      bankName: customer.bank_name,
      iban: customer.iban,
      swift: customer.swift,
      profilePicture: customer.profile_picture_url,
      identificationDocuments: customer.identification_documents || [],
      dateAdded: customer.created_at
    })) || []
  },

  async create(customer: Omit<Customer, 'id'>): Promise<Customer> {
    // Get current user's company_id from JWT
    const { data: { user } } = await supabase.auth.getUser()
    const companyId = user?.user_metadata?.company_id || '550e8400-e29b-41d4-a716-446655440001' // Default company
    
    const { data, error } = await supabase
      .from('customers')
      .insert({
        company_id: companyId,
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        mobile: customer.mobile,
        address1: customer.address1,
        address2: customer.address2,
        city: customer.city,
        postcode: customer.postcode,
        country: customer.country,
        sort_code: customer.sortCode,
        account_number: customer.accountNumber,
        bank_name: customer.bankName,
        iban: customer.iban,
        swift: customer.swift,
        profile_picture_url: customer.profilePicture,
        identification_documents: customer.identificationDocuments || []
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      mobile: data.mobile,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      postcode: data.postcode,
      country: data.country,
      sortCode: data.sort_code,
      accountNumber: data.account_number,
      bankName: data.bank_name,
      iban: data.iban,
      swift: data.swift,
      profilePicture: data.profile_picture_url,
      identificationDocuments: data.identification_documents || [],
      dateAdded: data.created_at
    }
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        email: updates.email,
        mobile: updates.mobile,
        address1: updates.address1,
        address2: updates.address2,
        city: updates.city,
        postcode: updates.postcode,
        country: updates.country,
        sort_code: updates.sortCode,
        account_number: updates.accountNumber,
        bank_name: updates.bankName,
        iban: updates.iban,
        swift: updates.swift,
        profile_picture_url: updates.profilePicture,
        identification_documents: updates.identificationDocuments || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      mobile: data.mobile,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      postcode: data.postcode,
      country: data.country,
      sortCode: data.sort_code,
      accountNumber: data.account_number,
      bankName: data.bank_name,
      iban: data.iban,
      swift: data.swift,
      profilePicture: data.profile_picture_url,
      identificationDocuments: data.identification_documents || [],
      dateAdded: data.created_at
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Product operations
export const productService = {
  async getAll(): Promise<WatchProduct[]> {
    const { data, error } = await supabase
      .from('watches')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data?.map(product => ({
      id: product.id,
      brand: product.brand,
      model: product.model,
      reference: product.reference,
      serial: product.serial,
      material: product.material,
      dialColor: product.dial_color,
      condition: product.condition,
      yearManufactured: product.year_manufactured,
      set: product.set,
      costPrice: product.cost_price,
      tradePrice: product.trade_price,
      retailPrice: product.retail_price,
      description: product.description,
      dateAdded: product.date_added,
      status: product.status,
      assignedCustomer: product.assigned_customer
    })) || []
  },

  async create(product: Omit<WatchProduct, 'id'>): Promise<WatchProduct> {
    // Get current user's company_id from JWT
    const { data: { user } } = await supabase.auth.getUser()
    const companyId = user?.user_metadata?.company_id || '550e8400-e29b-41d4-a716-446655440001' // Default company
    
    const { data, error } = await supabase
      .from('watches')
      .insert({
        company_id: companyId,
        brand: product.brand,
        model: product.model,
        reference: product.reference,
        serial: product.serial,
        material: product.material,
        dial_color: product.dialColor,
        condition: product.condition,
        year_manufactured: product.yearManufactured,
        set_type: product.set,
        cost_price: product.costPrice,
        trade_price: product.tradePrice,
        retail_price: product.retailPrice,
        description: product.description,
        date_added: product.dateAdded,
        status: product.status,
        assigned_customer: product.assignedCustomer
      })
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      brand: data.brand,
      model: data.model,
      reference: data.reference,
      serial: data.serial,
      material: data.material,
      dialColor: data.dial_color,
      condition: data.condition,
      yearManufactured: data.year_manufactured,
      set: data.set_type,
      costPrice: data.cost_price,
      tradePrice: data.trade_price,
      retailPrice: data.retail_price,
      description: data.description,
      dateAdded: data.date_added,
      status: data.status,
      assignedCustomer: data.assigned_customer
    }
  },

  async update(id: string, updates: Partial<WatchProduct>): Promise<WatchProduct> {
    const { data, error } = await supabase
      .from('watches')
      .update({
        brand: updates.brand,
        model: updates.model,
        reference: updates.reference,
        serial: updates.serial,
        material: updates.material,
        dial_color: updates.dialColor,
        condition: updates.condition,
        year_manufactured: updates.yearManufactured,
        set: updates.set,
        cost_price: updates.costPrice,
        trade_price: updates.tradePrice,
        retail_price: updates.retailPrice,
        description: updates.description,
        date_added: updates.dateAdded,
        status: updates.status,
        assigned_customer: updates.assignedCustomer,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      brand: data.brand,
      model: data.model,
      reference: data.reference,
      serial: data.serial,
      material: data.material,
      dialColor: data.dial_color,
      condition: data.condition,
      yearManufactured: data.year_manufactured,
      set: data.set_type,
      costPrice: data.cost_price,
      tradePrice: data.trade_price,
      retailPrice: data.retail_price,
      description: data.description,
      dateAdded: data.date_added,
      status: data.status,
      assignedCustomer: data.assigned_customer
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('watches')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Order operations
export const orderService = {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        watch:watches(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return data?.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      orderType: order.order_type,
      customer: order.customer ? {
        id: order.customer.id,
        firstName: order.customer.first_name,
        lastName: order.customer.last_name,
        email: order.customer.email,
        mobile: order.customer.mobile,
        address1: order.customer.address1,
        address2: order.customer.address2,
        city: order.customer.city,
        postcode: order.customer.postcode,
        country: order.customer.country,
        dateAdded: order.customer.date_added || new Date().toISOString()
      } : null,
      watch: {
        id: order.watch.id,
        brand: order.watch.brand,
        model: order.watch.model,
        reference: order.watch.reference,
        serial: order.watch.serial,
        material: order.watch.material,
        dialColor: order.watch.dial_color,
        condition: order.watch.condition,
        yearManufactured: order.watch.year_manufactured,
        set: order.watch.set_type,
        costPrice: order.watch.cost_price,
        tradePrice: order.watch.trade_price,
        retailPrice: order.watch.retail_price,
        description: order.watch.description,
        dateAdded: order.watch.date_added,
        status: order.watch.status,
        assignedCustomer: order.watch.assigned_customer
      },
      product: {
        id: order.watch.id,
        brand: order.watch.brand,
        model: order.watch.model,
        reference: order.watch.reference,
        serial: order.watch.serial,
        material: order.watch.material,
        dialColor: order.watch.dial_color,
        condition: order.watch.condition,
        yearManufactured: order.watch.year_manufactured,
        set: order.watch.set_type,
        costPrice: order.watch.cost_price,
        tradePrice: order.watch.trade_price,
        retailPrice: order.watch.retail_price,
        description: order.watch.description,
        dateAdded: order.watch.date_added,
        status: order.watch.status,
        assignedCustomer: order.watch.assigned_customer
      },
      salePrice: order.sale_price,
      paymentMethod: order.payment_method,
      status: order.status,
      date: order.date,
      timestamp: order.timestamp,
      notes: order.notes
    })) || []
  },

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    // Get current user's company_id from JWT
    const { data: { user } } = await supabase.auth.getUser()
    const companyId = user?.user_metadata?.company_id || '550e8400-e29b-41d4-a716-446655440001' // Default company
    
    const { data, error } = await supabase
      .from('orders')
      .insert({
        company_id: companyId,
        order_number: order.orderNumber,
        order_type: order.orderType,
        customer_id: order.customer?.id || null,
        watch_id: order.product.id,
        sale_price: order.salePrice,
        payment_method: order.paymentMethod,
        status: order.status,
        date: order.date,
        timestamp: order.timestamp,
        notes: order.notes
      })
      .select(`
        *,
        customer:customers(*),
        watch:watches(*)
      `)
      .single()
    
    if (error) throw error
    
    return {
      id: data.id,
      orderNumber: data.order_number,
      orderType: data.order_type,
      customer: data.customer ? {
        id: data.customer.id,
        firstName: data.customer.first_name,
        lastName: data.customer.last_name,
        email: data.customer.email,
        mobile: data.customer.mobile,
        address1: data.customer.address1,
        address2: data.customer.address2,
        city: data.customer.city,
        postcode: data.customer.postcode,
        country: data.customer.country,
        dateAdded: data.customer.date_added || new Date().toISOString()
      } : null,
      watch: {
        id: data.product.id,
        brand: data.product.brand,
        model: data.product.model,
        reference: data.product.reference,
        serial: data.product.serial,
        material: data.product.material,
        dialColor: data.product.dial_color,
        condition: data.product.condition,
        yearManufactured: data.product.year_manufactured,
        set: data.product.set_type,
        costPrice: data.product.cost_price,
        tradePrice: data.product.trade_price,
        retailPrice: data.product.retail_price,
        description: data.product.description,
        dateAdded: data.product.date_added,
        status: data.product.status,
        assignedCustomer: data.product.assigned_customer
      },
      product: {
        id: data.product.id,
        brand: data.product.brand,
        model: data.product.model,
        reference: data.product.reference,
        serial: data.product.serial,
        material: data.product.material,
        dialColor: data.product.dial_color,
        condition: data.product.condition,
        yearManufactured: data.product.year_manufactured,
        set: data.product.set_type,
        costPrice: data.product.cost_price,
        tradePrice: data.product.trade_price,
        retailPrice: data.product.retail_price,
        description: data.product.description,
        dateAdded: data.product.date_added,
        status: data.product.status,
        assignedCustomer: data.product.assigned_customer
      },
      salePrice: data.sale_price,
      paymentMethod: data.payment_method,
      status: data.status,
      date: data.date,
      timestamp: data.timestamp,
      notes: data.notes
    }
  }
}
