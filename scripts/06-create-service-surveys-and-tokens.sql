-- ============================================
-- TABLA DE ENCUESTAS DE SERVICIO
-- ============================================
CREATE TABLE IF NOT EXISTS service_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  service_rating INTEGER NOT NULL CHECK (service_rating >= 1 AND service_rating <= 5),
  delivery_rating INTEGER NOT NULL CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA DE TOKENS DE ENCUESTA DE PRODUCTO
-- ============================================
CREATE TABLE IF NOT EXISTS survey_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(255) UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_email VARCHAR(255),
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_service_surveys_created ON service_surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_tokens_token ON survey_tokens(token);
CREATE INDEX IF NOT EXISTS idx_survey_tokens_used ON survey_tokens(used) WHERE used = false;
CREATE INDEX IF NOT EXISTS idx_survey_tokens_order ON survey_tokens(order_id);

-- ============================================
-- FUNCIÓN PARA GENERAR TOKEN ÚNICO
-- ============================================
CREATE OR REPLACE FUNCTION generate_survey_token()
RETURNS TEXT AS $$
DECLARE
  token TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generar token aleatorio de 32 caracteres
    token := encode(gen_random_bytes(24), 'base64');
    token := replace(token, '/', '_');
    token := replace(token, '+', '-');
    token := replace(token, '=', '');
    
    -- Verificar si el token ya existe
    SELECT EXISTS(SELECT 1 FROM survey_tokens WHERE survey_tokens.token = token) INTO exists;
    
    -- Si no existe, salir del loop
    IF NOT exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN token;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================
COMMENT ON TABLE service_surveys IS 'Encuestas de satisfacción del servicio general (entrega, atención, etc.)';
COMMENT ON TABLE survey_tokens IS 'Tokens únicos para encuestas de productos específicos enviados por el admin';
COMMENT ON COLUMN survey_tokens.token IS 'Token único para acceder a la encuesta del producto';
COMMENT ON COLUMN survey_tokens.used IS 'Indica si el token ya fue utilizado para completar la encuesta';
COMMENT ON COLUMN survey_tokens.expires_at IS 'Fecha de expiración del token (30 días por defecto)';
