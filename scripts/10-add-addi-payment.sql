-- Agregar Addi como método de pago válido
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_payment_method_check;

ALTER TABLE orders 
ADD CONSTRAINT orders_payment_method_check 
CHECK (payment_method IN ('nequi', 'daviplata', 'breb', 'efectivo', 'addi'));

-- Agregar columnas opcionales para detalles de Addi
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS addi_cedula TEXT,
ADD COLUMN IF NOT EXISTS addi_phone TEXT;
