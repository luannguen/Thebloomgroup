-- ==========================================
-- 1. PRE-POPULATE AUTH USERS
-- ==========================================
DO $$
BEGIN
  -- Insert admin@vrc.com.vn (ID from backup: 0388c308-25d3-4385-9aa1-788edeb73aaa)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '0388c308-25d3-4385-9aa1-788edeb73aaa'::uuid) THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change,
      phone_change, phone_change_token, email_change_token_current, reauthentication_token, is_super_admin,
      created_at, updated_at
    ) VALUES (
      '0388c308-25d3-4385-9aa1-788edeb73aaa',
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', 'admin@vrc.com.vn',
      extensions.crypt('Admin@123456', extensions.gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"VRC Administrator", "role":"admin"}'::jsonb,
      '', '', '', '', '', '', '', '', false,
      now(), now()
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, created_at, updated_at
    ) VALUES (
      'b5f21def-510d-420a-9ec3-283dc0fd9a20',
      '0388c308-25d3-4385-9aa1-788edeb73aaa',
      '0388c308-25d3-4385-9aa1-788edeb73aaa',
      '{"sub":"0388c308-25d3-4385-9aa1-788edeb73aaa","email":"admin@vrc.com.vn"}'::jsonb,
      'email', now(), now()
    );
  END IF;

  -- Insert admin@vvc.com.vn (from 05_seed_admin.sql)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@vvc.com.vn') THEN
    DECLARE
      admin_vvc_uid UUID := 'a1111111-1111-1111-1111-111111111111'::uuid;
    BEGIN
      INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        phone_change, phone_change_token, email_change_token_current, reauthentication_token, is_super_admin,
        created_at, updated_at
      ) VALUES (
        admin_vvc_uid,
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated', 'admin@vvc.com.vn',
        extensions.crypt('Admin@123456', extensions.gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Quản trị viên", "role":"admin"}'::jsonb,
        '', '', '', '', '', '', '', '', false,
        now(), now()
      );

      INSERT INTO auth.identities (
        id, user_id, provider_id, identity_data, provider, created_at, updated_at
      ) VALUES (
        'b2222222-2222-2222-2222-222222222222'::uuid,
        admin_vvc_uid,
        admin_vvc_uid::text,
        format('{"sub":"%s","email":"%s"}', admin_vvc_uid::text, 'admin@vvc.com.vn')::jsonb,
        'email', now(), now()
      );
    END;
  END IF;
END $$;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$;


--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin() RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin') 
  );
END;
$$;


