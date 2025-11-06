-- Actualizar métodos de pago disponibles
-- Eliminar métodos antiguos: tarjeta, banco, contraentrega
-- Agregar nuevo método: breb

-- Actualizar el CHECK constraint de payment_method en la tabla orders
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;

ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check 
  CHECK (payment_method IN ('nequi', 'daviplata', 'breb'));

-- Agregar campos específicos para Bre-B
ALTER TABLE orders ADD COLUMN IF NOT EXISTS breb_key TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS breb_bank TEXT;

-- Comentarios para documentación
COMMENT ON COLUMN orders.payment_method IS 'Método de pago: nequi, daviplata, breb';
COMMENT ON COLUMN orders.breb_key IS 'Llave de Bre-B (número de cuenta o identificador)';
COMMENT ON COLUMN orders.breb_bank IS 'Banco seleccionado para Bre-B';

-- Actualizar pedidos existentes con métodos antiguos a nequi por defecto
UPDATE orders 
SET payment_method = 'nequi' 
WHERE payment_method NOT IN ('nequi', 'daviplata', 'breb');
