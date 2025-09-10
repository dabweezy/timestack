# Manual Supabase Setup

## Step 1: Create Database Tables

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/hscxnaplrewvqjdhjlsj)
2. Click **SQL Editor** in the left sidebar
3. Copy and paste the following SQL and click **Run**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT NOT NULL,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United Kingdom'
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  reference TEXT NOT NULL,
  serial TEXT UNIQUE NOT NULL,
  material TEXT NOT NULL,
  dial_color TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('New', 'Excellent', 'Very Good', 'Good', 'Fair')),
  year_manufactured INTEGER NOT NULL,
  set TEXT NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  trade_price DECIMAL(10,2) NOT NULL,
  retail_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  date_added TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'consignment')),
  assigned_customer UUID REFERENCES customers(id)
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_number TEXT UNIQUE NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('purchase', 'sale')),
  customer_id UUID NOT NULL REFERENCES customers(id),
  product_id UUID NOT NULL REFERENCES products(id),
  sale_price DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  date TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID UNIQUE NOT NULL,
  profile_picture TEXT,
  company_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email_address TEXT NOT NULL,
  vat_number TEXT NOT NULL,
  registered_address JSONB NOT NULL
);

-- Create indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now)
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on profiles" ON profiles FOR ALL USING (true);
```

## Step 2: Insert Sample Data

After creating the tables, run this SQL to insert sample data:

```sql
-- Insert sample customers
INSERT INTO customers (first_name, last_name, email, mobile, address1, city, postcode, country) VALUES
('John', 'Smith', 'john.smith@email.com', '+44 20 7123 4567', '123 High Street', 'London', 'SW1A 1AA', 'United Kingdom'),
('Sarah', 'Johnson', 'sarah.johnson@email.com', '+44 20 7123 4568', '456 Queen Street', 'Manchester', 'M1 1AA', 'United Kingdom'),
('Michael', 'Brown', 'michael.brown@email.com', '+44 20 7123 4569', '789 King Road', 'Birmingham', 'B1 1AA', 'United Kingdom'),
('Emma', 'Davis', 'emma.davis@email.com', '+44 20 7123 4570', '321 Prince Avenue', 'Leeds', 'LS1 1AA', 'United Kingdom'),
('David', 'Wilson', 'david.wilson@email.com', '+44 20 7123 4571', '654 Duke Street', 'Glasgow', 'G1 1AA', 'United Kingdom');

-- Insert sample products
INSERT INTO products (brand, model, reference, serial, material, dial_color, condition, year_manufactured, set, cost_price, trade_price, retail_price, description, date_added, status) VALUES
('Rolex', 'Submariner', '126610LN', 'R001234567', 'Stainless Steel', 'Black', 'Excellent', 2023, 'Complete', 8500.00, 8500.00, 12750.00, 'Pristine condition Submariner with complete box and papers', NOW(), 'available'),
('Omega', 'Speedmaster', '310.30.42.50.01.001', 'O001234567', 'Stainless Steel', 'Black', 'New', 2023, 'Complete', 4500.00, 4500.00, 6750.00, 'Brand new Speedmaster Professional Moonwatch', NOW(), 'available'),
('Tudor', 'Black Bay', '79230N', 'T001234567', 'Stainless Steel', 'Black', 'Very Good', 2022, 'Complete', 2800.00, 2800.00, 4200.00, 'Excellent condition Black Bay with original box', NOW(), 'consignment'),
('Breitling', 'Navitimer', 'A23322', 'B001234567', 'Stainless Steel', 'Blue', 'Good', 2021, 'Watch Only', 3200.00, 3200.00, 4800.00, 'Good condition Navitimer, watch only', NOW(), 'available'),
('IWC', 'Pilot', 'IW327001', 'I001234567', 'Stainless Steel', 'Black', 'Excellent', 2023, 'Complete', 4200.00, 4200.00, 6300.00, 'Excellent condition Pilot watch with full set', NOW(), 'available');
```

## Step 3: Test the Setup

After running the SQL, your app should automatically connect to Supabase and load the sample data.

## What This Gives You

- ✅ **Persistent Data**: All data stored in Supabase
- ✅ **Real-time Updates**: Live data synchronization
- ✅ **Scalability**: Handle thousands of records
- ✅ **Backup & Recovery**: Automatic backups
- ✅ **Security**: Row-level security enabled
- ✅ **Performance**: Optimized with indexes
