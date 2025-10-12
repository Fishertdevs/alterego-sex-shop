-- ============================================
-- TABLA DE CONFIGURACIÓN DE LA TIENDA
-- ============================================
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name VARCHAR(255) NOT NULL DEFAULT 'ALTEREGO',
  store_email VARCHAR(255) NOT NULL,
  store_phone VARCHAR(50) NOT NULL,
  store_address TEXT NOT NULL,
  
  -- Redes sociales
  instagram_url VARCHAR(500),
  whatsapp_number VARCHAR(50),
  facebook_url VARCHAR(500),
  
  -- Configuración de precios
  currency VARCHAR(10) DEFAULT 'COP',
  tax_rate DECIMAL(5, 2) DEFAULT 19.00,
  
  -- Notificaciones
  notify_low_stock BOOLEAN DEFAULT true,
  low_stock_threshold INTEGER DEFAULT 5,
  notify_settings_change BOOLEAN DEFAULT true,
  notify_new_sale BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA DE NOTIFICACIONES
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'low_stock', 'settings_change', 'new_sale'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id UUID, -- ID del producto, pedido, etc.
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA DE PEDIDOS/VENTAS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  items JSONB NOT NULL, -- Array de productos
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'delivered', 'cancelled'
  sale_channel VARCHAR(50) DEFAULT 'whatsapp', -- 'whatsapp', 'instagram'
  review_link_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ACTUALIZAR TABLA DE RESEÑAS
-- ============================================
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS delivery_comment TEXT;

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_order ON reviews(order_id);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER update_store_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCIÓN PARA CREAR NOTIFICACIÓN DE BAJO STOCK
-- ============================================
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
DECLARE
  threshold INTEGER;
  notify_enabled BOOLEAN;
BEGIN
  -- Obtener configuración
  SELECT low_stock_threshold, notify_low_stock 
  INTO threshold, notify_enabled
  FROM store_settings 
  LIMIT 1;
  
  -- Si las notificaciones están habilitadas y el stock es bajo
  IF notify_enabled AND NEW.stock <= threshold AND NEW.stock < OLD.stock THEN
    INSERT INTO notifications (type, title, message, related_id)
    VALUES (
      'low_stock',
      'Stock Bajo',
      'El producto "' || NEW.name || '" tiene solo ' || NEW.stock || ' unidades en stock.',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER PARA BAJO STOCK
-- ============================================
CREATE TRIGGER trigger_low_stock_notification
  AFTER UPDATE OF stock ON products
  FOR EACH ROW
  EXECUTE FUNCTION check_low_stock();

-- ============================================
-- INSERTAR CONFIGURACIÓN POR DEFECTO
-- ============================================
INSERT INTO store_settings (
  store_name, 
  store_email, 
  store_phone, 
  store_address,
  instagram_url,
  whatsapp_number
)
VALUES (
  'ALTEREGO',
  'contacto@alterego.com',
  '+57 300 123 4567',
  'Bogotá, Colombia',
  'https://www.instagram.com/alterego',
  '573001234567'
)
ON CONFLICT DO NOTHING;
