-- Hacer que delivery_rating sea opcional en service_surveys
-- Este script corrige el error de NOT NULL constraint en delivery_rating

-- Modificar la columna delivery_rating para permitir valores NULL
ALTER TABLE service_surveys 
ALTER COLUMN delivery_rating DROP NOT NULL;

-- Actualizar registros existentes que tengan delivery_rating NULL
-- (si los hay) para que tengan un valor por defecto
UPDATE service_surveys 
SET delivery_rating = service_rating 
WHERE delivery_rating IS NULL;

-- Agregar un comentario a la columna para documentar que es opcional
COMMENT ON COLUMN service_surveys.delivery_rating IS 'Calificación de la entrega (1-5). Opcional - puede ser NULL si no se proporciona.';
