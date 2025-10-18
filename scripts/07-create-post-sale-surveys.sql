-- ============================================
-- TABLA DE ENCUESTAS POS VENTA
-- ============================================
CREATE TABLE IF NOT EXISTS post_sale_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  delivery_rating INTEGER NOT NULL CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  comment TEXT,
  product_image TEXT,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_post_sale_surveys_created ON post_sale_surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_sale_surveys_token ON post_sale_surveys(token);
CREATE INDEX IF NOT EXISTS idx_post_sale_surveys_order ON post_sale_surveys(order_id);

-- ============================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================
COMMENT ON TABLE post_sale_surveys IS 'Encuestas pos venta enviadas por el admin a clientes específicos para calificar la entrega';
COMMENT ON COLUMN post_sale_surveys.token IS 'Token único para acceder a la encuesta pos venta';
COMMENT ON COLUMN post_sale_surveys.product_image IS 'URL de la imagen del producto asociado a la encuesta';
