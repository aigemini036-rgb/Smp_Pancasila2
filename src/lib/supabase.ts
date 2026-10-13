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
  if (storedUrl && storedAnonKey) {
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

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.ANON_KEY, anonKey.trim());
    // Re-initialize client
    initSupabaseClient();
  }
}

export function clearSupabaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.URL);
    localStorage.removeItem(STORAGE_KEYS.ANON_KEY);
    initSupabaseClient();
  }
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
      // Check if it's a 404/PGRST204 meaning table doesn't exist yet, but connection was made!
      if (error.code === '42P01' || error.message?.includes('relation "school_settings" does not exist')) {
        return {
          success: true,
          latencyMs,
          message: 'Berhasil terhubung ke Supabase! Namun tabel database belum dibuat. Silakan jalankan Skrip SQL di Supabase SQL Editor.',
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
