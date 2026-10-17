import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  ExternalLink,
  Key,
  Globe,
  FileCode,
  ShieldCheck,
  Layers,
  ArrowRight,
  Info,
  Server,
  Zap,
  FolderArchive,
  Image as ImageIcon,
  Cloud,
  Play,
  CheckCheck,
  FileText,
  FileJson,
  Download,
  Upload,
  Eye,
  EyeOff,
  Shield,
  HardDrive,
  Radio,
  Timer,
  Activity,
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  isSupabaseConfigured,
} from '../../lib/supabase';
import {
  syncAllLocalToSupabase,
  syncAllSupabaseToLocal,
  SyncResult,
} from '../../services/supabaseService';
import {
  getActiveBucketName,
  setActiveBucketName,
  checkBucketStatus,
  createStorageBucket,
  testBucketUpload,
  getStorageBucketSql,
  DEFAULT_BUCKET_NAME,
} from '../../services/supabaseStorage';
import {
  getSchoolSettings,
  getPeople,
  getNewsList,
  getAnnouncements,
  getAchievements,
  getGalleries,
} from '../../utils/storage';
import {
  isAutoSyncEnabled,
  setAutoSyncEnabled,
  getAutoSyncInterval,
  setAutoSyncInterval,
  isAutoSyncRunning,
  getLastSyncTime,
  initCloudSync,
  pushAllLocalDataToServer,
} from '../../services/cloudSync';

