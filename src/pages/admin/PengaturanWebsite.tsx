import React, { useState, useRef } from 'react';
import { getSchoolSettings, saveSchoolSettings, exportAllSchoolData, importAllSchoolData, resetAllToDefaults } from '../../utils/storage';
import { SchoolSettings } from '../../types';
import { usePermission, Permission } from '../../utils/permissions';
import {
  Settings,
  Globe,
  Bell,
  MessageCircle,
  Share2,
  MapPin,
  Save,
  CheckCircle2,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  FileText,
  Shield,
  Layers,
} from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function PengaturanWebsite() {
  const { can } = usePermission();
  const [settings, setSettings] = useState<SchoolSettings>(getSchoolSettings());
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'umum' | 'banner' | 'kontak_sosmed' | 'tampilan' | 'backup'>('umum');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSchoolSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const handleExportBackup = () => {
    const dataStr = exportAllSchoolData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_smp_pancasila_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        if (confirm('Apakah Anda yakin ingin memulihkan seluruh data CMS dari file backup ini? Data saat ini akan diperbarui.')) {
          const result = importAllSchoolData(content);
          if (result.success) {
            setImportStatus({ type: 'success', message: result.message });
            setSettings(getSchoolSettings());
          } else {
            setImportStatus({ type: 'error', message: result.message });
          }
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFactoryReset = () => {
    const confirmed = prompt(
      'PERINGATAN: Tindakan ini akan mengembalikan semua data berita, personel, galeri, fasilitas, dan pengaturan ke data contoh awal sekolah.\n\nKetik "RESET" untuk mengonfirmasi:'
    );
    if (confirmed === 'RESET') {
      resetAllToDefaults();
      setSettings(getSchoolSettings());
      setImportStatus({
        type: 'success',
        message: 'Data CMS berhasil dikembalikan ke pengaturan awal (factory default)!',
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-yellow-500" />
            <span>Pengaturan Website</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kustomisasi SEO, banner pengumuman atas, widget kontak WhatsApp, integrasi media sosial, serta manajemen pencadangan data situs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Pengaturan</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Pengaturan website berhasil diperbarui dan diterapkan ke seluruh halaman publik!</span>
        </div>
      )}

      {importStatus && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 ${
            importStatus.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {importStatus.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
          <button
            onClick={() => setImportStatus(null)}
            className="text-xs underline hover:opacity-80"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1 hide-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('umum')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'umum'
              ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-500/5'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>SEO & Metadata</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'banner'
              ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-500/5'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Banner Pengumuman Atas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kontak_sosmed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'kontak_sosmed'
              ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-500/5'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Kontak & Media Sosial</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tampilan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
            activeTab === 'tampilan'
              ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-500/5'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tampilan & Footer</span>
        </button>

        {can(Permission.BACKUP_RESTORE) && (
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'backup'
                ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-500/5'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Cadangan & Pemulihan (Backup)</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: SEO & METADATA */}
        {activeTab === 'umum' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                Metadata Mesin Pencari (SEO) & Identitas Publik
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Informasi yang digunakan oleh peramban, Google Search, dan pratinjau media sosial saat tautan dibagikan.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Website Resmi (Browser Title Tag)
                </label>
                <input
                  type="text"
                  value={settings.website_title || `${settings.school_name} - Sekolah Unggulan Sidoarjo`}
                  onChange={(e) => setSettings({ ...settings, website_title: e.target.value })}
                  placeholder="SMP Pancasila Ponokawan - Sekolah Karakter & Berprestasi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Slogan Sekolah
                </label>
                <input
                  type="text"
                  value={settings.website_tagline || 'Membentuk Generasi Cerdas Berkarakter Pancasila & Berwawasan Global'}
                  onChange={(e) => setSettings({ ...settings, website_tagline: e.target.value })}
                  placeholder="Membentuk Generasi Cerdas Berkarakter Pancasila"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Meta (Meta Description untuk Google)
                </label>
                <textarea
                  rows={3}
                  value={settings.meta_description || settings.description}
                  onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
                  placeholder="Deskripsi singkat sekolah untuk mesin pencari..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500 leading-relaxed"
                />
                <p className="text-[10px] text-slate-400 mt-1">Disarankan antara 120 - 160 karakter untuk hasil pencarian Google terbaik.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Kunci Pencarian (Keywords / Tags)
                </label>
                <input
                  type="text"
                  value={settings.meta_keywords || 'smp pancasila ponokawan, smp krian sidoarjo, ppdb smp sidoarjo, smp terbaik krian, smp pancasila'}
                  onChange={(e) => setSettings({ ...settings, meta_keywords: e.target.value })}
                  placeholder="smp pancasila, smp ponokawan krian, smp sidoarjo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Pisahkan kata kunci dengan tanda koma (,).</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BANNER PENGUMUMAN ATAS */}
        {activeTab === 'banner' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                Banner Notifikasi / Pengumuman Puncak (Header Banner)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tampilkan pengumuman mendesak atau ajakan aksi penting (seperti pembukaan PPDB / Ujian) pada bagian teratas situs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Aktifkan Banner Pengumuman Teratas
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Jika diaktifkan, banner khusus dengan warna menarik akan muncul di atas navigasi utama.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.banner_announcement_enabled ?? true}
                onChange={(e) =>
                  setSettings({ ...settings, banner_announcement_enabled: e.target.checked })
                }
                className="w-5 h-5 accent-yellow-500 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teks Pengumuman Banner
                </label>
                <input
                  type="text"
                  value={
                    settings.banner_announcement_text ??
                    '🎓 Penerimaan Peserta Didik Baru (PPDB) TA 2026/2027 telah dibuka! Dapatkan potongan khusus gelombang 1.'
                  }
                  onChange={(e) =>
                    setSettings({ ...settings, banner_announcement_text: e.target.value })
                  }
                  placeholder="Contoh: Penerimaan Siswa Baru Tahun 2026/2027 telah dibuka!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tautan / Link Target Saat Banner Diklik
                </label>
                <input
                  type="text"
                  value={settings.banner_announcement_link ?? '/pengumuman'}
                  onChange={(e) =>
                    setSettings({ ...settings, banner_announcement_link: e.target.value })
                  }
                  placeholder="Contoh: /pengumuman atau https://wa.me/6281234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              {/* Preview Banner */}
              <div className="pt-2">
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Pratinjau Tampilan Banner:
                </span>
                <div className="bg-yellow-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2 truncate">
                    <Bell className="w-4 h-4 shrink-0 animate-bounce" />
                    <span className="truncate">
                      {settings.banner_announcement_text || 'Pengumuman Resmi Sekolah'}
                    </span>
                  </div>
                  <span className="underline shrink-0 text-[11px] ml-2">Lihat Detail →</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KONTAK & SOSIAL MEDIA */}
        {activeTab === 'kontak_sosmed' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                Layanan Kontak Cepat, WhatsApp & Media Sosial
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola tautan akun media sosial resmi dan nomor WhatsApp untuk mempermudah calon wali murid menghubungi pihak sekolah.
              </p>
            </div>

            {/* WhatsApp Widget Toggle */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Widget Tombol Chat WhatsApp Mengambang
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Menampilkan tombol cepat chat WhatsApp langsung di pojok kanan bawah website publik.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.whatsapp_chat_widget_enabled ?? true}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp_chat_widget_enabled: e.target.checked })
                }
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor WhatsApp CS / PPDB (Format: 628...)
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_number || '6281234567890'}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  placeholder="6281234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Resmi Sekolah
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="info@smppancasilaponokawan.sch.id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instagram Sekolah
                </label>
                <input
                  type="text"
                  value={settings.social_links?.instagram || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social_links: { ...settings.social_links, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/smp_pancasila_ponokawan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kanal YouTube
                </label>
                <input
                  type="text"
                  value={settings.social_links?.youtube || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social_links: { ...settings.social_links, youtube: e.target.value },
                    })
                  }
                  placeholder="https://youtube.com/@smppancasilaponokawan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Halaman Facebook
                </label>
                <input
                  type="text"
                  value={settings.social_links?.facebook || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social_links: { ...settings.social_links, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/smppancasilaponokawan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Akun TikTok
                </label>
                <input
                  type="text"
                  value={settings.social_links?.tiktok || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social_links: { ...settings.social_links, tiktok: e.target.value },
                    })
                  }
                  placeholder="https://tiktok.com/@smppancasilaponokawan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TAMPILAN & FOOTER */}
        {activeTab === 'tampilan' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                Tampilan Footer & Hak Cipta
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Atur teks hak cipta pada bagian bawah serta status operasional sistem website.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teks Hak Cipta Footer (Copyright)
                </label>
                <input
                  type="text"
                  value={
                    settings.footer_copyright ||
                    `© ${new Date().getFullYear()} SMP Pancasila Ponokawan Sidoarjo. Seluruh Hak Cipta Dilindungi.`
                  }
                  onChange={(e) => setSettings({ ...settings, footer_copyright: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Kaki Tambahan / Informasi Pengaduan
                </label>
                <textarea
                  rows={2}
                  value={settings.contact_other || ''}
                  onChange={(e) => setSettings({ ...settings, contact_other: e.target.value })}
                  placeholder="Layanan Pengaduan & Informasi PPDB: 0812-3456-7890"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
                />
              </div>

              {/* Maintenance Mode */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Mode Pemeliharaan (Maintenance Mode)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Aktifkan jika sistem sedang dalam pembaharuan besar data dan perlu menampilkan banner informasi pemeliharaan.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode ?? false}
                  onChange={(e) =>
                    setSettings({ ...settings, maintenance_mode: e.target.checked })
                  }
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BACKUP & RESTORE */}
        {activeTab === 'backup' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                Pusat Cadangan & Pemulihan Data (Backup & Restore CMS)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simpan seluruh data artikel berita, data guru & staf, galeri, prestasi, fasilitas, dan pengaturan dalam satu file JSON untuk keamanan data.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Export Backup Card */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Unduh Cadangan Lengkap
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Ekspor semua koleksi database CMS ke file .json
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  File cadangan mencakup seluruh konten publik dan profil sekolah yang dapat disimpan di komputer Anda.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File Backup JSON</span>
                </button>
              </div>

              {/* Import Restore Card */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Pulihkan Data (Restore)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Unggah file cadangan .json yang pernah diunduh
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Pilih file cadangan JSON dari perangkat Anda untuk memulihkan seluruh konten situs seketika.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportFile}
                  accept=".json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Pilih & Pulihkan dari File JSON</span>
                </button>
              </div>
            </div>

            {/* Factory Reset Area */}
            {can(Permission.SYSTEM_MAINTENANCE) && (
              <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Reset ke Pengaturan Awal (Factory Reset)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Kembalikan seluruh data konten sekolah ke data bawaan awal sistem. Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFactoryReset}
                  className="px-4 py-2 rounded-xl bg-red-600/10 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 text-xs font-bold transition-colors whitespace-nowrap"
                >
                  Reset Semua Data
                </button>
              </div>
            )}
          </div>
        )}

        {/* Global Save Button at Bottom */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Seluruh Perubahan Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
