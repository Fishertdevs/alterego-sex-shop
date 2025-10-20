-- Add account type and account number fields to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS account_type TEXT CHECK (account_type IS NULL OR account_type IN ('corriente', 'ahorros')),
ADD COLUMN IF NOT EXISTS account_number TEXT;

-- Added "account_type IS NULL OR" to allow null values in the CHECK constraint

-- Add comment to explain the fields
COMMENT ON COLUMN orders.account_type IS 'Tipo de cuenta bancaria: corriente o ahorros (puede ser null)';
COMMENT ON COLUMN orders.account_number IS 'Número de cuenta bancaria';
