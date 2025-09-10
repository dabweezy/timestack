-- Add Sample Data for Multi-Tenant SaaS
-- Run this in your Supabase SQL Editor

-- =============================================
-- SAMPLE COMPANIES
-- =============================================
INSERT INTO companies (id, name, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Luxury Watch Co', NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Timepiece Emporium', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Elite Watches', NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SAMPLE CUSTOMERS
-- =============================================
INSERT INTO customers (id, company_id, first_name, last_name, email, mobile, address1, address2, city, postcode, country, notes, created_at) VALUES
  -- Luxury Watch Co customers
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'John', 'Smith', 'john.smith@email.com', '+1-555-0101', '123 Main St', 'Suite 100', 'New York', '10001', 'USA', 'VIP customer', NOW()),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '+1-555-0102', '456 Oak Ave', NULL, 'Los Angeles', '90210', 'USA', 'Regular customer', NOW()),
  
  -- Timepiece Emporium customers
  ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Emma', 'Davis', 'emma.davis@email.com', '+1-555-0201', '321 Elm St', NULL, 'Miami', '33101', 'USA', 'New customer', NOW()),
  
  -- Elite Watches customers
  ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'Lisa', 'Anderson', 'lisa.anderson@email.com', '+1-555-0301', '987 Cedar St', 'Floor 3', 'Boston', '02101', 'USA', 'Luxury collector', NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SAMPLE WATCHES
-- =============================================
INSERT INTO watches (id, company_id, brand, model, reference, serial, material, dial_color, condition, year_manufactured, set_type, cost_price, trade_price, retail_price, description, date_added, status, created_at) VALUES
  -- Luxury Watch Co watches
  ('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Rolex', 'Submariner', '126610LN', 'R123456789', 'Stainless Steel', 'Black', 'Excellent', 2023, 'Full Set', 8500.00, 10000.00, 12000.00, 'Pristine condition Submariner with complete box and papers', NOW(), 'available', NOW()),
  ('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Omega', 'Speedmaster', '311.30.42.30.01.005', 'O987654321', 'Stainless Steel', 'Black', 'Very Good', 2022, 'Full Set', 4500.00, 5500.00, 6500.00, 'Classic Speedmaster Moonwatch with original bracelet', NOW(), 'available', NOW()),
  
  -- Timepiece Emporium watches
  ('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Audemars Piguet', 'Royal Oak', '15400ST.OO.1220ST.01', 'AP111222333', 'Stainless Steel', 'Blue', 'Excellent', 2023, 'Full Set', 18000.00, 22000.00, 25000.00, 'Iconic Royal Oak in stainless steel', NOW(), 'available', NOW()),
  
  -- Elite Watches watches
  ('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'Vacheron Constantin', 'Overseas', '4500V/110A-B128', 'VC777888999', 'Stainless Steel', 'Blue', 'Excellent', 2023, 'Full Set', 22000.00, 26000.00, 30000.00, 'Luxury sports watch with integrated bracelet', NOW(), 'available', NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SAMPLE ORDERS
-- =============================================
INSERT INTO orders (id, company_id, order_number, order_type, customer_id, watch_id, sale_price, payment_method, status, date, timestamp, notes, created_at) VALUES
  -- Luxury Watch Co orders
  ('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'LW-2024-001', 'sale', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 12000.00, 'card', 'completed', '2024-01-16', NOW(), 'Customer very satisfied with purchase', NOW()),
  ('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'LW-2024-002', 'purchase', '650e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 4500.00, 'bank_transfer', 'completed', '2024-01-21', NOW(), 'Purchased from dealer', NOW()),
  
  -- Timepiece Emporium orders
  ('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'TE-2024-001', 'sale', '650e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 25000.00, 'bank_transfer', 'completed', '2024-02-02', NOW(), 'High-value sale, verified payment', NOW()),
  
  -- Elite Watches orders
  ('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'EW-2024-001', 'purchase', '650e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', 22000.00, 'cheque', 'completed', '2024-02-11', NOW(), 'Consignment piece from collector', NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SAMPLE TRANSACTIONS
-- =============================================
INSERT INTO transactions (id, company_id, order_id, type, amount, description, reference, status, created_at) VALUES
  -- Luxury Watch Co transactions
  ('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 'sale', 12000.00, 'Sale of Rolex Submariner', 'LW-2024-001', 'completed', NOW()),
  ('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002', 'purchase', -4500.00, 'Purchase of Omega Speedmaster', 'LW-2024-002', 'completed', NOW()),
        
  -- Timepiece Emporium transactions
  ('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440003', 'sale', 25000.00, 'Sale of Audemars Piguet Royal Oak', 'TE-2024-001', 'completed', NOW()),
  
  -- Elite Watches transactions
  ('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440004', 'purchase', -22000.00, 'Purchase of Vacheron Constantin Overseas', 'EW-2024-001', 'completed', NOW())
ON CONFLICT (id) DO NOTHING;
