-- ============================================
-- POLÍTICAS RLS PARA ENCUESTAS POS VENTA
-- ============================================

-- Habilitar RLS en la tabla post_sale_surveys
ALTER TABLE post_sale_surveys ENABLE ROW LEVEL SECURITY;

-- Política: Permitir INSERT público para encuestas pos venta
-- Cualquier persona con un token válido puede enviar una encuesta
CREATE POLICY "Permitir INSERT público en post_sale_surveys"
ON post_sale_surveys
FOR INSERT
TO public
WITH CHECK (true);

-- Política: Permitir SELECT solo para usuarios autenticados (admins)
CREATE POLICY "Permitir SELECT a admins en post_sale_surveys"
ON post_sale_surveys
FOR SELECT
TO authenticated
USING (true);

-- Política: Permitir UPDATE solo para usuarios autenticados (admins)
CREATE POLICY "Permitir UPDATE a admins en post_sale_surveys"
ON post_sale_surveys
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política: Permitir DELETE solo para usuarios autenticados (admins)
CREATE POLICY "Permitir DELETE a admins en post_sale_surveys"
ON post_sale_surveys
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================
COMMENT ON POLICY "Permitir INSERT público en post_sale_surveys" ON post_sale_surveys IS 
'Permite que cualquier persona (anónima) pueda enviar una encuesta pos venta usando un token válido';

COMMENT ON POLICY "Permitir SELECT a admins en post_sale_surveys" ON post_sale_surveys IS 
'Solo los administradores autenticados pueden ver las encuestas pos venta';
