import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Data directory & store paths
const ROOT_DIR = path.resolve(__dirname);
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');
const SUPABASE_CONFIG_PATH = path.join(DATA_DIR, 'supabase-config.json');
const PUBLIC_SUPABASE_CONFIG_PATH = path.resolve(__dirname, 'public', 'supabase-config.json');
const ENV_PATH = path.join(ROOT_DIR, '.env');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure public directory exists
const PUBLIC_DIR = path.resolve(__dirname, 'public');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Helper to read JSON safely
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`[Server] Error reading ${filePath}:`, err);
  }
  return fallback;
}

// Helper to write JSON safely
function writeJsonFile<T>(filePath: string, data: T): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`[Server] Error writing ${filePath}:`, err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// API Endpoints: Health & Status
// -----------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    storeExists: fs.existsSync(STORE_PATH),
    supabaseConfigured: fs.existsSync(SUPABASE_CONFIG_PATH) || Boolean(process.env.VITE_SUPABASE_URL),
  });
});

// -----------------------------------------------------------------------------
// API Endpoints: Supabase Configuration & API Keys
// -----------------------------------------------------------------------------
app.get('/api/config', (req, res) => {
  // 1. Check data/supabase-config.json
  let cfg = readJsonFile(SUPABASE_CONFIG_PATH, { url: '', anonKey: '', bucket: 'school-media' });
  let source: 'file' | 'env' | 'public' | 'none' = 'none';

  // 2. If not found or empty, check public/supabase-config.json
  if (!cfg.url || !cfg.anonKey || cfg.url.includes('your-project-id')) {
    const pubCfg = readJsonFile(PUBLIC_SUPABASE_CONFIG_PATH, { url: '', anonKey: '', bucket: 'school-media' });
    if (pubCfg.url && pubCfg.anonKey && !pubCfg.url.includes('your-project-id')) {
      cfg = pubCfg;
      source = 'public';
    }
  } else {
    source = 'file';
  }

  // 3. If still empty, check process.env / .env
  const envUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
  const envAnonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
  const envBucket = (process.env.VITE_SUPABASE_STORAGE_BUCKET || 'school-media').trim();

  if ((!cfg.url || !cfg.anonKey || cfg.url.includes('your-project-id')) && envUrl && envAnonKey && !envUrl.includes('your-project-id')) {
    cfg = {
      url: envUrl,
      anonKey: envAnonKey,
      bucket: envBucket || 'school-media',
    };
    source = 'env';
  }

  const isConfigured = Boolean(cfg.url && cfg.anonKey && !cfg.url.includes('your-project-id'));

  res.json({
    supabase: {
      url: cfg.url || '',
      anonKey: cfg.anonKey || '',
      bucket: cfg.bucket || 'school-media',
      isConfigured,
      source,
    },
    files: {
      envExists: fs.existsSync(ENV_PATH),
      publicConfigExists: fs.existsSync(PUBLIC_SUPABASE_CONFIG_PATH),
      dataConfigExists: fs.existsSync(SUPABASE_CONFIG_PATH),
    },
  });
});

app.post('/api/config', (req, res) => {
  const { url, anonKey, bucket = 'school-media' } = req.body || {};
  const config = {
    url: typeof url === 'string' ? url.trim() : '',
    anonKey: typeof anonKey === 'string' ? anonKey.trim() : '',
    bucket: typeof bucket === 'string' ? bucket.trim() : 'school-media',
    updated_at: new Date().toISOString(),
    comment: 'File konfigurasi database & API key Supabase untuk SMP Pancasila Ponokawan.',
  };

  writeJsonFile(SUPABASE_CONFIG_PATH, config);
  writeJsonFile(PUBLIC_SUPABASE_CONFIG_PATH, config);

  // If valid credentials, also update .env file if it exists or create it
  if (config.url && config.anonKey) {
    try {
      const envContent = `# ==============================================================================
# SMP PANCASILA PONOKAWAN - ENVIRONMENT CONFIGURATION (.env)
# Terakhir diperbarui: ${new Date().toLocaleString('id-ID')}
# ==============================================================================
VITE_SUPABASE_URL="${config.url}"
VITE_SUPABASE_ANON_KEY="${config.anonKey}"
VITE_SUPABASE_STORAGE_BUCKET="${config.bucket}"
APP_URL="${process.env.APP_URL || 'http://localhost:3000'}"
GEMINI_API_KEY="${process.env.GEMINI_API_KEY || 'MY_GEMINI_API_KEY'}"
`;
      fs.writeFileSync(ENV_PATH, envContent, 'utf-8');
    } catch (e) {
      console.warn('[Server] Could not write .env file:', e);
    }
  }

  const isConfigured = Boolean(config.url && config.anonKey);
  res.json({
    success: true,
    supabase: {
      url: config.url,
      anonKey: config.anonKey,
      bucket: config.bucket,
      isConfigured,
    },
    message: isConfigured
      ? 'File konfigurasi database & API Key Supabase (.env, public/supabase-config.json, dan server) berhasil diperbarui!'
      : 'Konfigurasi Supabase diperbarui.',
  });
});

