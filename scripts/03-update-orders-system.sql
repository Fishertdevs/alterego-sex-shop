-- Actualizar sistema de pedidos para incluir toda la información del cliente y envío

-- Eliminar tabla de customers separada y fusionar con orders
DROP TABLE IF EXISTS customers CASCADE;

-- Actualizar tabla de orders con todos los campos necesarios
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Información del cliente
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_department TEXT NOT NULL,
  customer_municipality TEXT NOT NULL,
  customer_email TEXT,
  
  -- Información del pedido
  products JSONB NOT NULL, -- Array de productos con {id, name, quantity, price}
  total_product_cost DECIMAL(10, 2) NOT NULL,
  
  -- Información de pago
  payment_method TEXT NOT NULL CHECK (payment_method IN ('nequi', 'daviplata', 'tarjeta', 'banco')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  
  -- Información de envío
  shipping_type TEXT NOT NULL CHECK (shipping_type IN ('contraentrega', 'paga_envio', 'gratis')),
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  shipping_company TEXT CHECK (shipping_company IN ('interrapidisimo', 'coordinadora', 'servientrega', 'tcc', 'envia', 'deprisa')),
  tracking_number TEXT,
  
  -- Estado y entrega
  order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  delivered BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_department ON orders(customer_department);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_delivered ON orders(delivered);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  -- Si se marca como entregado, actualizar delivered_at
  IF NEW.delivered = TRUE AND OLD.delivered = FALSE THEN
    NEW.delivered_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at_trigger
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_orders_updated_at();

-- Función para obtener estadísticas del dashboard
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_orders', COUNT(*),
    'pending_orders', COUNT(*) FILTER (WHERE order_status = 'pending'),
    'delivered_orders', COUNT(*) FILTER (WHERE delivered = TRUE),
    'total_revenue', COALESCE(SUM(total_product_cost + shipping_cost) FILTER (WHERE order_status != 'cancelled'), 0),
    'total_shipping_revenue', COALESCE(SUM(shipping_cost) FILTER (WHERE order_status != 'cancelled'), 0)
  ) INTO stats
  FROM orders;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- Comentarios para documentación
COMMENT ON TABLE orders IS 'Tabla unificada de pedidos que incluye información completa del cliente y envío';
COMMENT ON COLUMN orders.shipping_type IS 'Tipo de envío: contraentrega (paga al recibir), paga_envio (solo paga envío), gratis (envío gratis)';
COMMENT ON COLUMN orders.payment_method IS 'Método de pago: nequi, daviplata, tarjeta, banco';
COMMENT ON COLUMN orders.shipping_company IS 'Transportadora: interrapidisimo, coordinadora, servientrega, tcc, envia, deprisa';
