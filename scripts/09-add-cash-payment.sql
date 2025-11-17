-- Add cash payment method to existing payment methods constraint

-- Update the payment_method constraint to include efectivo
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check 
  CHECK (payment_method IN ('nequi', 'daviplata', 'breb', 'efectivo'));

-- Add comment
COMMENT ON COLUMN orders.payment_method IS 'Payment method: nequi, daviplata, breb, or efectivo (cash on delivery)';
