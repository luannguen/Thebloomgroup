-- Kịch bản seed tài khoản Admin
-- Tự động tạo user admin@vrc.com.vn với mật khẩu Admin@123456

DO $$
DECLARE
  admin_uid UUID := gen_random_uuid();
BEGIN
  -- Kiểm tra xem user đã tồn tại chưa
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@vrc.com.vn') THEN
    RAISE NOTICE 'Admin user already exists!';
    -- Đảm bảo role là admin/super_admin
    UPDATE public.users 
    SET role = 'admin' 
    WHERE email = 'admin@vrc.com.vn';
    RETURN;
  END IF;

  -- 1. Thêm user vào bảng auth.users
  INSERT INTO auth.users (
    id, 
    instance_id, 
    aud, 
    role, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    created_at, 
    updated_at
  ) VALUES (
    admin_uid, 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    'admin@vrc.com.vn', 
    crypt('Admin@123456', gen_salt('bf')), 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name":"Quản trị viên", "role":"admin"}', 
    now(), 
    now()
  );

  -- 2. Thêm identity vào bảng auth.identities
  INSERT INTO auth.identities (
    id, 
    user_id, 
    provider_id,
    identity_data, 
    provider, 
    created_at, 
    updated_at
  ) VALUES (
    gen_random_uuid(), 
    admin_uid, 
    admin_uid::text,
    format('{"sub":"%s","email":"%s"}', admin_uid::text, 'admin@vrc.com.vn')::jsonb, 
    'email', 
    now(), 
    now()
  );

  -- Trigger on_auth_user_created sẽ tự động tạo bản ghi trong public.users
  -- Tuy nhiên, ta cập nhật lại để chắc chắn role là `admin` thay vì fallback 'user'
  UPDATE public.users 
  SET role = 'admin' 
  WHERE id = admin_uid;

  RAISE NOTICE 'Admin user created successfully: admin@vrc.com.vn / Admin@123456';
END $$;
