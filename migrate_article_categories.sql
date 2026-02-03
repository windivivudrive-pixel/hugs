-- =============================================
-- Migration: Add project_category_ids array column
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Add array column to store multiple category IDs
ALTER TABLE service_articles 
ADD COLUMN IF NOT EXISTS project_category_ids UUID[] DEFAULT '{}';

-- 2. Migrate existing data from the old single-column relationship
UPDATE service_articles 
SET project_category_ids = ARRAY[project_category_id]
WHERE project_category_id IS NOT NULL 
  AND (project_category_ids IS NULL OR project_category_ids = '{}');

-- 3. (Optional) After verifying migration, you can drop the old column:
-- ALTER TABLE service_articles DROP COLUMN project_category_id;
-- NOTE: Keep this commented until you verify the migration worked.
