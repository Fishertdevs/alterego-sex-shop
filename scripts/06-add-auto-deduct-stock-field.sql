-- Add auto_deduct_stock field to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS auto_deduct_stock BOOLEAN DEFAULT true;

-- Update existing products to have auto_deduct_stock enabled by default
UPDATE products
SET auto_deduct_stock = true
WHERE auto_deduct_stock IS NULL;

-- Add comment to explain the field
COMMENT ON COLUMN products.auto_deduct_stock IS 'Indica si el stock se descuenta automáticamente cuando un pedido se confirma';
