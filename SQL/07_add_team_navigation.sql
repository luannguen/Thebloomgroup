-- Thêm mục "Đội ngũ" vào menu điều hướng (header) nếu chưa tồn tại
INSERT INTO navigation (label, path, type, position, order_index, is_active)
SELECT 'Đội ngũ', '/team', 'internal', 'header', 5, true
WHERE NOT EXISTS (
    SELECT 1 FROM navigation WHERE path = '/team' AND position = 'header'
);

-- Cập nhật lại thứ tự hiển thị của các mục phía sau "Đội ngũ" để giữ logic sắp xếp đúng
UPDATE navigation 
SET order_index = 6 
WHERE label = 'Tin tức' AND position = 'header' AND order_index = 5;

UPDATE navigation 
SET order_index = 7 
WHERE label = 'Liên hệ' AND position = 'header' AND order_index = 6;
