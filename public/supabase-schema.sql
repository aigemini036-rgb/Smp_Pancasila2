-- ============================================================================
-- SKRIP SKEMA DATABASE SUPABASE UNTUK SMP PANCASILA PONOKAWAN
-- Jalankan skrip ini di menu: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PENGATURAN SEKOLAH (school_settings)
CREATE TABLE IF NOT EXISTS public.school_settings (
    id TEXT PRIMARY KEY DEFAULT 'set-001',
    school_name TEXT NOT NULL DEFAULT 'SMP Pancasila Ponokawan',
    logo TEXT DEFAULT '/logo-smp-pancasila.png',
    address TEXT DEFAULT 'Jl. Raya Ponokawan No. 45, Desa Ponokawan, Kec. Krian, Kabupaten Sidoarjo, Jawa Timur 61262',
    phone TEXT DEFAULT '(031) 8971234 / 0812-3456-7890',
    email TEXT DEFAULT 'info@smppancasilaponokawan.sch.id',
    description TEXT,
    vision TEXT,
    mission TEXT,
    history TEXT,
    operating_hours TEXT DEFAULT 'Senin - Jumat: 07.00 - 15.00 WIB | Sabtu: Ekstrakurikuler',
    npsn TEXT DEFAULT '20501234',
    accreditation TEXT DEFAULT 'Akreditasi A',
    accreditation_label TEXT DEFAULT 'Status Akreditasi Unggul',
    total_students TEXT DEFAULT '450+',
    stat_students_label TEXT DEFAULT 'Peserta Didik Aktif',
    total_teachers TEXT DEFAULT '28+',
    stat_teachers_label TEXT DEFAULT 'Guru & Tenaga Kependidikan',
    total_achievements TEXT DEFAULT '50+',
    stat_achievements_label TEXT DEFAULT 'Prestasi & Kejuaraan',
    social_links JSONB DEFAULT '{"facebook":"https://facebook.com/smppancasilaponokawan","instagram":"https://instagram.com/smppancasilaponokawan","youtube":"https://youtube.com/@smppancasilaponokawan","tiktok":""}'::jsonb,
    contact_other TEXT,
    headmaster_section_background TEXT,
    headmaster_background_position TEXT DEFAULT 'center',
    headmaster_background_opacity NUMERIC DEFAULT 0.15,
    website_title TEXT DEFAULT 'SMP Pancasila Ponokawan - Krian, Sidoarjo',
    website_tagline TEXT DEFAULT 'Membentuk Generasi Berkarakter Pancasila & Unggul Prestasi',
    meta_description TEXT DEFAULT 'Website resmi SMP Pancasila Ponokawan, Krian, Sidoarjo. Lembaga pendidikan menengah terakreditasi.',
    meta_keywords TEXT DEFAULT 'SMP Pancasila Ponokawan, SMP Krian, Sekolah Menengah Pertama Sidoarjo',
    banner_announcement_enabled BOOLEAN DEFAULT false,
    banner_announcement_text TEXT,
    banner_announcement_link TEXT,
    whatsapp_number TEXT DEFAULT '6281234567890',
    whatsapp_chat_widget_enabled BOOLEAN DEFAULT true,
    google_maps_embed TEXT,
    footer_copyright TEXT DEFAULT 'SMP Pancasila Ponokawan. Seluruh Hak Cipta Dilindungi.',
    maintenance_mode BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABEL PERSONEL (Kepala Sekolah, Guru, Staf TU)
CREATE TABLE IF NOT EXISTS public.people (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    photo TEXT,
    position TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('kepala_sekolah', 'guru', 'staff')),
    nip_nuptk TEXT,
    education TEXT,
    subject TEXT,
    education_history TEXT,
    work_history TEXT,
    short_bio TEXT,
    contact TEXT,
    website TEXT, -- Tautan website/blog pribadi guru
    achievements_note TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABEL BERITA / ARTIKEL (news)
CREATE TABLE IF NOT EXISTS public.news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    thumbnail TEXT,
    content TEXT NOT NULL,
    author_id TEXT DEFAULT 'admin',
    author_name TEXT DEFAULT 'Humas SMP Pancasila',
    category TEXT DEFAULT 'Berita Sekolah',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABEL PENGUMUMAN & AGENDA (announcements)
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    start_date TEXT NOT NULL,
    end_date TEXT,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABEL PRESTASI (achievements)
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('sekolah', 'individu')),
    recipient_name TEXT,
    recipient_id TEXT,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    documentation TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABEL ALBUM GALERI (galleries)
