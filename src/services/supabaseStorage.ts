import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export const DEFAULT_BUCKET_NAME = 'school-media';
const STORAGE_BUCKET_KEY = 'smp_pancasila_supabase_bucket';

/**
 * Get active bucket name (default: 'school-media')
 */
export function getActiveBucketName(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_BUCKET_KEY);
    if (saved && saved.trim()) return saved.trim();
  }
  return DEFAULT_BUCKET_NAME;
}

/**
 * Set custom bucket name
 */
export function setActiveBucketName(name: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_BUCKET_KEY, name.trim() || DEFAULT_BUCKET_NAME);
  }
}

/**
 * Check if the bucket exists and check its accessibility
 */
export async function checkBucketStatus(bucketName = getActiveBucketName()): Promise<{
  exists: boolean;
  isPublic?: boolean;
  error?: string;
  message: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      exists: false,
      message: 'Supabase belum dikonfigurasi (URL / Anon Key kosong).',
    };
  }

  const client = getSupabase();
  if (!client) {
    return { exists: false, message: 'Client Supabase tidak tersedia.' };
  }

  try {
    // 1. Try to get specific bucket
    const { data: bucket, error } = await client.storage.getBucket(bucketName);

    if (error) {
      // If getBucket fails, attempt listBuckets
      const { data: buckets, error: listError } = await client.storage.listBuckets();
      if (!listError && buckets) {
        const found = buckets.find((b) => b.id === bucketName || b.name === bucketName);
        if (found) {
          return {
            exists: true,
            isPublic: found.public,
            message: `Bucket "${bucketName}" ditemukan di Supabase Storage (Status: ${found.public ? 'Public' : 'Private'}).`,
          };
        }
      }

      return {
        exists: false,
        error: error.message,
        message: `Bucket "${bucketName}" belum ditemukan di Supabase: ${error.message}`,
      };
    }

    if (bucket) {
      return {
        exists: true,
        isPublic: bucket.public,
        message: `Bucket "${bucketName}" aktif dan siap digunakan (Public: ${bucket.public ? 'Ya' : 'Tidak'}).`,
      };
    }

    return {
      exists: false,
      message: `Bucket "${bucketName}" tidak ditemukan.`,
    };
  } catch (err: any) {
    return {
      exists: false,
      error: err.message,
      message: `Gagal memeriksa status bucket: ${err.message || 'Network error'}`,
    };
  }
}

/**
 * Create the bucket via Supabase Storage API
 */
