-- Enable RLS on reviews and service_surveys tables if not already enabled
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_surveys ENABLE ROW LEVEL SECURITY;

-- Drop existing delete policies if they exist
DROP POLICY IF EXISTS "Allow admin to delete reviews" ON reviews;
DROP POLICY IF EXISTS "Allow admin to delete service surveys" ON service_surveys;
DROP POLICY IF EXISTS "Allow public to delete reviews" ON reviews;
DROP POLICY IF EXISTS "Allow public to delete service surveys" ON service_surveys;

-- Create policies to allow deletion of reviews
-- Allow anyone to delete from reviews (since we're using client-side auth)
CREATE POLICY "Allow public to delete reviews" ON reviews
  FOR DELETE
  USING (true);

-- Allow anyone to delete from service_surveys (since we're using client-side auth)
CREATE POLICY "Allow public to delete service surveys" ON service_surveys
  FOR DELETE
  USING (true);

-- Also ensure SELECT policies exist for reading
DROP POLICY IF EXISTS "Allow public to read reviews" ON reviews;
DROP POLICY IF EXISTS "Allow public to read service surveys" ON service_surveys;

CREATE POLICY "Allow public to read reviews" ON reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public to read service surveys" ON service_surveys
  FOR SELECT
  USING (true);

-- Ensure UPDATE policies exist for updating review status
DROP POLICY IF EXISTS "Allow public to update reviews" ON reviews;

CREATE POLICY "Allow public to update reviews" ON reviews
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