CREATE TABLE IF NOT EXISTS public.galleries (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABEL FOTO GALERI (gallery_images)
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id TEXT PRIMARY KEY,
    gallery_id TEXT NOT NULL REFERENCES public.galleries(id) ON DELETE CASCADE,
    image TEXT NOT NULL,
    caption TEXT,
    date TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. TABEL SARANA & FASILITAS (facilities)
CREATE TABLE IF NOT EXISTS public.facilities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    photo TEXT,
    image TEXT,
    location TEXT,
    condition TEXT,
    specifications TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TABEL AKUN PENGGUNA ADMIN (admin_users)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('superadmin', 'admin', 'editor', 'operator')),
    avatar TEXT,
    phone TEXT,
    linked_person_id TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. TABEL FILE MEDIA (media_files)
CREATE TABLE IF NOT EXISTS public.media_files (
    id TEXT PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    alt_text TEXT,
    uploaded_by TEXT DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Membuka akses baca untuk pengunjung publik, dan akses kelola penuh untuk anon/authenticated
-- ============================================================================
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses: Baca Publik & Kelola Bebas (dengan Anon Key atau User Login)
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
        AND tablename IN ('school_settings', 'people', 'news', 'announcements', 'achievements', 'galleries', 'gallery_images', 'facilities', 'admin_users', 'media_files')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public Read All" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Public Read All" ON public.%I FOR SELECT USING (true)', tbl);
        
        EXECUTE format('DROP POLICY IF EXISTS "Full Access Anon" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Full Access Anon" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl);
    END LOOP;
END
$$;

-- ============================================================================
-- SEED INITIAL DATA
-- Mengisi data bawaan SMP Pancasila Ponokawan jika tabel masih kosong
-- ============================================================================
INSERT INTO public.school_settings (id, school_name, logo, address, phone, email)
VALUES ('set-001', 'SMP Pancasila Ponokawan', '/logo-smp-pancasila.png', 'Jl. Raya Ponokawan No. 45, Desa Ponokawan, Kec. Krian, Kabupaten Sidoarjo, Jawa Timur 61262', '(031) 8971234', 'info@smppancasilaponokawan.sch.id')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.admin_users (id, full_name, email, role, status)
VALUES ('usr-001', 'Administrator Utama', 'admin@smppancasilaponokawan.sch.id', 'superadmin', 'active')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 10. SUPABASE STORAGE BUCKET (school-media)
-- Penyimpanan file gambar (foto guru, thumbnail berita, galeri, aset sekolah)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'school-media',
    'school-media',
    true, -- Public bucket agar gambar dapat ditampilkan di website
    52428800, -- Batas 50 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 52428800;

-- Kebijakan Akses Storage
DROP POLICY IF EXISTS "Public Read School Media" ON storage.objects;
CREATE POLICY "Public Read School Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'school-media');

DROP POLICY IF EXISTS "Public Upload School Media" ON storage.objects;
CREATE POLICY "Public Upload School Media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'school-media');

DROP POLICY IF EXISTS "Public Update School Media" ON storage.objects;
CREATE POLICY "Public Update School Media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'school-media');

DROP POLICY IF EXISTS "Public Delete School Media" ON storage.objects;
CREATE POLICY "Public Delete School Media"
ON storage.objects FOR DELETE
USING (bucket_id = 'school-media');

-- Selesai! Skema database dan storage bucket siap digunakan oleh aplikasi web SMP Pancasila.
