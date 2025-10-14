-- Agregar columna original_price a la tabla products existente
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2);

-- Actualizar productos existentes para calcular original_price basado en precio y descuento
UPDATE products 
SET original_price = CASE 
  WHEN discount > 0 THEN price / (1 - discount / 100)
  ELSE price
END
WHERE original_price IS NULL;
