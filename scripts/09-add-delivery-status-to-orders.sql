-- Add delivery_status field to orders table
-- This replaces the simple boolean 'delivered' with more detailed status options

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS delivery_status text DEFAULT 'no';

-- Update existing records: if delivered = true, set to 'yes', otherwise 'no'
UPDATE orders
SET delivery_status = CASE
  WHEN delivered = true THEN 'yes'
  ELSE 'no'
END
WHERE delivery_status IS NULL OR delivery_status = 'no';

-- Add check constraint to ensure only valid values
ALTER TABLE orders
ADD CONSTRAINT delivery_status_check
CHECK (delivery_status IN ('yes', 'no', 'returned', 'in_transit'));

COMMENT ON COLUMN orders.delivery_status IS 'Estado de entrega del pedido: yes (entregado), no (no entregado), returned (devuelto), in_transit (en tránsito)';
