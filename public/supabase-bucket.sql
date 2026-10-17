-- ============================================================================
-- SUPABASE STORAGE BUCKET: school-media
-- SMP PANCASILA PONOKAWAN
-- Jalankan skrip ini di menu: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. Buat bucket penyimpanan 'school-media' (Public = true)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'school-media',
    'school-media',
    true, -- WAJIB TRUE agar foto guru, berita, dan galeri bisa tampil di browser
    52428800, -- Batas ukuran file 50 MB
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 52428800;

-- 2. Kebijakan Row Level Security (RLS) untuk storage.objects
-- A. Izinkan publik membaca/melihat seluruh file media
DROP POLICY IF EXISTS "Public Read school-media" ON storage.objects;
CREATE POLICY "Public Read school-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'school-media');

-- B. Izinkan upload file ke bucket school-media (Anon & Authenticated)
DROP POLICY IF EXISTS "Public Upload school-media" ON storage.objects;
CREATE POLICY "Public Upload school-media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'school-media');

-- C. Izinkan update file di bucket school-media
DROP POLICY IF EXISTS "Public Update school-media" ON storage.objects;
CREATE POLICY "Public Update school-media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'school-media');

-- D. Izinkan hapus file di bucket school-media
DROP POLICY IF EXISTS "Public Delete school-media" ON storage.objects;
CREATE POLICY "Public Delete school-media"
ON storage.objects FOR DELETE
USING (bucket_id = 'school-media');

-- ============================================================================
-- Selesai! Bucket 'school-media' aktif dan siap menerima upload file foto/media.
-- ============================================================================