export async function createStorageBucket(bucketName = getActiveBucketName()): Promise<{
  success: boolean;
  message: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Kredensial Supabase belum diatur.',
    };
  }

  const client = getSupabase();
  if (!client) {
    return { success: false, message: 'Koneksi Supabase tidak tersedia.' };
  }

  try {
    const { data, error } = await client.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
        'image/gif',
        'application/pdf',
      ],
    });

    if (error) {
      // Check if it already exists
      if (error.message?.includes('already exists') || (error as any).statusCode === '409') {
        return {
          success: true,
          message: `Bucket "${bucketName}" sudah ada di Supabase Storage.`,
        };
      }

      if (
        error.message?.includes('violates row-level security policy') ||
        error.message?.includes('AccessDenied') ||
        (error as any).statusCode === '403'
      ) {
        return {
          success: false,
          message: `Supabase menerapkan Row-Level Security (RLS) pada pembuatan bucket via Anon Key. Silakan salin & jalankan Skrip SQL di bawah ini pada menu "SQL Editor" di Dashboard Supabase untuk membuat bucket '${bucketName}' secara instan.`,
        };
      }

      return {
        success: false,
        message: `Gagal membuat bucket via API: ${error.message}. Anda bisa membuatnya lewat Supabase Dashboard -> Storage -> New Bucket ("${bucketName}"), atau via SQL Editor.`,
      };
    }

    return {
      success: true,
      message: `Bucket "${bucketName}" berhasil dibuat dengan status Public!`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Terjadi kesalahan: ${err.message || 'Unknown error'}`,
    };
  }
}

/**
 * Test upload a small asset to verify write and read permissions on the bucket
 */
export async function testBucketUpload(bucketName = getActiveBucketName()): Promise<{
  success: boolean;
  publicUrl?: string;
  message: string;
  latencyMs?: number;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase belum dikonfigurasi.',
    };
  }

  const client = getSupabase();
  if (!client) return { success: false, message: 'Client Supabase tidak aktif.' };

  const startTime = performance.now();
  const testFileName = `test-ping/ping-${Date.now()}.json`;
  const testContent = JSON.stringify({
    app: 'SMP Pancasila Ponokawan',
    timestamp: new Date().toISOString(),
    status: 'Storage Bucket OK',
  });
  const blob = new Blob([testContent], { type: 'application/json' });

  try {
    // 1. Upload test file
    const { data, error } = await client.storage
      .from(bucketName)
      .upload(testFileName, blob, {
        cacheControl: '60',
        upsert: true,
        contentType: 'application/json',
      });

    const latencyMs = Math.round(performance.now() - startTime);

    if (error) {
      return {
        success: false,
        latencyMs,
        message: `Gagal mengunggah file uji ke bucket "${bucketName}": ${error.message}. Pastikan bucket sudah dibuat dan RLS policy mengizinkan INSERT.`,
      };
    }

    // 2. Get public url
    const { data: urlData } = client.storage.from(bucketName).getPublicUrl(testFileName);
    const publicUrl = urlData?.publicUrl || '';

    // 3. Try to clean up the test file
    client.storage.from(bucketName).remove([testFileName]).catch(() => {});

    return {
      success: true,
      publicUrl,
      latencyMs,
      message: `Uji coba upload ke bucket "${bucketName}" BERHASIL (${latencyMs}ms)! CDN URL berfungsi normal.`,
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      latencyMs,
      message: `Error saat menguji storage bucket: ${err.message || 'Unknown error'}`,
    };
  }
}

/**
 * Upload an image or document file directly to Supabase Storage Bucket
 * Returns the public CDN URL to be saved in database/storage
 */
export async function uploadFileToSupabase(
  file: File | Blob,
  options?: {
    folder?: string;
    fileName?: string;
    bucketName?: string;
  }
): Promise<{
  success: boolean;
  url: string;
  path?: string;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      url: '',
      error: 'Supabase belum dikonfigurasi',
    };
  }

  const client = getSupabase();
  if (!client) {
    return { success: false, url: '', error: 'Client Supabase belum siap' };
  }

  const bucket = options?.bucketName || getActiveBucketName();
  const folder = options?.folder || 'uploads';

  // Sanitize filename
  const originalName = (file as File).name || 'file';
  const cleanExt = originalName.includes('.')
    ? originalName.split('.').pop()?.toLowerCase() || 'jpg'
    : 'jpg';
  const safeBaseName = originalName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const filePath = `${folder}/${timestamp}-${safeBaseName}-${randomSuffix}.${cleanExt}`;

  try {
    const mimeType = file.type || 'image/jpeg';
    const { data, error } = await client.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '31536000', // 1 year cache for static media
        upsert: true,
        contentType: mimeType,
      });

    if (error) {
      console.warn('[Supabase Storage] Upload error:', error);
      return {
        success: false,
        url: '',
        error: error.message,
      };
    }

    const { data: urlData } = client.storage.from(bucket).getPublicUrl(filePath);
    return {
      success: true,
      url: urlData?.publicUrl || '',
      path: filePath,
    };
  } catch (err: any) {
    console.error('[Supabase Storage] Exception:', err);
    return {
      success: false,
      url: '',
      error: err.message || 'Upload gagal',
    };
  }
}

/**
 * Upload a Base64 dataUrl directly to Supabase Storage bucket
 */
export async function uploadBase64ToSupabase(
  dataUrl: string,
  options?: {
    folder?: string;
    fileName?: string;
    bucketName?: string;
  }
): Promise<{ success: boolean; url: string; error?: string }> {
  try {
    // Convert base64 dataUrl to Blob
    const parts = dataUrl.split(',');
    if (parts.length !== 2) {
      return { success: false, url: '', error: 'Bukan format dataUrl base64 yang valid' };
    }

    const mimeMatch = parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const byteCharacters = atob(parts[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: mimeType });
    const ext = mimeType.split('/')[1] || 'jpg';
    const mockFile = new File([blob], `${options?.fileName || 'image'}.${ext}`, { type: mimeType });

    return await uploadFileToSupabase(mockFile, options);
  } catch (err: any) {
    return {
      success: false,
      url: '',
      error: err.message || 'Gagal memproses gambar base64',
    };
  }
}

/**
 * Generate complete SQL script for creating and configuring the Supabase storage bucket
 */
export function getStorageBucketSql(bucketName = getActiveBucketName()): string {
  return `-- ============================================================================
-- SUPABASE STORAGE BUCKET SCRIPT: ${bucketName}
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. Buat bucket penyimpanan '${bucketName}' jika belum ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    '${bucketName}',
    '${bucketName}',
    true, -- WAJIB TRUE agar foto dan dokumen dapat dilihat oleh publik / pengunjung website
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
-- A. Izinkan siapapun (publik/pengunjung) melihat dan mengunduh file media
DROP POLICY IF EXISTS "Public Read ${bucketName}" ON storage.objects;
CREATE POLICY "Public Read ${bucketName}"
ON storage.objects FOR SELECT
USING (bucket_id = '${bucketName}');

-- B. Izinkan upload file ke bucket ${bucketName} (Anon & Authenticated)
DROP POLICY IF EXISTS "Public Upload ${bucketName}" ON storage.objects;
CREATE POLICY "Public Upload ${bucketName}"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = '${bucketName}');

-- C. Izinkan update/perbarui file di bucket ${bucketName}
DROP POLICY IF EXISTS "Public Update ${bucketName}" ON storage.objects;
CREATE POLICY "Public Update ${bucketName}"
ON storage.objects FOR UPDATE
USING (bucket_id = '${bucketName}');

-- D. Izinkan hapus file dari bucket ${bucketName}
DROP POLICY IF EXISTS "Public Delete ${bucketName}" ON storage.objects;
CREATE POLICY "Public Delete ${bucketName}"
ON storage.objects FOR DELETE
USING (bucket_id = '${bucketName}');

-- ============================================================================
-- Sukses! Bucket '${bucketName}' kini siap digunakan untuk upload foto guru, berita, galeri, dll.
-- ============================================================================
`;
}
