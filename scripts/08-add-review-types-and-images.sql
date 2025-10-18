-- Agregar campo review_type y images a la tabla reviews
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS review_type TEXT CHECK (review_type IN ('pre_sale', 'post_sale')) DEFAULT 'pre_sale',
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Actualizar reseñas existentes
-- Las que tienen product_id son post_sale, las demás son pre_sale
UPDATE reviews
SET review_type = CASE
  WHEN product_id IS NOT NULL THEN 'post_sale'
  ELSE 'pre_sale'
END
WHERE review_type IS NULL;

-- Crear índice para mejorar consultas por tipo
CREATE INDEX IF NOT EXISTS idx_reviews_type ON reviews(review_type);

-- Comentarios para documentación
COMMENT ON COLUMN reviews.review_type IS 'Tipo de reseña: pre_sale (servicio) o post_sale (producto)';
COMMENT ON COLUMN reviews.images IS 'Array de URLs de imágenes subidas por el cliente en reseñas post-venta';
