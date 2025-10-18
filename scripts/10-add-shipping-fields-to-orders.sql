-- Add additional shipping fields to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipping_carrier text,
ADD COLUMN IF NOT EXISTS shipping_notes text;

-- Add comment to explain the fields
COMMENT ON COLUMN orders.shipping_carrier IS 'Transportadora que realiza el envío (Servientrega, Coordinadora, etc.)';
COMMENT ON COLUMN orders.shipping_notes IS 'Notas adicionales sobre el envío';
