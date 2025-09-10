import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          email: string
          mobile: string
          address1: string
          address2?: string
          city: string
          postcode: string
          country: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          email: string
          mobile: string
          address1: string
          address2?: string
          city: string
          postcode: string
          country: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          email?: string
          mobile?: string
          address1?: string
          address2?: string
          city?: string
          postcode?: string
          country?: string
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          brand: string
          model: string
          reference: string
          serial: string
          material: string
          dial_color: string
          condition: 'New' | 'Excellent' | 'Very Good' | 'Good' | 'Fair'
          year_manufactured: number
          set: string
          cost_price: number
          trade_price: number
          retail_price: number
          description?: string
          date_added: string
          status: 'available' | 'sold' | 'reserved' | 'consignment'
          assigned_customer?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          brand: string
          model: string
          reference: string
          serial: string
          material: string
          dial_color: string
          condition: 'New' | 'Excellent' | 'Very Good' | 'Good' | 'Fair'
          year_manufactured: number
          set: string
          cost_price: number
          trade_price: number
          retail_price: number
          description?: string
          date_added: string
          status: 'available' | 'sold' | 'reserved' | 'consignment'
          assigned_customer?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          brand?: string
          model?: string
          reference?: string
          serial?: string
          material?: string
          dial_color?: string
          condition?: 'New' | 'Excellent' | 'Very Good' | 'Good' | 'Fair'
          year_manufactured?: number
          set?: string
          cost_price?: number
          trade_price?: number
          retail_price?: number
          description?: string
          date_added?: string
          status?: 'available' | 'sold' | 'reserved' | 'consignment'
          assigned_customer?: string
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          order_number: string
          order_type: 'purchase' | 'sale'
          customer_id: string
          product_id: string
          sale_price: number
          payment_method: 'cash' | 'card' | 'bank_transfer'
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          date: string
          timestamp: string
          notes?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          order_number: string
          order_type: 'purchase' | 'sale'
          customer_id: string
          product_id: string
          sale_price: number
          payment_method: 'cash' | 'card' | 'bank_transfer'
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          date: string
          timestamp: string
          notes?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          order_number?: string
          order_type?: 'purchase' | 'sale'
          customer_id?: string
          product_id?: string
          sale_price?: number
          payment_method?: 'cash' | 'card' | 'bank_transfer'
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          date?: string
          timestamp?: string
          notes?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          profile_picture?: string
          company_name: string
          mobile_number: string
          email_address: string
          vat_number: string
          registered_address: {
            line1: string
            line2?: string
            city: string
            postcode: string
            country: string
          }
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          profile_picture?: string
          company_name: string
          mobile_number: string
          email_address: string
          vat_number: string
          registered_address: {
            line1: string
            line2?: string
            city: string
            postcode: string
            country: string
          }
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          profile_picture?: string
          company_name?: string
          mobile_number?: string
          email_address?: string
          vat_number?: string
          registered_address?: {
            line1: string
            line2?: string
            city: string
            postcode: string
            country: string
          }
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
