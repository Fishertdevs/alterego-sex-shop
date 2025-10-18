-- ============================================
-- CORRECCIÓN DE POLÍTICAS RLS PARA ENCUESTAS POS VENTA
-- ============================================
-- Este script corrige las políticas RLS para permitir INSERT anónimo

-- Primero, eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir INSERT público en post_sale_surveys" ON post_sale_surveys;
DROP POLICY IF EXISTS "Permitir SELECT a admins en post_sale_surveys" ON post_sale_surveys;
DROP POLICY IF EXISTS "Permitir UPDATE a admins en post_sale_surveys" ON post_sale_surveys;
DROP POLICY IF EXISTS "Permitir DELETE a admins en post_sale_surveys" ON post_sale_surveys;

-- Deshabilitar RLS temporalmente para limpiar
ALTER TABLE post_sale_surveys DISABLE ROW LEVEL SECURITY;

-- Habilitar RLS nuevamente
ALTER TABLE post_sale_surveys ENABLE ROW LEVEL SECURITY;

-- Política: Permitir INSERT a TODOS (anónimos y autenticados)
CREATE POLICY "allow_anonymous_insert_post_sale_surveys"
ON post_sale_surveys
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política: Permitir SELECT solo a usuarios autenticados (admins)
CREATE POLICY "allow_authenticated_select_post_sale_surveys"
ON post_sale_surveys
FOR SELECT
TO authenticated
USING (true);

-- Política: Permitir UPDATE solo a usuarios autenticados (admins)
CREATE POLICY "allow_authenticated_update_post_sale_surveys"
ON post_sale_surveys
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política: Permitir DELETE solo a usuarios autenticados (admins)
CREATE POLICY "allow_authenticated_delete_post_sale_surveys"
ON post_sale_surveys
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Verificar que las políticas se crearon correctamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'post_sale_surveys'
ORDER BY policyname;
