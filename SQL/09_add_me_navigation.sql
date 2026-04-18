-- 09_add_me_navigation.sql
-- Add "Hệ Thống Cơ Điện" to Header Navigation

-- First, update existing orders to make room at index 3
UPDATE public.navigation 
SET order_index = order_index + 1 
WHERE position = 'header' AND order_index >= 3;

-- Insert the new M&E navigation item
INSERT INTO public.navigation (label, path, type, position, order_index, is_active)
VALUES ('Cơ điện', '/he-thong-co-dien', 'internal', 'header', 3, true);

-- Optional: Add sub-items if needed in the future
-- Example:
-- INSERT INTO public.navigation (parent_id, label, path, type, position, order_index, is_active)
-- SELECT id, 'Hệ thống điện', '/he-thong-co-dien#electrical', 'internal', 'header', 1, true
-- FROM public.navigation WHERE path = '/he-thong-co-dien' LIMIT 1;
