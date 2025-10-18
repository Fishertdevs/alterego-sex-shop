-- Habilitar Row Level Security en service_surveys
ALTER TABLE service_surveys ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT público (cualquier persona puede enviar una encuesta)
CREATE POLICY "Permitir INSERT público en service_surveys"
ON service_surveys
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política para permitir SELECT solo a usuarios autenticados (admins)
CREATE POLICY "Permitir SELECT a usuarios autenticados en service_surveys"
ON service_surveys
FOR SELECT
TO authenticated
USING (true);

-- Política para permitir UPDATE solo a usuarios autenticados (admins)
CREATE POLICY "Permitir UPDATE a usuarios autenticados en service_surveys"
ON service_surveys
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política para permitir DELETE solo a usuarios autenticados (admins)
CREATE POLICY "Permitir DELETE a usuarios autenticados en service_surveys"
ON service_surveys
FOR DELETE
TO authenticated
USING (true);
