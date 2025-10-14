-- ============================================
-- AGREGAR SOPORTE PARA VIDEOS EN PRODUCTOS
-- ============================================

-- Agregar columna para almacenar URLs de videos
ALTER TABLE products
ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT '{}';

-- Agregar comentario para documentación
COMMENT ON COLUMN products.videos IS 'Array de URLs de videos del producto almacenados en Vercel Blob';
