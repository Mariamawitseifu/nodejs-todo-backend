-- migrations/003_seed_categories.sql
-- Default categories for the Todo app
INSERT INTO categories (name) VALUES
  ('Work'),
  ('Personal'),
  ('Health'),
  ('Urgent')
ON CONFLICT (name) DO NOTHING;
