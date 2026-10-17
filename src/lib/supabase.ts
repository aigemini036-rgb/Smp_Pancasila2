import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  URL: 'smp_pancasila_supabase_url',
  ANON_KEY: 'smp_pancasila_supabase_anon_key',
};

// Retrieve configuration from Vite env or admin local storage override
export function getSupabaseConfig(): {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'env' | 'storage' | 'none';
} {
  const envUrl = (((import.meta as any).env?.VITE_SUPABASE_URL as string) || '').trim();
  const envAnonKey = (((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || '').trim();

  const storedUrl = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.URL) || '' : '').trim();
  const storedAnonKey = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ANON_KEY) || '' : '').trim();

  // Stored override takes precedence if set, otherwise use env
  if (storedUrl && storedAnonKey && !storedUrl.includes('your-project-id')) {
    return {
      url: storedUrl,
      anonKey: storedAnonKey,
      isConfigured: true,
      source: 'storage',
    };
  }

  if (envUrl && envAnonKey && !envUrl.includes('your-project-id')) {
    return {
      url: envUrl,
      anonKey: envAnonKey,
      isConfigured: true,
      source: 'env',
    };
  }

  return {
    url: storedUrl || envUrl,
    anonKey: storedAnonKey || envAnonKey,
    isConfigured: false,
    source: 'none',
  };
}

export function saveSupabaseConfig(url: string, anonKey: string, bucket: string = 'school-media'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.ANON_KEY, anonKey.trim());
    localStorage.setItem('smp_pancasila_supabase_bucket', (bucket || 'school-media').trim());
    // Re-initialize client
    initSupabaseClient();
    // Replicate config to backend server so other devices get it automatically
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url.trim(), anonKey: anonKey.trim(), bucket: (bucket || 'school-media').trim() }),
    }).catch(() => {
      // offline / fallback
    });
  }
}

export function clearSupabaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.URL);
    localStorage.removeItem(STORAGE_KEYS.ANON_KEY);
    initSupabaseClient();
    // Clear from backend server as well
    fetch('/api/config', { method: 'DELETE' }).catch(() => {});
  }
}

/**
 * Fetch Supabase configuration from central server or static config
 * This allows all devices and visitors to share the same Supabase configuration!
 */
export async function fetchServerSupabaseConfig(): Promise<{ url: string; anonKey: string; isConfigured: boolean } | null> {
  if (typeof window === 'undefined') return null;

  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      if (
        data?.supabase?.url &&
        data?.supabase?.anonKey &&
        !data.supabase.url.includes('your-project-id')
      ) {
        localStorage.setItem(STORAGE_KEYS.URL, data.supabase.url);
        localStorage.setItem(STORAGE_KEYS.ANON_KEY, data.supabase.anonKey);
        if (data.supabase.bucket) {
          localStorage.setItem('smp_pancasila_supabase_bucket', data.supabase.bucket);
        }
        initSupabaseClient();
        return {
          url: data.supabase.url,
          anonKey: data.supabase.anonKey,
          isConfigured: true,
        };
      }
    }
  } catch {
    // If API unavailable, fallback to static /supabase-config.json
    try {
      const resStatic = await fetch('/supabase-config.json');
      if (resStatic.ok) {
        const data = await resStatic.json();
        if (data?.url && data?.anonKey && !data.url.includes('your-project-id')) {
          localStorage.setItem(STORAGE_KEYS.URL, data.url);
          localStorage.setItem(STORAGE_KEYS.ANON_KEY, data.anonKey);
          if (data.bucket) {
            localStorage.setItem('smp_pancasila_supabase_bucket', data.bucket);
          }
          initSupabaseClient();
          return {
            url: data.url,
            anonKey: data.anonKey,
            isConfigured: true,
          };
        }
      }
    } catch {
      // ignore
    }
  }

  return null;
}

// Global cached client instance
let cachedClient: SupabaseClient | null = null;

function initSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (config.isConfigured && config.url && config.anonKey) {
    try {
      cachedClient = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return cachedClient;
    } catch (err) {
      console.error('[Supabase] Failed to initialize client:', err);
      cachedClient = null;
      return null;
    }
  }
  cachedClient = null;
  return null;
}

export function getSupabase(): SupabaseClient | null {
  if (!cachedClient) {
    return initSupabaseClient();
  }
  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig().isConfigured;
}

/**
 * Ping test to verify connection to Supabase database
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
  tablesFound?: string[];
}> {
  const client = getSupabase();
  const config = getSupabaseConfig();

  if (!client || !config.isConfigured) {
    return {
      success: false,
      message: 'Kredensial Supabase (URL & Anon Key) belum diisi.',
    };
  }

  const startTime = performance.now();
  try {
    // Attempt to query school_settings or a basic check
    const { data, error } = await client
      .from('school_settings')
      .select('id')
      .limit(1);

    const latencyMs = Math.round(performance.now() - startTime);

    if (error) {
      // Check if it's missing table (PGRST205 / PGRST204 / 42P01 / schema cache)
      const isMissingTable =
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.code === 'PGRST204' ||
        error.message?.includes('schema cache') ||
        error.message?.includes('does not exist');

      if (isMissingTable) {
        // Also verify storage endpoint to confirm credentials and network are 100% active
        try {
          const { error: storageErr } = await client.storage.listBuckets();
          if (!storageErr) {
            return {
              success: true,
              latencyMs,
              message: `Koneksi ke Supabase AKTIF & API Key Valid (${latencyMs}ms)! Tabel database belum dibuat. Silakan jalankan Skrip SQL di Tab 2 (Setup Database & SQL).`,
            };
          }
        } catch {
          // continue
        }

        return {
          success: true,
          latencyMs,
          message: 'Berhasil terhubung ke Supabase! Namun tabel database belum dibuat. Silakan jalankan Skrip SQL di Tab 2 (Setup Database & SQL).',
        };
      }

      return {
        success: false,
        latencyMs,
        message: `Koneksi gagal: ${error.message} (Kode: ${error.code || 'UNKNOWN'})`,
      };
    }

    return {
      success: true,
      latencyMs,
      message: `Koneksi ke Supabase aktif dan berhasil! (${latencyMs}ms)`,
      tablesFound: data ? ['school_settings'] : [],
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      latencyMs,
      message: `Terjadi kendala jaringan saat menghubungi Supabase: ${err.message || 'Network error'}`,
    };
  }
}