export default function SupabaseIntegration() {
  const [config, setConfig] = useState(getSupabaseConfig());
  const [urlInput, setUrlInput] = useState(config.url || '');
  const [keyInput, setKeyInput] = useState(config.anonKey || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  const [syncingUp, setSyncingUp] = useState(false);
  const [syncingDown, setSyncingDown] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql' | 'bucket' | 'sync' | 'guide'>('config');

  // Storage Bucket State
  const [bucketName, setBucketNameState] = useState(getActiveBucketName());
  const [checkingBucket, setCheckingBucket] = useState(false);
  const [bucketStatus, setBucketStatus] = useState<{
    exists: boolean;
    isPublic?: boolean;
    message: string;
    error?: string;
  } | null>(null);

  const [creatingBucket, setCreatingBucket] = useState(false);
  const [createBucketResult, setCreateBucketResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [testingUpload, setTestingUpload] = useState(false);
  const [testUploadResult, setTestUploadResult] = useState<{
    success: boolean;
    publicUrl?: string;
    message: string;
    latencyMs?: number;
  } | null>(null);

  const [copiedBucketSql, setCopiedBucketSql] = useState(false);

  // File Management & Key visibility states
  const [showKey, setShowKey] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [fileStatuses, setFileStatuses] = useState<{
    envExists: boolean;
    publicConfigExists: boolean;
    dataConfigExists: boolean;
  } | null>(null);

  // Auto-Sync States
  const [autoSync, setAutoSync] = useState<boolean>(isAutoSyncEnabled());
  const [autoSyncRunning, setAutoSyncRunning] = useState<boolean>(isAutoSyncRunning());
  const [syncInterval, setSyncInterval] = useState<number>(getAutoSyncInterval());
  const [lastSyncDisplay, setLastSyncDisplay] = useState<string | null>(getLastSyncTime());
  const [isInstantSyncing, setIsInstantSyncing] = useState(false);
  const [autoSyncSuccessMsg, setAutoSyncSuccessMsg] = useState<string | null>(null);
  const [configSavedRecently, setConfigSavedRecently] = useState(false);

  // Stats for local data
  const localStats = {
    teachers: getPeople().length,
    news: getNewsList().length,
    announcements: getAnnouncements().length,
    achievements: getAchievements().length,
    galleries: getGalleries().length,
  };

  useEffect(() => {
    // Check status of configuration files on server
    fetch('/api/config')
      .then((r) => r.json())
      .then((data) => {
        if (data?.files) {
          setFileStatuses(data.files);
        }
        if (data?.supabase?.url && !urlInput && !data.supabase.url.includes('your-project-id')) {
          setUrlInput(data.supabase.url);
        }
        if (data?.supabase?.anonKey && !keyInput && !data.supabase.anonKey.includes('your-anon-key')) {
          setKeyInput(data.supabase.anonKey);
        }
      })
      .catch(() => {});

    // Listen to background sync events
    const handleSyncComplete = (e: any) => {
      setLastSyncDisplay(e?.detail?.displayTime || new Date().toLocaleTimeString('id-ID'));
    };
    const handleAutoSyncStatus = (e: any) => {
      if (e?.detail) {
        setAutoSync(e.detail.enabled);
        setAutoSyncRunning(e.detail.running);
        setSyncInterval(e.detail.interval);
        if (e.detail.lastSync) setLastSyncDisplay(e.detail.lastSync);
      }
    };

    window.addEventListener('smp-data-sync-complete', handleSyncComplete);
    window.addEventListener('smp-auto-sync-status-changed', handleAutoSyncStatus);

    // Run an initial connection test if configured
    if (config.isConfigured) {
      handleTestConnection();
      handleCheckBucket();
    }

    return () => {
      window.removeEventListener('smp-data-sync-complete', handleSyncComplete);
      window.removeEventListener('smp-auto-sync-status-changed', handleAutoSyncStatus);
    };
  }, []);

  const handleToggleAutoSync = (enabled: boolean) => {
    setAutoSyncEnabled(enabled);
    setAutoSync(enabled);
    setAutoSyncRunning(enabled);
    setAutoSyncSuccessMsg(
      enabled
        ? 'Sinkronisasi otomatis berhasil diaktifkan! Data tersinkron secara real-time saat ada perubahan & setiap interval waktu.'
        : 'Sinkronisasi otomatis dijeda. Anda tetap dapat melakukan sinkronisasi manual kapan saja.'
    );
    setTimeout(() => setAutoSyncSuccessMsg(null), 4500);
  };

  const handleChangeSyncInterval = (sec: number) => {
    setAutoSyncInterval(sec);
    setSyncInterval(sec);
    setAutoSyncSuccessMsg(`Interval sinkronisasi latar belakang diatur ke setiap ${sec} detik.`);
    setTimeout(() => setAutoSyncSuccessMsg(null), 3000);
  };

  const handleInstantAutoSync = async () => {
    setIsInstantSyncing(true);
    try {
      const res = await pushAllLocalDataToServer();
      setLastSyncDisplay(new Date().toLocaleTimeString('id-ID'));
      setAutoSyncSuccessMsg(res.message);
    } catch (e: any) {
      setAutoSyncSuccessMsg(`Gagal sinkron: ${e.message}`);
    } finally {
      setIsInstantSyncing(false);
      setTimeout(() => setAutoSyncSuccessMsg(null), 4500);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Gagal menghubungi server Supabase',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleCheckBucket = async () => {
    setCheckingBucket(true);
    try {
      const res = await checkBucketStatus(bucketName);
      setBucketStatus(res);
    } catch (err: any) {
      setBucketStatus({
        exists: false,
        message: err.message || 'Gagal memeriksa status bucket',
      });
    } finally {
      setCheckingBucket(false);
    }
  };

  const handleCreateBucketAction = async () => {
    setCreatingBucket(true);
    setCreateBucketResult(null);
    try {
      const res = await createStorageBucket(bucketName);
      setCreateBucketResult(res);
      if (res.success) {
        await handleCheckBucket();
      }
    } catch (err: any) {
      setCreateBucketResult({
        success: false,
        message: err.message || 'Gagal membuat bucket',
      });
    } finally {
      setCreatingBucket(false);
    }
  };

  const handleTestUploadAction = async () => {
    setTestingUpload(true);
    setTestUploadResult(null);
    try {
      const res = await testBucketUpload(bucketName);
      setTestUploadResult(res);
      if (res.success) {
        setBucketStatus({
          exists: true,
          isPublic: true,
          message: `Bucket "${bucketName}" aktif dan sukses diverifikasi untuk upload file!`,
        });
      }
    } catch (err: any) {
      setTestUploadResult({
        success: false,
        message: err.message || 'Gagal menguji upload ke bucket',
      });
    } finally {
      setTestingUpload(false);
    }
  };

  const handleCopyBucketSql = () => {
    const sql = getStorageBucketSql(bucketName);
    navigator.clipboard.writeText(sql);
    setCopiedBucketSql(true);
    setTimeout(() => setCopiedBucketSql(false), 2500);
  };

  // Download .env file
  const handleDownloadEnv = () => {
    const content = `# ==============================================================================
# SMP PANCASILA PONOKAWAN - ENVIRONMENT CONFIGURATION (.env)
# File ini digunakan oleh Vite & Node server untuk database Supabase
# ==============================================================================
VITE_SUPABASE_URL="${urlInput || 'https://your-project-id.supabase.co'}"
VITE_SUPABASE_ANON_KEY="${keyInput || 'your-anon-key-here'}"
VITE_SUPABASE_STORAGE_BUCKET="${bucketName || 'school-media'}"
APP_URL="http://localhost:3000"
GEMINI_API_KEY="MY_GEMINI_API_KEY"
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download supabase-config.json file
  const handleDownloadJson = () => {
    const configObj = {
      url: urlInput || '',
      anonKey: keyInput || '',
      bucket: bucketName || 'school-media',
      updated_at: new Date().toISOString(),
      comment: 'File konfigurasi database & API key Supabase untuk SMP Pancasila Ponokawan.',
    };
    const blob = new Blob([JSON.stringify(configObj, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'supabase-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy .env content to clipboard
  const handleCopyEnv = () => {
    const content = `VITE_SUPABASE_URL="${urlInput || 'https://your-project-id.supabase.co'}"
VITE_SUPABASE_ANON_KEY="${keyInput || 'your-anon-key-here'}"
VITE_SUPABASE_STORAGE_BUCKET="${bucketName || 'school-media'}"`;
    navigator.clipboard.writeText(content);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  // Copy JSON content to clipboard
  const handleCopyJson = () => {
    const configObj = {
      url: urlInput || '',
      anonKey: keyInput || '',
      bucket: bucketName || 'school-media',
    };
    navigator.clipboard.writeText(JSON.stringify(configObj, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  // Import from uploaded file (.env or .json)
  const handleImportConfigFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = (event.target?.result as string) || '';
        let detectedUrl = '';
        let detectedKey = '';
        let detectedBucket = '';

        if (file.name.endsWith('.json') || text.trim().startsWith('{')) {
          const parsed = JSON.parse(text);
          detectedUrl = parsed.url || parsed.VITE_SUPABASE_URL || '';
          detectedKey = parsed.anonKey || parsed.VITE_SUPABASE_ANON_KEY || '';
          detectedBucket = parsed.bucket || parsed.VITE_SUPABASE_STORAGE_BUCKET || '';
        } else {
          // Parse .env style
          const urlMatch = text.match(/VITE_SUPABASE_URL\s*=\s*["']?([^"'\s\r\n]+)/);
          const keyMatch = text.match(/VITE_SUPABASE_ANON_KEY\s*=\s*["']?([^"'\s\r\n]+)/);
          const bucketMatch = text.match(/VITE_SUPABASE_STORAGE_BUCKET\s*=\s*["']?([^"'\s\r\n]+)/);
          if (urlMatch) detectedUrl = urlMatch[1];
          if (keyMatch) detectedKey = keyMatch[1];
          if (bucketMatch) detectedBucket = bucketMatch[1];
        }

        if (detectedUrl && detectedKey) {
          setUrlInput(detectedUrl);
          setKeyInput(detectedKey);
          if (detectedBucket) setBucketNameState(detectedBucket);
          saveSupabaseConfig(detectedUrl, detectedKey, detectedBucket || bucketName);
          setConfig(getSupabaseConfig());
          setImportStatus({
            success: true,
            message: `File "${file.name}" berhasil diimpor! URL dan API Key telah disimpan ke database & seluruh perangkat.`,
          });
          handleTestConnection();
        } else {
          setImportStatus({
            success: false,
            message: `File "${file.name}" tidak memiliki data VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY yang lengkap.`,
          });
        }
      } catch (err: any) {
        setImportStatus({
          success: false,
          message: `Gagal membaca file: ${err.message || 'Format tidak valid'}`,
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !keyInput.trim()) {
      alert('Harap isi Project URL dan Anon Key dengan lengkap.');
      return;
    }

    saveSupabaseConfig(urlInput.trim(), keyInput.trim(), bucketName.trim());
    const newCfg = getSupabaseConfig();
    setConfig(newCfg);
    setTestResult(null);
    setConfigSavedRecently(true);
    setTimeout(() => setConfigSavedRecently(false), 4500);
    setImportStatus({
      success: true,
      message: 'Konfigurasi berhasil disimpan ke file .env, file public/supabase-config.json, dan server lokal!',
    });
    await handleTestConnection();
    await handleCheckBucket();
  };

  const handleClearConfig = () => {
    if (confirm('Apakah Anda yakin ingin menghapus konfigurasi Supabase? Website akan kembali menggunakan penyimpanan browser lokal (localStorage).')) {
      clearSupabaseConfig();
      setConfig(getSupabaseConfig());
      setUrlInput('');
      setKeyInput('');
      setTestResult(null);
      setSyncResult(null);
      setBucketStatus(null);
    }
  };

  const handleSyncToSupabase = async () => {
    if (!confirm('Apakah Anda ingin mengunggah seluruh data website saat ini (Profil sekolah, Guru, Berita, Pengumuman, Galeri) ke Supabase?')) {
      return;
    }
    setSyncingUp(true);
    setSyncResult(null);
    try {
      const res = await syncAllLocalToSupabase();
      setSyncResult(res);
      if (res.success) {
        handleTestConnection();
      }
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err.message || 'Gagal sinkronisasi data ke Supabase',
        counts: { settings: 0, people: 0, news: 0, announcements: 0, achievements: 0, galleries: 0, galleryImages: 0, facilities: 0, users: 0 },
      });
    } finally {
      setSyncingUp(false);
    }
  };

  const handleSyncFromSupabase = async () => {
    if (!confirm('Tarik data terbaru dari Supabase ke cache browser lokal? Data lokal yang belum disimpan ke Supabase mungkin akan tertimpa.')) {
      return;
    }
    setSyncingDown(true);
    setSyncResult(null);
    try {
      const res = await syncAllSupabaseToLocal();
      setSyncResult(res);
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err.message || 'Gagal menarik data dari Supabase',
        counts: { settings: 0, people: 0, news: 0, announcements: 0, achievements: 0, galleries: 0, galleryImages: 0, facilities: 0, users: 0 },
      });
    } finally {
      setSyncingDown(false);
    }
  };

  const handleCopySql = () => {
    fetch('/supabase-schema.sql')
      .then((res) => {
        if (!res.ok) throw new Error('File not found');
        return res.text();
      })
      .catch(() => defaultSqlSnippet)
      .then((text) => {
        navigator.clipboard.writeText(text || defaultSqlSnippet);
        setCopiedSql(true);
        setTimeout(() => setCopiedSql(false), 2500);
      });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Database & Storage Cloud Ready
            </span>
            <span className="text-xs text-slate-400 font-mono">PostgreSQL & Media Bucket</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Database className="w-7 h-7 text-emerald-500" />
            <span>Integrasi Database & Storage Supabase</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hubungkan website SMP Pancasila Ponokawan ke database cloud PostgreSQL dan Storage Bucket Supabase untuk sinkronisasi data online & upload gambar antar device.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2">
          {config.isConfigured ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase Terhubung</span>
              {testResult?.latencyMs && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20">
                  {testResult.latencyMs}ms
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Mode Penyimpanan Lokal (Siap Dikoneksikan)</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'config'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>1. Kredensial & Koneksi</span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'sql'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>2. Skrip Skema SQL</span>
        </button>

        <button
          onClick={() => setActiveTab('bucket')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'bucket'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FolderArchive className="w-4 h-4" />
          <span>3. Storage Bucket (Media/Foto)</span>
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'sync'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>4. Sinkronisasi Data</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'guide'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>5. Panduan Cepat</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: KREDENSIAL & KONEKSI */}
      {/* ==================================================================== */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Status Box */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3.5 text-xs ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-sm">
                  {testResult.success ? 'Koneksi Berhasil' : 'Koneksi Bermasalah'}
                </p>
                <p>{testResult.message}</p>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-500" />
                  <span>Pengaturan Kredensial Supabase</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Masukkan URL dan Anon Public Key proyek Supabase Anda. Konfigurasi otomatis disimpan dan disinkronkan ke seluruh device!
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Supabase Project URL (VITE_SUPABASE_URL) *</span>
                </label>
                <input
                  type="url"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://xyzabcdefghijklmnop.supabase.co"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Didapat dari: Dashboard Supabase &gt; Project Settings &gt; API &gt; Project URL.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Supabase Project Anon Key (VITE_SUPABASE_ANON_KEY) *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showKey ? 'Sembunyikan' : 'Tampilkan API Key'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    required
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Didapat dari: Dashboard Supabase &gt; Project Settings &gt; API &gt; Project API Keys &gt; anon public.
                </p>
              </div>

              {/* Import status notification banner */}
              {importStatus && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                    importStatus.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {importStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-700/80">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="submit"
                    className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 ${
                      configSavedRecently
                        ? 'bg-emerald-600 shadow-emerald-600/30 ring-2 ring-emerald-400'
                        : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{configSavedRecently ? 'Konfigurasi Tersimpan!' : 'Simpan & Sinkronkan ke Seluruh Device'}</span>
                  </button>

                  {/* Inline notification right next to button */}
                  {configSavedRecently && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold animate-in fade-in slide-in-from-left-2 shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Data Kredensial Berhasil Disimpan!</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testing || !urlInput}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>{testing ? 'Menguji...' : 'Tes Koneksi'}</span>
                  </button>
                </div>

                {config.isConfigured && (
                  <button
                    type="button"
                    onClick={handleClearConfig}
                    className="px-3.5 py-2 text-rose-600 hover:text-rose-700 dark:text-rose-400 text-xs font-semibold hover:underline"
                  >
                    Hapus Konfigurasi
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ================================================================ */}
          {/* CARD KHUSUS: FILE DATABASE & API KEY (MULTI-DEVICE & HOSTING) */}
          {/* ================================================================ */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    File Konfigurasi Database & API Key
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    Multi-Device Sync
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Agar seluruh HP, laptop, dan pengunjung lain otomatis terhubung ke database yang sama tanpa harus input ulang, sistem menyediakan 2 file standar: <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">.env</code> dan <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">public/supabase-config.json</code>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadEnv}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  title="Unduh file .env dengan kredensial aktif"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download .env</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                  title="Unduh file supabase-config.json"
                >
                  <Download className="w-3.5 h-3.5 text-blue-500" />
                  <span>Download JSON</span>
                </button>

                <label className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Impor File (.env / .json)</span>
                  <input
                    type="file"
                    accept=".env,.json,.txt"
                    onChange={handleImportConfigFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Status 3 File Konfigurasi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                  .env
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                      File .env
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Root project. Dibaca oleh server Vite & Express saat build/start.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                  {}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                      public/supabase-config.json
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Otomatis diakses browser klien (HP, laptop pengunjung).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                      data/supabase-config.json
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Penyimpanan sinkronisasi internal backend server.
                  </p>
                </div>
              </div>
            </div>

            {/* Code Box: Preview of .env & JSON */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-emerald-500" />
                  <span>Isi File .env (Siap Digunakan):</span>
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyEnv}
                    className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 transition-colors"
                  >
                    {copiedEnv ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin .env</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors"
                  >
                    {copiedJson ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin JSON</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-4 text-slate-300 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                <pre className="leading-relaxed">
{`# SMP PANCASILA PONOKAWAN (.env)
VITE_SUPABASE_URL="${urlInput || 'https://your-project-id.supabase.co'}"
VITE_SUPABASE_ANON_KEY="${keyInput ? (showKey ? keyInput : keyInput.slice(0, 15) + '••••••••••••••••' + keyInput.slice(-8)) : 'your-anon-key-here'}"
VITE_SUPABASE_STORAGE_BUCKET="${bucketName || 'school-media'}"
APP_URL="http://localhost:3000"`}
                </pre>
              </div>
            </div>

            {/* Quick Guide to find Supabase Keys */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <Key className="w-4 h-4 text-amber-600" />
                <span>Di mana mengambil API Key & URL dari Supabase?</span>
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                <li>Buka dashboard proyek Anda di <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline font-bold">https://supabase.com/dashboard</a>.</li>
                <li>Klik ikon <strong>Project Settings</strong> (ikon roda gigi di bilah kiri bawah).</li>
                <li>Pilih menu <strong>API</strong>.</li>
                <li>Salin <strong>Project URL</strong> (contoh: <code className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded text-emerald-600">https://xyzabc.supabase.co</code>) ke kolom URL.</li>
                <li>Salin <strong>Project API Keys &gt; anon public</strong> (kode panjang yang diawali <code className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded text-emerald-600">eyJhbGciOi...</code>) ke kolom Anon Key.</li>
                <li>Klik <strong>Simpan & Hubungkan</strong>. File <code className="font-mono font-bold">.env</code> dan konfigurasi langsung diperbarui otomatis di sistem.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: SKRIP SKEMA SQL */}
      {/* ==================================================================== */}
      {activeTab === 'sql' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-emerald-500" />
                  <span>Skrip Skema SQL Supabase (supabase-schema.sql)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Skrip ini otomatis membuat seluruh tabel (<code className="font-mono text-emerald-600 dark:text-emerald-400">school_settings, people, news, announcements, achievements, galleries, facilities, admin_users</code>), Storage Bucket (<code className="font-mono text-emerald-600 dark:text-emerald-400">school-media</code>), mengaktifkan keamanan RLS, dan mengisi data bawaan sekolah.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'Tersalin!' : 'Salin Skrip SQL'}</span>
                </button>

                <a
                  href="/supabase-schema.sql"
                  download="supabase-schema.sql"
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>Unduh .sql</span>
                </a>
              </div>
            </div>

            {/* Instruction Tip */}
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Cara Menggunakan:</strong> Buka dashboard Supabase proyek Anda &gt; klik menu <strong>SQL Editor</strong> di sidebar kiri &gt; klik <strong>New Query</strong> &gt; tempel (paste) kode di bawah &gt; klik tombol hijau <strong>Run</strong>. Tabel & Bucket langsung siap dipakai!
              </div>
            </div>

            {/* Code Box */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-slate-300 max-h-96 overflow-y-auto hide-scrollbar">
              <pre className="whitespace-pre">{defaultSqlSnippet}</pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: STORAGE BUCKET (school-media) */}
      {/* ==================================================================== */}
      {activeTab === 'bucket' && (
        <div className="space-y-6">
          {/* Bucket Status Banner */}
          {bucketStatus && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3.5 text-xs ${
                bucketStatus.exists
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              }`}
            >
              {bucketStatus.exists ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-sm">
                  {bucketStatus.exists ? 'Bucket Terdeteksi Aktif' : 'Status Bucket Storage'}
                </p>
                <p>{bucketStatus.message}</p>
                {bucketStatus.exists && (
                  <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
                    Bucket ID: <span className="font-bold underline">{bucketName}</span> | Mode: Public CDN
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Test Upload Result */}
          {testUploadResult && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-start gap-3.5 ${
                testUploadResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}
            >
              {testUploadResult.success ? (
                <CheckCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5 flex-1">
                <p className="font-bold text-sm">
                  {testUploadResult.success ? 'Uji Upload Sukses' : 'Uji Upload Gagal'}
                </p>
                <p>{testUploadResult.message}</p>
                {testUploadResult.publicUrl && (
                  <div className="pt-1">
                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Public CDN URL:</p>
                    <a
                      href={testUploadResult.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 break-all hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      {testUploadResult.publicUrl}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bucket Creation Result */}
          {createBucketResult && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-start gap-3.5 ${
                createBucketResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              }`}
            >
              {createBucketResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-sm">
                  {createBucketResult.success ? 'Hasil Pembuatan Bucket' : 'Info Pembuatan Bucket'}
                </p>
                <p>{createBucketResult.message}</p>
              </div>
            </div>
          )}

          {/* Main Bucket Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                    Storage Cloud CDN
                  </span>
                  <span className="text-xs font-mono text-slate-400">Public Bucket</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderArchive className="w-6 h-6 text-emerald-500" />
                  <span>Bucket Penyimpanan: {bucketName}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                  Bucket ini digunakan untuk menampung seluruh foto profil guru, cover berita, pengumuman, foto galeri, fasilitas, dan logo sekolah yang diupload melalui Admin.
                </p>
              </div>

              {/* Bucket Quick Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCheckBucket}
                  disabled={checkingBucket || !config.isConfigured}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checkingBucket ? 'animate-spin' : ''}`} />
                  <span>{checkingBucket ? 'Memeriksa...' : 'Cek Status Bucket'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCreateBucketAction}
                  disabled={creatingBucket || !config.isConfigured}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
                >
                  <Cloud className={`w-3.5 h-3.5 ${creatingBucket ? 'animate-pulse' : ''}`} />
                  <span>{creatingBucket ? 'Membuat...' : 'Buat Bucket Otomatis'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestUploadAction}
                  disabled={testingUpload || !config.isConfigured}
                  className="px-3.5 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
                >
                  <Play className={`w-3.5 h-3.5 ${testingUpload ? 'animate-spin' : ''}`} />
                  <span>{testingUpload ? 'Menguji...' : 'Uji Upload (Ping)'}</span>
                </button>
              </div>
            </div>

            {/* Specifications Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Nama Bucket</span>
                <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {bucketName}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">ID unik di storage Supabase</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Akses Visibilitas</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Public Bucket (Wajib)
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Agar pengunjung web bisa memuat gambar</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Batas Ukuran & Format</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Maks. 50 MB / File
                </p>
                <p className="text-[11px] text-slate-500 mt-1">JPG, PNG, WEBP, GIF, SVG, PDF</p>
              </div>
            </div>

            {/* Options to Create: 3 Options */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pilih Salah Satu Cara untuk Mengaktifkan Bucket di Supabase:
              </h3>

              {/* Method 1: Otomatis via Tombol */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                    Cara 1: Otomatis (Direkomendasikan)
                  </span>
                  <button
                    type="button"
                    onClick={handleCreateBucketAction}
                    disabled={creatingBucket || !config.isConfigured}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Klik di Sini untuk Buat Otomatis</span>
                  </button>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Cukup klik tombol <strong>"Buat Bucket Otomatis"</strong> di atas. Sistem kami akan membuat bucket <code className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">{bucketName}</code> dengan status Public secara langsung via Supabase API.
                </p>
              </div>

              {/* Method 2: Manual via Supabase Dashboard UI */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold">
                  Cara 2: Lewat Supabase Dashboard Menu Storage
                </span>
                <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal pl-4">
                  <li>Buka dashboard Supabase proyek Anda (<a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 font-bold underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a>).</li>
                  <li>Di menu sebelah kiri, klik menu <strong>Storage</strong>.</li>
                  <li>Klik tombol hijau <strong>New bucket</strong>.</li>
                  <li>Ketik nama bucket: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{bucketName}</strong>.</li>
                  <li>Pastikan opsi <strong>Public bucket</strong> diaktifkan (Toggle ON warna hijau).</li>
                  <li>Klik <strong>Save bucket</strong>. Selesai!</li>
                </ol>
              </div>

              {/* Method 3: Via SQL Editor */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold">
                      Cara 3: Lewat Supabase SQL Editor (Termasuk Kebijakan RLS)
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Salin kode SQL di bawah ini dan jalankan di menu <strong>SQL Editor</strong> Supabase untuk membuat bucket sekaligus mengonfigurasi hak akses (RLS Policy).
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyBucketSql}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      {copiedBucketSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBucketSql ? 'Tersalin!' : 'Salin Skrip Bucket'}</span>
                    </button>

                    <a
                      href="/supabase-bucket.sql"
                      download="supabase-bucket.sql"
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>Unduh .sql</span>
                    </a>
                  </div>
                </div>

                <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-slate-300 max-h-64 overflow-y-auto hide-scrollbar">
                  <pre className="whitespace-pre">{getStorageBucketSql(bucketName)}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: SINKRONISASI DATA */}
      {/* ==================================================================== */}
      {activeTab === 'sync' && (
        <div className="space-y-6">
          {/* Auto-Sync Feedback Banner */}
          {autoSyncSuccessMsg && (
            <div className="p-4 rounded-2xl border text-xs flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 shadow-sm transition-all animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="font-medium flex-1">{autoSyncSuccessMsg}</p>
            </div>
          )}

          {/* Sync Result Notice */}
          {syncResult && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-start gap-3.5 ${
                syncResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              }`}
            >
              {syncResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5 flex-1">
                <p className="font-bold text-sm">
                  {syncResult.success ? 'Sinkronisasi Selesai' : 'Catatan Sinkronisasi'}
                </p>
                <p>{syncResult.message}</p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Personel: {syncResult.counts.people}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Berita: {syncResult.counts.news}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Pengumuman: {syncResult.counts.announcements}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Prestasi: {syncResult.counts.achievements}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Galeri: {syncResult.counts.galleries}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* UTAMA: KONTROL SINKRONISASI OTOMATIS (REAL-TIME AUTO-SYNC)       */}
          {/* ================================================================ */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-md shadow-emerald-500/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Sinkronisasi Otomatis (Real-time Auto-Sync)
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide ${
                        autoSync
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {autoSync ? 'AKTIF (ON)' : 'NONAKTIF (OFF)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Setiap perubahan data yang Anda simpan akan <strong>otomatis terkirim ke server & database</strong>, dan seluruh perangkat lain (HP, laptop, tablet) akan otomatis diperbarui.
                  </p>
                </div>
              </div>

              {/* Master Toggle Switch */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {autoSync ? 'Auto-Sync Aktif' : 'Auto-Sync Dijeda'}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleAutoSync(!autoSync)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    autoSync ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={autoSync}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      autoSync ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 3 Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Status Engine */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    {autoSync && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        autoSync ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    ></span>
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Status Latar Belakang
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {autoSync
                    ? 'Engine aktif memantau perubahan & tab baru'
                    : 'Sinkronisasi latar belakang dijeda'}
                </p>
                <div className="pt-1 text-[11px] text-slate-400 font-mono">
                  Terakhir sync:{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {lastSyncDisplay || 'Baru saja'}
                  </span>
                </div>
              </div>

              {/* Card 2: Auto-Push saat Edit */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Push Otomatis Saat Edit
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Simpan berita, guru, galeri &rarr; langsung broadcast ke semua device tanpa perlu upload manual.
                </p>
                <div className="pt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Aktif Otomatis di Semua Form
                </div>
              </div>

              {/* Card 3: Interval Pengecekan */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <Timer className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Interval Polling
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[10, 15, 30, 60].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleChangeSyncInterval(sec)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all ${
                        syncInterval === sec
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {sec}d
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400">
                  {syncInterval === 15 ? '15 detik (Rekomendasi terbaik)' : `Setiap ${syncInterval} detik`}
                </p>
              </div>
            </div>

            {/* Manual Forced Sync Trigger */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ingin memastikan seluruh data lokal terkirim ke cloud sekarang juga?
              </p>
              <button
                type="button"
                onClick={handleInstantAutoSync}
                disabled={isInstantSyncing}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isInstantSyncing ? 'animate-spin' : ''}`} />
                <span>{isInstantSyncing ? 'Sedang Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload to Supabase */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Unggah Data Lokal ke Supabase (Upload)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Kirim semua data website yang saat ini ada di browser ini ke Supabase agar tersimpan permanen di cloud dan bisa dibuka oleh device lain.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1 font-mono text-slate-600 dark:text-slate-300">
                  <p>• Data Guru & Staf: <strong>{localStats.teachers}</strong> orang</p>
                  <p>• Berita & Agenda: <strong>{localStats.news}</strong> artikel</p>
                  <p>• Pengumuman: <strong>{localStats.announcements}</strong> item</p>
                  <p>• Prestasi: <strong>{localStats.achievements}</strong> catatan</p>
                  <p>• Galeri Kegiatan: <strong>{localStats.galleries}</strong> album</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncToSupabase}
                disabled={!config.isConfigured || syncingUp}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
              >
                <UploadCloud className={`w-4 h-4 ${syncingUp ? 'animate-bounce' : ''}`} />
                <span>{syncingUp ? 'Sedang Mengunggah...' : 'Unggah Semua Data ke Supabase'}</span>
              </button>
            </div>

            {/* Download from Supabase */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <DownloadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Tarik Data dari Supabase (Download)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Ambil data paling baru yang tersimpan di cloud Supabase dan simpan ke memori lokal browser ini.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300">
                  <p className="font-bold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>Catatan:</span>
                  </p>
                  <p className="mt-1">
                    Operasi ini akan memperbarui data lokal perangkat ini dengan data terbaru yang ada di database cloud Supabase.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncFromSupabase}
                disabled={!config.isConfigured || syncingDown}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
              >
                <DownloadCloud className={`w-4 h-4 ${syncingDown ? 'animate-bounce' : ''}`} />
                <span>{syncingDown ? 'Sedang Menarik Data...' : 'Tarik Data Terbaru dari Supabase'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: PANDUAN CEPAT */}
      {/* ==================================================================== */}
      {activeTab === 'guide' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Panduan Menghubungkan Supabase Database & Storage</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ikuti tahapan ringkas berikut untuk mengaktifkan database online dan storage bucket Supabase Anda:
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Buat Proyek di Supabase
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Buka website <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1 hover:underline">supabase.com <ExternalLink className="w-3 h-3" /></a>, masuk ke akun Anda, dan klik <strong>New Project</strong>. Beri nama (misal: <em>smp-pancasila-ponokawan</em>) dan pilih region terdekat (misal: Singapore).
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Jalankan Skrip Skema SQL (Tabel & Bucket)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Buka tab <strong>2. Skrip Skema SQL</strong> di menu atas, klik <strong>Salin Skrip SQL</strong>. Kemudian di dashboard Supabase, buka menu <strong>SQL Editor</strong> di sidebar kiri, klik <strong>New Query</strong>, tempel skrip tersebut, lalu klik <strong>Run</strong>. Semua tabel database dan storage bucket <code className="font-mono text-emerald-600">school-media</code> Anda otomatis terbuat.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Salin API Keys & Hubungkan
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Di dashboard Supabase, klik ikon roda gigi <strong>Project Settings &gt; API</strong>. Salin <strong>Project URL</strong> dan <strong>Project API Keys (anon public)</strong>. Tempel di tab <strong>1. Kredensial & Koneksi</strong> di halaman ini, lalu klik <strong>Simpan & Hubungkan</strong>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Verifikasi Storage Bucket
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Buka tab <strong>3. Storage Bucket (Media/Foto)</strong>, klik tombol <strong>"Cek Status Bucket"</strong> atau <strong>"Uji Upload (Ping)"</strong> untuk memastikan upload foto langsung tersimpan di cloud Supabase dan memiliki URL CDN publik.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('config')}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Mulai Masukkan Kredensial Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Fallback preview snippet for SQL Editor preview
const defaultSqlSnippet = `-- SKRIP SKEMA DATABASE SUPABASE UNTUK SMP PANCASILA PONOKAWAN
-- Jalankan di: Supabase Dashboard -> SQL Editor -> Run

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Pengaturan Sekolah
CREATE TABLE IF NOT EXISTS public.school_settings (
    id TEXT PRIMARY KEY DEFAULT 'set-001',
    school_name TEXT NOT NULL DEFAULT 'SMP Pancasila Ponokawan',
    logo TEXT DEFAULT '/logo-smp-pancasila.png',
    address TEXT,
    phone TEXT,
    email TEXT,
    description TEXT,
    vision TEXT,
    mission TEXT,
    history TEXT,
    operating_hours TEXT,
    npsn TEXT DEFAULT '20501234',
    accreditation TEXT DEFAULT 'Akreditasi A',
    total_students TEXT DEFAULT '450+',
    total_teachers TEXT DEFAULT '28+',
    total_achievements TEXT DEFAULT '50+',
    social_links JSONB DEFAULT '{}'::jsonb,
    whatsapp_number TEXT DEFAULT '6281234567890',
    whatsapp_chat_widget_enabled BOOLEAN DEFAULT true,
    maintenance_mode BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Personel (Kepala Sekolah, Guru, Staf TU)
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
    website TEXT, -- Tautan website pribadi guru
    status TEXT NOT NULL DEFAULT 'active',
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Berita / Artikel
CREATE TABLE IF NOT EXISTS public.news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    thumbnail TEXT,
    content TEXT NOT NULL,
    author_name TEXT DEFAULT 'Humas SMP Pancasila',
    category TEXT DEFAULT 'Berita Sekolah',
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Pengumuman
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    start_date TEXT NOT NULL,
    end_date TEXT,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Prestasi
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    recipient_name TEXT,
    year INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Galeri Foto & Sarana Fasilitas
CREATE TABLE IF NOT EXISTS public.galleries (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id TEXT PRIMARY KEY,
    gallery_id TEXT NOT NULL REFERENCES public.galleries(id) ON DELETE CASCADE,
    image TEXT NOT NULL,
    caption TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.facilities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    photo TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. STORAGE BUCKET: school-media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'school-media',
    'school-media',
    true,
    52428800,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Keamanan RLS Database & Storage
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read All" ON public.school_settings;
CREATE POLICY "Public Read All" ON public.school_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full Access Anon" ON public.school_settings;
CREATE POLICY "Full Access Anon" ON public.school_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read All" ON public.people;
CREATE POLICY "Public Read All" ON public.people FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full Access Anon" ON public.people;
CREATE POLICY "Full Access Anon" ON public.people FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read All" ON public.news;
CREATE POLICY "Public Read All" ON public.news FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full Access Anon" ON public.news;
CREATE POLICY "Full Access Anon" ON public.news FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read All" ON public.announcements;
CREATE POLICY "Public Read All" ON public.announcements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full Access Anon" ON public.announcements;
CREATE POLICY "Full Access Anon" ON public.announcements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read All" ON public.achievements;
CREATE POLICY "Public Read All" ON public.achievements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full Access Anon" ON public.achievements;
CREATE POLICY "Full Access Anon" ON public.achievements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read All" ON public.galleries;
CREATE POLICY "Public Read All" ON public.galleries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full Access Anon" ON public.galleries;
CREATE POLICY "Full Access Anon" ON public.galleries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read All" ON public.gallery_images;
CREATE POLICY "Public Read All" ON public.gallery_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full Access Anon" ON public.gallery_images;
CREATE POLICY "Full Access Anon" ON public.gallery_images FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read All" ON public.facilities;
CREATE POLICY "Public Read All" ON public.facilities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full Access Anon" ON public.facilities;
CREATE POLICY "Full Access Anon" ON public.facilities FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read School Media" ON storage.objects;
CREATE POLICY "Public Read School Media" ON storage.objects FOR SELECT USING (bucket_id = 'school-media');

DROP POLICY IF EXISTS "Public Upload School Media" ON storage.objects;
CREATE POLICY "Public Upload School Media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'school-media');

DROP POLICY IF EXISTS "Public Update School Media" ON storage.objects;
CREATE POLICY "Public Update School Media" ON storage.objects FOR UPDATE USING (bucket_id = 'school-media');

DROP POLICY IF EXISTS "Public Delete School Media" ON storage.objects;
CREATE POLICY "Public Delete School Media" ON storage.objects FOR DELETE USING (bucket_id = 'school-media');
`;
