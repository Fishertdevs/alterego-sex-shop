-- Habilitar políticas de lectura pública para service_surveys
-- Este script permite que cualquier usuario pueda leer las encuestas de servicio

-- Eliminar política de SELECT existente si existe
DROP POLICY IF EXISTS "Allow public read access to service_surveys" ON service_surveys;

-- Crear política para permitir SELECT público (lectura)
CREATE POLICY "Allow public read access to service_surveys"
ON service_surveys
FOR SELECT
TO public
USING (true);

-- Verificar que RLS esté habilitado
ALTER TABLE service_surveys ENABLE ROW LEVEL SECURITY;

-- Verificar políticas existentes
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
WHERE tablename = 'service_surveys'
ORDER BY policyname;
