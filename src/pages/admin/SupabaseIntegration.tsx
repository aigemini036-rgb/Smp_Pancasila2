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
  getSchoolSettings,
  getPeople,
  getNewsList,
  getAnnouncements,
  getAchievements,
  getGalleries,
} from '../../utils/storage';

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
  const [activeTab, setActiveTab] = useState<'config' | 'sql' | 'sync' | 'guide'>('config');

  // Stats for local data
  const localStats = {
    teachers: getPeople().length,
    news: getNewsList().length,
    announcements: getAnnouncements().length,
    achievements: getAchievements().length,
    galleries: getGalleries().length,
  };

  useEffect(() => {
    // Run an initial connection test if configured
    if (config.isConfigured) {
      handleTestConnection();
    }
  }, []);

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

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !keyInput.trim()) {
      alert('Harap isi Project URL dan Anon Key dengan lengkap.');
      return;
    }

    saveSupabaseConfig(urlInput.trim(), keyInput.trim());
    const newCfg = getSupabaseConfig();
    setConfig(newCfg);
    setTestResult(null);
    await handleTestConnection();
  };

  const handleClearConfig = () => {
    if (confirm('Apakah Anda yakin ingin menghapus konfigurasi Supabase? Website akan kembali menggunakan penyimpanan browser lokal (localStorage).')) {
      clearSupabaseConfig();
      setConfig(getSupabaseConfig());
      setUrlInput('');
      setKeyInput('');
      setTestResult(null);
      setSyncResult(null);
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
              Backend-as-a-Service Ready
            </span>
            <span className="text-xs text-slate-400 font-mono">PostgreSQL Database</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Database className="w-7 h-7 text-emerald-500" />
            <span>Integrasi Database Supabase</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hubungkan website SMP Pancasila Ponokawan ke database cloud PostgreSQL Supabase untuk persistensi data online multi-admin.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2">
          {config.isConfigured ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase Terkonfigurasi</span>
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
          onClick={() => setActiveTab('sync')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'sync'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Sinkronisasi Data</span>
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
          <span>Panduan Cepat (3 Menit)</span>
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
                  Masukkan Project URL dan Anon Key dari proyek Supabase Anda. Anda juga dapat mengaturnya melalui file <code className="text-emerald-600 dark:text-emerald-400 font-mono">.env</code>.
                </p>
              </div>

              {config.isConfigured && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono text-[10px] font-bold">
                  Sumber: {config.source === 'env' ? '.env file' : 'Browser Config'}
                </span>
              )}
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Supabase Project Anon Key (VITE_SUPABASE_ANON_KEY) *</span>
                </label>
                <input
                  type="password"
                  required
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Didapat dari: Dashboard Supabase &gt; Project Settings &gt; API &gt; Project API Keys &gt; anon public.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-700/80">
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan & Hubungkan</span>
                  </button>

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
                  Skrip ini otomatis membuat seluruh tabel (<code className="font-mono text-emerald-600 dark:text-emerald-400">school_settings, people, news, announcements, achievements, galleries, facilities, admin_users</code>), mengaktifkan keamanan RLS, dan memasukkan data bawaan sekolah.
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
                <strong>Cara Menggunakan:</strong> Buka dashboard Supabase proyek Anda &gt; klik menu <strong>SQL Editor</strong> di sidebar kiri &gt; klik <strong>New Query</strong> &gt; tempel (paste) kode di bawah &gt; klik tombol hijau <strong>Run</strong>. Tabel langsung siap dipakai dalam hitungan detik!
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
      {/* TAB 3: SINKRONISASI DATA */}
      {/* ==================================================================== */}
      {activeTab === 'sync' && (
        <div className="space-y-6">
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

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sync Local -> Supabase */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Unggah Data Lokal ke Supabase
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Migrasikan seluruh data sekolah yang saat ini tersimpan di website ke tabel database Supabase Anda. Sangat cocok setelah Anda baru saja membuat tabel Supabase pertama kali.
                </p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-mono space-y-1 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Data Guru & Personel:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{localStats.teachers} data</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Berita & Artikel:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{localStats.news} artikel</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prestasi Siswa:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{localStats.achievements} prestasi</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncToSupabase}
                disabled={!config.isConfigured || syncingUp}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
              >
                <UploadCloud className={`w-4 h-4 ${syncingUp ? 'animate-bounce' : ''}`} />
                <span>{syncingUp ? 'Sedang Mengunggah...' : 'Unggah & Migrasikan ke Supabase'}</span>
              </button>
            </div>

            {/* Sync Supabase -> Local */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <DownloadCloud className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Tarik Data dari Supabase
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Ambil data terbaru yang ada di database cloud Supabase untuk memperbarui salinan cache lokal di browser Anda.
                </p>
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                  <p className="font-semibold">Catatan Dual-Sync Otomatis:</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed">
                    Setiap kali Anda menambah atau mengedit data (guru, berita, dsb.) di Panel Admin saat Supabase terhubung, data otomatis tersimpan ke Supabase secara real-time!
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
      {/* TAB 4: PANDUAN CEPAT */}
      {/* ==================================================================== */}
      {activeTab === 'guide' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Panduan Menghubungkan Supabase (3 Langkah Mudah)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ikuti 3 tahapan ringkas berikut untuk mengaktifkan database online Supabase Anda:
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
                  Jalankan Skrip Skema SQL
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Buka tab <strong>2. Skrip Skema SQL</strong> di menu atas, klik <strong>Salin Skrip SQL</strong>. Kemudian di dashboard Supabase, buka menu <strong>SQL Editor</strong> di sidebar kiri, klik <strong>New Query</strong>, tempel skrip tersebut, lalu klik <strong>Run</strong>. Semua tabel database Anda otomatis terbuat.
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
                  Di dashboard Supabase, klik ikon roda gigi <strong>Project Settings &gt; API</strong>. Salin <strong>Project URL</strong> dan <strong>Project API Keys (anon public)</strong>. Tempel di tab <strong>1. Kredensial & Koneksi</strong> di halaman ini, lalu klik <strong>Simpan & Hubungkan</strong>. Selesai!
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

-- Keamanan RLS
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read All" ON public.school_settings FOR SELECT USING (true);
CREATE POLICY "Full Access Anon" ON public.school_settings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read All" ON public.people FOR SELECT USING (true);
CREATE POLICY "Full Access Anon" ON public.people FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read All" ON public.news FOR SELECT USING (true);
CREATE POLICY "Full Access Anon" ON public.news FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read All" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Full Access Anon" ON public.announcements FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read All" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Full Access Anon" ON public.achievements FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read All" ON public.galleries FOR SELECT USING (true);
CREATE POLICY "Full Access Anon" ON public.galleries FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read All" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Full Access Anon" ON public.gallery_images FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read All" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Full Access Anon" ON public.facilities FOR ALL USING (true) WITH CHECK (true);
`;
