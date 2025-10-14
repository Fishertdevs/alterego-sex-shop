-- Eliminar la columna whatsapp_number y usar solo store_phone
-- Este script elimina la columna redundante whatsapp_number de store_settings

ALTER TABLE store_settings 
DROP COLUMN IF EXISTS whatsapp_number;

-- Verificar que store_phone existe y tiene el formato correcto
-- Si necesitas actualizar el formato, descomenta la siguiente línea:
-- UPDATE store_settings SET store_phone = '+57 3168192054' WHERE id = 1;
