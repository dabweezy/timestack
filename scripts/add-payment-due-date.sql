-- Add payment_due_date column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_due_date TIMESTAMP WITH TIME ZONE;

-- Add comment to explain the column
COMMENT ON COLUMN orders.payment_due_date IS 'Date when payment is due for purchase orders';
