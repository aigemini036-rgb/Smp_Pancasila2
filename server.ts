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
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');
const SUPABASE_CONFIG_PATH = path.join(DATA_DIR, 'supabase-config.json');
const PUBLIC_SUPABASE_CONFIG_PATH = path.resolve(__dirname, 'public', 'supabase-config.json');

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
    supabaseConfigured: fs.existsSync(SUPABASE_CONFIG_PATH),
  });
});

// -----------------------------------------------------------------------------
// API Endpoints: Supabase Configuration
// -----------------------------------------------------------------------------
app.get('/api/config', (req, res) => {
  const cfg = readJsonFile(SUPABASE_CONFIG_PATH, { url: '', anonKey: '' });
  const isConfigured = Boolean(cfg.url && cfg.anonKey && !cfg.url.includes('your-project-id'));
  res.json({
    supabase: {
      url: cfg.url || '',
      anonKey: cfg.anonKey || '',
      isConfigured,
    },
  });
});

app.post('/api/config', (req, res) => {
  const { url, anonKey } = req.body || {};
  const config = {
    url: typeof url === 'string' ? url.trim() : '',
    anonKey: typeof anonKey === 'string' ? anonKey.trim() : '',
    updated_at: new Date().toISOString(),
  };

  writeJsonFile(SUPABASE_CONFIG_PATH, config);
  writeJsonFile(PUBLIC_SUPABASE_CONFIG_PATH, config);

  const isConfigured = Boolean(config.url && config.anonKey);
  res.json({
    success: true,
    supabase: {
      url: config.url,
      anonKey: config.anonKey,
      isConfigured,
    },
    message: isConfigured
      ? 'Konfigurasi Supabase berhasil disimpan di server dan disinkronkan ke seluruh perangkat.'
      : 'Konfigurasi Supabase diperbarui.',
  });
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
