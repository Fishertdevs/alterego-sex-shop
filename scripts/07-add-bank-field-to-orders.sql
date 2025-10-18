-- Add bank field to orders table for card and bank transfer payments

ALTER TABLE orders ADD COLUMN IF NOT EXISTS bank TEXT;

COMMENT ON COLUMN orders.bank IS 'Bank name for card or bank transfer payments';
