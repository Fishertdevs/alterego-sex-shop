-- ============================================
-- AGREGAR CAMPO is_offensive A LA TABLA reviews
-- ============================================

-- Agregar columna para marcar reseñas ofensivas
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_offensive BOOLEAN DEFAULT false;

-- Crear índice para filtrar reseñas ofensivas
CREATE INDEX IF NOT EXISTS idx_reviews_offensive ON reviews(is_offensive) WHERE is_offensive = true;

-- Comentario para documentación
COMMENT ON COLUMN reviews.is_offensive IS 'Indica si la reseña contiene contenido ofensivo o inapropiado';