// Download .env file
app.get('/api/config/download-env', (req, res) => {
  let cfg = readJsonFile(SUPABASE_CONFIG_PATH, { url: '', anonKey: '', bucket: 'school-media' });
  if (!cfg.url) {
    cfg = readJsonFile(PUBLIC_SUPABASE_CONFIG_PATH, { url: '', anonKey: '', bucket: 'school-media' });
  }
  const url = cfg.url || process.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
  const anonKey = cfg.anonKey || process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';
  const bucket = cfg.bucket || 'school-media';

  const envContent = `# ==============================================================================
# SMP PANCASILA PONOKAWAN - ENVIRONMENT CONFIGURATION (.env)
# ==============================================================================
VITE_SUPABASE_URL="${url}"
VITE_SUPABASE_ANON_KEY="${anonKey}"
VITE_SUPABASE_STORAGE_BUCKET="${bucket}"
APP_URL="http://localhost:3000"
GEMINI_API_KEY="${process.env.GEMINI_API_KEY || 'MY_GEMINI_API_KEY'}"
`;

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename=".env"');
  res.send(envContent);
});

// Download supabase-config.json file
app.get('/api/config/download-json', (req, res) => {
  let cfg = readJsonFile(PUBLIC_SUPABASE_CONFIG_PATH, null);
  if (!cfg || !cfg.url) {
    cfg = readJsonFile(SUPABASE_CONFIG_PATH, {
      url: process.env.VITE_SUPABASE_URL || '',
      anonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
      bucket: 'school-media',
      updated_at: new Date().toISOString(),
      comment: 'File konfigurasi database & API key Supabase untuk SMP Pancasila Ponokawan.',
    });
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="supabase-config.json"');
  res.send(JSON.stringify(cfg, null, 2));
});

app.delete('/api/config', (req, res) => {
  if (fs.existsSync(SUPABASE_CONFIG_PATH)) {
    fs.unlinkSync(SUPABASE_CONFIG_PATH);
  }
  if (fs.existsSync(PUBLIC_SUPABASE_CONFIG_PATH)) {
    fs.unlinkSync(PUBLIC_SUPABASE_CONFIG_PATH);
  }
  res.json({ success: true, message: 'Konfigurasi Supabase di server berhasil dihapus.' });
});

// -----------------------------------------------------------------------------
// API Endpoints: Centralized Data Store (Multi-Device Sync)
// -----------------------------------------------------------------------------
app.get('/api/data', (req, res) => {
  const store = readJsonFile<Record<string, any>>(STORE_PATH, {});
  res.json(store);
});

// Bulk upsert/merge all tables
app.post('/api/data', (req, res) => {
  const incoming = req.body || {};
  const current = readJsonFile<Record<string, any>>(STORE_PATH, {});

  const updated = {
    ...current,
    ...incoming,
    updated_at: new Date().toISOString(),
  };

  writeJsonFile(STORE_PATH, updated);
  res.json({
    success: true,
    message: 'Seluruh data berhasil disinkronkan ke server pusat.',
    updated_at: updated.updated_at,
  });
});

// Table-specific upsert
app.post('/api/data/:table', (req, res) => {
  const { table } = req.params;
  const payload = req.body;
  const store = readJsonFile<Record<string, any>>(STORE_PATH, {});

  if (!table) {
    return res.status(400).json({ error: 'Nama tabel diperlukan' });
  }

  // Handle settings / school_settings
  if (table === 'settings' || table === 'school_settings') {
    store.settings = { ...(store.settings || {}), ...payload, updated_at: new Date().toISOString() };
    store.school_settings = store.settings;
  } else if (Array.isArray(payload)) {
    // Array replacement
    store[table] = payload;
  } else if (payload && typeof payload === 'object' && payload.id) {
    // Single item upsert into array
    const list = Array.isArray(store[table]) ? [...store[table]] : [];
    const idx = list.findIndex((item: any) => item.id === payload.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...payload, updated_at: new Date().toISOString() };
    } else {
      list.unshift({ ...payload, created_at: payload.created_at || new Date().toISOString() });
    }
    store[table] = list;
  } else {
    store[table] = payload;
  }

  store.updated_at = new Date().toISOString();
  writeJsonFile(STORE_PATH, store);

  res.json({
    success: true,
    table,
    message: `Tabel ${table} berhasil diperbarui di server pusat.`,
    updated_at: store.updated_at,
  });
});

// Delete item from table
app.delete('/api/data/:table/:id', (req, res) => {
  const { table, id } = req.params;
  const store = readJsonFile<Record<string, any>>(STORE_PATH, {});

  if (Array.isArray(store[table])) {
    store[table] = store[table].filter((item: any) => item.id !== id);
    store.updated_at = new Date().toISOString();
    writeJsonFile(STORE_PATH, store);
  }

  res.json({
    success: true,
    table,
    id,
    message: `Data dengan ID ${id} berhasil dihapus dari tabel ${table} di server.`,
  });
});

// Reset data store
app.post('/api/data/reset', (req, res) => {
  if (fs.existsSync(STORE_PATH)) {
    fs.unlinkSync(STORE_PATH);
  }
  res.json({ success: true, message: 'Data store berhasil direset.' });
});

// -----------------------------------------------------------------------------
// Vite Dev Middleware / Static Production Server
// -----------------------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SMP Pancasila Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error] Failed to start:', err);
  process.exit(1);
});
