import { Link } from 'react-router-dom';
import {
  Users,
  Newspaper,
  Bell,
  Trophy,
  Images,
  Landmark,
  Plus,
  ExternalLink,
  ShieldCheck,
  Building,
  Settings,
  UserCheck,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  CheckCircle2,
  Database,
  Smartphone,
  Laptop,
  AlertCircle,
  FileJson,
} from 'lucide-react';
import {
  getPeople,
  getNewsList,
  getAnnouncements,
  getAchievements,
  getFacilities,
  getGalleryAlbums,
  getSchoolSettings,
} from '../../utils/storage';
import { getAdminUsers } from '../../utils/auth';
import { useDataSync } from '../../hooks/useDataSync';
import React, { useState, useRef } from 'react';

export default function Dashboard() {
  const people = getPeople();
  const newsList = getNewsList();
  const announcements = getAnnouncements();
  const achievements = getAchievements();
  const facilities = getFacilities();
  const galleryAlbums = getGalleryAlbums();
  const settings = getSchoolSettings();
  const adminUsers = getAdminUsers();

  const {
    isSyncing,
    lastSyncTime,
    statusMessage,
    supabaseReady,
    pushToServer,
    pullFromServer,
    exportBackup,
    importBackup,
  } = useDataSync();

  const [bannerFeedback, setBannerFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePush = async () => {
    const res = await pushToServer();
    setBannerFeedback(res.message);
    setTimeout(() => setBannerFeedback(null), 6000);
  };

  const handlePull = async () => {
    const res = await pullFromServer();
    setBannerFeedback(res.message);
    setTimeout(() => setBannerFeedback(null), 6000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = await importBackup(content);
        setBannerFeedback(res.message);
        setTimeout(() => setBannerFeedback(null), 6000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">
            SMP PANCASILA PONOKAWAN
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Selamat Datang di Panel CMS Administrator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Kelola data sekolah, profil personel, berita, pengumuman, fasilitas, galeri, dan konten publik secara terpadu.
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>Lihat Website Utama</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Multi-Device Synchronization & Database Control Panel */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Sinkronisasi Multi-Perangkat Aktif
              </span>
              {supabaseReady ? (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-emerald-400" />
                  Supabase Cloud Terhubung
                </span>
              ) : (
                <Link
                  to="/admin/supabase"
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors flex items-center gap-1.5"
                >
                  <Database className="w-3 h-3" />
                  Supabase: Klik untuk Sambungkan
                </Link>
              )}
            </div>

            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <span>Sinkronisasi Data ke HP & Perangkat Lain</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Jika Anda sudah mengedit data (guru, berita, fasilitas, atau profil) di laptop dan ingin memastikan perubahannya langsung muncul saat dilihat di HP atau perangkat lain, tekan tombol <strong>"Kirim Perubahan ke HP / Semua Perangkat"</strong> di bawah.
            </p>

            {lastSyncTime && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Terakhir disinkronkan: {lastSyncTime} WIB</span>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
            {/* Action 1: Push Local to Server */}
            <button
              type="button"
              onClick={handlePush}
              disabled={isSyncing}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Kirim Perubahan ke Semua Device'}</span>
            </button>

            {/* Action 2: Pull Latest */}
            <button
              type="button"
              onClick={handlePull}
              disabled={isSyncing}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
              title="Tarik data terbaru dari server / database jika diedit dari perangkat lain"
            >
              <DownloadCloud className="w-4 h-4 text-emerald-400" />
              <span>Tarik Data Terbaru</span>
            </button>

            {/* Action 3: Export Backup */}
            <button
              type="button"
              onClick={exportBackup}
              className="w-full sm:w-auto px-3.5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              title="Unduh cadangan data lengkap (JSON)"
            >
              <FileJson className="w-4 h-4 text-yellow-400" />
              <span>Unduh Backup</span>
            </button>

            {/* Action 4: Import Backup */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-3.5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              title="Pulihkan data dari file cadangan JSON"
            >
              <UploadCloud className="w-4 h-4 text-blue-400" />
              <span>Pulihkan Backup</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Feedback message banner */}
        {bannerFeedback && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{bannerFeedback}</span>
            </div>
            <button
              onClick={() => setBannerFeedback(null)}
              className="text-xs text-emerald-300 hover:text-white underline font-normal"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <Link
          to="/admin/personel"
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-yellow-500 transition-colors group"
        >
          <Users className="w-5 h-5 text-yellow-500 mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-xl font-black text-slate-900 dark:text-white">{people.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Personel</p>
        </Link>

        <Link
          to="/admin/berita"
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-yellow-500 transition-colors group"
        >
          <Newspaper className="w-5 h-5 text-yellow-500 mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-xl font-black text-slate-900 dark:text-white">{newsList.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Berita</p>
        </Link>

        <Link
          to="/admin/pengumuman"
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-yellow-500 transition-colors group"
        >
          <Bell className="w-5 h-5 text-yellow-500 mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-xl font-black text-slate-900 dark:text-white">{announcements.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Pengumuman</p>
        </Link>

        <Link
          to="/admin/prestasi"
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-yellow-500 transition-colors group"
        >
          <Trophy className="w-5 h-5 text-yellow-500 mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-xl font-black text-slate-900 dark:text-white">{achievements.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Prestasi</p>
        </Link>

        <Link
          to="/admin/galeri"
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-yellow-500 transition-colors group"
        >
          <Images className="w-5 h-5 text-yellow-500 mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-xl font-black text-slate-900 dark:text-white">{galleryAlbums.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Album</p>
        </Link>

        <Link
          to="/admin/fasilitas"
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-yellow-500 transition-colors group"
        >
          <Landmark className="w-5 h-5 text-yellow-500 mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-xl font-black text-slate-900 dark:text-white">{facilities.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Fasilitas</p>
        </Link>

        <Link
          to="/admin/akun"
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-yellow-500 transition-colors group"
        >
          <UserCheck className="w-5 h-5 text-yellow-500 mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-xl font-black text-slate-900 dark:text-white">{adminUsers.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Akun Admin</p>
        </Link>

        <Link
          to="/admin/pengaturan"
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-yellow-500 transition-colors group"
        >
          <Settings className="w-5 h-5 text-yellow-500 mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-xl font-black text-slate-900 dark:text-white">Web</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Pengaturan</p>
        </Link>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-yellow-500" />
          <span>Aksi Cepat Manajemen CMS</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            to="/admin/berita"
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-yellow-500/10 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Newspaper className="w-4 h-4 text-yellow-500 shrink-0" />
            <span>Tambah Berita & Artikel Baru</span>
          </Link>

          <Link
            to="/admin/pengumuman"
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-yellow-500/10 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Bell className="w-4 h-4 text-yellow-500 shrink-0" />
            <span>Buat Pengumuman Baru</span>
          </Link>

          <Link
            to="/admin/personel"
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-yellow-500/10 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Users className="w-4 h-4 text-yellow-500 shrink-0" />
            <span>Kelola Guru & Staf</span>
          </Link>

          <Link
            to="/admin/sekolah"
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-yellow-500/10 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Building className="w-4 h-4 text-yellow-500 shrink-0" />
            <span>Data & Profil Resmi Sekolah</span>
          </Link>

          <Link
            to="/admin/pengaturan"
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-yellow-500/10 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Settings className="w-4 h-4 text-yellow-500 shrink-0" />
            <span>Pengaturan Website & Cadangan</span>
          </Link>

          <Link
            to="/admin/akun"
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-yellow-500/10 border border-slate-200 dark:border-slate-700 flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-yellow-500 shrink-0" />
            <span>Manajemen Akun & Hak Akses</span>
          </Link>
        </div>
      </div>

      {/* School Status Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-yellow-500" />
          <span>Ringkasan Profil Sekolah Terpasang</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Nama Lembaga:</span>
            <p>{settings.school_name}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">NPSN / Akreditasi:</span>
            <p>{settings.npsn} • {settings.accreditation}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Alamat Lengkap:</span>
            <p>{settings.address}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Kontak & Telepon:</span>
            <p>{settings.phone} • {settings.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
