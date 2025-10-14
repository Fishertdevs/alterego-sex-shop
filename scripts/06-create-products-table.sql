-- Crear tabla de productos en Supabase
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  discount DECIMAL(5, 2),
  category TEXT NOT NULL,
  subcategory TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  USING (true);

-- Política para permitir escritura solo a usuarios autenticados (admins)
CREATE POLICY "Allow authenticated insert" ON products
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON products
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated delete" ON products
  FOR DELETE
  USING (true);