--
-- Name: rls_auto_enable(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


--
-- Name: update_partners_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_partners_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievements (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    label text NOT NULL,
    value text NOT NULL,
    icon text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: banners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banners (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    title text,
    description text,
    image_url text NOT NULL,
    link text,
    "position" text DEFAULT 'home_main'::text,
    order_index integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT banners_position_check CHECK (("position" = ANY (ARRAY['home_main'::text, 'popup'::text, 'sidebar'::text, 'page_top'::text])))
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    type text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT categories_type_check CHECK ((type = ANY (ARRAY['product'::text, 'event'::text, 'news'::text, 'project'::text])))
);


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contacts (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    subject text,
    message text,
    status text DEFAULT 'new'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT contacts_status_check CHECK ((status = ANY (ARRAY['new'::text, 'read'::text, 'replied'::text])))
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    summary text,
    content text,
    image_url text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    location text,
    organizer text,
    status text DEFAULT 'upcoming'::text,
    category_id uuid,
    participants_count integer DEFAULT 0,
    tags text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT events_status_check CHECK ((status = ANY (ARRAY['upcoming'::text, 'ongoing'::text, 'past'::text])))
);


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faqs (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    category text DEFAULT 'general'::text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_applications (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    job_id uuid,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    cv_url text NOT NULL,
    message text,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    requirements text,
    benefits text,
    location text DEFAULT 'TP. Hồ Chí Minh'::text,
    type text DEFAULT 'Full-time'::text,
    salary text DEFAULT 'Thỏa thuận'::text,
    status text DEFAULT 'open'::text,
    deadline date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: navigation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.navigation (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    label text NOT NULL,
    path text NOT NULL,
    parent_id uuid,
    order_index integer DEFAULT 0,
    is_active boolean DEFAULT true,
    children jsonb,
    "position" character varying(50) DEFAULT 'header'::character varying,
    type character varying(50) DEFAULT 'custom'::character varying,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    summary text,
    content text,
    image_url text,
    publish_date timestamp with time zone DEFAULT now(),
    author text,
    category_id uuid,
    tags text[],
    views integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partners (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    logo_url text,
    website_url text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    category_id uuid,
    price text,
    is_new boolean DEFAULT false,
    is_bestseller boolean DEFAULT false,
    image_url text,
    features jsonb DEFAULT '[]'::jsonb,
    specifications jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    content text,
    image_url text,
    client text,
    completion_date timestamp with time zone,
    category_id uuid,
    is_featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text,
    description text,
    content text,
    icon text NOT NULL,
    link text,
    type text DEFAULT 'category'::text,
    features jsonb DEFAULT '[]'::jsonb,
    parent_id uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    role_id text NOT NULL,
    permission_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: service_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_categories (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: service_inquiries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_inquiries (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    service_id uuid,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    message text,
    status text DEFAULT 'new'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT service_inquiries_status_check CHECK ((status = ANY (ARRAY['new'::text, 'processing'::text, 'completed'::text, 'cancelled'::text])))
);


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text,
    content text,
    icon text,
    image_url text,
    is_active boolean DEFAULT true,
    category_id uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    key text NOT NULL,
    value text,
    description text,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: static_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.static_pages (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    content text,
    excerpt text,
    image_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    title_en text,
    excerpt_en text,
    title_de text,
    excerpt_de text,
    title_fr text,
    excerpt_fr text,
    title_ru text,
    excerpt_ru text,
    title_hr text,
    excerpt_hr text,
    title_sl text,
    excerpt_sl text,
    title_sr text,
    excerpt_sr text,
    title_ja text,
    excerpt_ja text,
    title_ko text,
    excerpt_ko text,
    title_zh text,
    excerpt_zh text
);


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    bio text,
    image_url text,
    social_links jsonb DEFAULT '{}'::jsonb,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email text,
    full_name text,
    avatar_url text,
    role text DEFAULT 'user'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.achievements (id, label, value, icon, sort_order, is_active, created_at, updated_at) FROM stdin;
9c23e8a1-df34-4f2e-9164-931ce0820a6f	Dự án đã hoàn thành	500+	\N	1	t	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
bac8cf9f-22a0-4d26-aa5b-d79234dfe771	Năm kinh nghiệm	20+	\N	2	t	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
d0c01b24-e048-4695-8818-bc78eec0a253	Đối tác lớn	50+	\N	3	t	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
5a61e371-78bc-48aa-bac4-627a1e8dda58	Kỹ sư & nhân viên	100+	\N	4	t	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.banners (id, title, description, image_url, link, "position", order_index, is_active, created_at, updated_at) FROM stdin;
2ccb9825-1177-45c6-90ef-f33508b9d900	Tổng Thầu Cơ Điện (M&E) Chuyên Nghiệp	Thiết kế và thi công hệ thống điện lực, cấp thoát nước và HVAC cho các dự án quy mô lớn.	https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000	/services	home_main	2	t	2026-04-04 13:45:15.520181+00	2026-04-04 13:45:15.520181+00
d6b8add1-6da5-48d1-830a-20a7d1039025	Hạ Tầng Trung Tâm Dữ Liệu (Data Center)	Đảm bảo sự ổn định tuyệt đối cho hạ tầng số với giải pháp làm mát và nguồn điện dự phòng.	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/banners/ba2f11ef-b27b-41c2-902b-b1e140cf80a6.jpg	/technologies	home_main	3	t	2026-04-04 13:45:15.615107+00	2026-04-04 13:45:15.615107+00
ac9adfa7-f5b9-4f41-8c3c-31d28877d73e	Hệ Thống Lạnh Công Nghiệp	Việt Vinh cung cấp các giải pháp làm lạnh chuyên sâu cho nhà kho, trung tâm chế biến và logistics.	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/banners/ad5f8435-9f25-4ebc-ba84-c4afe84e44de.jpg	/products/industrial	home_main	1	t	2026-04-04 13:45:15.391161+00	2026-04-04 13:45:15.391161+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, type, description, created_at, updated_at) FROM stdin;
237bccb0-8eb5-4d8d-a16d-7ed36ae1efdc	Công nghiệp	industrial	product	\N	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
6049a6ae-0775-469b-84d1-7ca6819c23b6	Thương mại	commercial	product	\N	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
365f2324-9bc5-44a4-9491-9fb962ef6000	Dân dụng	residential	product	\N	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
4ed856c9-6bfa-47e8-8115-9d60fbe4ba14	Kho lạnh	cold-storage	product	\N	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
7461100e-1554-4bcf-bb2b-9d3f6f3e17b7	Triển lãm	exhibition	event	\N	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
77d32024-3cb5-4dfa-9d8d-d33233a89c03	Hội thảo	workshop	event	\N	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
0df76eab-0904-4e00-8b90-244d28a03a55	Tin công ty	company-news	news	\N	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
f9ac9112-089a-406a-9ae2-12d1ce7e5b2f	Công nghệ mới	technology	news	\N	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
83275b10-f880-4972-b996-39c3fadbff7f	Dự án Công nghiệp	project-industrial	project	\N	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
673c4282-879b-4d2b-a4d8-dc8ce63121c9	Dự án Thương mại	project-commercial	project	\N	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
f592ab7f-b303-4baf-a56e-0e154dc9d2fa	Thiết bị làm lạnh	thiet-bi-lam-lanh	product	Các cụm máy nén và dàn trao đổi nhiệt công nghiệp.	2026-04-09 11:39:58.499309+00	2026-04-09 11:39:58.499309+00
f3080f2d-68b2-4c87-b880-7619e79aa37f	Tấm cách nhiệt (Panel)	tam-cach-nhiet-panel	product	Panel PU/PIR tỉ trọng cao cho kho lạnh và phòng sạch.	2026-04-09 11:39:58.499309+00	2026-04-09 11:39:58.499309+00
8e054a40-db44-449f-b3a1-2fd05ecaba1e	Cửa kho lạnh chuyên dụng	cua-kho-lanh	product	Cửa trượt, cửa bản lề và cửa kho khí quyển CA.	2026-04-09 11:39:58.499309+00	2026-04-09 11:39:58.499309+00
891bdefa-08c5-42c5-ac35-5b5897d58b02	Phụ kiện & Vật tư	phu-kien-vat-tu	product	Van, tủ điện điều khiển và linh kiện thay thê.	2026-04-09 11:39:58.499309+00	2026-04-09 11:39:58.499309+00
859114f6-fb38-43fc-96eb-a953e5e91fc2	Chế biến Thủy hải sản	che-bien-thuy-hai-san	project	Hệ thống cấp đông và kho bảo quản cho nhà máy thủy sản.	2026-04-09 11:39:58.499309+00	2026-04-09 11:39:58.499309+00
86d19566-59cb-4c25-a17e-7d8baa06cc7b	Công nghiệp & Điện tử	cong-nghiep-dien-tu	project	Hệ thống MEP và phòng sạch cho các nhà máy sản xuất linh kiện.	2026-04-09 11:39:58.499309+00	2026-04-09 11:39:58.499309+00
4e4696a2-7a18-4b0d-91f6-77c4e25671dd	Logistics & Bán lẻ	logistics-ban-le	project	Kho lạnh trung tâm và hệ thống lạnh cho siêu thị.	2026-04-09 11:39:58.499309+00	2026-04-09 11:39:58.499309+00
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contacts (id, name, email, phone, subject, message, status, created_at, updated_at) FROM stdin;
a81b617b-3b77-4b39-bb63-677d6e9d724b	nguyen luan	luan.nguyenthien@gmail.com	0834807962	general	vwvwvwvw  wdsdv 	read	2026-04-05 00:08:18.471634+00	2026-04-05 00:08:37.664+00
5658a73d-c0ee-49b9-9500-6eeb24ddf80f	Bot Tester	bot@test.com		general	This is a spam message from a simulated bot.	read	2026-04-10 15:28:54.13633+00	2026-04-10 15:29:06+00
f90aaffd-9567-421e-aba3-7b044cea839c	Fast Tester	fast@tester.com		general	This is a fast submission message for testing.	read	2026-04-10 15:30:19.763654+00	2026-04-10 16:09:53.797+00
3aab8bc0-87ad-4da7-87dc-dcbc7d091d2d	Human Tester	human@tester.com		general	This is a normal submission from a human tester after waiting.	read	2026-04-10 15:31:04.521813+00	2026-04-10 16:10:00.972+00
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events (id, title, slug, summary, content, image_url, start_date, end_date, location, organizer, status, category_id, participants_count, tags, created_at, updated_at) FROM stdin;
da942426-3c05-447d-9e6f-60032b744448	Triển lãm Quốc tế HVACR Vietnam 2025	vvc-hvacr-vietnam-2025	VVC tham gia Triển lãm Quốc tế HVACR Vietnam 2025 tại SECC TP.HCM, giới thiệu các giải pháp điện lạnh mới nhất.	<p>VVC tham gia với gian hàng 200m² tại Triển lãm Quốc tế HVACR Vietnam 2025, trưng bày các sản phẩm và giải pháp mới nhất trong lĩnh vực điều hòa không khí, kho lạnh và xử lý không khí.</p>	https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800	2026-05-02 02:24:08.257314+00	2026-05-05 02:24:08.257314+00	Trung tâm Hội chợ Triển lãm Sài Gòn (SECC), Q.7, TP.HCM	HVACR Vietnam	upcoming	7461100e-1554-4bcf-bb2b-9d3f6f3e17b7	0	{"triển lãm",HVAC,"quốc tế"}	2026-04-02 02:24:08.257314+00	2026-04-02 02:24:08.257314+00
1f853091-6f67-49e9-af6f-45f815c4f6a3	Hội thảo Tiết kiệm Năng lượng trong Công nghiệp	vvc-hoi-thao-tiet-kiem-nang-luong	Hội thảo chuyên đề về các giải pháp tiết kiệm năng lượng trong hệ thống điện lạnh công nghiệp.	<p>VVC phối hợp tổ chức hội thảo chuyên đề "Giải pháp tiết kiệm năng lượng trong hệ thống điện lạnh công nghiệp" tại Khách sạn Rex, TP.HCM. Chương trình gồm các bài trình bày từ chuyên gia trong và ngoài nước.</p>	https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800	2026-04-17 02:24:08.257314+00	2026-04-17 02:24:08.257314+00	Khách sạn Rex, 141 Nguyễn Huệ, Q.1, TP.HCM	VVC & Hiệp hội Cơ điện lạnh Việt Nam	upcoming	77d32024-3cb5-4dfa-9d8d-d33233a89c03	0	{"hội thảo","tiết kiệm năng lượng","công nghiệp"}	2026-04-02 02:24:08.257314+00	2026-04-02 02:24:08.257314+00
22c39010-fe94-4124-b760-be254ddb8207	Khóa đào tạo Kỹ thuật viên HVAC nâng cao	vvc-dao-tao-ky-thuat-vien-hvac	Khóa đào tạo chuyên sâu dành cho kỹ thuật viên HVAC về vận hành và bảo trì hệ thống Chiller, VRV/VRF.	<p>VVC tổ chức khóa đào tạo nâng cao dành cho kỹ thuật viên ngành HVAC với nội dung: Vận hành hệ thống Chiller, Bảo trì hệ thống VRV/VRF, Xử lý sự cố và tối ưu hóa hiệu suất. Giảng viên là các chuyên gia hàng đầu của VVC.</p>	https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800	2026-03-23 02:24:08.257314+00	2026-03-25 02:24:08.257314+00	Trụ sở VVC, 123 Nguyễn Văn Linh, Q.7, TP.HCM	VVC Academy	past	77d32024-3cb5-4dfa-9d8d-d33233a89c03	45	{"đào tạo","kỹ thuật viên",HVAC}	2026-04-02 02:24:08.257314+00	2026-04-02 02:24:08.257314+00
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.faqs (id, question, answer, category, sort_order, is_active, created_at, updated_at) FROM stdin;
a3cf7d23-0f11-450a-ad33-ee3d0ff936f2	Làm thế nào để chọn công suất điều hòa phù hợp?	Để chọn công suất điều hòa phù hợp, bạn cần tính toán dựa trên diện tích phòng, số người sử dụng, hướng phòng, thiết bị sinh nhiệt trong phòng và vị trí địa lý. Thông thường, cần 9.000 BTU cho phòng 15m², 12.000 BTU cho phòng 20m², 18.000 BTU cho phòng 30m². Với không gian công nghiệp hoặc thương mại, VVC có đội ngũ kỹ sư sẽ tính toán chi tiết và đề xuất giải pháp tối ưu.	product	1	t	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
c511ec0e-262b-4a69-84a4-a3699599f70d	Chi phí lắp đặt hệ thống kho lạnh phụ thuộc vào yếu tố nào?	Chi phí lắp đặt kho lạnh phụ thuộc vào nhiều yếu tố như: diện tích kho, nhiệt độ yêu cầu, loại hàng hóa cần bảo quản, độ dày panel cách nhiệt, hệ thống điện, hệ thống giám sát, và các trang thiết bị đi kèm. VVC cung cấp giải pháp kho lạnh theo yêu cầu cụ thể của từng khách hàng với mức giá cạnh tranh nhất trên thị trường.	pricing	3	t	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
3c9fe1b1-71d2-4c27-a45f-dda44b42e829	Thời gian bảo hành cho các sản phẩm của VVC là bao lâu?	VVC cung cấp chế độ bảo hành 24 tháng cho tất cả các sản phẩm điều hòa dân dụng, 36 tháng đối với máy nén của hệ thống VRV/VRF, và 12 tháng đối với các thiết bị công nghiệp. Ngoài ra, chúng tôi có các gói bảo trì và gia hạn bảo hành để đảm bảo hệ thống của bạn luôn vận hành ổn định và hiệu quả trong suốt vòng đời sản phẩm.	service	2	t	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00
\.


--
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_applications (id, job_id, full_name, email, phone, cv_url, message, status, created_at) FROM stdin;
03a6d2c6-f751-4ea6-bd26-5cd4a92f55a5	89c50633-602d-411e-9a5f-48aa9a7365c2	nguyen luan	luan.nguyenthien@gmail.com	0834807962	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/cvs/7vspytjv1u-1775348951222.pdf	ádasdad	pending	2026-04-05 00:29:13.524482+00
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs (id, title, slug, description, requirements, benefits, location, type, salary, status, deadline, created_at, updated_at) FROM stdin;
89c50633-602d-411e-9a5f-48aa9a7365c2	IT	it	<p>IT văn phòng</p>	<p>Tốt nghiệp cao đẳng / đại học</p>	<p>Lương thưởng theo vị trí công việc</p>	TP. Hồ Chí Minh	Full-time	Thỏa thuận	open	2026-04-30	2026-04-05 00:21:15.627792+00	2026-04-05 00:21:15.627792+00
\.


--
-- Data for Name: navigation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.navigation (id, label, path, parent_id, order_index, is_active, children, "position", type, created_at) FROM stdin;
07def1e2-b38f-4da9-b661-0c703cd564b1	Giới thiệu chung	/about-us	5ae0758f-cf8f-4a16-8f59-3ac864a5c10e	1	t	\N	footer	internal	2026-04-01 09:54:05.223487+00
60370ba3-47e8-4f7f-adfe-683f643c8094	Tuyển dụng	/careers	5ae0758f-cf8f-4a16-8f59-3ac864a5c10e	3	t	\N	footer	internal	2026-04-01 09:54:05.223487+00
dafbd48d-8510-4c5a-a0e8-a39c9805f52c	Dịch vụ & Hỗ trợ	#	\N	2	t	\N	footer	custom	2026-04-01 09:54:05.223487+00
415da321-01c4-43d6-b9ee-5ebda70eb3c0	Tư vấn kỹ thuật	/services/consulting	dafbd48d-8510-4c5a-a0e8-a39c9805f52c	1	t	\N	footer	internal	2026-04-01 09:54:05.223487+00
cbfee428-8cae-48f7-860d-2a8b70c4b99e	Bảo trì & Sửa chữa	/services/maintenance	dafbd48d-8510-4c5a-a0e8-a39c9805f52c	2	t	\N	footer	internal	2026-04-01 09:54:05.223487+00
1a2f83cc-f77f-4ac9-ab5d-477fbff1198a	Liên hệ báo giá	/contact	dafbd48d-8510-4c5a-a0e8-a39c9805f52c	3	t	\N	footer	internal	2026-04-01 09:54:05.223487+00
bd0d2a19-573f-43fa-9a79-945d2c7ff593	Chính sách	#	\N	3	t	\N	footer	custom	2026-04-01 09:54:05.223487+00
a6bfa5ba-adbe-48d7-8c84-28a8e1589c43	Chính sách bảo mật	/chinh-sach-bao-mat	bd0d2a19-573f-43fa-9a79-945d2c7ff593	1	t	\N	footer	internal	2026-04-01 09:54:05.223487+00
3ef39b54-bd59-4aaa-8fdb-c65a4817fbcb	Điều khoản sử dụng	/dieu-khoan-su-dung	bd0d2a19-573f-43fa-9a79-945d2c7ff593	2	t	\N	footer	internal	2026-04-01 09:54:05.223487+00
3b6de810-6572-41ae-bcb7-5c444023266f	Chính sách Cookie	/chinh-sach-cookie	bd0d2a19-573f-43fa-9a79-945d2c7ff593	3	t	\N	footer	internal	2026-04-01 09:54:05.223487+00
d3e0044e-cc34-4756-8fc9-22a6935d45d1	Sơ đồ trang	/legal/sitemap	bd0d2a19-573f-43fa-9a79-945d2c7ff593	4	t	\N	footer	internal	2026-04-01 09:54:05.223487+00
743b1c7e-a558-4ff7-a38b-e0effb25c53d	Hệ thống lạnh	/page/he-thong-lanh	\N	2	t	\N	header	internal	2026-04-04 01:52:45.207958+00
7f4d50e9-e076-4d9f-bf69-e5dd406656c9	Khám phá	/#	\N	6	t	[{"id": "a7469b72-393e-4324-818a-7b945ec07243", "path": "/products", "type": "internal", "label": "Sản phẩm", "children": [], "position": "header", "is_active": true, "parent_id": "7f4d50e9-e076-4d9f-bf69-e5dd406656c9", "created_at": "2026-04-01T09:54:05.223487+00:00", "order_index": 1}, {"id": "155a258c-e42d-487a-a6eb-6cb0591bdcaa", "path": "/services", "type": "internal", "label": "Dịch vụ", "children": [], "position": "header", "is_active": true, "parent_id": "7f4d50e9-e076-4d9f-bf69-e5dd406656c9", "created_at": "2026-04-01T09:54:05.223487+00:00", "order_index": 2}, {"id": "d19790e6-601e-4bab-998a-3ec450cfffb3", "path": "/projects", "type": "internal", "label": "Dự án", "children": [], "position": "header", "is_active": true, "parent_id": "7f4d50e9-e076-4d9f-bf69-e5dd406656c9", "created_at": "2026-04-01T09:54:05.223487+00:00", "order_index": 3}, {"id": "b8f762a9-dcb0-4841-b287-cf6525752886", "path": "/team", "type": "internal", "label": "Đội ngũ", "children": [], "position": "header", "is_active": true, "parent_id": "7f4d50e9-e076-4d9f-bf69-e5dd406656c9", "created_at": "2026-04-01T12:26:47.770175+00:00", "order_index": 4}, {"id": "cae770ac-35fa-4f81-8e13-8d79ba14c7b0", "path": "/news", "type": "internal", "label": "Tin tức", "children": [], "position": "header", "is_active": true, "parent_id": "7f4d50e9-e076-4d9f-bf69-e5dd406656c9", "created_at": "2026-04-01T09:54:05.223487+00:00", "order_index": 6}, {"id": "temp-1775347461065", "path": "/ho-so-nang-luc", "type": "internal", "label": "hồ sơ năng lực", "position": "header", "is_active": true, "parent_id": "7f4d50e9-e076-4d9f-bf69-e5dd406656c9", "order_index": 6}]	header	internal	2026-04-04 09:02:10.571453+00
155a258c-e42d-487a-a6eb-6cb0591bdcaa	Dịch vụ	/services	7f4d50e9-e076-4d9f-bf69-e5dd406656c9	2	t	\N	header	internal	2026-04-01 09:54:05.223487+00
bb07a2e7-9e8c-4935-8a5c-fe876d20a917	Hệ thống tích hợp	/he-thong-tich-hop	\N	5	t	\N	header	internal	2026-04-04 09:26:45.301177+00
cae770ac-35fa-4f81-8e13-8d79ba14c7b0	Tin tức	/news	7f4d50e9-e076-4d9f-bf69-e5dd406656c9	6	t	\N	header	internal	2026-04-01 09:54:05.223487+00
4f438203-49d5-4d89-8dac-eaaa24325cc3	Liên hệ	/contact	\N	7	t	\N	header	internal	2026-04-01 09:54:05.223487+00
d19790e6-601e-4bab-998a-3ec450cfffb3	Dự án	/projects	7f4d50e9-e076-4d9f-bf69-e5dd406656c9	3	t	\N	header	internal	2026-04-01 09:54:05.223487+00
79a34d07-a021-4419-8788-63e28bec45dd	Hồ sơ năng lực	/ho-so-nang-luc	5ae0758f-cf8f-4a16-8f59-3ac864a5c10e	2	t	\N	footer	internal	2026-04-01 09:54:05.223487+00
b8f762a9-dcb0-4841-b287-cf6525752886	Đội ngũ	/team	7f4d50e9-e076-4d9f-bf69-e5dd406656c9	4	t	\N	header	internal	2026-04-01 12:26:47.770175+00
a7469b72-393e-4324-818a-7b945ec07243	Sản phẩm	/products	7f4d50e9-e076-4d9f-bf69-e5dd406656c9	1	t	\N	header	internal	2026-04-01 09:54:05.223487+00
1252bc4f-6ab9-4b22-b52e-cc1db4d27dc5	Giới thiệu	/about-us	\N	1	t	\N	header	internal	2026-04-01 09:54:05.223487+00
9f06e299-20fd-4529-b353-1a51d4d22078	Cơ điện	/he-thong-co-dien	\N	3	t	\N	header	internal	2026-04-04 08:33:39.173427+00
86d93fa7-c3b8-49e8-8104-f78dbb65d641	Trung tâm dữ liệu	/he-thong-dc-management	\N	4	t	\N	header	internal	2026-04-04 08:52:20.4254+00
5ae0758f-cf8f-4a16-8f59-3ac864a5c10e	Về VVC	/#	\N	1	t	[{"id": "07def1e2-b38f-4da9-b661-0c703cd564b1", "path": "/about-us", "type": "internal", "label": "Giới thiệu chung", "children": [], "position": "footer", "is_active": true, "parent_id": "5ae0758f-cf8f-4a16-8f59-3ac864a5c10e", "created_at": "2026-04-01T09:54:05.223487+00:00", "order_index": 1}, {"id": "79a34d07-a021-4419-8788-63e28bec45dd", "path": "/ho-so-nang-luc", "type": "internal", "label": "Hồ sơ năng lực", "children": [], "position": "footer", "is_active": true, "parent_id": "5ae0758f-cf8f-4a16-8f59-3ac864a5c10e", "created_at": "2026-04-01T09:54:05.223487+00:00", "order_index": 2}, {"id": "60370ba3-47e8-4f7f-adfe-683f643c8094", "path": "/recruitment", "type": "internal", "label": "Tuyển dụng", "children": [], "position": "footer", "is_active": true, "parent_id": "5ae0758f-cf8f-4a16-8f59-3ac864a5c10e", "created_at": "2026-04-01T09:54:05.223487+00:00", "order_index": 3}]	footer	custom	2026-04-01 09:54:05.223487+00
135f5cb8-0104-4d28-886d-524d5c45835a	Tuyển dụng	/careers	7f4d50e9-e076-4d9f-bf69-e5dd406656c9	6	t	\N	header	internal	2026-04-05 00:42:41.351845+00
8ff979a1-517f-4f18-bb7b-135bf57b39b2	Hồ sơ năng lực	/ho-so-nang-luc	7f4d50e9-e076-4d9f-bf69-e5dd406656c9	7	t	\N	header	internal	2026-04-05 00:43:28.639655+00
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news (id, title, slug, summary, content, image_url, publish_date, author, category_id, tags, views, created_at, updated_at) FROM stdin;
3d1230bf-df83-4361-b486-a8c0984a570b	Xu hướng công nghệ điều hòa không khí 2025	vvc-xu-huong-cong-nghe-2025	Các xu hướng công nghệ mới trong ngành HVAC năm 2025: AI, IoT, và giải pháp xanh.	<h2>Công nghệ HVAC thế hệ mới</h2><p>Năm 2025 đánh dấu bước ngoặt lớn của ngành HVAC với sự tích hợp sâu của trí tuệ nhân tạo (AI) và Internet of Things (IoT). Các hệ thống điều hòa thông minh có khả năng tự học hành vi sử dụng và tối ưu hóa hiệu suất năng lượng.</p><p>VVC là một trong những đơn vị tiên phong trong việc áp dụng các công nghệ này vào các giải pháp cho khách hàng.</p>	https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800	2026-03-21 02:24:07.865592+00	Phòng R&D VVC	f9ac9112-089a-406a-9ae2-12d1ce7e5b2f	{"công nghệ",AI,IoT,HVAC}	567	2026-04-02 02:24:07.865592+00	2026-04-02 02:24:07.865592+00
a7ee9fc6-7b29-4c4c-897c-ba14c40b6d32	Hướng dẫn bảo trì hệ thống điều hòa mùa hè	vvc-huong-dan-bao-tri-mua-he	Những lưu ý quan trọng để bảo trì hệ thống điều hòa trước mùa hè, giúp tiết kiệm điện và tăng tuổi thọ thiết bị.	<h2>Bảo trì đúng cách - Tiết kiệm hơn 20% điện năng</h2><p>Mùa hè đến, nhu cầu sử dụng điều hòa tăng cao. Việc bảo trì định kỳ sẽ giúp hệ thống vận hành hiệu quả hơn, tiết kiệm đến 20% điện năng tiêu thụ.</p><p>VVC khuyến nghị thực hiện các bước bảo trì: Vệ sinh lưới lọc 2 tuần/lần, kiểm tra gas 6 tháng/lần, vệ sinh dàn nóng 3 tháng/lần...</p>	https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800	2026-03-03 02:24:07.865592+00	Phòng Kỹ thuật VVC	f9ac9112-089a-406a-9ae2-12d1ce7e5b2f	{"bảo trì","tiết kiệm điện","mùa hè"}	1205	2026-04-02 02:24:07.865592+00	2026-04-02 02:24:07.865592+00
d7331071-7fb2-4fa7-a5b3-cea381870ff1	VVC hoàn thành dự án hệ thống lạnh cho Vinamilk Factory	vvc-hoan-thanh-du-an-vinamilk	Tổng công ty VVC vừa hoàn thành lắp đặt hệ thống điều hòa trung tâm và kho lạnh cho nhà máy Vinamilk tại Bình Dương.	<h2>Dự án tiêu biểu của VVC trong năm 2024</h2><p>VVC đã hoàn thành việc lắp đặt toàn bộ hệ thống điều hòa trung tâm và kho lạnh bảo quản sản phẩm cho nhà máy Vinamilk tại KCN VSIP II, Bình Dương. Đây là một trong những dự án lớn nhất mà VVC thực hiện trong năm 2024.</p><p>Hệ thống bao gồm 2 chiller giải nhiệt nước với tổng công suất 1000 RT, hệ thống AHU cho khu vực sản xuất và 3 kho lạnh bảo quản sản phẩm ở các mức nhiệt độ khác nhau.</p>	https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800	2026-03-28 02:24:07.865592+00	Ban biên tập VVC	0df76eab-0904-4e00-8b90-244d28a03a55	{"dự án","kho lạnh","công nghiệp"}	234	2026-04-02 02:24:07.865592+00	2026-04-02 02:24:07.865592+00
50150c29-e99a-4e8a-8330-196f42ad4dbb	VVC nhận giải thưởng Doanh nghiệp Xanh 2024	vvc-giai-thuong-doanh-nghiep-xanh-2024	VVC vinh dự nhận giải thưởng Doanh nghiệp Xanh 2024 vì những đóng góp trong lĩnh vực tiết kiệm năng lượng.	<h2>Giải thưởng uy tín cho doanh nghiệp bền vững</h2><p>Ngày 15/11/2024, tại Hà Nội, VVC vinh dự nhận giải thưởng "Doanh nghiệp Xanh 2024" do Bộ Tài nguyên và Môi trường trao tặng. Giải thưởng ghi nhận những nỗ lực không ngừng của VVC trong việc cung cấp các giải pháp điện lạnh thân thiện với môi trường và tiết kiệm năng lượng.</p>	https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800	2026-03-13 02:24:07.865592+00	Ban truyền thông VVC	0df76eab-0904-4e00-8b90-244d28a03a55	{"giải thưởng",xanh,"bền vững"}	890	2026-04-02 02:24:07.865592+00	2026-04-02 02:24:07.865592+00
ee9105c3-9f8d-4aad-b668-05b3eedb9b47	VVC mở rộng chi nhánh tại Đà Nẵng	vvc-mo-rong-chi-nhanh-da-nang	VVC chính thức khai trương chi nhánh mới tại Đà Nẵng, phục vụ khách hàng khu vực miền Trung.	<h2>Mở rộng mạng lưới phục vụ toàn quốc</h2><p>Ngày 01/10/2024, VVC chính thức khai trương chi nhánh mới tại 123 Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng. Đây là bước đi quan trọng trong chiến lược mở rộng mạng lưới toàn quốc của VVC, nhằm phục vụ tốt hơn khách hàng khu vực miền Trung - Tây Nguyên.</p>	https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800	2026-02-16 02:24:07.865592+00	Ban biên tập VVC	0df76eab-0904-4e00-8b90-244d28a03a55	{"chi nhánh","Đà Nẵng","mở rộng"}	432	2026-04-02 02:24:07.865592+00	2026-04-02 02:24:07.865592+00
\.


--
-- Data for Name: partners; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.partners (id, name, logo_url, website_url, display_order, is_active, created_at, updated_at) FROM stdin;
536281e5-f83c-4e22-ad03-cede78a3f88a	vietvinh	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/3b1c60c4-e737-41e7-aee5-25a6999e4888.png		999	t	2026-04-08 15:55:23.512339+00	2026-04-08 15:55:23.512339+00
c4a57cde-f9d9-4242-8c03-7ff6c2e35461	testngay	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/62b1233a-d387-4915-b6de-81164cfa7dfd.png		999	t	2026-04-08 15:57:20.808652+00	2026-04-09 08:36:29.615222+00
572dc950-da40-462c-b401-3b439dd93937	a	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/089f7de3-c4c3-46ca-b3c0-b094c394323a.png		999	t	2026-04-08 15:59:07.484612+00	2026-04-09 08:36:46.242598+00
82539466-c8b9-4d69-aac8-60701036384d	aaa	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/caae4687-f5c2-4903-bc1b-09f6ce4aa253.png		999	t	2026-04-08 16:13:36.259438+00	2026-04-09 08:37:01.953657+00
87066f15-9a4a-43bd-8bb8-61b224039a7b	daikin	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/8a332956-9042-4728-abbb-a34ccbb384c6.png		999	t	2026-04-09 08:37:27.095443+00	2026-04-09 08:37:27.095443+00
79b8fa10-8f8e-4775-b767-88c8a3fc13b2	panasonic	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/a77e923a-e03a-4e55-ae1f-311c81e0b7b9.png		999	t	2026-04-09 08:37:44.036125+00	2026-04-09 08:37:44.036125+00
d1d54227-e207-48f6-adcf-47e6143073b7	frascold	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/f70b748b-b816-48dc-8684-f0aa9633f612.png		999	t	2026-04-09 08:38:15.084995+00	2026-04-09 08:38:15.084995+00
04c27cc9-7863-407d-8be4-a483490b0b84	gea	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/3797d5fd-8c59-4316-8994-c025e7a2c75f.png		999	t	2026-04-09 08:38:32.016575+00	2026-04-09 08:38:32.016575+00
2aa1b4a0-1e3a-4092-9ac0-fd3576778bea	emerson	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/63bbdf16-ea16-475d-9dee-1ee90c8fd2ba.png		999	t	2026-04-09 08:38:50.663101+00	2026-04-09 08:38:50.663101+00
fae593b9-337a-4b67-8f67-c4cb842a2cf8	danfoss 	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/df295804-caf1-4401-8cf4-31ee83b6a9fa.png		999	t	2026-04-09 08:39:39.440164+00	2026-04-09 08:39:39.440164+00
962f72e0-84b4-449f-846c-43c1eaf9113d	unicons	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/eeac9edc-ee61-4062-8ef5-0856c39bfb1a.png		999	t	2026-04-09 08:39:56.446488+00	2026-04-09 08:39:56.446488+00
147525fa-6b90-4fb3-9624-46a470a74635	abb	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/a2145f22-379b-4645-8e57-1283f0c727c3.png		999	t	2026-04-09 08:40:11.330172+00	2026-04-09 08:40:11.330172+00
89b389c6-ea72-4838-942b-6e618c2de794	Johnson Controls	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/306f9054-9235-49bf-90b7-a16c28cbea51.png		999	t	2026-04-09 08:40:32.571075+00	2026-04-09 08:40:32.571075+00
dcef3021-6cec-4009-afe8-2e4659c17da7	Turner	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/530cd125-e5be-419a-95d4-aba8f48dfb2e.png		999	t	2026-04-09 08:40:48.919104+00	2026-04-09 08:40:48.919104+00
d7167f77-f27b-4dce-b0f8-f95b3178cbcd	trane	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/3bfcf5c0-cee2-4623-ba1d-6d945dcb9a17.png		999	t	2026-04-09 08:41:05.090291+00	2026-04-09 08:41:05.090291+00
94ce19eb-0f73-4c67-8dad-b9ea01308915	Hòa Bình	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/e7b1206e-7421-4b90-902d-cfceb5581535.png		999	t	2026-04-09 08:41:19.779677+00	2026-04-09 08:41:19.779677+00
29d20edd-5ff6-427d-a0f5-5c2ac7e90930	Ricons	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/81029cc7-cc97-4867-9780-a68c5d47f72e.png		999	t	2026-04-09 08:41:34.250866+00	2026-04-09 08:41:34.250866+00
a9bf22fe-c6ba-4a9c-b396-d463400722fb	csvc	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/partners/f7e63169-ab40-4a27-909b-9e48ffb0f460.png		0	t	2026-04-10 13:38:24.645478+00	2026-04-10 13:38:24.645478+00
de96907d-14ee-4e87-a756-982701912814	IBM	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/partners/7792a071-79e5-471d-a8dc-22997e39821f.png		0	t	2026-04-10 13:38:56.913341+00	2026-04-10 13:38:56.913341+00
48ca01e2-d24f-4f1b-87bf-6a159668dcb8	HPE	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/partners/145d9c90-638e-4284-b455-daf2de8016f4.png		0	t	2026-04-10 13:39:10.536422+00	2026-04-10 13:39:10.536422+00
b1f7b33b-c9c8-4531-846f-f266545d7cca	APC	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/partners/3f38ec7e-ef7a-4bab-a852-f6e56d050b24.png		0	t	2026-04-10 13:39:24.351575+00	2026-04-10 13:39:24.351575+00
9a568e1c-6682-4396-bd2e-468934cb9ec2	Delta	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/partners/b54df34c-61eb-42b4-a0f5-5fa1da55e191.jpg		0	t	2026-04-10 13:39:37.814568+00	2026-04-10 13:39:37.814568+00
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, code, description, created_at) FROM stdin;
128d69a5-b3ee-4000-920e-33187d6c2e22	users.view	View users list	2026-04-01 09:54:05.223487+00
4eaeb7cc-d5d5-4690-bcdd-52c604fd63c5	users.create	Create new users	2026-04-01 09:54:05.223487+00
9ca90f9a-526b-4f0a-a254-1a292286a0d5	users.edit	Edit existing users	2026-04-01 09:54:05.223487+00
e2d55256-ed1a-446c-99ef-9605fc20a7d7	users.delete	Delete users	2026-04-01 09:54:05.223487+00
5963ccda-7e81-48f1-ae3f-4761ec2d65f0	roles.manage	Manage roles and permissions	2026-04-01 09:54:05.223487+00
be41e7ae-9033-4515-b12a-4fa4c37a070e	content.view	View content	2026-04-01 09:54:05.223487+00
35bc9bfd-19b3-4700-9b56-f607394eb562	content.create	Create content	2026-04-01 09:54:05.223487+00
e15d5525-856e-48f4-9df4-294ca4c063b7	content.edit	Edit content	2026-04-01 09:54:05.223487+00
5e5f1729-fdbd-4abd-9be7-25d6cddce8d8	content.delete	Delete content	2026-04-01 09:54:05.223487+00
7e6ce08e-1634-4118-a838-8187872f16b2	dashboard.view	Access the admin dashboard	2026-04-01 09:54:05.223487+00
9b1e9d8f-4adf-4a5d-93b8-285f289f7489	settings.view	View system settings	2026-04-01 09:54:05.223487+00
a255581c-2912-4473-8d2f-18e117011d00	settings.manage	Manage system settings	2026-04-01 09:54:05.223487+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, slug, description, category_id, price, is_new, is_bestseller, image_url, features, specifications, created_at, updated_at) FROM stdin;
9759eff5-5b8c-420b-9099-822f0f9ef2f6	Hệ thống VRV/VRF công nghiệp	vvc-vrv-vrf-industrial	Hệ thống điều hòa trung tâm VRV/VRF công suất lớn, phù hợp cho các nhà máy, khu công nghiệp và tòa nhà thương mại quy mô lớn. Tiết kiệm năng lượng lên đến 30% so với hệ thống truyền thống.	237bccb0-8eb5-4d8d-a16d-7ed36ae1efdc	Liên hệ	f	t	https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800	["Công suất từ 8HP đến 60HP", "Tiết kiệm năng lượng 30%", "Inverter thế hệ mới", "Điều khiển thông minh BMS"]	{"cop": "4.12", "refrigerant": "R410A", "power_supply": "380V/3P/50Hz", "cooling_capacity": "22.4kW - 168kW"}	2026-04-02 02:24:07.632087+00	2026-04-02 02:24:07.632087+00
205b6d23-f1f6-4de7-9cc7-ab89286c94b7	Điều hòa dân dụng cao cấp	vvc-residential-premium	Dòng điều hòa dân dụng cao cấp với công nghệ lọc không khí tiên tiến, tiết kiệm điện tối ưu và thiết kế sang trọng phù hợp mọi không gian sống.	365f2324-9bc5-44a4-9491-9fb962ef6000	\N	t	t	https://cdnv2.tgdd.vn/mwg-static/common/News/0/01-1020x570-fix-1020x570%20%281%29.jpg	["Công nghệ Nanoe-X khử khuẩn", "Inverter tiết kiệm 60% điện năng", "Cảm biến chuyển động thông minh", "Vận hành siêu êm 19dB"]	{"refrigerant": "R32", "power_supply": "220V/1P/50Hz", "energy_rating": "5 sao", "cooling_capacity": "2.5kW - 7.1kW"}	2026-04-02 02:24:07.632087+00	2026-04-02 02:24:07.632087+00
c6dae63a-1b4c-4021-825c-b161ae77d663	Hệ thống điều hòa thương mại	vvc-commercial-hvac	Giải pháp điều hòa toàn diện cho văn phòng, showroom, nhà hàng và cửa hàng. Thiết kế linh hoạt, lắp đặt nhanh chóng, vận hành êm ái.	6049a6ae-0775-469b-84d1-7ca6819c23b6	\N	f	t	https://lanhcongnghiep.com.vn/wp-content/uploads/2020/09/maximark-can-tho.jpg	["Công suất 2HP - 10HP", "Thiết kế âm trần cassette", "Gas R32 thân thiện môi trường", "Điều khiển wifi thông minh"]	{"noise_level": "< 38dB", "refrigerant": "R32", "power_supply": "220V/1P/50Hz", "cooling_capacity": "5.6kW - 28kW"}	2026-04-02 02:24:07.632087+00	2026-04-02 02:24:07.632087+00
ff779a17-fee9-41ea-9ed7-76e31919fbbb	Điều hòa Chiller giải nhiệt nước	vvc-chiller-water-cooled	Hệ thống Chiller giải nhiệt nước công suất lớn, thiết kế cho các tòa nhà cao tầng, trung tâm thương mại và bệnh viện. Vận hành ổn định, hiệu suất cao.	237bccb0-8eb5-4d8d-a16d-7ed36ae1efdc	Liên hệ	t	f	https://dienmaydongsapa.com/wp-content/uploads/2023/06/Chiller-Daikin-ZUWY1.jpg	["Công suất 100-2000 RT", "Hiệu suất COP > 6.0", "Máy nén trục vít/ly tâm", "Hệ thống giám sát từ xa"]	{"cop": "6.1", "refrigerant": "R134a/R513A", "power_supply": "380V/3P/50Hz", "cooling_capacity": "350kW - 7000kW"}	2026-04-02 02:24:07.632087+00	2026-04-02 02:24:07.632087+00
f7f8c7af-a65b-4579-8987-725749645a83	Kho lạnh bảo quản công nghiệp	vvc-cold-storage-industrial	Hệ thống kho lạnh công nghiệp chuyên dụng cho bảo quản thực phẩm, dược phẩm và hàng hóa nhạy cảm nhiệt độ. Đạt chuẩn HACCP và GMP.	4ed856c9-6bfa-47e8-8115-9d60fbe4ba14	Liên hệ	f	t	https://warehousesolution.vn/wp-content/uploads/2022/11/bangkok-thailand-scaled.jpeg	["Nhiệt độ -40°C đến +15°C", "Panel PU cách nhiệt 100-200mm", "Hệ thống giám sát nhiệt độ 24/7", "Đạt chuẩn HACCP, GMP"]	{"compressor": "Bitzer/Copeland", "monitoring": "IoT 24/7", "panel_thickness": "100-200mm", "temperature_range": "-40°C đến +15°C"}	2026-04-02 02:24:07.632087+00	2026-04-02 02:24:07.632087+00
7ac38dfd-5a39-457f-b4bb-ba4c8826aecc	Panel PU Cam-lock tiêu chuẩn xuất khẩu	panel-pu-cam-lock	Tấm cách nhiệt Polyurethane tỉ trọng 42kg/m3, sử dụng khóa Cam-lock để đảm bảo kín khít tuyệt đối.	f3080f2d-68b2-4c87-b880-7619e79aa37f	\N	\N	\N	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_panel.png	["Khóa Cam-lock kín khí", "Tỉ trọng 42kg/m3", "Chống cháy lan B2"]	{"Bề mặt": "Inox 304 / Tôn mạ màu", "Độ dày": "50, 75, 100, 150mm", "Khổ rộng": "1120mm"}	2026-04-09 11:39:58.807595+00	2026-04-09 11:39:58.807595+00
82a06b47-9718-4b1f-bd2d-7f5ea0b85d25	Cửa trượt kho lạnh tự động công nghệ EU	cua-truot-kho-lanh-tu-dong	Khung inox 304 bền bỉ, hệ thống điện sưởi chống đóng băng gioăng cửa, tích hợp cảm biến radar.	8e054a40-db44-449f-b3a1-2fd05ecaba1e	\N	\N	\N	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_door.png	["Cảm biến tự động", "Inox 304 cao cấp", "Chống đóng băng gioăng"]	{"Kích thước": "Tùy chọn theo dự án", "Tốc độ mở": "0.5 - 1.2m/s", "Điện áp sưởi": "220V"}	2026-04-09 11:39:58.807595+00	2026-04-09 11:39:58.807595+00
2a75bf76-e9f7-4db4-bad3-f1c8289a4f8a	Hệ thống AHU xử lý không khí	vvc-ahu-air-handling	Air Handling Unit (AHU) - Hệ thống xử lý không khí trung tâm cho phòng sạch, bệnh viện và nhà máy sản xuất. Đáp ứng tiêu chuẩn ISO 14644.	237bccb0-8eb5-4d8d-a16d-7ed36ae1efdc	Liên hệ	t	f	https://lead.com.vn/wp-content/uploads/2023/09/IMAGE_AHU_05.jpg	["Lọc HEPA H13/H14", "Kiểm soát nhiệt độ ±0.5°C", "Kiểm soát độ ẩm ±3%RH", "Tiêu chuẩn phòng sạch ISO Class 5-8"]	{"air_flow": "1000-50000 CMH", "filter_class": "HEPA H14", "humidity_control": "±3%RH", "temperature_control": "±0.5°C"}	2026-04-02 02:24:07.632087+00	2026-04-02 02:24:07.632087+00
27929d5b-b29d-42a3-89c3-46bce2255df1	Dàn lạnh công nghiệp - Frost Free Design	dan-lanh-cong-nghiep-frost-free	Hệ thống dàn lạnh hiệu suất cao, thiết kế chống đóng tuyết, tối ưu lưu lượng gió xuyên suốt kho.	f592ab7f-b303-4baf-a56e-0e154dc9d2fa	\N	t	f	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_compressor.png	["Chống đóng tuyết", "Vỏ inox 304", "Quạt tiết kiệm điện EC"]	{"Môi chất": "NH3/Freon/Glycol", "Lưu lượng gió": "5.000 - 50.000 m3/h", "Khoảng cách thổi": "Tới 30m"}	2026-04-09 11:53:48.613848+00	2026-04-09 11:53:48.613848+00
93455216-6092-450a-a535-09e157c7258f	Hệ thống tủ điều khiển iBMS thông minh	tu-dieu-khien-ibms-thong-minh	Tích hợp màn hình cảm ứng HMI, thuật toán AI dự đoán phụ tải nhiệt, giúp hệ thống vận hành trơn tru.	891bdefa-08c5-42c5-ac35-5b5897d58b02	\N	t	t	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_panel.png	["Màn hình HMI 10 inch", "Giám sát qua Wifi/4G", "Thuật toán AI tiết kiệm 71%"]	{"Kết nối": "RS485/Modbus/Ethernet", "Điện áp": "380V/3P/50Hz", "Tiêu chuẩn": "IP65"}	2026-04-09 11:53:48.613848+00	2026-04-09 11:53:48.613848+00
98570916-4065-410b-8f2d-10998ee36d63	Dàn ngưng giải nhiệt gió Evaporative Condenser	dan-ngung-giai-nhiet-gio-evaporative	Dàn ngưng kết hợp bay hơi nước, giảm công suất điện tiêu thụ so với dàn ngưng gió thông thường. Phù hợp cho các nhà máy quy mô lớn.	f592ab7f-b303-4baf-a56e-0e154dc9d2fa	\N	f	t	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_compressor.png	["Tiết kiệm 40% điện năng", "Giảm tiếng ồn đáng kể", "Bảo trì dễ dàng", "Tuổi thọ trên 15 năm"]	{"Vỏ": "Tôn mạ kẽm / Inox 304", "Motor quạt": "Tiết kiệm EC", "Ứng dụng": "Nhà máy, Kho lạnh lớn", "Công suất tản nhiệt": "100 - 2.000 kW"}	2026-04-09 11:57:22.668488+00	2026-04-09 11:57:22.668488+00
db1e0108-999c-439d-bb58-b3b7eed47a7d	Panel PIR chống cháy chuẩn FM Global	panel-pir-chong-chay-fm-global	Tấm cách nhiệt Polyisocyanurate (PIR) đạt tiêu chuẩn chống cháy FM Global Approval cho các công trình bảo hiểm quốc tế yêu cầu.	f3080f2d-68b2-4c87-b880-7619e79aa37f	\N	t	f	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_panel.png	["FM Global Approved", "Chống cháy B1/B-s1,d0", "Tỉ trọng 45kg/m3", "Bề mặt Inox Food Grade"]	{"Khóa": "Cam-lock bước nối cam", "Bề mặt": "Inox 304BA / Tôn màu PVDF", "Độ dày": "50, 75, 100, 125, 150mm", "Chứng nhận": "FM, CE, ISO 9001"}	2026-04-09 11:57:22.668488+00	2026-04-09 11:57:22.668488+00
f6a90695-bfdc-4221-944c-be154f16d7dd	Cửa kho khí quyển CA (Controlled Atmosphere)	cua-kho-khi-quyen-ca	Cửa chuyên dụng cho kho bảo quản khí quyển điều chỉnh (CA Storage), đảm bảo kín khí tuyệt đối để duy trì tỷ lệ O2/CO2.	8e054a40-db44-449f-b3a1-2fd05ecaba1e	\N	t	f	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_door.png	["Kín khí tuyệt đối", "Gioăng nén 3 lớp", "Cửa sổ quan sát", "Van cân áp tích hợp"]	{"Gioăng": "EPDM chịu nhiệt", "Áp dụng": "Kho bảo quản trái cây, rau củ", "Rò rỉ khí": "< 0.05 m3/h", "Kích thước": "Tùy chọn"}	2026-04-09 11:57:22.668488+00	2026-04-09 11:57:22.668488+00
0baec947-9b7e-4370-9e6a-f89cebdace64	Van tiết lưu điện tử EEV - Tối ưu bằng AI	van-tiet-luu-dien-tu-eev	Van tiết lưu điện tử (Electronic Expansion Valve) được điều khiển bởi thuật toán AI, tự động tối ưu lưu lượng môi chất lạnh theo phụ tải thực tế.	891bdefa-08c5-42c5-ac35-5b5897d58b02	\N	t	t	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_door.png	["Điều khiển bằng AI", "Phản ứng nhanh 0.5 giây", "Tiết kiệm 15% năng lượng", "Bảo vệ máy nén tối ưu"]	{"Môi chất": "R404A, R507, R134a, NH3", "Dải công suất": "1 - 200 kW", "Nhiệt độ vận hành": "-40°C đến +70°C", "Tín hiệu điều khiển": "4-20mA / PWM"}	2026-04-09 11:57:22.668488+00	2026-04-09 11:57:22.668488+00
8f5c8a61-0125-4f4e-8b37-75ca99b87059	Cụm máy nén giải nhiệt gió - Thế hệ mới	cum-may-nen-giai-nhiet-gio	Sử dụng máy nén Bitzer (Đức), tối ưu hóa hiệu suất làm lạnh và tiết kiệm điện năng lên đến 30%.	f592ab7f-b303-4baf-a56e-0e154dc9d2fa	\N	t	t	https://dieuhoaxanh.vn/wp-content/uploads/2021/01/Cum-may-nen-dan-ngung-cho-kho-lanh.png	["Tiết kiệm điện 30%", "Vận hành êm ái", "Điều khiển qua App"]	{"Môi chất": "R404A/R507", "Xuất xứ": "Đức/VietVinh Assembly", "Công suất": "10-150 HP"}	2026-04-09 11:39:58.807595+00	2026-04-09 11:39:58.807595+00
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, name, slug, description, content, image_url, client, completion_date, category_id, is_featured, created_at, updated_at) FROM stdin;
7c65f536-9559-4655-89a7-c1f7fda07b48	Hệ thống kho lạnh trung tâm tại Khu Logistics Miền Tây	du-an-logistics-mien-tay	Thi công trọn gói cụm kho lạnh 5.000 tấn, sử dụng công nghệ quản lý kho thông minh và máy nén hiệu suất cao.	\n      <div class="space-y-8">\n        <h3>Tổng quan dự án</h3>\n        <p>Dự án xây dựng trọn gói cụm kho lạnh trung tâm với tổng sức chứa 5.000 tấn hàng hóa, phục vụ mảng logistics chuỗi lạnh (Cold Chain) cho khu vực Đồng bằng sông Cửu Long. Hệ thống được thiết kế theo tiêu chuẩn quốc tế, đáp ứng yêu cầu bảo quản đa nhiệt độ.</p>\n\n        <h3>Phạm vi công việc</h3>\n        <ul>\n          <li>Thiết kế và thi công 8 kho lạnh với 3 dải nhiệt độ: +2°C đến +8°C (mát), -18°C đến -25°C (đông), -35°C đến -45°C (cấp đông nhanh).</li>\n          <li>Lắp đặt hệ thống máy nén đa cấp (Cascade) với công suất tổng 500 HP.</li>\n          <li>Thi công hệ thống Panel PU Cam-lock dày 150mm, đạt chuẩn chống cháy B2.</li>\n          <li>Triển khai hệ thống giám sát nhiệt độ Cloud thời gian thực qua ứng dụng di động.</li>\n        </ul>\n\n        <h3>Kết quả đạt được</h3>\n        <div class="grid md:grid-cols-3 gap-4">\n          <div class="bg-blue-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-blue-600">5.000</div>\n            <div class="text-sm text-gray-600">Tấn sức chứa</div>\n          </div>\n          <div class="bg-green-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-green-600">35%</div>\n            <div class="text-sm text-gray-600">Tiết kiệm điện năng</div>\n          </div>\n          <div class="bg-amber-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-amber-600">6</div>\n            <div class="text-sm text-gray-600">Tháng thi công</div>\n          </div>\n        </div>\n\n        <h3>Công nghệ áp dụng</h3>\n        <p>Dự án ứng dụng thuật toán điều khiển thông minh (Learning Algorithm) để tự động tối ưu chu kỳ phá băng, giúp giảm 35% chi phí điện năng so với thiết kế truyền thống. Hệ thống quản lý kho thông minh WMS được tích hợp giúp vận hành trơn tru.</p>\n      </div>\n    	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_warehouse.png	Tập đoàn Logistics hàng đầu Việt Nam	2023-10-15 00:00:00+00	4e4696a2-7a18-4b0d-91f6-77c4e25671dd	t	2026-04-09 11:39:59.186537+00	2026-04-09 11:39:59.186537+00
309c3034-81f7-447b-9d35-f142ded51623	Kho lạnh Bảo quản Thực phẩm Chế biến	vvc-vissan-cold-storage	Thiết kế và thi công kho lạnh bảo quản 2.000 tấn cho nhà máy chế biến thực phẩm quy mô lớn tại Bình Dương.	\n      <div class="space-y-6">\n        <h3>Tổng quan dự án</h3>\n        <p>Thiết kế và thi công kho lạnh bảo quản 2.000 tấn cho nhà máy chế biến thực phẩm. Hệ thống sử dụng máy nén Screw hiệu suất cao và Panel PU 150mm đạt tiêu chuẩn vệ sinh an toàn thực phẩm.</p>\n        <h3>Phạm vi công việc</h3>\n        <ul>\n          <li>Kho mát +2°C đến +8°C với sức chứa 1.000 tấn.</li>\n          <li>Kho đông -25°C với sức chứa 1.000 tấn.</li>\n          <li>Hệ thống giám sát nhiệt độ CloudBased 24/7.</li>\n          <li>Panel PU 150mm với khóa Cam-lock và bề mặt Inox Food Grade.</li>\n        </ul>\n        <h3>Kết quả đạt được</h3>\n        <div class="grid md:grid-cols-3 gap-4">\n          <div class="bg-blue-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-blue-600">2.000</div>\n            <div class="text-sm text-gray-600">Tấn sức chứa</div>\n          </div>\n          <div class="bg-green-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-green-600">HACCP</div>\n            <div class="text-sm text-gray-600">Đạt tiêu chuẩn</div>\n          </div>\n          <div class="bg-amber-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-amber-600">30%</div>\n            <div class="text-sm text-gray-600">Tiết kiệm điện</div>\n          </div>\n        </div>\n      </div>\n    	https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800	Doanh nghiệp Chế biến Thực phẩm hàng đầu	2024-03-20 00:00:00+00	83275b10-f880-4972-b996-39c3fadbff7f	t	2026-04-02 02:24:08.062228+00	2026-04-02 02:24:08.062228+00
bdfdaf6f-99fc-40f9-817d-99cff5f62adb	Hệ thống HVAC Trung tâm Thương mại Quốc tế	vvc-aeon-mall-ha-dong	Cung cấp và lắp đặt hệ thống điều hòa trung tâm VRV cho trung tâm thương mại quy mô 50.000m2, phục vụ hàng triệu lượt khách mỗi năm.	\n      <div class="space-y-6">\n        <h3>Tổng quan dự án</h3>\n        <p>Triển khai hệ thống VRV/VRF toàn diện cho trung tâm thương mại quốc tế quy mô 50.000m2. Hệ thống bao gồm 120 dàn nóng và hơn 500 dàn lạnh, phục vụ đa dạng không gian từ khu mua sắm, rạp chiếu phim đến khu ẩm thực.</p>\n        <h3>Phạm vi công việc</h3>\n        <ul>\n          <li>Thiết kế hệ thống VRV/VRF đa tầng cho toàn bộ tòa nhà 5 tầng + 2 tầng hầm.</li>\n          <li>Lắp đặt hệ thống thông gió tươi (Fresh Air) và hệ thống hút khói tầng hầm.</li>\n          <li>Tích hợp BMS giám sát năng lượng và điều khiển tập trung từ phòng kỹ thuật.</li>\n          <li>Hệ thống quạt tăng áp cầu thang bộ theo tiêu chuẩn PCCC.</li>\n        </ul>\n        <h3>Kết quả đạt được</h3>\n        <div class="grid md:grid-cols-3 gap-4">\n          <div class="bg-blue-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-blue-600">50.000</div>\n            <div class="text-sm text-gray-600">m2 diện tích phục vụ</div>\n          </div>\n          <div class="bg-green-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-green-600">500+</div>\n            <div class="text-sm text-gray-600">Dàn lạnh lắp đặt</div>\n          </div>\n          <div class="bg-amber-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-amber-600">8</div>\n            <div class="text-sm text-gray-600">Tháng thi công</div>\n          </div>\n        </div>\n      </div>\n    	https://cdn2.fptshop.com.vn/unsafe/aeon_mall_ha_dong_9_a1314de5e6.jpg	Tập đoàn Bán lẻ hàng đầu Châu Á	2023-11-10 00:00:00+00	673c4282-879b-4d2b-a4d8-dc8ce63121c9	t	2026-04-02 02:24:08.062228+00	2026-04-02 02:24:08.062228+00
ffdaed60-ca2a-4ea3-b6fd-72de61c49a35	Nhà máy chế biến Thủy sản tiêu biểu - Tiêu chuẩn EU/HACCP	du-an-nha-may-thuy-san-tieu-chuan-eu	Cung cấp hệ thống cấp đông IQF, kho bảo quản -25 độ C và hệ thống điều hòa khu vực sản xuất.	\n      <div class="space-y-8">\n        <h3>Tổng quan dự án</h3>\n        <p>Cung cấp giải pháp hệ thống cấp đông và bảo quản toàn diện cho nhà máy chế biến thủy hải sản quy mô lớn, đáp ứng tiêu chuẩn xuất khẩu EU/HACCP. Dự án bao gồm cả hệ thống IQF (Individual Quick Freezing) và kho bảo quản dài hạn.</p>\n\n        <h3>Phạm vi công việc</h3>\n        <ul>\n          <li>Hệ thống cấp đông IQF công suất 5 tấn/giờ cho tôm và cá phi lê.</li>\n          <li>Kho bảo quản -25°C với sức chứa 3.000 tấn.</li>\n          <li>Hệ thống điều hòa khu vực sản xuất duy trì 18°C ± 1°C.</li>\n          <li>Hệ thống ống công nghệ vi sinh (Sanitary Piping) bằng Inox 316L Food Grade.</li>\n        </ul>\n\n        <h3>Kết quả đạt được</h3>\n        <div class="grid md:grid-cols-3 gap-4">\n          <div class="bg-blue-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-blue-600">5T/h</div>\n            <div class="text-sm text-gray-600">Công suất IQF</div>\n          </div>\n          <div class="bg-green-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-green-600">EU</div>\n            <div class="text-sm text-gray-600">Đạt chuẩn xuất khẩu</div>\n          </div>\n          <div class="bg-amber-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-amber-600">3.000</div>\n            <div class="text-sm text-gray-600">Tấn kho bảo quản</div>\n          </div>\n        </div>\n\n        <h3>Điểm nổi bật</h3>\n        <p>Hệ thống IQF được thiết kế theo dạng băng chuyền (belt tunnel), đảm bảo sản phẩm đóng băng riêng lẻ, giữ nguyên hình dáng và chất lượng dinh dưỡng. Toàn bộ hệ thống được giám sát và ghi lại dữ liệu nhiệt độ liên tục 24/7 để phục vụ truy xuất nguồn gốc.</p>\n      </div>\n    	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_factory.png	Doanh nghiệp xuất khẩu Thủy sản xuất sắc	2024-02-20 00:00:00+00	859114f6-fb38-43fc-96eb-a953e5e91fc2	t	2026-04-09 11:39:59.186537+00	2026-04-09 11:39:59.186537+00
070546f8-c9f4-4398-943d-b2c36c03af72	Hệ thống MEP & Phòng sạch Nhà máy Linh kiện Điện tử	du-an-mep-phong-sach-dien-tu	Lắp đặt hệ thống điều hòa chính xác, xử lý bụi ISO Class 5 và hệ thống ống công nghệ kỹ thuật cao.	\n      <div class="space-y-8">\n        <h3>Tổng quan dự án</h3>\n        <p>Triển khai hệ thống MEP (Cơ Điện) tổng thể và phòng sạch tiêu chuẩn ISO Class 5 cho nhà máy sản xuất linh kiện điện tử của nhà đầu tư FDI công nghệ cao. Dự án yêu cầu độ chính xác cao về nhiệt độ, độ ẩm và mật độ hạt bụi.</p>\n\n        <h3>Phạm vi công việc</h3>\n        <ul>\n          <li>Hệ thống HVAC chính xác (Precision Cooling) duy trì 22°C ± 0.5°C, độ ẩm 45% ± 5%.</li>\n          <li>Hệ thống xử lý không khí AHU với bộ lọc HEPA H14 (hiệu suất lọc 99.995%).</li>\n          <li>Hệ thống điện hạ thế và UPS dự phòng đảm bảo vận hành liên tục.</li>\n          <li>Hệ thống phòng cháy chữa cháy bằng khí FM200 cho khu vực nhạy cảm.</li>\n        </ul>\n\n        <h3>Kết quả đạt được</h3>\n        <div class="grid md:grid-cols-3 gap-4">\n          <div class="bg-blue-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-blue-600">ISO 5</div>\n            <div class="text-sm text-gray-600">Cấp sạch đạt được</div>\n          </div>\n          <div class="bg-green-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-green-600">±0.5°C</div>\n            <div class="text-sm text-gray-600">Độ chính xác nhiệt</div>\n          </div>\n          <div class="bg-amber-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-amber-600">99.99%</div>\n            <div class="text-sm text-gray-600">Uptime hệ thống</div>\n          </div>\n        </div>\n\n        <h3>Công nghệ áp dụng</h3>\n        <p>Hệ thống BMS (Building Management System) được tích hợp để giám sát và điều khiển tập trung toàn bộ hệ thống MEP, bao gồm HVAC, chiếu sáng, PCCC và an ninh. Giao diện điều khiển trực quan trên màn hình cảm ứng giúp vận hành viên quản lý hiệu quả.</p>\n      </div>\n    	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_hvac.png	Nhà đầu tư FDI công nghệ cao	2024-01-10 00:00:00+00	86d19566-59cb-4c25-a17e-7d8baa06cc7b	t	2026-04-09 11:39:59.186537+00	2026-04-09 11:39:59.186537+00
0c661290-26a9-4c09-855b-2a0df30d1d18	Hệ thống kho siêu lạnh âm sâu -60°C cho thực phẩm cao cấp	du-an-kho-am-sau-60-do	Thiết kế và lắp đặt trọn gói hệ thống kho âm sâu, sử dụng máy nén đa cấp (Cascade) công nghệ Nhật Bản.	\n      <div class="space-y-8">\n        <h3>Tổng quan dự án</h3>\n        <p>Thiết kế và lắp đặt hệ thống kho âm sâu -60°C sử dụng công nghệ máy nén đa cấp (Cascade System), phục vụ bảo quản dài hạn các loại thực phẩm cao cấp như sashimi cá ngừ đại dương và các sản phẩm thủy sản giá trị cao.</p>\n\n        <h3>Phạm vi công việc</h3>\n        <ul>\n          <li>Hệ thống Cascade 2 cấp: CO2 (cấp thấp) kết hợp NH3 (cấp cao).</li>\n          <li>Kho bảo quản -60°C với Panel dày 200mm, gioăng kép chống thất thoát nhiệt.</li>\n          <li>Hệ thống sàn sưởi (Floor Heating) chống phồng rộp nền do nhiệt độ cực thấp.</li>\n          <li>Hệ thống kiểm soát ra vào và airlock kép ngăn ngừng sốc nhiệt.</li>\n        </ul>\n\n        <h3>Kết quả đạt được</h3>\n        <div class="grid md:grid-cols-3 gap-4">\n          <div class="bg-blue-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-blue-600">-60°C</div>\n            <div class="text-sm text-gray-600">Nhiệt độ bảo quản</div>\n          </div>\n          <div class="bg-green-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-green-600">CO2</div>\n            <div class="text-sm text-gray-600">Môi chất tự nhiên</div>\n          </div>\n          <div class="bg-amber-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-amber-600">24/7</div>\n            <div class="text-sm text-gray-600">Giám sát liên tục</div>\n          </div>\n        </div>\n\n        <h3>Điểm nổi bật</h3>\n        <p>Công nghệ Cascade sử dụng môi chất tự nhiên CO2/NH3 giúp giảm thiểu tác động môi trường so với các hệ thống truyền thống sử dụng gas Freon. Hệ thống đạt chứng nhận an toàn thực phẩm và truy xuất nguồn gốc cho thị trường Nhật Bản.</p>\n      </div>\n    	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_factory.png	Tập đoàn Chế biến Thực phẩm xuất khẩu	2024-03-01 00:00:00+00	859114f6-fb38-43fc-96eb-a953e5e91fc2	t	2026-04-09 11:53:51.15615+00	2026-04-09 11:53:51.15615+00
30d9a941-a06a-4a13-afc0-a6f1c7a4e2a3	Nhà máy Sản xuất Dược phẩm đạt chuẩn GMP-WHO	du-an-nha-may-duoc-pham-gmp	Triển khai hệ thống điều hòa chính xác (Precision Cooling) và hệ thống xử lý không khí AHU chuyên dụng.	\n      <div class="space-y-8">\n        <h3>Tổng quan dự án</h3>\n        <p>Triển khai hệ thống điều hòa chính xác và xử lý không khí cho nhà máy sản xuất dược phẩm đạt chuẩn GMP-WHO. Dự án yêu cầu kiểm soát nghiêm ngặt về nhiệt độ, độ ẩm, áp suất vi sai giữa các phòng và nồng độ hạt bụi.</p>\n\n        <h3>Phạm vi công việc</h3>\n        <ul>\n          <li>Hệ thống AHU (Air Handling Unit) với bộ lọc Pre-filter, Medium filter và HEPA.</li>\n          <li>Kiểm soát áp suất vi sai (Differential Pressure) giữa các khu vực: Hành lang > Sạch > Siêu sạch.</li>\n          <li>Hệ thống BMS giám sát các thông số: nhiệt độ, độ ẩm, áp suất, particle count.</li>\n          <li>Hệ thống nước tinh khiết (Purified Water) và nước cất (WFI).</li>\n        </ul>\n\n        <h3>Kết quả đạt được</h3>\n        <div class="grid md:grid-cols-3 gap-4">\n          <div class="bg-blue-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-blue-600">GMP</div>\n            <div class="text-sm text-gray-600">Đạt chứng nhận WHO</div>\n          </div>\n          <div class="bg-green-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-green-600">Class D</div>\n            <div class="text-sm text-gray-600">Cấp sạch phòng sản xuất</div>\n          </div>\n          <div class="bg-amber-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-amber-600">100%</div>\n            <div class="text-sm text-gray-600">Đạt IQ/OQ/PQ</div>\n          </div>\n        </div>\n\n        <h3>Công nghệ áp dụng</h3>\n        <p>Hệ thống điều hòa sử dụng công nghệ biến tần (Inverter) kết hợp bộ gia nhiệt (Re-heater) để kiểm soát chính xác nhiệt độ và độ ẩm. Toàn bộ hệ thống được validation (IQ/OQ/PQ) theo quy trình chuẩn GMP trước khi bàn giao.</p>\n      </div>\n    	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_hvac.png	Công ty Cổ phần Dược phẩm quy mô lớn	2024-01-20 00:00:00+00	86d19566-59cb-4c25-a17e-7d8baa06cc7b	t	2026-04-09 11:53:51.15615+00	2026-04-09 11:53:51.15615+00
b2d40cac-fa03-4382-8f37-0d6632265dd4	Chuỗi kho lạnh Mini cho Trung tâm Phân phối Bán lẻ	du-an-kho-lanh-mini-ban-le	Triển khai hệ thống 12 kho lạnh mini (20-50m2) cho chuỗi trung tâm phân phối thực phẩm sạch, tối ưu không gian và chi phí vận hành.	\n        <div class="space-y-6">\n          <h3>Tổng quan</h3>\n          <p>Thiết kế và lắp đặt hệ thống 12 kho lạnh mini cho chuỗi trung tâm phân phối thực phẩm sạch. Mỗi kho lạnh được tối ưu hóa cho không gian từ 20-50m2, phù hợp với mô hình bán lẻ hiện đại.</p>\n          <h3>Điểm nổi bật</h3>\n          <ul>\n            <li>Thiết kế module hóa, lắp đặt nhanh trong 3-5 ngày/kho.</li>\n            <li>Hệ thống điều khiển tập trung từ xa qua Cloud.</li>\n            <li>Tiết kiệm 25% chi phí điện so với giải pháp truyền thống.</li>\n          </ul>\n        </div>\n      	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_warehouse.png	Chuỗi bán lẻ Thực phẩm sạch	2023-08-15 00:00:00+00	4e4696a2-7a18-4b0d-91f6-77c4e25671dd	f	2026-04-09 11:57:23.057323+00	2026-04-09 11:57:23.057323+00
37d44da0-b8e4-4ae6-8598-7adca55a01d9	Hệ thống làm lạnh Nhà máy Nước giải khát - Dây chuyền tự động	du-an-nha-may-nuoc-giai-khat	Cung cấp hệ thống chiller làm mát nước cho dây chuyền sản xuất nước giải khát công suất 500.000 lít/ngày.	\n        <div class="space-y-6">\n          <h3>Tổng quan</h3>\n          <p>Thiết kế và lắp đặt hệ thống chiller công suất lớn (tổng 2.000 RT) để làm mát nước phục vụ dây chuyền sản xuất nước giải khát tự động công suất 500.000 lít/ngày.</p>\n          <h3>Phạm vi</h3>\n          <ul>\n            <li>Hệ thống chiller screw giải nhiệt nước, công suất 2.000 RT.</li>\n            <li>Hệ thống bơm nước lạnh và đường ống cách nhiệt.</li>\n            <li>Tích hợp hệ thống BMS giám sát COP và năng lượng tiêu thụ.</li>\n          </ul>\n        </div>\n      	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_hvac.png	Tập đoàn FMCG hàng đầu	2024-05-10 00:00:00+00	86d19566-59cb-4c25-a17e-7d8baa06cc7b	f	2026-04-09 11:57:23.057323+00	2026-04-09 11:57:23.057323+00
3f863d71-cbc5-417a-87b2-de5556eec4d7	Hệ thống Điều hòa Bệnh viện Đa khoa Quốc tế	vvc-vinmec-hospital	Lắp đặt hệ thống HVAC và xử lý không khí cho bệnh viện đa khoa quốc tế với các yêu cầu đặc thù về phòng mổ và phòng cách ly.	\n      <div class="space-y-6">\n        <h3>Tổng quan dự án</h3>\n        <p>Triển khai hệ thống HVAC chuyên dụng cho bệnh viện đa khoa quốc tế, bao gồm hệ thống điều hòa phòng mổ (áp suất dương), phòng cách ly (áp suất âm) và hệ thống xử lý không khí tươi.</p>\n        <h3>Phạm vi công việc</h3>\n        <ul>\n          <li>Hệ thống AHU với bộ lọc HEPA cho 12 phòng mổ tiêu chuẩn.</li>\n          <li>Hệ thống Chiller 800 RT phục vụ toàn bệnh viện 500 giường.</li>\n          <li>Hệ thống khí y tế (O2, N2O, Vacuum, Air compressor).</li>\n          <li>Hệ thống xử lý nước thải y tế theo tiêu chuẩn TCVN.</li>\n        </ul>\n        <h3>Kết quả đạt được</h3>\n        <div class="grid md:grid-cols-3 gap-4">\n          <div class="bg-blue-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-blue-600">800 RT</div>\n            <div class="text-sm text-gray-600">Công suất Chiller</div>\n          </div>\n          <div class="bg-green-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-green-600">12</div>\n            <div class="text-sm text-gray-600">Phòng mổ HEPA</div>\n          </div>\n          <div class="bg-amber-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-amber-600">500</div>\n            <div class="text-sm text-gray-600">Giường bệnh</div>\n          </div>\n        </div>\n      </div>\n    	https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800	Tập đoàn Y tế tư nhân hàng đầu	2024-01-25 00:00:00+00	673c4282-879b-4d2b-a4d8-dc8ce63121c9	f	2026-04-02 02:24:08.062228+00	2026-04-02 02:24:08.062228+00
169bfa14-ebbc-4b21-bdd2-365d01c13649	Hệ thống HVAC Nhà máy Sản xuất Điện tử FDI	vvc-samsung-hcmc-hvac	Triển khai hệ thống điều hòa chính xác cho nhà máy sản xuất công nghệ cao, đảm bảo kiểm soát nhiệt độ và độ ẩm nghiêm ngặt.	\n      <div class="space-y-6">\n        <h3>Tổng quan dự án</h3>\n        <p>Lắp đặt hệ thống điều hòa chính xác cho nhà máy sản xuất điện tử công nghệ cao, yêu cầu kiểm soát nhiệt độ ±0.5°C và độ ẩm ±3% trong toàn bộ khu vực sản xuất.</p>\n        <h3>Phạm vi công việc</h3>\n        <ul>\n          <li>Hệ thống Chiller giải nhiệt nước công suất 1.500 RT.</li>\n          <li>AHU với bộ lọc HEPA H13 cho khu vực phòng sạch ISO Class 7.</li>\n          <li>Hệ thống ống gió cách âm và chống rung cho khu văn phòng.</li>\n          <li>Hệ thống điện và UPS dự phòng cho các thiết bị quan trọng.</li>\n        </ul>\n        <h3>Kết quả đạt được</h3>\n        <div class="grid md:grid-cols-3 gap-4">\n          <div class="bg-blue-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-blue-600">1.500 RT</div>\n            <div class="text-sm text-gray-600">Công suất Chiller</div>\n          </div>\n          <div class="bg-green-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-green-600">ISO 7</div>\n            <div class="text-sm text-gray-600">Cấp sạch đạt được</div>\n          </div>\n          <div class="bg-amber-50 p-4 rounded-lg text-center">\n            <div class="text-3xl font-bold text-amber-600">±0.5°C</div>\n            <div class="text-sm text-gray-600">Độ chính xác nhiệt</div>\n          </div>\n        </div>\n      </div>\n    	https://quanganhcgte.com/wp-content/uploads/2025/08/IMG_1743936231653_1743989695049-1024x768.jpg	Tập đoàn Điện tử FDI tại TP.HCM	2024-06-15 00:00:00+00	83275b10-f880-4972-b996-39c3fadbff7f	t	2026-04-02 02:24:08.062228+00	2026-04-02 02:24:08.062228+00
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resources (id, title, slug, description, content, icon, link, type, features, parent_id, created_at) FROM stdin;
b7408e4a-c06b-4379-9689-42fd3e13ea23	Dữ liệu & Thống kê năng lượng	statistics	Truy cập dữ liệu phân tích và thống kê về hiệu suất năng lượng...	\N	LineChart	/data/statistics	category	["Chỉ số hiệu suất năng lượng (EER/COP)", "Chi phí vận hành và bảo trì", "Phân tích ROI và thời gian hoàn vốn", "Dữ liệu phát thải carbon và tác động môi trường"]	\N	2026-04-01 09:54:05.223487+00
03afe72a-b89c-4811-9f9a-d38b077817c8	Công cụ tính toán & Thiết kế	tools	Sử dụng các công cụ tính toán và thiết kế để lựa chọn hệ thống...	\N	Gauge	/data/tools	category	["Tính toán tải lạnh cho không gian", "So sánh hiệu suất và chi phí giữa các hệ thống", "Phân tích tiết kiệm năng lượng và giảm chi phí", "Tư vấn lựa chọn giải pháp phù hợp"]	\N	2026-04-01 09:54:05.223487+00
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_permissions (role_id, permission_id, created_at) FROM stdin;
admin	128d69a5-b3ee-4000-920e-33187d6c2e22	2026-04-01 09:54:05.223487+00
admin	4eaeb7cc-d5d5-4690-bcdd-52c604fd63c5	2026-04-01 09:54:05.223487+00
admin	9ca90f9a-526b-4f0a-a254-1a292286a0d5	2026-04-01 09:54:05.223487+00
admin	e2d55256-ed1a-446c-99ef-9605fc20a7d7	2026-04-01 09:54:05.223487+00
admin	5963ccda-7e81-48f1-ae3f-4761ec2d65f0	2026-04-01 09:54:05.223487+00
admin	be41e7ae-9033-4515-b12a-4fa4c37a070e	2026-04-01 09:54:05.223487+00
admin	35bc9bfd-19b3-4700-9b56-f607394eb562	2026-04-01 09:54:05.223487+00
admin	e15d5525-856e-48f4-9df4-294ca4c063b7	2026-04-01 09:54:05.223487+00
admin	5e5f1729-fdbd-4abd-9be7-25d6cddce8d8	2026-04-01 09:54:05.223487+00
admin	7e6ce08e-1634-4118-a838-8187872f16b2	2026-04-01 09:54:05.223487+00
admin	9b1e9d8f-4adf-4a5d-93b8-285f289f7489	2026-04-01 09:54:05.223487+00
admin	a255581c-2912-4473-8d2f-18e117011d00	2026-04-01 09:54:05.223487+00
editor	128d69a5-b3ee-4000-920e-33187d6c2e22	2026-04-01 09:54:05.223487+00
editor	be41e7ae-9033-4515-b12a-4fa4c37a070e	2026-04-01 09:54:05.223487+00
editor	35bc9bfd-19b3-4700-9b56-f607394eb562	2026-04-01 09:54:05.223487+00
editor	e15d5525-856e-48f4-9df4-294ca4c063b7	2026-04-01 09:54:05.223487+00
editor	5e5f1729-fdbd-4abd-9be7-25d6cddce8d8	2026-04-01 09:54:05.223487+00
editor	7e6ce08e-1634-4118-a838-8187872f16b2	2026-04-01 09:54:05.223487+00
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, description, created_at) FROM stdin;
super_admin	Super Administrator	Has full system access and can manage all aspects of the platform.	2026-04-01 09:54:05.223487+00
admin	Administrator	Full system access	2026-04-01 09:54:05.223487+00
editor	Editor	Can manage content but not users or system settings	2026-04-01 09:54:05.223487+00
user	User	Standard user access	2026-04-01 09:54:05.223487+00
\.


--
-- Data for Name: service_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.service_categories (id, name, slug, description, display_order, is_active, created_at, updated_at) FROM stdin;
7d4a9218-7627-4ebf-8c83-3cf66ebc9428	Tư vấn & Thiết kế	consulting-design	Dịch vụ tư vấn giải pháp và thiết kế hệ thống điện lạnh.	0	t	2026-04-05 00:38:55.792491+00	2026-04-05 00:38:55.792491+00
b39b9404-e447-4f6c-90a3-9ad258853f2d	Cung cấp & Lắp đặt	supply-installation	Cung cấp thiết bị chính hãng và lắp đặt chuyên nghiệp.	0	t	2026-04-05 00:38:55.925611+00	2026-04-05 00:38:55.925611+00
cf4e86f6-6b38-438e-9693-49cc3a7c1078	Bảo trì & Sửa chữa	maintenance-repair	Dịch vụ bảo dưỡng định kỳ và sửa chữa sự cố 24/7.	0	t	2026-04-05 00:38:56.020947+00	2026-04-05 00:38:56.020947+00
f8fdfeaa-e393-46f3-9f8c-c0607e080873	CSKH 24/7	cskh-24-7	CSKH 24/7	4	t	2026-04-05 01:07:02.965711+00	2026-04-05 01:07:02.965711+00
c382b460-edda-4aa5-89a6-6c0a8239e2bd	Kỹ thuật & Giải pháp	ky-thuat-giai-phap	\N	1	t	2026-04-09 11:53:47.604476+00	2026-04-09 11:53:47.604476+00
\.


--
-- Data for Name: service_inquiries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.service_inquiries (id, service_id, name, email, phone, company, message, status, created_at, updated_at) FROM stdin;
3b557592-a839-4895-9295-075b497f9e54	18782263-0507-49d6-95c6-5f12a7eb6cd2	NGUYEN THIEN LUAN	luan.nguyenthien@gmail.com	0834807962		qưqcqcqc qưdqwqdwqwwd	new	2026-04-05 00:49:06.951883+00	2026-04-05 00:49:06.951883+00
c6753f8f-d8d3-44b1-9cf7-8962bb3838dc	18782263-0507-49d6-95c6-5f12a7eb6cd2	quanlykhoiluongcongviec	luan.nguyenthien@gmail.com	0834807962		qưdqqwd qwdqwdqw d	new	2026-04-05 00:54:55.486922+00	2026-04-05 00:54:55.486922+00
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (id, slug, title, description, content, icon, image_url, is_active, category_id, created_at, updated_at) FROM stdin;
ba448aea-0e73-47e9-a34b-8be88197f462	cskh-24-7	CSKH 247	chăm sóc KH 24/7	chăm sóc KH 24/7			t	f8fdfeaa-e393-46f3-9f8c-c0607e080873	2026-04-05 01:09:19.926826+00	2026-04-05 01:09:19.926826+00
d3502863-4f77-4e4e-9fc0-00f7db49460d	tu-van-thiet-ke-he-thong-nhiet	Tư vấn & Thiết kế Hệ thống Nhiệt - Điện lạnh	Giải pháp thiết kế "may đo" dựa trên công nghệ mô phỏng nhiệt độ thực tế, tối ưu hóa PUE và chi phí vận hành.	\n        <div class="space-y-6">\n          <p class="text-lg">Tại VietVinhCorp, chúng tôi không chỉ vẽ bản vẽ, chúng tôi kiến tạo các giải pháp năng lượng bền vững. Quy trình tư vấn thiết kế của chúng tôi dựa trên 20 năm kinh nghiệm và các công cụ mô phỏng hiện đại nhất.</p>\n          \n          <h3 class="text-2xl font-bold text-blue-800">Quy trình 5 bước tiêu chuẩn:</h3>\n          <ol class="list-decimal pl-6 space-y-4">\n            <li><strong>Khảo sát & Phân tích (Site Audit):</strong> Đánh giá nhu cầu thực tế, điều kiện khí hậu và đặc tính sản phẩm cần bảo quản.</li>\n            <li><strong>Tính toán phụ tải nhiệt & Mô phỏng:</strong> Sử dụng phần mềm chuyên dụng để tính toán chính xác công suất cần thiết, tránh lãng phí.</li>\n            <li><strong>Thiết kế giải pháp tối ưu (BIM/3D):</strong> Xây dựng mô hình 3D giúp khách hàng hình dung trực quan và tối ưu hóa không gian lắp đặt.</li>\n            <li><strong>Lập dự toán & Lộ trình tiết kiệm điện:</strong> Đề xuất các thuật toán điều khiển giúp giảm tới 71% chi phí điện năng.</li>\n            <li><strong>Bàn giao Hồ sơ kỹ thuật:</strong> Cung cấp bộ hồ sơ đầy đủ, sẵn sàng cho giai đoạn thi công.</li>\n          </ol>\n\n          <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">\n            <h4 class="font-bold mb-2">Điểm khác biệt của VietVinh:</h4>\n            <ul class="list-disc pl-5">\n              <li>Ứng dụng thuật toán AI trong việc quản lý chu kỳ phá băng.</li>\n              <li>Thiết kế tích hợp năng lượng tái tạo (Solar Cold Storage).</li>\n              <li>Tối ưu hóa luân chuyển khí động học trong kho.</li>\n            </ul>\n          </div>\n        </div>\n      	\N	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/serv_design.png	t	c382b460-edda-4aa5-89a6-6c0a8239e2bd	2026-04-09 11:53:47.896788+00	2026-04-09 11:53:47.896788+00
b44803a7-beb3-4233-be3e-c51c93cbbda3	thi-cong-lap-dat-kho-lanh	Thi công & Lắp đặt Kho lạnh chuyên sâu	Đội ngũ kỹ sư tinh nhuệ, thi công mọi địa hình từ kho cấp đông siêu tốc -60°C đến hệ thống kho khí quyển CA.	\n        <div class="space-y-6">\n          <p>VietVinh sở hữu đội ngũ kỹ thuật viên giàu kinh nghiệm, đã thực hiện hàng trăm dự án trọng điểm trên toàn quốc. Chúng tôi cam kết tiến độ và chất lượng thi công đạt chuẩn quốc tế.</p>\n          \n          <h3 class="text-2xl font-bold text-blue-800">Năng lực thực hiện:</h3>\n          <ul class="grid md:grid-cols-2 gap-4 list-none p-0">\n            <li class="bg-white p-4 shadow-sm rounded border">✅ Kho đông sâu tới -60°C (Deep Freezing)</li>\n            <li class="bg-white p-4 shadow-sm rounded border">✅ Kho khí quyển CA (Controlled Atmosphere)</li>\n            <li class="bg-white p-4 shadow-sm rounded border">✅ Hệ thống HVAC cho phòng sạch Dược phẩm</li>\n            <li class="bg-white p-4 shadow-sm rounded border">✅ Lắp đặt hệ ống công nghệ vi sinh (Inox Food Grade)</li>\n          </ul>\n\n          <h3 class="text-xl font-bold">Cam kết chất lượng:</h3>\n          <p>Mọi dự án đều tuân thủ nghiêm ngặt tiêu chuẩn 5S và an toàn lao động. Chúng tôi sử dụng các vật liệu cách nhiệt (Panel) có khả năng chống cháy lan B2 và phụ kiện Inox 304 bền bỉ.</p>\n        </div>\n      	\N	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_hvac.png	t	c382b460-edda-4aa5-89a6-6c0a8239e2bd	2026-04-09 11:53:47.896788+00	2026-04-09 11:53:47.896788+00
29c904f5-38c3-44c6-8ea7-94f777fac8be	bao-tri-giam-sat-cloud	Dịch vụ Bảo trì & Giám sát Cloud 24/7	Hệ thống giám sát trực tuyến qua Smartphone, cảnh báo sớm sự cố và đội ngũ phản ứng nhanh trong vòng 2 giờ.	\n        <div class="space-y-6">\n          <p>Dịch vụ hậu mãi là niềm tự hào của VietVinhCorp. Chúng tôi không bao giờ để khách hàng cô đơn sau khi bàn giao dự án.</p>\n          \n          <div class="grid md:grid-cols-2 gap-8">\n            <div class="space-y-4">\n              <h4 class="font-bold text-lg">Giám sát Cloud thông minh:</h4>\n              <p>Hệ thống của bạn được kết nối với trung tâm dữ liệu VietVinh. Mọi biến động nhiệt độ đều được ghi lại và gửi cảnh báo tức thì qua Smartphone.</p>\n            </div>\n            <div class="space-y-4">\n              <h4 class="font-bold text-lg">Phản ứng nhanh 2h:</h4>\n              <p>Chúng tôi cam kết có mặt trong vòng 2 giờ (nội thành) và tối đa 12 giờ (tỉnh) để xử lý mọi sự cố, bảo vệ hàng hóa của bạn.</p>\n            </div>\n          </div>\n\n          <h3 class="text-xl font-bold">Gói bảo trì định kỳ:</h3>\n          <ul class="list-disc pl-5 space-y-2">\n            <li>Kiểm tra nồng độ gas và rò rỉ môi chất.</li>\n            <li>Vệ sinh dàn trao đổi nhiệt bằng hóa chất chuyên dụng.</li>\n            <li>Cân chỉnh các thông số vận hành của máy nén.</li>\n            <li>Nâng cấp phần mềm điều khiển tiết kiệm điện.</li>\n          </ul>\n        </div>\n      	\N	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_warehouse.png	t	c382b460-edda-4aa5-89a6-6c0a8239e2bd	2026-04-09 11:53:47.896788+00	2026-04-09 11:53:47.896788+00
10620d51-88e2-4ed5-a726-3cf56f30ef37	bao-tri-dinh-ky	Bảo trì hệ thống định kỳ	Dịch vụ bảo trì, vệ sinh hệ thống định kỳ giúp kéo dài tuổi thọ và tiết kiệm điện năng.	\n      <div class="space-y-6">\n        <p class="text-lg">Dịch vụ bảo trì định kỳ giúp kéo dài tuổi thọ thiết bị, duy trì hiệu suất tối ưu và phát hiện sớm các sự cố tiềm ẩn trước khi chúng trở thành vấn đề nghiêm trọng.</p>\n        <h3>Danh mục kiểm tra định kỳ:</h3>\n        <ul>\n          <li>Kiểm tra áp suất gas, bổ sung môi chất nếu cần.</li>\n          <li>Vệ sinh dàn ngưng, dàn lạnh bằng hóa chất chuyên dụng.</li>\n          <li>Kiểm tra và siết lại các đầu nối điện.</li>\n          <li>Đo dòng điện, điện áp motor quạt và máy nén.</li>\n          <li>Kiểm tra hệ thống điều khiển, cảm biến nhiệt.</li>\n          <li>Vệ sinh bộ lọc gió, kiểm tra đường ống thoát nước ngưng.</li>\n        </ul>\n        <h3>Gói bảo trì linh hoạt:</h3>\n        <div class="grid md:grid-cols-2 gap-4">\n          <div class="bg-white p-5 shadow-sm rounded-lg border">\n            <h4 class="font-bold text-blue-600 mb-2">Gói Cơ bản</h4>\n            <p class="text-sm text-gray-600">Kiểm tra 2 lần/năm. Phù hợp hệ thống nhỏ, văn phòng.</p>\n          </div>\n          <div class="bg-white p-5 shadow-sm rounded-lg border border-blue-200">\n            <h4 class="font-bold text-blue-600 mb-2">Gói Toàn diện</h4>\n            <p class="text-sm text-gray-600">Kiểm tra 4 lần/năm + Hotline ưu tiên. Phù hợp nhà máy, kho lạnh.</p>\n          </div>\n        </div>\n      </div>\n    	Clock	\N	t	cf4e86f6-6b38-438e-9693-49cc3a7c1078	2026-04-05 00:38:56.51356+00	2026-04-05 00:38:56.51356+00
dae5800f-1b76-45d7-9016-16e83132d392	energy-service	Phân tích tối ưu sử dụng năng lượng	Phân tích tối ưu sử dụng năng lượng	Phân tích tối ưu sử dụng năng lượng			t	\N	2026-04-05 01:23:52.337645+00	2026-04-05 01:23:52.337645+00
e1049d6b-7b2a-42c3-af7e-248e17285c65	tu-van-giai-phap	Tư vấn giải pháp điện lạnh	Tư vấn thiết kế hệ thống điều hòa không khí và thông gió (HVAC) tối ưu cho mọi công trình.	\n      <div class="space-y-6">\n        <p class="text-lg">Với kinh nghiệm hơn 20 năm trong ngành điện lạnh công nghiệp, đội ngũ kỹ sư của VietVinhCorp sẵn sàng tư vấn giải pháp toàn diện cho mọi nhu cầu của quý khách hàng.</p>\n        <h3>Các lĩnh vực tư vấn chuyên sâu:</h3>\n        <ul>\n          <li><strong>Kho lạnh bảo quản:</strong> Từ kho mát +2°C đến kho siêu đông -60°C, đáp ứng mọi yêu cầu bảo quản thực phẩm, dược phẩm.</li>\n          <li><strong>Hệ thống HVAC:</strong> Điều hòa trung tâm cho tòa nhà thương mại, nhà máy, bệnh viện.</li>\n          <li><strong>Phòng sạch (Cleanroom):</strong> Thiết kế phòng sạch ISO Class 5-8 cho công nghiệp điện tử, dược phẩm.</li>\n          <li><strong>Hệ thống MEP:</strong> Giải pháp cơ điện tổng thể cho các dự án xây dựng.</li>\n        </ul>\n        <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">\n          <h4 class="font-bold mb-2">Cam kết từ VietVinh:</h4>\n          <p>Tư vấn miễn phí, khảo sát tận nơi trong vòng 24h. Đề xuất giải pháp tối ưu chi phí đầu tư và vận hành.</p>\n        </div>\n      </div>\n    	HelpCircle	\N	t	7d4a9218-7627-4ebf-8c83-3cf66ebc9428	2026-04-05 00:38:56.214358+00	2026-04-05 00:38:56.214358+00
b6bd79eb-7f55-417f-89e4-2e2ca4864b76	thiet-ke-kho-lanh	Thiết kế hệ thống kho lạnh	Thiết kế kho lạnh bảo quản thực phẩm, dược phẩm đạt tiêu chuẩn quốc tế.	\n      <div class="space-y-6">\n        <p class="text-lg">VietVinhCorp chuyên thiết kế hệ thống kho lạnh công nghiệp theo tiêu chuẩn quốc tế, sử dụng phần mềm mô phỏng 3D/BIM hiện đại.</p>\n        <h3>Quy trình thiết kế:</h3>\n        <ol class="list-decimal pl-6 space-y-3">\n          <li><strong>Khảo sát hiện trường:</strong> Đánh giá mặt bằng, điều kiện khí hậu, nhu cầu bảo quản.</li>\n          <li><strong>Tính toán phụ tải nhiệt:</strong> Xác định chính xác công suất lạnh cần thiết.</li>\n          <li><strong>Thiết kế 3D:</strong> Xây dựng mô hình không gian giúp hình dung trực quan.</li>\n          <li><strong>Lập dự toán chi tiết:</strong> Minh bạch từng hạng mục, vật tư, nhân công.</li>\n          <li><strong>Bàn giao hồ sơ:</strong> Bản vẽ kỹ thuật, hồ sơ P&ID, hướng dẫn vận hành.</li>\n        </ol>\n        <h3>Loại kho lạnh chúng tôi thiết kế:</h3>\n        <ul class="grid md:grid-cols-2 gap-3 list-none p-0">\n          <li class="bg-white p-4 shadow-sm rounded border">🧊 Kho mát +2°C đến +8°C</li>\n          <li class="bg-white p-4 shadow-sm rounded border">❄️ Kho đông -18°C đến -25°C</li>\n          <li class="bg-white p-4 shadow-sm rounded border">🌬️ Kho cấp đông nhanh -35°C</li>\n          <li class="bg-white p-4 shadow-sm rounded border">🔬 Kho khí quyển CA</li>\n        </ul>\n      </div>\n    	FileCheck	\N	t	7d4a9218-7627-4ebf-8c83-3cf66ebc9428	2026-04-05 00:38:56.320761+00	2026-04-05 00:38:56.320761+00
1a78e15c-4cc7-4cd6-bfa9-6db3f69df78b	lap-dat-dieu-hoa-trung-tam	Lắp đặt điều hòa trung tâm	Lắp đặt hệ thống VRV/VRF, Chiller chuyên nghiệp cho tòa nhà và nhà máy.	\n      <div class="space-y-6">\n        <p class="text-lg">Lắp đặt hệ thống điều hòa trung tâm cho mọi quy mô công trình: từ văn phòng, trường học đến trung tâm thương mại và nhà máy công nghiệp.</p>\n        <h3>Các hệ thống chúng tôi triển khai:</h3>\n        <ul>\n          <li><strong>VRV/VRF:</strong> Hệ thống biến tần tiết kiệm điện, linh hoạt cho tòa nhà nhiều tầng.</li>\n          <li><strong>Chiller (Water Cooled / Air Cooled):</strong> Hệ thống giải nhiệt nước/gió cho nhà máy và tòa nhà lớn.</li>\n          <li><strong>AHU (Air Handling Unit):</strong> Xử lý không khí chuyên dụng cho phòng sạch, bệnh viện.</li>\n          <li><strong>FCU (Fan Coil Unit):</strong> Giải pháp điều hòa cục bộ linh hoạt.</li>\n        </ul>\n        <h3>Cam kết chất lượng:</h3>\n        <div class="grid md:grid-cols-3 gap-4">\n          <div class="bg-blue-50 p-4 rounded-lg text-center">\n            <div class="text-2xl font-bold text-blue-600">ISO 9001</div>\n            <div class="text-sm text-gray-600">Quy trình chuẩn</div>\n          </div>\n          <div class="bg-green-50 p-4 rounded-lg text-center">\n            <div class="text-2xl font-bold text-green-600">24 tháng</div>\n            <div class="text-sm text-gray-600">Bảo hành thiết bị</div>\n          </div>\n          <div class="bg-amber-50 p-4 rounded-lg text-center">\n            <div class="text-2xl font-bold text-amber-600">An toàn</div>\n            <div class="text-sm text-gray-600">Thi công 5S</div>\n          </div>\n        </div>\n      </div>\n    	Cog	\N	t	b39b9404-e447-4f6c-90a3-9ad258853f2d	2026-04-05 00:38:56.41811+00	2026-04-05 00:38:56.41811+00
18782263-0507-49d6-95c6-5f12a7eb6cd2	sua-chua-khan-cap	Sửa chữa khẩn cấp 24/7	Đội ngũ kỹ thuật sẵn sàng hỗ trợ sửa chữa các sự cố hệ thống lạnh mọi lúc, mọi nơi.	\n      <div class="space-y-6">\n        <p class="text-lg">Khi hệ thống lạnh gặp sự cố, mỗi phút chậm trễ đều có thể gây thiệt hại lớn cho hàng hóa. VietVinhCorp cam kết phản ứng nhanh nhất có thể.</p>\n        <h3>Cam kết thời gian phản hồi:</h3>\n        <div class="grid md:grid-cols-2 gap-4">\n          <div class="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">\n            <h4 class="font-bold text-red-700">Nội thành TP.HCM</h4>\n            <p class="text-2xl font-bold text-red-600">2 giờ</p>\n            <p class="text-sm text-gray-600">Kỹ thuật viên có mặt</p>\n          </div>\n          <div class="bg-amber-50 p-5 rounded-lg border-l-4 border-amber-500">\n            <h4 class="font-bold text-amber-700">Khu vực lân cận</h4>\n            <p class="text-2xl font-bold text-amber-600">4-12 giờ</p>\n            <p class="text-sm text-gray-600">Tùy khoảng cách</p>\n          </div>\n        </div>\n        <h3>Dịch vụ sửa chữa bao gồm:</h3>\n        <ul>\n          <li>Chẩn đoán và xử lý lỗi máy nén (quá tải, kẹt, cháy cuộn dây).</li>\n          <li>Sửa chữa rò rỉ gas, hàn ống đồng/inox.</li>\n          <li>Thay thế linh kiện: van tiết lưu, cảm biến, relay.</li>\n          <li>Sửa chữa tủ điện điều khiển, PLC, biến tần.</li>\n          <li>Xử lý sự cố Panel bị thấm, gioăng cửa bị hỏng.</li>\n        </ul>\n        <div class="bg-blue-50 p-6 rounded-lg">\n          <p class="font-bold">📞 Hotline sửa chữa khẩn cấp: Liên hệ 24/7 qua số điện thoại trên website.</p>\n        </div>\n      </div>\n    	Wrench	\N	t	cf4e86f6-6b38-438e-9693-49cc3a7c1078	2026-04-05 00:38:56.608786+00	2026-04-05 00:38:56.608786+00
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_settings (key, value, description, updated_at) FROM stdin;
company_slogan	Giải pháp MEP & Lạnh toàn diện	\N	2026-04-14 03:33:41.059+00
contact_address	[{"id":"hq-hcm","title":"Trụ sở chính (HCM)","address":"Tầng 14, Tòa nhà HM Town, 412 Nguyễn Thị Minh Khai, Phường Bàn Cờ, Quận 3, TP.HCM","phone":"+84 775 842 789","email":"contact@vietvinhcorp.com","map_url":""},{"id":"branch-thuduc","title":"Văn phòng Thủ Đức","address":"59Bis Đường số 2, P. Thủ Đức, TP.HCM","phone":"+84 384 898 284","email":"contact@vietvinhcorp.com","map_url":""},{"id":"branch-hanoi","title":"Văn phòng Hà Nội","address":"BT1 Đường Phạm Văn Đồng, Quận Bắc Từ Liêm, Hà Nội","phone":"+84 705 789 345","email":"contact@vietvinhcorp.com","map_url":""},{"id":"cskh","title":"Trung tâm CSKH","address":"Hỗ trợ toàn quốc 24/7","phone":"+84 981 789 248","email":"contact@vietvinhcorp.com","map_url":""}]	Địa chỉ công ty	2026-04-14 03:33:41.059+00
contact_email	contact@vietvinhcorp.com	Email liên hệ chính	2026-04-14 03:33:41.059+00
contact_hotline	(+84) 981 789 248	\N	2026-04-14 03:33:41.059+00
contact_phone	+84 775 842 789	Số điện thoại liên hệ	2026-04-14 03:33:41.059+00
copyright_text	© 2026 VIETVINH INDUSTRIES CORPORATION. Bảo lưu mọi quyền.	Text bản quyền footer	2026-04-14 03:33:41.059+00
copyright_text_de	© 2024 VVC. All rights reserved.	\N	2026-04-14 03:33:41.059+00
copyright_text_en	© 2026 VIETVINH INDUSTRIES CORPORATION. All rights reserved.	\N	2026-04-14 03:33:41.059+00
copyright_text_fr	© 2024 VVC. All rights reserved.	\N	2026-04-14 03:33:41.059+00
enable_profile_download	false	\N	2026-04-14 03:33:41.059+00
favicon_url	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/settings/4554fe1a-ad3c-4629-81c3-33988abdce11.png	URL favicon (hiển thị trên tab trình duyệt)	2026-04-14 03:33:41.059+00
footer_logo	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/settings/2d7a7ed9-3dad-4283-8c84-c9351738a77a.png	\N	2026-04-14 03:33:41.059+00
footer_scripts		Custom scripts chèn trước </body> (chat widget, tracking...)	2026-04-14 03:33:41.059+00
google_analytics_id		Google Analytics Tracking ID (GA4, ví dụ: G-XXXXXXXXXX)	2026-04-14 03:33:41.059+00
header_scripts		Custom scripts chèn vào <head> (GTM, Analytics...)	2026-04-14 03:33:41.059+00
og_image_url	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/settings/f7157818-0a79-466c-8f1c-1405cd8a5889.png	Ảnh mặc định khi chia sẻ link trên mạng xã hội (OG Image, khuyến nghị 1200x630px)	2026-04-14 03:33:41.059+00
og_site_name	VVC	Tên website hiển thị trên Open Graph	2026-04-14 03:33:41.059+00
og_type	website	Loại trang (website, article...)	2026-04-14 03:33:41.059+00
og_url	https://vvc.com.vn	URL chính thức của website	2026-04-14 03:33:41.059+00
site_description	Giải pháp tối ưu cho mọi công trình. Hiệu quả, tận tâm, tân tiến.	Mô tả SEO (meta description)	2026-04-14 03:33:41.059+00
company_name	VIETVINH INDUSTRIES CORPORATION	\N	2026-04-14 03:33:41.059+00
twitter_card	summary_large_image	Loại Twitter Card (summary, summary_large_image)	2026-04-14 03:33:41.059+00
twitter_site	@vvcdienlanhvn	Twitter handle của tổ chức	2026-04-14 03:33:41.059+00
contact_address_fr	123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam	\N	2026-04-14 03:33:41.059+00
contact_address_hr	123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam	\N	2026-04-14 03:33:41.059+00
contact_address_ja	123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam	\N	2026-04-14 03:33:41.059+00
contact_address_ko	123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam	\N	2026-04-14 03:33:41.059+00
contact_address_ru	123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam	\N	2026-04-14 03:33:41.059+00
contact_address_sl	123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam	\N	2026-04-14 03:33:41.059+00
contact_address_sr	123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam	\N	2026-04-14 03:33:41.059+00
contact_address_zh	123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam	\N	2026-04-14 03:33:41.059+00
copyright_text_hr	© 2024 VVC. All rights reserved.	\N	2026-04-14 03:33:41.059+00
copyright_text_ja	© 2024 VVC. All rights reserved.	\N	2026-04-14 03:33:41.059+00
copyright_text_ko	© 2024 VVC. All rights reserved.	\N	2026-04-14 03:33:41.059+00
copyright_text_ru	© 2024 VVC. All rights reserved.	\N	2026-04-14 03:33:41.059+00
copyright_text_sl	© 2024 VVC. All rights reserved.	\N	2026-04-14 03:33:41.059+00
copyright_text_sr	© 2024 VVC. All rights reserved.	\N	2026-04-14 03:33:41.059+00
copyright_text_zh	© 2024 VVC. All rights reserved.	\N	2026-04-14 03:33:41.059+00
security_disable_copy	true	\N	2026-04-14 03:33:41.059+00
site_description_de	Umfassende Kältelösungen für alle Projekte. Ansehen, Qualität, Effizienz.	\N	2026-04-14 03:33:41.059+00
site_description_en	Comprehensive refrigeration solutions for all projects. Prestige, Quality, Efficiency.	\N	2026-04-14 03:33:41.059+00
site_description_fr	Solutions de réfrigération complètes pour tous les projets. Prestige, Qualité, Efficacité.	\N	2026-04-14 03:33:41.059+00
site_description_hr	Sveobuhvatna rješenja hlađenja za sve projekte. Ugled, Kvaliteta, Učinkovitost.	\N	2026-04-14 03:33:41.059+00
site_description_ja	あらゆるプロジェクトに対応する包括的な冷凍ソリューション。信頼、品質、効率。	\N	2026-04-14 03:33:41.059+00
site_description_ko	모든 프로젝트를 위한 종합 냉동 솔루션. 신뢰, 품질, 효율.	\N	2026-04-14 03:33:41.059+00
site_description_ru	Комплексные холодильные решения для всех проектов. Престиж, Качество, Эффективность.	\N	2026-04-14 03:33:41.059+00
site_description_sl	Celovite rešitve hlajenja za vse projekte. Ugled, Kakovost, Učinkovitost.	\N	2026-04-14 03:33:41.059+00
contact_address_de	123 Nguyen Van Linh, District 7, Ho Chi Minh City, Vietnam	\N	2026-04-14 03:33:41.059+00
contact_address_en	VIETVINH INDUSTRIES CORPORATION\n\nHead Office: FL.14 HM Town Building, 412 Nguyen Thi Minh Khai St., Ban Co Ward, District 3, HCMC\nPhone: +84 775 842 789 \nEmail: contact@vietvinhcorp.com\n\nThu Duc Office: 59 Bis, Road No. 2, Thu Duc Ward, HCMC\nPhone: +84 384 898 284 \n\nHanoi Office: BT1 Pham Van Dong St., Bac Tu Liem, Ha Noi\nPhone: +84 705 789 345\n\nCustomer Care Center: +84 981 789 248	\N	2026-04-14 03:33:41.059+00
map_embed_url	<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9645.472528389993!2d106.68041869465905!3d10.778324247069579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f07b3a24645%3A0x8190331668205de4!2zVMOyYSBuaMOgIEhNIFRvd24!5e1!3m2!1svi!2s!4v1775848132589!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>	\N	2026-04-14 03:33:41.059+00
site_description_sr	Sveobuhvatna rešenja hlađenja za sve projekte. Ugled, Kvalitet, Efikasnost.	\N	2026-04-14 03:33:41.059+00
site_description_zh	适用于所有项目的全面制冷解决方案。信誉、质量、效率。	\N	2026-04-14 03:33:41.059+00
site_keywords	tủ lạnh thực phẩm, showcase, kho lạnh, điện lạnh, VVC, Việt Vinh , Việt Vinh Corp, hvac, construction, cơ điện lạnh, bảo trì	Từ khóa SEO (phân cách bằng dấu phẩy)	2026-04-14 03:33:41.059+00
site_keywords_de	refrigeration, vvc, hvac, mep, vvc corp	\N	2026-04-14 03:33:41.059+00
site_keywords_en	refrigeration, vvc, hvac, mep, vvc corp	\N	2026-04-14 03:33:41.059+00
site_keywords_fr	refrigeration, vvc, hvac, mep, vvc corp	\N	2026-04-14 03:33:41.059+00
site_keywords_hr	refrigeration, vvc, hvac, mep, vvc corp	\N	2026-04-14 03:33:41.059+00
site_keywords_ja	refrigeration, vvc, hvac, mep, vvc corp	\N	2026-04-14 03:33:41.059+00
site_keywords_ko	refrigeration, vvc, hvac, mep, vvc corp	\N	2026-04-14 03:33:41.059+00
site_keywords_ru	refrigeration, vvc, hvac, mep, vvc corp	\N	2026-04-14 03:33:41.059+00
site_keywords_sl	refrigeration, vvc, hvac, mep, vvc corp	\N	2026-04-14 03:33:41.059+00
site_keywords_sr	refrigeration, vvc, hvac, mep, vvc corp	\N	2026-04-14 03:33:41.059+00
site_keywords_zh	refrigeration, vvc, hvac, mep, vvc corp	\N	2026-04-14 03:33:41.059+00
site_logo	https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/settings/7f4e452d-e063-4d41-8f44-ae3eb3f823bb.png	URL logo website (file SVG/PNG)	2026-04-14 03:33:41.059+00
site_name	VVC	Tên ngắn website (hiển thị trên tab trình duyệt)	2026-04-14 03:33:41.059+00
site_title	Việt Vinh Corp	Tiêu đề đầy đủ (SEO title)	2026-04-14 03:33:41.059+00
site_title_de	VIETVINH Corporation - Führende industrielle Kältelösungen in Vietnam	\N	2026-04-14 03:33:41.059+00
site_title_en	VIETVINH Corporation - Leading Industrial Refrigeration Solutions in Vietnam	\N	2026-04-14 03:33:41.059+00
site_title_fr	VIETVINH Corporation - Solutions de réfrigération industrielle de pointe au Vietnam	\N	2026-04-14 03:33:41.059+00
site_title_hr	VIETVINH Corporation - Vodeća rješenja industrijskog hlađenja u Vijetnamu	\N	2026-04-14 03:33:41.059+00
site_title_ja	VIETVINH Corporation - ベトナムを代表する産業用冷凍ソリューション	\N	2026-04-14 03:33:41.059+00
site_title_ko	VIETVINH Corporation - 베트남 최고의 산업용 냉동 솔루션	\N	2026-04-14 03:33:41.059+00
site_title_ru	VIETVINH Corporation - Ведущие промышленные холодильные решения во Вьетнаме	\N	2026-04-14 03:33:41.059+00
site_title_sl	VIETVINH Corporation - Vodilne rešitve za industrijsko hlajenje v Vietnamu	\N	2026-04-14 03:33:41.059+00
site_title_sr	VIETVINH Corporation - Vodeća rešenja industrijskog hlađenja u Vijetnamu	\N	2026-04-14 03:33:41.059+00
site_title_zh	VIETVINH Corporation - 越南领先的工业制冷解决方案	\N	2026-04-14 03:33:41.059+00
site_url	http://vietvinhcorp.com/	Tên miền website (Domain)	2026-04-14 03:33:41.059+00
\.


--
-- Data for Name: static_pages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.static_pages (id, slug, title, content, excerpt, image_url, is_active, created_at, updated_at, title_en, excerpt_en, title_de, excerpt_de, title_fr, excerpt_fr, title_ru, excerpt_ru, title_hr, excerpt_hr, title_sl, excerpt_sl, title_sr, excerpt_sr, title_ja, excerpt_ja, title_ko, excerpt_ko, title_zh, excerpt_zh) FROM stdin;
1874e3d3-27fd-4b8c-8817-56c69181b3f6	intro	Giới thiệu chung	<h1>Giới thiệu chung</h1><p>Nội dung giới thiệu chi tiết...</p>	Bài giới thiệu chi tiết về doanh nghiệp.	\N	t	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
db41b01f-1c64-44b5-a1ff-2af58d2bcde8	team	Đội ngũ	<p>{"sections":[{"id":"team-hero-1","type":"team_hero","props":{"title":"Đội ngũ","subtitle":"Chúng tôi là tập thể chuyên nghiệp, thân thiện và luôn sẵn sàng hỗ trợ khách hàng."}},{"id":"team-grid-1","type":"team_grid","props":{"title":"Đội ngũ nhân sự","description":"Gặp gỡ những chuyên gia của chúng tôi"}}]}</p>	Đội ngũ chuyên gia giàu kinh nghiệm của Tổng công ty Kỹ thuật lạnh Việt Nam (VVC)		f	2026-04-04 12:42:41.412892+00	2026-04-10 14:38:05.734+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
aa472ad0-2088-4e01-8ae0-cd6f71a5c405	about-us	Giới thiệu	{"sections":[{"id":"hero","type":"about_hero","props":{"title":"GIỚI THIỆU VỀ VIETVINH INDUSTRIES CORPORATION","title_en":"ABOUT VIETVINH INDUSTRIES CORPORATION","title_de":"ÜBER VIETVINH INDUSTRIES CORPORATION","title_fr":"À PROPOS DE VIETVINH INDUSTRIES CORPORATION","title_ru":"О VIETVINH INDUSTRIES CORPORATION","title_ja":"私たちについて - VIETVINH INDUSTRIES CORPORATION","title_ko":"회사 소개 - VIETVINH INDUSTRIES CORPORATION","title_zh":"关于我们 - VIETVINH INDUSTRIES CORPORATION","title_hr":"O VIETVINH INDUSTRIES CORPORATION","title_sl":"O VIETVINH INDUSTRIES CORPORATION","title_sr":"O VIETVINH INDUSTRIES CORPORATION","description":"VIETVINH INDUSTRIES CORPORATION là đơn vị hàng đầu cung cấp dịch vụ tư vấn kỹ thuật, thiết kế, lắp đặt trọn gói và bảo trì kỹ thuật 24/7 trong lĩnh vực cơ điện, hệ thống lạnh và\\nphòng sạch công nghiệp, hạ tầng kỹ thuật trung tâm dữ liệu và các giải pháp hệ\\nthống thông tin tích hợp tại Việt Nam.","description_en":"VIETVINH is a leading provider of technical consulting, design, turnkey installation, and 24/7 maintenance services in the MEP, industrial cooling, and cleanroom sectors in Vietnam.","description_de":"VIETVINH ist ein führender Anbieter von technischer Beratung, Planung, schlüsselfertiger Installation und 24/7-Wartungsdiensten in den Sektoren TGA/MEP, Industriekühlung und Reinraum in Vietnam.","description_ja":"VIETVINHは、ベトナムにおけるMEP（機械・電気・配管）、産業用冷却、およびクリーンルーム分野での技術コンサルティング、設計、一括設置、および24時間365日の保守サービスの主要プロバイダーです。","description_ko":"VIETVINH은 베트남의 MEP(기계, 전기, 배관), 산업용 냉각 및 클린룸 분야에서 기술 컨설팅, 설계, 일괄 설치 및 24/7 유지보수 서비스를 제공하는 선도적인 기업입니다.","description_zh":"VIETVINH 是越南 MEP（机械、电气、管道）、工业制冷和无尘室领域技术咨询、设计、成套安装和 24/7 维护服务的领先供应商。"}},{"id":"history","type":"about_history","props":{"title":"Hành trình kiến tạo từ năm 2014","title_en":"Our Journey Since 2014","title_ja":"2014年からの歩み","title_ko":"2014년부터의 여정","title_zh":"自2014年以来的历程","p1":"Từ năm 2014, đội ngũ kỹ sư và nhân viên của VIETVINH đã tiên phong trong việc thiết kế, thi công và sản xuất các sản phẩm điện lạnh thương mại và công nghiệp với giá thành cạnh tranh vượt trội.","p1_en":"Since 2014, VIETVINH’s engineers and staff have dedicated themselves to designing, constructing, and manufacturing high-quality commercial and industrial refrigeration products at competitive prices.","p1_ja":"2014年以来、VIETVINHのエンジニアとスタッフは、競争力のある価格で高品質の商業用および産業用冷凍製品の設計、建設、製造に専念してきました。","p1_ko":"2014년부터 VIETVINH의 엔지니어와 직원들은 경쟁력 있는 가격으로 고품질 상업용 및 산업용 냉동 제품을 설계, 건설 및 제조하는 데 전념해 왔습니다.","p1_zh":"自2014年以来，VIETVINH 的工程师和员工一直致力于以具有竞争力的价格设计、建造和制造高质量的商业和工业制冷产品。","p2":"Chúng tôi ưu tiên sử dụng thiết bị từ các nhà cung cấp uy tín trên thế giới như Bitzer, Embraco, Guntner, Cabero… nhằm mang lại những sản phẩm tốt nhất, phù hợp nhất với nhu cầu khắt khe của khách hàng.","p2_en":"We prioritize premium components from world-renowned suppliers like Bitzer, Embraco, Guntner, and Cabero, ensuring that our products provide the best and most suitable solutions for our clients.","p2_ja":"私たちはBitzer、Embraco、Guntner、Caberoなどの世界的に有名なサプライヤーからのプレミアムコンポーネントを優先し、当社の製品がクライアントに最適で最適なソリューションを提供できるようにしています。","p2_ko":"우리는 Bitzer, Embraco, Guntner, Cabero와 같은 세계적으로 유명한 공급업체의 프리미엄 부품을 우선적으로 사용하여 당사 제품이 고객에게 가장 적합한 최적의 솔루션을 제공할 수 있도록 합니다.","p2_zh":"我们优先选用 Bitzer、Embraco、Guntner 和 Cabero 等世界知名供应商的高级组件，确保我们的产品为客户提供最佳且最合适的解决方案。","image":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/f08f1f84-3e08-47f0-8c77-a79e02d69b15.webp","expYears":"10+","expText":"Năm kinh nghiệm","expText_en":"Years of Experience","expText_ja":"年の経験","expText_ko":"년 경력","expText_zh":"年经验","p3_en":"Today, Viet Vinh is proud to be a strategic partner of many multinational corporations and key infrastructure projects.","p3":"Ngày nay, Việt Vinh tự hào là đối tác chiến lược của nhiều tập đoàn đa quốc gia và các dự án hạ tầng trọng điểm."}},{"id":"vision_mission","type":"about_vision","props":{"visionTitle":"Tầm nhìn & Sứ mệnh","visionTitle_en":"Vision & Mission","visionTitle_ja":"ビジョンとミッション","visionTitle_ko":"비전 및 사명","visionTitle_zh":"愿景与使命","visionDesc1":"Trở thành nhà cung cấp giải pháp, thiết bị và dịch vụ hiệu quả năng lượng toàn diện trong hệ thống cơ điện và điện lạnh.","visionDesc1_en":"To become a comprehensive provider of energy-efficient equipment, services, and solutions in mechanical, electrical, plumbing, and refrigeration systems.","visionDesc1_ja":"機械、電気、配管、および冷凍システムにおけるエネルギー効率の高い機器、サービス、およびソリューションの包括的なプロバイダーになります。","visionDesc1_ko":"기계, 전기, 배관 및 냉동 시스템 부문에서 포괄적인 에너지 효율 장비, 서비스 및 솔루션 제공업체가 되는 것입니다.","visionDesc1_zh":"成为机械、电气、管道和制冷系统中综合节能设备、服务和解决方案的供应商。","missionTitle":"Sứ mệnh cốt lõi","missionTitle_en":"Core Mission","missionTitle_ja":"コアミッション","missionTitle_ko":"핵심 사명","missionTitle_zh":"核心使命","missionDesc1":"Không ngừng cải tiến công nghệ và quy trình sản xuất để tối ưu hóa sự hài lòng của khách hàng với chi phí hợp lý nhất.","missionDesc1_en":"Constantly improving technology and management processes to enhance customer satisfaction at the best possible cost.","missionDesc1_ja":"最善のコストで顧客満足度を高めるために、常に技術と管理プロセスを改善しています。","missionDesc1_ko":"최적의 비용으로 고객 만족도를 높이기 위해 기술 및 관리 프로세스를 지속적으로 개선합니다.","missionDesc1_zh":"不断改进技术和管理流程，以最优成本提高客户满意度。"}},{"id":"industries","type":"about_facilities","props":{"title":"Giải pháp đa ngành & Công nghệ xanh","title_en":"Multi-industry Solutions & Green Tech","title_ja":"多様な産業とグリーン技術","title_ko":"다양한 산업분야 및 녹색 기술","title_zh":"门类齐全的行业与绿色技术","description":"Chúng tôi thiết kế và xây dựng các hệ thống công nghệ xanh tiên tiến cho đa dạng lĩnh vực: từ nhà máy điện tử, dược phẩm, ô tô đến các chuỗi kho lạnh và trung tâm thương mại.","description_en":"We design and build advanced green technology systems and utility process lines for various industries, including electronics, pharmaceuticals, and automotive factories, as well as cold warehouse chains.","description_ja":"私たちは、電子機器、医薬品、自動車工場、さらには大規模なコールドチェーンや商業センターなど、さまざまな業界向けに高度なグリーンテクノロジーシステムとユーティリティプロセスラインを設計および構築しています。","description_ko":"우리는 전자, 제약, 자동차 공장부터 대규모 콜드체인 및 상업 센터에 이르기까지 다양한 산업 분야를 위한 첨단 녹색 기술 시스템과 유틸리티 프로세스 라인을 설계하고 구축합니다.","description_zh":"我们为电子、制药和汽车工厂以及大型冷链和商业中心等各个行业设计和建造先进的绿色技术系统和公用设施流程线。","image1":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/9e889b5a-07db-42e5-a125-92e8dd354fe5.png","image2":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/be61ffa2-5ab7-49fe-8df6-33dd2952834f.png"}},{"id":"quality","type":"about_quality","props":{"title":"Cam kết Chất lượng & An toàn","title_en":"Quality Commitment & Safety","title_ja":"品質と安全へのコミットメント","title_ko":"품질 및 안전에 대한 약속","title_zh":"质量与安全承诺","q1_title":"Chất lượng là sống còn","q1_title_en":"Quality is Vital","q1_title_ja":"品質は生命線","q1_title_ko":"품질은 생명","q1_title_zh":"质量是生命线","q1_desc":"Mọi sản phẩm đều phải vượt qua quy trình kiểm tra nghiêm ngặt ít nhất 24 giờ về kỹ thuật và an toàn.","q1_desc_en":"Every product must pass a rigorous testing process of at least 24 hours for technical and safety standards.","q2_title":"An toàn Môi trường","q2_title_en":"Environmental Safety","q2_title_ja":"環境安全","q2_title_ko":"환경 안전","q2_title_zh":"环境安全","q2_desc":"VIETVINH cam kết bảo vệ môi trường thông qua việc sử dụng môi chất lạnh không chứa CFC (CFC-free).","q2_desc_en":"VIETVINH is committed to environmental protection by using CFC-free refrigerants in all systems.","q3_title":"Đối tác Tin cậy","q3_title_en":"Trusted Partner","q3_title_ja":"信頼できるパートナー","q3_title_ko":"신뢰할 수 있는 파트너","q3_title_zh":"值得信赖的合作伙伴","q4_title":"Bảo trì 24/7","q4_title_en":"24/7 Maintenance","q4_title_ja":"24時間365日の保守","q4_title_ko":"24/7 유지보수","q4_title_zh":"24/7 维护"}},{"id":"services_list","type":"about_values","props":{"title":"Dịch vụ của chúng tôi","title_en":"Our Services","title_ja":"私たちのサービス","title_ko":"당사의 서비스","title_zh":"我们的服务","v1_title":"HVAC & Hệ thống lạnh","v1_title_en":"HVAC & Cooling Systems","v1_title_ja":"HVACおよび冷却システム","v1_title_ko":"HVAC 및 냉각 시스템","v1_title_zh":"HVAC 与制冷系统","v2_title":"Cơ điện & Tự động hóa","v2_title_en":"MEP & Automation","v2_title_ja":"MEPおよびオートメーション","v2_title_ko":"MEP 및 자동화","v2_title_zh":"MEP 与自动化"}},{"id":"sec_1775711458044","type":"about_partners","props":{}}]}	VIETVINH là đơn vị hàng đầu cung cấp giải pháp cơ điện lạnh toàn diện tại Việt Nam.		t	2026-04-01 09:54:05.223487+00	2026-04-10 13:42:54.389+00	About Us	VIETVINH is a leading provider of comprehensive MEP and refrigeration solutions in Vietnam.	Über uns	\N	À propos	\N	О нас	\N	O nama	\N	O nas	\N	O nama	\N	私たちについて	VIETVINHは、ベトナムにおけるMEPと冷凍ソリューションのリーディングプロバイダーです。	회사 소개	VIETVINH은 베트남의 포괄적인 MEP 및 냉동 솔루션 분야의 선도적인 기업입니다.	关于我们	VIETVINH 是越南综合 MEP 和制冷解决方案的领先供应商。
3cf18cd8-3844-426a-bc80-04250b1a3b30	chinh-sach-cookie	Chính sách Cookie	{"sections":[{"id":"rich-text-1775306871567","type":"rich_text","props":{"content":"<h1>Chính sách Cookie</h1><p>Website này sử dụng cookie để nâng cao trải nghiệm...</p>"}}]}	Thông tin về cách VVC sử dụng cookie trên website.	\N	t	2026-04-01 09:54:05.223487+00	2026-04-01 09:54:05.223487+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
be040715-bfac-41d4-9838-ca4d7e1eb98d	dieu-khoan-su-dung	Điều khoản sử dụng	{"sections":[{"id":"rich-text-1775306871908","type":"rich_text","props":{"content":"<h1>Điều khoản sử dụng</h1><p>Chào mừng bạn đến với website VIETVINH INDUSTRIES CORPORATION...</p>"}}]}	Các quy định và điều khoản khi sử dụng dịch vụ của VVC.		t	2026-04-01 09:54:05.223487+00	2026-04-04 12:50:01.319+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9404c81f-580e-445a-828d-56aede75b20e	chinh-sach-bao-mat	Chính sách bảo mật	{"sections":[{"id":"rich-text-1775306870788","type":"rich_text","props":{"content":"<h1>Chính sách bảo mật</h1><p>VIETVINH INDUSTRIES CORPORATION cam kết bảo mật thông tin cá nhân của khách hàng...</p><p>Nội dung đang cập nhật.</p>"}}]}	Cam kết của VVC về bảo mật thông tin khách hàng.		t	2026-04-01 09:54:05.223487+00	2026-04-04 12:48:38.922+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
97562e18-14eb-4d14-a939-c544099f2cb8	he-thong-tich-hop	Giải Pháp Hệ Thống Tích Hợp	{"sections":[{"id":"hero-integrated","type":"hero","props":{"badge":"Hội tụ & Kết nối Công nghệ","title":"GIẢI PHÁP HỆ THỐNG TÍCH HỢP (ELV & AUTOMATION)","description":"VietVinhCorp tối ưu hóa vận hành công trình thông qua việc tích hợp các hệ thống điện nhẹ, tự động hóa và quản lý tập trung, mang lại sự thông minh và tiết kiệm năng lượng vượt trội.","buttonText":"Tư vấn tích hợp","buttonLink":"/contact","button2Text":"Giải pháp kỹ thuật","button2Link":"/services","alignment":"left","backgroundImage":"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80"}},{"id":"solutions-title","type":"rich_text","props":{"content":"<h2 class=\\"text-3xl font-bold text-primary text-center my-12\\">Hệ Thống Tích Hợp Tiêu Biểu</h2>","padding":"small"}},{"id":"solutions-grid","type":"rich_text","props":{"content":"\\n          <div class=\\"grid grid-cols-1 md:grid-cols-3 gap-8\\">\\n            <div class=\\"p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all\\">\\n              <h3 class=\\"text-xl font-bold text-primary mb-4\\">Hệ thống ELV</h3>\\n              <p class=\\"text-muted-foreground mb-4\\">Tích hợp Camera, CCTV, Âm thanh thông báo, và Kiểm soát ra vào trên một nền tảng quản lý duy nhất, đảm bảo tính bảo mật và dễ dàng điều hành.</p>\\n              <ul class=\\"text-sm space-y-2\\">\\n                <li>✓ Camera giám sát IP thông minh</li>\\n                <li>✓ Kiểm soát vào ra sinh trắc học</li>\\n                <li>✓ Âm thanh thông báo đa vùng</li>\\n              </ul>\\n            </div>\\n            <div class=\\"p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all\\">\\n              <h3 class=\\"text-xl font-bold text-primary mb-4\\">SCADA & Automation</h3>\\n              <p class=\\"text-muted-foreground mb-4\\">Giải pháp điều khiển giám sát và thu thập dữ liệu cho các dây chuyền công nghịêp, quản lý lưu lượng và thông số vận hành theo thời gian thực.</p>\\n              <ul class=\\"text-sm space-y-2\\">\\n                <li>✓ Hệ thống PLC linh hoạt</li>\\n                <li>✓ Giao diện HMI trực quan</li>\\n                <li>✓ Phân tích dữ liệu vận hành</li>\\n              </ul>\\n            </div>\\n            <div class=\\"p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all\\">\\n              <h3 class=\\"text-xl font-bold text-primary mb-4\\">BMS / iBMS</h3>\\n              <p class=\\"text-muted-foreground mb-4\\">Hệ thống quản lý tòa nhà thông minh, điều phối linh hoạt các hệ thống Điều hòa, Chiếu sáng và An ninh để tối ưu hóa năng lượng tiêu thụ.</p>\\n              <ul class=\\"text-sm space-y-2\\">\\n                <li>✓ Tiết kiệm đến 30% năng lượng</li>\\n                <li>✓ Điều khiển tập trung Web-based</li>\\n                <li>✓ Kết nối đa giao thức (BACnet, Modbus)</li>\\n              </ul>\\n            </div>\\n          </div>\\n        ","padding":"medium"}},{"id":"why-choose-integrated","type":"features","props":{"title":"Sự Khác Biệt Của VietVinhCorp","subtitle":"Chúng tôi mang lại giải pháp tích hợp chìa khóa trao tay với quy mô từ tòa nhà đến khu công nghiệp.","items":[{"id":"1","title":"Tương Thích Đa Nền Tảng","description":"Tích hợp mượt mà các thiết bị từ nhiều nhà sản xuất khác nhau.","icon":"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"},{"id":"2","title":"Khả năng Mở rộng","description":"Hệ thống thiết kế theo module dễ dàng nâng cấp trong tương lai.","icon":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"},{"id":"3","title":"Đội ngũ Chuyên gia","description":"Kỹ sư dày dặn kinh nghiệm triển khai các dự án quy mô lớn.","icon":"https://images.unsplash.com/photo-1426927308491-6380b6a9936f?auto=format&fit=crop&q=80"}]}},{"id":"cta-integrated","type":"hero","props":{"title":"Bạn cần một giải pháp vận hành thông minh và hiệu quả?","description":"Liên hệ với đội ngũ chuyên gia của chúng tôi để được khảo sát và tư vấn giải pháp tích hợp tối ưu nhất.","buttonText":"Liên hệ chuyên gia ngay","buttonLink":"/contact","alignment":"center","padding":"small","backgroundImage":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/70a31e6b-e0fe-47e8-bff6-5c869e13dcfb.png"}}]}			t	2026-04-04 09:26:44.913527+00	2026-04-09 01:39:19.217+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
61bf42ea-9636-49a4-9f4e-25922df9a58a	careers	Tuyển dụng	{"sections":[{"id":"hero-recruitment","type":"hero","props":{"title":"Gia nhập Viet Vinh Corp","subtitle":"Khởi đầu sự nghiệp vững chắc cùng đội ngũ chuyên gia hàng đầu trong lĩnh vực cơ điện lạnh.","backgroundImage":"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80","buttonText":"Xem các vị trí đang tuyển","buttonLink":"#jobs-list"}},{"id":"jobs-list","type":"jobs_list","props":{"title":"Vị trí đang tuyển dụng","subtitle":"Hãy chọn cho mình một vị trí phù hợp để cùng chúng tôi kiến tạo tương lai."}}]}	\N	\N	t	2026-04-05 00:11:20.256657+00	2026-04-05 00:19:39.185+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e543f587-4e93-4c0c-bc2a-1dd2ef3a7feb	he-thong-lanh	Hệ Thống Lạnh Công Nghiệp	{"sections":[{"id":"refrig_hero","type":"refrigeration","props":{"image":"/assets/images/industry/ca_tech.png","title":"Công Nghệ Làm Lạnh Công Nghiệp","description":"Giải pháp làm lạnh tiên tiến cho chuỗi cung ứng thực phẩm, tối ưu chất lượng và năng lượng."}},{"id":"refrig_catalog","type":"cold_storage_catalog","props":{}},{"id":"refrig_tech","type":"advanced_tech_showcase","props":{"title":"Công Nghệ Bảo Quản & Cấp Đông Chuyên Sâu","subtitle":"VIETVINH tiên phong ứng dụng các giải pháp bảo quản tiên tiến nhất thế giới.","badge":"Specialized Solutions","items":[{"title":"Công nghệ Bảo quản CA","desc":"Kiểm soát khí quyển cho phép lưu trữ trái cây trên 12 tháng.","link":"/cong-nghe-bao-quan-ca"},{"title":"Cấp đông nhanh IQF","desc":"Cấp đông từng cá thể giữ nguyên dinh dưỡng.","link":"/cap-dong-nhanh-iqf"},{"title":"Phòng chín chuối","desc":"Quy trình chín nhân tạo chuẩn khoa học.","link":"/phong-chin-chuoi-tieu-chuan"},{"title":"Hầm đông gió","desc":"Hạ nhiệt độ cực nhanh xuống -35°C.","link":"/ham-dong-gio-cong-suat-lon"}]}},{"id":"refrig_expertise","type":"industrial_expertise","props":{}},{"id":"refrig_contact","type":"contact_form","props":{}}]}			t	2026-04-04 00:22:01.496588+00	2026-04-09 10:25:42.625898+00	Industrial Refrigeration Systems	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
0ab04d5f-27ab-4744-ba4e-30b599b57eee	ho-so-nang-luc	Hồ sơ năng lực	{"sections":[{"id":"cap-prof-hero","type":"capability_profile","props":{"title":"Hồ sơ năng lực Viet Vinh Corp","description":"Khám phá năng lực thiết kế, thi công và vận hành hệ thống điện lạnh hàng đầu của VIETVINH INDUSTRIES CORPORATION. Cam kết chất lượng, tiến độ và giải pháp tối ưu bảo vệ môi trường.","previewImage":"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80","pdfUrl":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/public/documents/capability-profile-1775828680278.pdf","downloadText":"Tải xuống Hồ sơ năng lực (PDF)","pdfFileName":"2025 - Vietvinh Industries Overview.pdf","pdfFileSize":"10.39 MB"}},{"id":"cap-prof-contact","type":"contact_form","props":{}}]}	Tài liệu chi tiết về năng lực và kinh nghiệm triển khai dự án điện lạnh của Viet Vinh Corp.		t	2026-04-04 23:41:58.120715+00	2026-04-10 13:44:50.139+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
d6e7c266-5152-447d-b318-fd22cf1a8d56	he-thong-bms	Hệ Thống Quản Lý Tòa Nhà & Hạ Tầng ICT	{"sections":[{"id":"detail-bms","type":"technical_detail","props":{"title":"Thông Minh Hóa Công Trình (BMS/ICT)","description":"Tích hợp các hệ thống kỹ thuật vào một nền tảng quản lý duy nhất (iBMS), giúp giám sát tập trung, tối ưu hóa năng lượng và tăng cường an ninh hạ tầng CNTT cho doanh nghiệp.","image":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_bms.png","feature1":"Hệ thống iBMS giám sát toàn diện cơ điện","feature2":"Phát hiện sự cố & Cảnh báo sớm qua Mobile/Email","feature3":"Quản lý tiêu thụ điện năng & Tự động tiết kiệm","feature4":"Hạ tầng Data Center, LAN/TEL & WiFi chuyên dụng"}}]}	\N	\N	t	2026-04-09 11:14:37.191215+00	2026-04-09 11:14:37.191215+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
248e948a-0ad7-4089-bc9b-f11ebd5cb4db	he-thong-dc-management	DC & Management System	{"sections":[{"id":"hero-dc","type":"hero","props":{"badge":"Giải pháp Hạ tầng Thông minh","title":"HỆ THỐNG TRUNG TÂM DỮ LIỆU & QUẢN LÝ","description":"VietVinhCorp cung cấp giải pháp hạ tầng Data Center đạt chuẩn quốc tế, đảm bảo an toàn dữ liệu và hiệu suất vận hành 24/7 cho các hệ thống thông tin quan trọng.","buttonText":"Nhận tư vấn giải pháp","buttonLink":"/contact","button2Text":"Khám phá dự án","button2Link":"/projects","alignment":"left","backgroundImage":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/335932d2-e413-4580-9257-1bd8aa963cfb.jpg"}},{"id":"solutions-title","type":"rich_text","props":{"content":"<h2 class=\\"text-3xl font-bold text-primary text-center my-12\\">Giải Pháp DC & Management Tiêu Biểu</h2>","padding":"small"}},{"id":"solutions-grid","type":"rich_text","props":{"content":"\\n          <div class=\\"grid grid-cols-1 md:grid-cols-3 gap-8\\">\\n            <div class=\\"p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all\\">\\n              <h3 class=\\"text-xl font-bold text-primary mb-4\\">Hệ thống UPS</h3>\\n              <p class=\\"text-muted-foreground mb-4\\">Bộ lưu điện công suất lớn, đảm bảo nguồn điện sạch và liên tục cho các thiết bị quan trọng, ngăn ngừa rủi ro mất dữ liệu đột ngột.</p>\\n              <ul class=\\"text-sm space-y-2\\">\\n                <li>✓ UPS Modular linh hoạt</li>\\n                <li>✓ Hệ thống ắc quy dự phòng</li>\\n                <li>✓ Giám sát nguồn điện 24/7</li>\\n              </ul>\\n            </div>\\n            <div class=\\"p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all\\">\\n              <h3 class=\\"text-xl font-bold text-primary mb-4\\">Lạnh chính xác</h3>\\n              <p class=\\"text-muted-foreground mb-4\\">Giải pháp làm mát Precision Cooling kiểm soát độ ẩm và nhiệt độ chính xác cho phòng máy chủ, kéo dài tuổi thọ thiết bị phần cứng.</p>\\n              <ul class=\\"text-sm space-y-2\\">\\n                <li>✓ Inrow Cooling hiệu suất cao</li>\\n                <li>✓ Kiểm soát độ ẩm thông minh</li>\\n                <li>✓ Tiết kiệm năng lượng chuẩn xanh</li>\\n              </ul>\\n            </div>\\n            <div class=\\"p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all\\">\\n              <h3 class=\\"text-xl font-bold text-primary mb-4\\">Quản lý dữ liệu</h3>\\n              <p class=\\"text-muted-foreground mb-4\\">Hệ thống DCIM giám sát hạ tầng và tối ưu hóa tài nguyên phần cứng, giúp ban quản trị ra quyết định dựa trên dữ liệu thực tế.</p>\\n              <ul class=\\"text-sm space-y-2\\">\\n                <li>✓ Giám sát hạ tầng tập trung</li>\\n                <li>✓ Cảnh báo sự cố thời gian thực</li>\\n                <li>✓ Báo cáo hiệu năng tiêu thụ</li>\\n              </ul>\\n            </div>\\n          </div>\\n        ","padding":"medium"}},{"id":"why-choose-dc","type":"features","props":{"title":"Tại sao chọn giải pháp của chúng tôi?","subtitle":"VietVinhCorp cam kết mang lại hạ tầng ổn định và khả năng mở rộng không giới hạn.","items":[{"id":"1","title":"Công nghệ Tiên tiến","description":"Ứng dụng các giải pháp mới nhất từ Emerson, APC, Vertiv...","icon":"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80"},{"id":"2","title":"Độ Tin cậy Cao","description":"Đảm bảo uptime 99.99% cho mọi thiết bị trong trung tâm dữ liệu.","icon":"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"},{"id":"3","title":"Tối ưu Chi phí","description":"Thiết kế hệ thống giúp giảm chỉ số PUE, tiết kiệm điện năng tối đa.","icon":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"}]}},{"id":"cta-dc","type":"hero","props":{"title":"Sẵn sàng xây dựng Trung tâm dữ liệu của bạn?","description":"Liên hệ với đội ngũ chuyên gia của chúng tôi để được khảo sát và tư vấn giải pháp hạ tầng tối ưu nhất.","buttonText":"Yêu cầu khảo sát ngay","buttonLink":"/contact","alignment":"center","padding":"small","backgroundImage":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/6800ceb5-24b8-49c9-89bc-f4964e6b795f.jpg"}}]}			t	2026-04-04 08:52:20.052795+00	2026-04-04 09:46:19.352+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14094bfa-57e2-4dbb-8228-013fc8096c42	cong-nghe-bao-quan-ca	Công nghệ Bảo quản CA	{"sections":[{"id":"tech_ca","type":"technical_detail","props":{"techType":"ca","accent":"blue","image":"/assets/images/industry/ca_tech.png","title":"Công nghệ Khí quyển Kiểm soát (CA)","description":"Hệ thống Controlled Atmosphere (CA) là công nghệ bảo quản rau quả tiên tiến nhất hiện nay, hoạt động bằng cách thay đổi thành phần không khí bên trong kho lạnh để làm chậm quá trình chín và hô hấp của nông sản.","features":["Kiểm soát chính xác tỷ lệ O2 và CO2","Kéo dài thời gian bảo quản gấp 2-4 lần","Giữ nguyên độ giòn và hương vị tự nhiên","Giảm thiểu hao hụt trọng lượng sản phẩm"]}},{"id":"tech_ca_contact","type":"contact_form","props":{}}]}	\N	\N	t	2026-04-09 10:25:42.729995+00	2026-04-09 10:25:42.729995+00	CA Storage Technology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e50b3c25-02fc-41e4-bbbb-ff6cc6345a7f	cap-dong-nhanh-iqf	Cấp đông nhanh IQF	{"sections":[{"id":"tech_iqf","type":"technical_detail","props":{"techType":"iqf","accent":"cyan","image":"/assets/images/industry/iqf_tech.png","title":"Hệ thống Cấp đông Nhanh IQF","description":"Công nghệ IQF (Individual Quick Freezing) cho phép cấp đông nhanh từng cá thể sơ chế, đảm bảo sản phẩm không bị dính vào nhau và giữ nguyên cấu trúc tế bào sau khi rã đông.","features":["Tốc độ cấp đông cực nhanh","Giữ trọn vẹn giá trị dinh dưỡng","Công nghệ Fluidized Bed tiên tiến","Tiết kiệm nước và hóa chất vệ sinh"]}},{"id":"tech_iqf_contact","type":"contact_form","props":{}}]}	\N	\N	t	2026-04-09 10:25:42.824703+00	2026-04-09 10:25:42.824703+00	IQF Fast Freezing	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
37d30262-433c-4966-83fb-5b928cec0e8d	phong-chin-chuoi-tieu-chuan	Phòng chín chuối tiêu chuẩn	{"sections":[{"id":"tech_ripening","type":"technical_detail","props":{"techType":"ripening","accent":"amber","image":"/assets/images/industry/ripening_tech.png","title":"Phòng Chín Chuối Tiêu Chuẩn Quốc Tế","description":"Hệ thống làm chín bằng khí Ethylene trong môi trường kiểm soát nhiệt độ và độ ẩm tuyệt đối, giúp trái cây chín đồng đều về màu sắc và đạt hương vị thơm ngon nhất.","features":["Kiểm soát nồng độ Ethylene tự động","Hệ thống quạt đối lưu áp suất cao","Màu sắc trái chín vàng đều và đẹp","Tối ưu hóa thời gian và chi phí vận hành"]}},{"id":"tech_ripening_contact","type":"contact_form","props":{}}]}	\N	\N	t	2026-04-09 10:25:42.917857+00	2026-04-09 10:25:42.917857+00	Banana Ripening Room	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
0f3f0f7a-6398-49d3-973b-85acb6a2d5e5	ham-dong-gio-cong-suat-lon	Hầm đông gió (Blast Freezer)	{"sections":[{"id":"tech_blast","type":"technical_detail","props":{"techType":"blast","accent":"indigo","image":"/assets/images/industry/blast_tech.png","title":"Hầm Đông Gió Công Suất Lớn","description":"Giải pháp cấp đông tập trung cho lượng lớn sản phẩm như thịt, thủy sản. Hầm đông gió sử dụng luồng khí lạnh áp lực cao để hạ nhiệt độ tâm sản phẩm xuống -35°C trong thời gian ngắn nhất.","features":["Công suất cấp đông mạnh mẽ","Dàn lạnh hiệu suất giải nhiệt cao","Cách nhiệt panel mật độ cao (PIR/PU)","Ngăn chặn sự phát triển của vi khuẩn"]}},{"id":"tech_blast_contact","type":"contact_form","props":{}}]}	\N	\N	t	2026-04-09 10:25:43.01484+00	2026-04-09 10:25:43.01484+00	Blast Freezer Technology	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
689fc12a-b401-4a72-bc09-64f1bdcba706	he-thong-dien	Hệ Thống Điện Công Nghiệp & Tòa Nhà	{"sections":[{"id":"detail-elec","type":"technical_detail","props":{"title":"Hệ Thống Phân Phối Điện Toàn Diện","description":"VietVinhCorp thiết kế và thi công hệ thống điện từ khâu cấp nguồn trung thế đến các thiết bị tiêu thụ đầu cuối. Chúng tôi tập trung vào tính ổn định, an toàn và khả năng dự phòng cao cho các nhà máy sản xuất liên tục.","image":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_electrical.png","feature1":"Trạm biến áp & Tủ trung thế RMU","feature2":"Hệ thống tủ điện MSB, ATS, DB tiêu chuẩn IEC","feature3":"Máy phát điện dự phòng & UPS công suất lớn","feature4":"Hệ thống chống sét địa chỉ & Tiếp địa chuyên dụng"}}]}	\N	\N	t	2026-04-09 11:14:36.706199+00	2026-04-09 11:14:36.706199+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
0ebe5925-794b-4d25-aa82-94660507263b	he-thong-hvac	Giải Pháp Điều Hòa Không Khí & Thông Gió	{"sections":[{"id":"detail-hvac","type":"technical_detail","props":{"title":"Công Nghệ HVAC Tiết Kiệm Năng Lượng","description":"Giải pháp điều hòa không khí trung tâm và thông gió quy mô lớn, tối ưu hóa lưu chuyển khí tươi và kiểm soát nhiệt độ, độ ẩm chính xác cho môi trường làm việc lý tưởng.","image":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_hvac.png","feature1":"Hệ thống Chiller giải nhiệt nước & Tháp giải nhiệt","feature2":"Điều hòa trung tâm VRV / VRF biến tần Daikin/Mitsubishi","feature3":"Hệ thống thông gió hút khí thải & Cấp khí tươi (PAU)","feature4":"Điều hòa chính xác (Precision Cooling) cho Server Room"}}]}	\N	\N	t	2026-04-09 11:14:36.80021+00	2026-04-09 11:14:36.80021+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8fb21d64-0b34-42b9-8742-53bb31755daf	he-thong-ong-cong-nghe	Hệ Thống Đường Ống Công Nghệ & Tiện Ích	{"sections":[{"id":"detail-utility","type":"technical_detail","props":{"title":"Hệ Thống Tiện Ích Công Nghiệp (Utility)","description":"Cung cấp hạ tầng đường ống kỹ thuật cho sản xuất, bao gồm khí nén, lò hơi và nước làm mát. Chúng tôi sử dụng các vật liệu cao cấp như Inox vi sinh để đảm bảo tiêu chuẩn vệ sinh an toàn thực phẩm.","image":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_utility.png","feature1":"Đường ống khí nén áp lực cao & Máy nén khí","feature2":"Hệ thống lò hơi (Steam) & Mạng phân phối nhiệt","feature3":"Hệ thống nước lạnh PCW & Cooling Water","feature4":"Đường ống Inox vi sinh (Sanitary) cho Thực phẩm"}}]}	\N	\N	t	2026-04-09 11:14:36.890906+00	2026-04-09 11:14:36.890906+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
aa65f2c5-ddb7-40c9-b64e-22a54db50daf	phong-chay-chua-chay	Hệ Thống PCCC & Cấp Thoát Nước	{"sections":[{"id":"detail-fire","type":"technical_detail","props":{"title":"An Toàn PCCC & Hạ Tầng Nước","description":"Thi công trọn gói hệ thống phòng cháy chữa cháy đạt chuẩn kiểm duyệt của cơ quan chức năng, kết hợp hệ thống cấp thoát nước thông minh cho các khu công nghiệp.","image":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_firefighting.png","feature1":"Hệ thống chữa cháy tự động Sprinkler & Vách tường","feature2":"Báo cháy địa chỉ (Addressable Fire Alarm) thông minh","feature3":"Trạm bơm chữa cháy công suất lớn & Bể chứa","feature4":"Hệ thống xử lý nước thải & Cấp nước sản xuất"}}]}	\N	\N	t	2026-04-09 11:14:36.987834+00	2026-04-09 11:14:36.987834+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
78c98a94-8fc0-4a1d-a517-61a3c218adf2	phong-sach	Thi Công Phòng Sạch Tiêu Chuẩn Quốc Tế	{"sections":[{"id":"detail-clean","type":"technical_detail","props":{"title":"Kiểm Soát Môi Trường Tuyệt Đối (Cleanroom)","description":"Thiết kế và thi công phòng sạch đạt tiêu chuẩn ISO 14644, GMP cho lĩnh vực Dược phẩm, Thực phẩm và Điện tử. Chúng tôi làm chủ kỹ thuật thi công Panel và hệ thống lọc bụi tiên tiến.","image":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_cleanroom.png","feature1":"Thi công Panel cách nhiệt PU/PIR & Cửa chuyên dụng","feature2":"Hệ thống lọc khí HEPA/ULPA & FFU tự động","feature3":"Thiết kế kháng chấn & Sàn Vinyl chống tĩnh điện","feature4":"Kiểm soát áp suất, nhiệt độ & độ ẩm 24/7"}}]}	\N	\N	t	2026-04-09 11:14:37.080869+00	2026-04-09 11:14:37.080869+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e36136b7-1f76-4976-8151-21187406a347	he-thong-co-dien	Hệ Thống Cơ Điện (M&E)	{"sections":[{"id":"mep-hero","type":"hero","props":{"title":"GIẢI PHÁP CƠ ĐIỆN (M&E) TỔNG THỂ","description":"VietVinhCorp là tổng thầu cơ điện uy tín, chuyên cung cấp các giải pháp kỹ thuật tích hợp từ thiết kế đến thi công cho các nhà máy công nghiệp, tòa nhà cao tầng và hạ tầng kỹ thuật chuyên sâu.","alignment":"left","image_url":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_electrical.png","backgroundImage":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/uploads/9a15fbd4-ef01-4207-a7da-8f7abf25b2c4.webp"}},{"id":"mep-systems","type":"me_systems","props":{"title":"6 Hệ Thống Cơ Điện Cốt Lõi","description":"Chúng tôi làm chủ công nghệ và quy trình thi công cho toàn bộ các hạng mục MEP quan trọng nhất hiện nay.","image":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_bms.png","cat1_label":"Hệ Thống Điện","cat1_sub":"Trạm biến áp, tủ điện MSB, RMU và hệ thống nguồn dự phòng.","cat1_link":"/he-thong-dien","cat2_label":"Hệ Thống HVAC","cat2_sub":"Chiller trung tâm, điều hòa VRV/VRF và thông gió nhà xưởng.","cat2_link":"/he-thong-hvac","cat3_label":"Ống Công Nghệ","cat3_sub":"Khí nén, lò hơi, nước lạnh PCW và đường ống vi sinh.","cat3_link":"/he-thong-ong-cong-nghe","cat4_label":"PCCC & Cấp Thoát Nước","cat4_sub":"Hệ thống Sprinkler, báo cháy địa chỉ và xử lý nước thải.","cat4_link":"/phong-chay-chua-chay","cat5_label":"Phòng Sạch (Cleanroom)","cat5_sub":"Thi công Panel, lọc HEPA tiêu chuẩn ISO 14644 & GMP.","cat5_link":"/phong-sach","cat6_label":"BMS & ICT","cat6_sub":"Quản lý tòa nhà thông minh, giám sát năng lượng và hạ tầng mạng IT.","cat6_link":"/he-thong-bms"}},{"id":"mep-lifecycle","type":"service_lifecycle","props":{"title":"Quy Trình Triển Khai Chuyên Nghiệp","description":"Đảm bảo tiến độ và chất lượng thông qua quy trình kiểm soát 4 giai đoạn nghiêm ngặt.","step1_title":"Tư Vấn & Thiết Kế","step1_desc":"Khảo sát hiện trạng, tư vấn giải pháp tối ưu và thiết kế Shopdrawing chi tiết.","step2_title":"Cung Ứng Vật Tư","step2_desc":"Lựa chọn thiết bị từ các thương hiệu uy tín toàn cầu, đảm bảo tiêu chuẩn kỹ thuật.","step3_title":"Thi Công & Giám Sát","step3_desc":"Đội ngũ kỹ sư giàu kinh nghiệm trực tiếp thi công và giám sát an toàn tại công trường.","step4_title":"Bàn Giao & Bảo Trì","step4_desc":"Vận hành thử nghiệm, đào tạo chuyển giao và bảo trì định kỳ trọn đời dự án."}}]}			t	2026-04-04 08:39:51.369972+00	2026-04-09 11:21:47.768+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
a2f48716-f5a4-4ffa-93a8-9c4888e5a974	technologies	Công Nghệ & Thiết Bị	{"sections":[{"id":"hero_tech_main","type":"hero","props":{"title":"Công Nghệ & Thiết Bị","description":"Tiên phong ứng dụng AI điều khiển vòng kín và các công nghệ xanh tiên tiến nhất trong kỹ thuật Nhiệt Lạnh / Điệu Hòa Không Khí.","backgroundImage":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_factory.png","alignment":"center","badge":"Innovation"}},{"id":"media_opt_1","type":"media_section","props":{"title":"Tối Ưu Hóa Năng Lượng Bằng AI & BMS","description":"Tại Việt VinhCorp, hệ thống quản lý năng lượng (BMS/EMS) không chỉ dừng lại ở việc đọc chỉ số. Chúng tôi tích hợp AI để tiến hành **Machine Learning** trên dữ liệu lịch sử vận hành, tự động kiểm soát tải tĩnh, điều chỉnh góc mở của van tiết lưu EEV và công suất máy nén.\\n\\nKết quả mang lại là **hiệu năng tiết kiệm điện năng chạm mốc 35 - 40%**, giảm thiểu đáng kể khí thải Carbon, đáp ứng tiêu chí LEED/LOTUS cho công trình kiến trúc xanh bền vững.","image":"https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80","layout":"image-left"}},{"id":"cards_tech","type":"cards","props":{"title":"Nền Tảng Kỹ Thuật Đỉnh Cao","columns":3,"style":"elevated","items":[{"id":"c1","title":"Máy Nén Từ Tĩnh Biến Tần","description":"Vận hành không dùng dầu bôi trơn, triệt tiêu ma sát cơ học, gia tăng tuổi thọ và giảm độ ồn xuống dưới 65dB.","icon":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"/><path d=\\"M12 2v20 M2 12h20\\"/></svg>"},{"id":"c2","title":"Môi Chất Lạnh Xanh","description":"Sử dụng HFO (R-1234ze) và tự nhiên với chỉ số GWP siêu thấp, vượt xa chuẩn tiêu chuẩn Quốc tế.","icon":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M11 20A7 7 0 0 1 14 6v0a7 7 0 0 1 4 11v0a7 7 0 0 1-7 3v0z\\"/></svg>"},{"id":"c3","title":"Đường Hầm Cấp Đông IQF","description":"Bề mặt sản phẩm bị đông lạnh tức thì, khóa chặt tinh thể nước, giữ cấu trúc dinh dưỡng không suy suyển.","icon":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M12 2v20 M2 12h20 M4.9 4.9l14.2 14.2 M19.1 4.9L4.9 19.1\\"/></svg>"},{"id":"c4","title":"Giám Sát Đám Mây Cloud Server","description":"Cảnh báo tải hệ thống và áp suất ngay lập tức được gửi đến mobile/web của đội kĩ sư duy trì 24/7.","icon":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M17.5 19H9a7 7 0 1 1 6.7-9h.8a4 4 0 1 1 1 8\\"/></svg>"},{"id":"c5","title":"Kháng Khuẩn Nano Bạc","description":"Sử dụng vật liệu bảo ôn lõi Nano kháng khuẩn, tự động vô hiệu hóa sinh vật, xuất sắc đạt chuẩn GMP.","icon":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\\"/></svg>"},{"id":"c6","title":"Kho Khí Quyển CA","description":"Làm chậm quá trình rữa bằng việc kiểm soát O2, CO2, Ni-tơ và Ethylene một cách tinh chỉnh tự động hóa.","icon":"<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\\"/></svg>"}]}},{"id":"products_tech","type":"product_categories","props":{"title":"Công Nghệ Tích Hợp Ở Thiết Bị Tiêu Chuẩn","subtitle":"Các dòng sản phẩm phân phối được ứng dụng các tinh hoa công nghệ hàng đầu."}},{"id":"projects_tech","type":"featured_projects","props":{"title":"Thực Chiến Công Nghệ Trên Công Trình","subtitle":"Những dự án tiêu biểu minh chứng cho khả năng triển khai công nghệ cao của Việt VinhCorp."}},{"id":"partners_tech","type":"about_partners","props":{"title":"Mạng Lưới Đối Tác Chuyển Giao Công Nghệ Toàn Cầu"}}]}	Khám phá các tiến bộ công nghệ cốt lõi giúp VVC thiết lập tiêu chuẩn mới trong làm lạnh công nghiệp.	\N	t	2026-04-09 12:19:14.251978+00	2026-04-09 12:19:14.251978+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4254f539-285d-4106-9ce3-9486e0b2943b	products-industrial	Sản Phẩm Điều Hòa Công Nghiệp	{"sections":[{"id":"hero_industrial","type":"hero","props":{"title":"Giải Pháp Điều Hòa Công Nghiệp","description":"Hệ thống làm mát công suất siêu lớn chuyên dụng cho nhà máy, kho xưởng và trung tâm thương mại theo tiêu chuẩn quốc tế ISO 9001.","backgroundImage":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_hvac.png","alignment":"center","badge":"Hiệu suất tối ưu"}},{"id":"media_industrial_1","type":"media_section","props":{"title":"Khả năng vận hành mạnh mẽ, tối ưu","description":"Việt Vinh tự hào là nhà cung cấp giải pháp điều hòa trung tâm với công suất lên đến 3000RT. Công nghệ máy nén tích hợp biến tần toàn phần giúp đạt hiệu suất làm mát xuất sắc, đồng thời tiết kiệm đáng kể chi phí điện năng.\\n\\n<ul><li class='mb-2'>✅ <b>Làm lạnh siêu tốc:</b> Đáp ứng mọi yêu cầu khắt khe về nhiệt độ.</li><li class='mb-2'>✅ <b>Tiết kiệm điện 40%:</b> Nhờ công nghệ từ tĩnh và môi chất lạnh thế hệ mới (R134a/R1234ze).</li><li class='mb-2'>✅ <b>Độ ổn định cao:</b> Vận hành bền bỉ liên tục 24/7 trong nhiều năm.</li></ul>","image":"https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80","layout":"image-left","imageWidth":50,"mediaType":"image"}},{"id":"tech_industrial_1","type":"technical_detail","props":{"title":"Đặc tính kỹ thuật vượt trội","description":"Chiller và AHU công nghiệp tại Việt VinhCorp không chỉ làm lạnh, mà còn thanh lọc không khí, kiểm soát độ ẩm chặt chẽ dùng cho các công trình đẳng cấp cao như Dược Phẩm, Điện Tử.\\n\\n- Dải công suất: 50RT - 3.000RT\\n- Chuẩn màng lọc vệ sinh: HEPA H13/H14\\n- Lưu lượng gió (AHU): Lên đến 120.000 CFM\\n- Công nghệ điều khiển: iBMS/PLC tự động hóa toàn phần","image":"https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_compressor.png","layout":"image-right"}},{"id":"feat_projects_idx","type":"featured_projects","props":{"title":"Dự Án Công Nghiệp Thực Tế","description":"Các đối tác đã tin tưởng và ứng dụng hệ thống điều hòa công nghiệp của chúng tôi."}},{"id":"feat_products_idx","type":"product_categories","props":{"title":"Thiết Bị Lưu Trữ & Phụ Trợ","description":"Khám phá thêm hệ sinh thái sản phẩm toàn diện cho HVAC & Lạnh Công Nghiệp."}}]}	Giải pháp HVAC toàn diện, hiệu suất cao dành riêng cho nhà máy, khu công nghiệp và công trình quy mô lớn.		t	2026-04-09 12:14:55.184285+00	2026-04-10 13:49:22.998+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1db14075-944a-4520-8941-93c918128c40	services	Dịch vụ	{"sections":[{"id":"hero-section","type":"HeroBlock","data":{"title":"Dịch vụ chuyên nghiệp","description":"Cung cấp đầy đủ các giải pháp dịch vụ kỹ thuật điện lạnh chất lượng cao từ tư vấn, lắp đặt đến bảo trì và sửa chữa.","backgroundImage":"/assets/images/service-hero.jpg","primaryButtonLabel":"Liên hệ tư vấn","primaryButtonLink":"/contact","secondaryButtonLabel":"Hỗ trợ kỹ thuật","secondaryButtonLink":"/service-support"}},{"id":"overview-section","type":"ContentBlock","data":{"title":"Dịch vụ toàn diện","content":"Với hơn 20 năm kinh nghiệm trong lĩnh vực điện lạnh công nghiệp và dân dụng, VIETVINH INDUSTRIES CORPORATION đã trở thành đối tác tin cậy của hàng nghìn khách hàng trên cả nước. Chúng tôi tự hào cung cấp các dịch vụ kỹ thuật chất lượng cao với đội ngũ chuyên viên được đào tạo bài bản.","image":"/assets/images/service-overview.jpg","features":["Đội ngũ kỹ sư giàu kinh nghiệm, được chứng nhận chuyên môn","Phục vụ 24/7 với thời gian phản hồi nhanh chóng","Trang thiết bị hiện đại, công nghệ tiên tiến","Cam kết chất lượng và bảo hành dài hạn"]}}]}	\N	\N	t	2026-04-05 00:38:56.706857+00	2026-04-05 00:38:56.706857+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team_members (id, name, role, bio, image_url, social_links, display_order, created_at, updated_at) FROM stdin;
94005510-d509-4c77-87af-76a68b171620	Nguyễn Văn A	Chủ tịch Hội đồng Quản trị	Hơn 25 năm kinh nghiệm trong lĩnh vực kỹ thuật lạnh và quản trị doanh nghiệp.	https://i.pravatar.cc/300?img=1	{}	1	2026-04-02 02:06:30.422399+00	2026-04-02 02:06:30.422399+00
733b66fc-5b0d-4443-acee-b114b587942e	Lê Văn C	Phó Tổng Giám đốc	Kỹ sư cơ điện lạnh với 15 năm kinh nghiệm triển khai các dự án quy mô lớn.	https://i.pravatar.cc/300?img=3	{}	3	2026-04-02 02:06:30.422399+00	2026-04-02 02:06:30.422399+00
99c4daf6-2d32-4ca6-afa0-9289e732950a	Phạm Thị D	Giám đốc Tài chính	Chuyên gia tài chính với kinh nghiệm quản lý ngân sách và đầu tư doanh nghiệp.	https://i.pravatar.cc/300?img=4	{}	4	2026-04-02 02:06:30.422399+00	2026-04-02 02:06:30.422399+00
f03bc08e-29b9-4b93-b85f-4443eb89f4fb	Trần Thị B	Tổng Giám đốc	Chuyên gia quản lý với tầm nhìn chiến lược, dẫn dắt VVC phát triển bền vững.	https://i.pravatar.cc/300?img=5	{}	2	2026-04-02 02:06:30.422399+00	2026-04-02 02:06:30.422399+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, full_name, avatar_url, role, created_at) FROM stdin;
0388c308-25d3-4385-9aa1-788edeb73aaa	admin@vrc.com.vn	VRC Administrator	\N	admin	2026-04-01 10:35:16.869976+00
\.


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: events events_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_slug_key UNIQUE (slug);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_slug_key UNIQUE (slug);


--
-- Name: navigation navigation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.navigation
    ADD CONSTRAINT navigation_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news news_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_slug_key UNIQUE (slug);


--
-- Name: partners partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_code_key UNIQUE (code);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_slug_key UNIQUE (slug);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: resources resources_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_slug_key UNIQUE (slug);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: service_categories service_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_pkey PRIMARY KEY (id);


--
-- Name: service_categories service_categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_slug_key UNIQUE (slug);


--
-- Name: service_inquiries service_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_inquiries
    ADD CONSTRAINT service_inquiries_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services services_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_slug_key UNIQUE (slug);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (key);


--
-- Name: static_pages static_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.static_pages
    ADD CONSTRAINT static_pages_pkey PRIMARY KEY (id);


--
-- Name: static_pages static_pages_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.static_pages
    ADD CONSTRAINT static_pages_slug_key UNIQUE (slug);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: partners update_partners_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.update_partners_updated_at_column();


--
-- Name: events events_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: job_applications job_applications_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- Name: navigation navigation_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.navigation
    ADD CONSTRAINT navigation_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.navigation(id) ON DELETE CASCADE;


--
-- Name: news news_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: projects projects_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: resources resources_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.resources(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: service_inquiries service_inquiries_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_inquiries
    ADD CONSTRAINT service_inquiries_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- Name: services services_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.service_categories(id) ON DELETE SET NULL;


--
-- Name: users users_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);


--
-- Name: users users_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_fkey FOREIGN KEY (role) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: contacts Admins can delete contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete contacts" ON public.contacts FOR DELETE USING (public.is_admin());


--
-- Name: banners Admins can manage banners; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage banners" ON public.banners USING (public.is_admin());


--
-- Name: partners Admins can manage partners; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage partners" ON public.partners USING ((auth.role() = 'authenticated'::text));


--
-- Name: permissions Admins can manage permissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage permissions" ON public.permissions USING (public.is_admin());


--
-- Name: role_permissions Admins can manage role_permissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage role_permissions" ON public.role_permissions USING (public.is_admin());


--
-- Name: roles Admins can manage roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage roles" ON public.roles USING (public.is_admin());


--
-- Name: users Admins can select all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can select all users" ON public.users FOR SELECT USING (public.is_admin());


--
-- Name: contacts Admins can select contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can select contacts" ON public.contacts FOR SELECT USING (public.is_admin());


--
-- Name: contacts Admins can update contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update contacts" ON public.contacts FOR UPDATE USING (public.is_admin());


--
-- Name: users Admins can update users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update users" ON public.users FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: job_applications Admins have full access to applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins have full access to applications" ON public.job_applications USING (true) WITH CHECK (true);


--
-- Name: jobs Admins have full access to jobs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins have full access to jobs" ON public.jobs USING (true) WITH CHECK (true);


--
-- Name: achievements Admins manage achievements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage achievements" ON public.achievements USING (public.is_admin());


--
-- Name: faqs Admins manage faqs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage faqs" ON public.faqs USING (public.is_admin());


--
-- Name: navigation Admins manage navigation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage navigation" ON public.navigation USING (public.is_admin());


--
-- Name: resources Admins manage resources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage resources" ON public.resources USING (public.is_admin());


--
-- Name: site_settings Admins manage settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage settings" ON public.site_settings USING (public.is_admin());


--
-- Name: static_pages Admins manage static pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage static pages" ON public.static_pages USING (public.is_admin());


--
-- Name: team_members Admins manage team_members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage team_members" ON public.team_members USING (public.is_admin());


--
-- Name: static_pages Allow all access to static_pages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all access to static_pages" ON public.static_pages USING (true) WITH CHECK (true);


--
-- Name: service_categories Allow all for admin on service_categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all for admin on service_categories" ON public.service_categories USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: service_inquiries Allow all for admin on service_inquiries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all for admin on service_inquiries" ON public.service_inquiries USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: services Allow all for admin on services; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow all for admin on services" ON public.services USING (public.is_admin()) WITH CHECK (public.is_admin());


--
-- Name: service_inquiries Allow public insert for service_inquiries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert for service_inquiries" ON public.service_inquiries FOR INSERT WITH CHECK (true);


--
-- Name: service_categories Allow public read access for active service_categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access for active service_categories" ON public.service_categories FOR SELECT USING ((is_active = true));


--
-- Name: services Allow public read access for active services; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access for active services" ON public.services FOR SELECT USING ((is_active = true));


--
-- Name: permissions Authenticated can read permissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated can read permissions" ON public.permissions FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: role_permissions Authenticated can read role_permissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated can read role_permissions" ON public.role_permissions FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: roles Authenticated can read roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated can read roles" ON public.roles FOR SELECT USING ((auth.role() = 'authenticated'::text));


--
-- Name: categories Public Insert Categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public Insert Categories" ON public.categories FOR INSERT WITH CHECK (true);


--
-- Name: products Public Insert Products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public Insert Products" ON public.products FOR INSERT WITH CHECK (true);


--
-- Name: projects Public Insert Projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public Insert Projects" ON public.projects FOR INSERT WITH CHECK (true);


--
-- Name: service_categories Public Insert Service Categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public Insert Service Categories" ON public.service_categories FOR INSERT WITH CHECK (true);


--
-- Name: services Public Insert Services; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public Insert Services" ON public.services FOR INSERT WITH CHECK (true);


--
-- Name: static_pages Public Read Access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public Read Access" ON public.static_pages FOR SELECT USING ((is_active = true));


--
-- Name: categories Public Update Categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public Update Categories" ON public.categories FOR UPDATE USING (true);


--
-- Name: products Public Update Products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public Update Products" ON public.products FOR UPDATE USING (true);


--
-- Name: projects Public Update Projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public Update Projects" ON public.projects FOR UPDATE USING (true);


--
-- Name: service_categories Public Update Service Categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public Update Service Categories" ON public.service_categories FOR UPDATE USING (true);


--
-- Name: services Public Update Services; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public Update Services" ON public.services FOR UPDATE USING (true);


--
-- Name: contacts Public can insert contacts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can insert contacts" ON public.contacts FOR INSERT WITH CHECK (true);


--
-- Name: job_applications Public can submit applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can submit applications" ON public.job_applications FOR INSERT WITH CHECK (true);


--
-- Name: banners Public can view active banners; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view active banners" ON public.banners FOR SELECT USING ((is_active = true));


--
-- Name: partners Public can view active partners; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view active partners" ON public.partners FOR SELECT USING ((is_active = true));


--
-- Name: jobs Public can view open jobs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view open jobs" ON public.jobs FOR SELECT USING ((status = 'open'::text));


--
-- Name: achievements Public view achievements; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public view achievements" ON public.achievements FOR SELECT USING ((is_active = true));


--
-- Name: navigation Public view active navigation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public view active navigation" ON public.navigation FOR SELECT USING ((is_active = true));


--
-- Name: categories Public view categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public view categories" ON public.categories FOR SELECT USING (true);


--
-- Name: events Public view events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public view events" ON public.events FOR SELECT USING (true);


--
-- Name: faqs Public view faqs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public view faqs" ON public.faqs FOR SELECT USING ((is_active = true));


--
-- Name: news Public view news; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public view news" ON public.news FOR SELECT USING (true);


--
-- Name: products Public view products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public view products" ON public.products FOR SELECT USING (true);


--
-- Name: projects Public view projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public view projects" ON public.projects FOR SELECT USING (true);


--
-- Name: resources Public view resources; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public view resources" ON public.resources FOR SELECT USING (true);


--
-- Name: site_settings Public view settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public view settings" ON public.site_settings FOR SELECT USING (true);


--
-- Name: team_members Public view team_members; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public view team_members" ON public.team_members FOR SELECT USING (true);


--
-- Name: categories Staff manage categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff manage categories" ON public.categories USING (public.is_admin());


--
-- Name: events Staff manage events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff manage events" ON public.events USING (public.is_admin());


--
-- Name: news Staff manage news; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff manage news" ON public.news USING (public.is_admin());


--
-- Name: products Staff manage products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff manage products" ON public.products USING (public.is_admin());


--
-- Name: projects Staff manage projects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Staff manage projects" ON public.projects USING (public.is_admin());


--
-- Name: users Users can read own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING ((auth.uid() = id));


--
-- Name: achievements; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

--
-- Name: banners; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

--
-- Name: categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

--
-- Name: contacts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

--
-- Name: faqs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

--
-- Name: job_applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

--
-- Name: jobs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

--
-- Name: navigation; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;

--
-- Name: news; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

--
-- Name: partners; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

--
-- Name: permissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- Name: projects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

--
-- Name: resources; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

--
-- Name: role_permissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

--
-- Name: roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

--
-- Name: service_categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

--
-- Name: service_inquiries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;

--
-- Name: services; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

--
-- Name: site_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: static_pages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.static_pages ENABLE ROW LEVEL SECURITY;

--
-- Name: team_members; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




-- ==========================================
-- POST-MIGRATION ENHANCEMENTS & TRIGGERS
-- ==========================================

-- 1. Ensure admin@vvc.com.vn is in public.users
INSERT INTO public.users (id, email, full_name, avatar_url, role)
SELECT id, email, raw_user_meta_data->>'full_name', raw_user_meta_data->>'avatar_url', 'admin'
FROM auth.users
WHERE email = 'admin@vvc.com.vn'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 2. Trigger on_auth_user_created for future registrations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Banner extra columns (title_color, description_color)
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS title_color TEXT DEFAULT '#ffffff';
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS description_color TEXT DEFAULT '#ffffff';

-- 4. Setup Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('cv_uploads', 'cv_uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Storage Policies
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
DROP POLICY IF EXISTS "Public can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage storage" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload cvs" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Media" ON storage.objects;

CREATE POLICY "Public can view media" ON storage.objects FOR SELECT TO public USING (bucket_id = 'media');
CREATE POLICY "Public can view documents" ON storage.objects FOR SELECT TO public USING (bucket_id = 'documents');
CREATE POLICY "Authenticated users can manage storage" ON storage.objects FOR ALL TO authenticated USING (bucket_id IN ('media', 'documents', 'cv_uploads'));
CREATE POLICY "Public can upload cvs" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'media' AND name LIKE 'cvs/%' OR bucket_id = 'cv_uploads');
CREATE POLICY "Public Upload Media" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'media');

-- 6. Schema Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
