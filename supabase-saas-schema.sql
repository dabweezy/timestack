-- Multi-Tenant SaaS Schema for Watch Businesses
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- COMPANIES TABLE
-- =============================================
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{}',
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'suspended', 'cancelled')),
  subscription_plan TEXT DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'premium', 'enterprise'))
);

-- =============================================
-- BUSINESS TABLES (Multi-tenant)
-- =============================================

-- Customers table
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United Kingdom',
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked'))
);

-- Watches table (renamed from products)
CREATE TABLE watches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  reference TEXT NOT NULL,
  serial TEXT NOT NULL,
  material TEXT NOT NULL,
  dial_color TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('New', 'Excellent', 'Very Good', 'Good', 'Fair')),
  year_manufactured INTEGER NOT NULL,
  set_type TEXT NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  trade_price DECIMAL(10,2) NOT NULL,
  retail_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  date_added TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'consignment')),
  assigned_customer_id UUID REFERENCES customers(id),
  image_url TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_number TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('purchase', 'sale')),
  customer_id UUID NOT NULL REFERENCES customers(id),
  watch_id UUID NOT NULL REFERENCES watches(id),
  sale_price DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'cheque')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  date TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  invoice_url TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Transactions table (for financial tracking)
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id UUID REFERENCES orders(id),
  type TEXT NOT NULL CHECK (type IN ('sale', 'purchase', 'refund', 'adjustment')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  reference TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  metadata JSONB DEFAULT '{}'
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Company indexes
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_subscription_status ON companies(subscription_status);

-- Customer indexes
CREATE INDEX idx_customers_company_id ON customers(company_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_name ON customers(first_name, last_name);
CREATE INDEX idx_customers_status ON customers(status);

-- Watch indexes
CREATE INDEX idx_watches_company_id ON watches(company_id);
CREATE INDEX idx_watches_brand ON watches(brand);
CREATE INDEX idx_watches_model ON watches(model);
CREATE INDEX idx_watches_status ON watches(status);
CREATE INDEX idx_watches_serial ON watches(serial);
CREATE INDEX idx_watches_assigned_customer ON watches(assigned_customer_id);

-- Order indexes
CREATE INDEX idx_orders_company_id ON orders(company_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_watch_id ON orders(watch_id);
CREATE INDEX idx_orders_order_type ON orders(order_type);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_timestamp ON orders(timestamp);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Transaction indexes
CREATE INDEX idx_transactions_company_id ON transactions(company_id);
CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- =============================================
-- UPDATED_AT TRIGGERS
-- =============================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watches_updated_at BEFORE UPDATE ON watches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's company_id
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
BEGIN
  RETURN (auth.jwt() ->> 'company_id')::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is master
CREATE OR REPLACE FUNCTION is_master_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'role') = 'master';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Companies policies
CREATE POLICY "Master users can access all companies" ON companies
  FOR ALL USING (is_master_user());

CREATE POLICY "Users can access their own company" ON companies
  FOR ALL USING (id = get_user_company_id());

-- Customers policies
CREATE POLICY "Master users can access all customers" ON customers
  FOR ALL USING (is_master_user());

CREATE POLICY "Users can access customers from their company" ON customers
  FOR ALL USING (company_id = get_user_company_id());

-- Watches policies
CREATE POLICY "Master users can access all watches" ON watches
  FOR ALL USING (is_master_user());

CREATE POLICY "Users can access watches from their company" ON watches
  FOR ALL USING (company_id = get_user_company_id());

-- Orders policies
CREATE POLICY "Master users can access all orders" ON orders
  FOR ALL USING (is_master_user());

CREATE POLICY "Users can access orders from their company" ON orders
  FOR ALL USING (company_id = get_user_company_id());

-- Transactions policies
CREATE POLICY "Master users can access all transactions" ON transactions
  FOR ALL USING (is_master_user());

CREATE POLICY "Users can access transactions from their company" ON transactions
  FOR ALL USING (company_id = get_user_company_id());

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert sample companies
INSERT INTO companies (id, name, subscription_plan) VALUES
('11111111-1111-1111-1111-111111111111', 'Timestack Master', 'enterprise'),
('22222222-2222-2222-2222-222222222222', 'Luxury Watches Ltd', 'premium'),
('33333333-3333-3333-3333-333333333333', 'Timepiece Co', 'basic');

-- Insert sample customers for company 2
INSERT INTO customers (company_id, first_name, last_name, email, mobile, address1, city, postcode, country) VALUES
('22222222-2222-2222-2222-222222222222', 'John', 'Smith', 'john.smith@luxurywatches.com', '+44 20 7123 4567', '123 High Street', 'London', 'SW1A 1AA', 'United Kingdom'),
('22222222-2222-2222-2222-222222222222', 'Sarah', 'Johnson', 'sarah.johnson@luxurywatches.com', '+44 20 7123 4568', '456 Queen Street', 'Manchester', 'M1 1AA', 'United Kingdom');

-- Insert sample customers for company 3
INSERT INTO customers (company_id, first_name, last_name, email, mobile, address1, city, postcode, country) VALUES
('33333333-3333-3333-3333-333333333333', 'Michael', 'Brown', 'michael.brown@timepiece.com', '+44 20 7123 4569', '789 King Road', 'Birmingham', 'B1 1AA', 'United Kingdom'),
('33333333-3333-3333-3333-333333333333', 'Emma', 'Davis', 'emma.davis@timepiece.com', '+44 20 7123 4570', '321 Prince Avenue', 'Leeds', 'LS1 1AA', 'United Kingdom');

-- Insert sample watches for company 2
INSERT INTO watches (company_id, brand, model, reference, serial, material, dial_color, condition, year_manufactured, set_type, cost_price, trade_price, retail_price, description, date_added, status) VALUES
('22222222-2222-2222-2222-222222222222', 'Rolex', 'Submariner', '126610LN', 'R001234567', 'Stainless Steel', 'Black', 'Excellent', 2023, 'Complete', 8500.00, 8500.00, 12750.00, 'Pristine condition Submariner with complete box and papers', NOW(), 'available'),
('22222222-2222-2222-2222-222222222222', 'Omega', 'Speedmaster', '310.30.42.50.01.001', 'O001234567', 'Stainless Steel', 'Black', 'New', 2023, 'Complete', 4500.00, 4500.00, 6750.00, 'Brand new Speedmaster Professional Moonwatch', NOW(), 'available');

-- Insert sample watches for company 3
INSERT INTO watches (company_id, brand, model, reference, serial, material, dial_color, condition, year_manufactured, set_type, cost_price, trade_price, retail_price, description, date_added, status) VALUES
('33333333-3333-3333-3333-333333333333', 'Tudor', 'Black Bay', '79230N', 'T001234567', 'Stainless Steel', 'Black', 'Very Good', 2022, 'Complete', 2800.00, 2800.00, 4200.00, 'Excellent condition Black Bay with original box', NOW(), 'consignment'),
('33333333-3333-3333-3333-333333333333', 'Breitling', 'Navitimer', 'A23322', 'B001234567', 'Stainless Steel', 'Blue', 'Good', 2021, 'Watch Only', 3200.00, 3200.00, 4800.00, 'Good condition Navitimer, watch only', NOW(), 'available');

-- =============================================
-- REAL-TIME SUBSCRIPTIONS
-- =============================================

-- Enable real-time for watches and orders
ALTER PUBLICATION supabase_realtime ADD TABLE watches;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE customers;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
