import React, { useState, useEffect } from 'react';
import {
  getSchoolSettings,
  saveSchoolSettings,
  getPeople,
  getAchievements,
} from '../../utils/storage';
import { SchoolSettings } from '../../types';
import { usePermission, Permission } from '../../utils/permissions';
import {
  Building,
  Save,
  CheckCircle2,
  Users,
  Trophy,
  Award,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
} from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function SekolahSettings() {
  const { can } = usePermission();
  const [settings, setSettings] = useState<SchoolSettings>(getSchoolSettings());
  const [saved, setSaved] = useState(false);
  const [peopleCount, setPeopleCount] = useState(0);
  const [achievementsCount, setAchievementsCount] = useState(0);

  useEffect(() => {
    const currentPeople = getPeople().filter((p) => p.status === 'active');
    const currentAchievements = getAchievements().filter((a) => a.status === 'published');
    setPeopleCount(currentPeople.length);
    setAchievementsCount(currentAchievements.length);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSchoolSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const handleSyncTeachers = () => {
    setSettings((prev) => ({
      ...prev,
      total_teachers: `${peopleCount}+`,
    }));
  };

  const handleSyncAchievements = () => {
    setSettings((prev) => ({
      ...prev,
      total_achievements: `${achievementsCount}+`,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-6 h-6 text-yellow-500" />
            <span>Pengaturan Data Profil & Statistik Sekolah</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola identitas resmi, angka statistik (siswa, guru, prestasi), status akreditasi, serta visi-misi SMP Pancasila Ponokawan.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/40 text-yellow-700 dark:text-yellow-400 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Perubahan data profil, statistik, dan akreditasi sekolah berhasil disimpan ke website!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: STATISTIK & AKREDITASI WEBSITE (UTAMA SESUAI REQUEST) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-[11px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Statistik & Akreditasi Web</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Metrik Angka & Akreditasi yang Ditampilkan di Website
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ubah nilai jumlah siswa, guru & staff, prestasi juara, serta status akreditasi yang tampil pada halaman beranda dan seluruh website.
              </p>
            </div>
          </div>

          {/* Form Grid 4 Metrics */}
          <div className="grid sm:grid-cols-2 gap-5">
            {/* 1. Siswa-Siswi */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-yellow-500" />
                  <span>1. Jumlah Siswa-Siswi</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Tampil di Beranda</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Nilai / Angka Tampilan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 450+ atau 480"
                  value={settings.total_students || ''}
                  onChange={(e) => setSettings({ ...settings, total_students: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Label / Keterangan Kartu
                </label>
                <input
                  type="text"
                  placeholder="Siswa-Siswi"
                  value={settings.stat_students_label || ''}
                  onChange={(e) => setSettings({ ...settings, stat_students_label: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 block mb-1">Pilihan Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['450+', '480+', '500+', '550+'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSettings({ ...settings, total_students: val })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        settings.total_students === val
                          ? 'bg-yellow-500 text-slate-950 shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-yellow-500'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Guru & Staff */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span>2. Jumlah Guru & Staff</span>
                </label>
                <button
                  type="button"
                  onClick={handleSyncTeachers}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold transition-colors"
                  title="Otomatis isi dengan jumlah data Personel aktif saat ini"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Ambil Data ({peopleCount})</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Nilai / Angka Tampilan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 28+ atau 30"
                  value={settings.total_teachers || ''}
                  onChange={(e) => setSettings({ ...settings, total_teachers: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Label / Keterangan Kartu
                </label>
                <input
                  type="text"
                  placeholder="Guru & Staff"
                  value={settings.stat_teachers_label || ''}
                  onChange={(e) => setSettings({ ...settings, stat_teachers_label: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 block mb-1">Pilihan Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[`${peopleCount}+`, '28+', '30+', '35+'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSettings({ ...settings, total_teachers: val })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        settings.total_teachers === val
                          ? 'bg-yellow-500 text-slate-950 shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-yellow-500'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Prestasi Juara */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>3. Jumlah Prestasi Juara</span>
                </label>
                <button
                  type="button"
                  onClick={handleSyncAchievements}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold transition-colors"
                  title="Otomatis isi dengan jumlah data Prestasi saat ini"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Ambil Data ({achievementsCount})</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Nilai / Angka Tampilan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 50+ atau 65"
                  value={settings.total_achievements || ''}
                  onChange={(e) => setSettings({ ...settings, total_achievements: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Label / Keterangan Kartu
                </label>
                <input
                  type="text"
                  placeholder="Prestasi Juara"
                  value={settings.stat_achievements_label || ''}
                  onChange={(e) => setSettings({ ...settings, stat_achievements_label: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 block mb-1">Pilihan Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[`${achievementsCount}+`, '50+', '60+', '100+'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSettings({ ...settings, total_achievements: val })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        settings.total_achievements === val
                          ? 'bg-yellow-500 text-slate-950 shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-yellow-500'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Status Akreditasi */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                  <span>4. Status & Keterangan Akreditasi *</span>
                </label>
                <span className="text-[10px] text-yellow-600 dark:text-yellow-400 font-bold uppercase">Sinkron ke Seluruh Web</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Peringkat Akreditasi (Judul Utama) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Akreditasi A atau A"
                  value={settings.accreditation || ''}
                  onChange={(e) => setSettings({ ...settings, accreditation: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Keterangan / Sub-label Akreditasi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Unggul & Terpuji atau BAN-S/M"
                  value={settings.accreditation_label || ''}
                  onChange={(e) => setSettings({ ...settings, accreditation_label: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 block mb-1">Pilihan Akreditasi:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Akreditasi A', 'Akreditasi A (Unggul)', 'Akreditasi B', 'Akreditasi Baik Sekali'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSettings({ ...settings, accreditation: val })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        settings.accreditation === val
                          ? 'bg-yellow-500 text-slate-950 shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-yellow-500'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* LIVE PREVIEW BOX OF THE STATS GRID */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                Pratinjau Langsung (Live Preview) Tampilan Kartu di Website:
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {/* 1. Siswa */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70">
                  <Users className="w-5 h-5 text-yellow-500 mx-auto mb-1.5" />
                  <p className="text-xl font-black text-white">
                    {settings.total_students || '450+'}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                    {settings.stat_students_label || 'Siswa-Siswi'}
                  </p>
                </div>

                {/* 2. Guru */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70">
                  <Award className="w-5 h-5 text-yellow-500 mx-auto mb-1.5" />
                  <p className="text-xl font-black text-white">
                    {settings.total_teachers || '28+'}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                    {settings.stat_teachers_label || 'Guru & Staff'}
                  </p>
                </div>

                {/* 3. Prestasi */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70">
                  <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-1.5" />
                  <p className="text-xl font-black text-white">
                    {settings.total_achievements || '50+'}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                    {settings.stat_achievements_label || 'Prestasi Juara'}
                  </p>
                </div>

                {/* 4. Akreditasi */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70">
                  <CheckCircle2 className="w-5 h-5 text-yellow-500 mx-auto mb-1.5" />
                  <p className="text-xl font-black text-white">
                    {settings.accreditation || 'Akreditasi A'}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                    {settings.accreditation_label || 'Unggul & Terpuji'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: IDENTITAS & LOGO SEKOLAH */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Identitas & Logo Resmi Sekolah
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kelola logo, nama sekolah, dan Nomor Pokok Sekolah Nasional (NPSN).
            </p>
          </div>

          {/* Upload Logo Sekolah */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <ImageUpload
              label="Upload Logo Resmi Sekolah"
              helperText="Pilih atau tarik file logo sekolah (Format PNG/SVG/WEBP). Logo ini akan muncul pada header, footer, dan kop surat."
              value={settings.logo}
              onChange={(val) => setSettings({ ...settings, logo: val })}
              aspectRatio="square"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Resmi Sekolah *
              </label>
              <input
                type="text"
                required
                value={settings.school_name}
                onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                NPSN (Nomor Pokok Sekolah Nasional) *
              </label>
              <input
                type="text"
                required
                value={settings.npsn || ''}
                onChange={(e) => setSettings({ ...settings, npsn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION: BACKGROUND FOTO SEKOLAH - SECTION KEPALA SEKOLAH */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Background Foto Gedung Sekolah</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-bold border border-yellow-500/20">
                  Section Kepala Sekolah
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload foto gedung/halaman sekolah untuk dijadikan background sinematik pada section Sambutan Kepala Sekolah di beranda. Dilengkapi animasi mask reveal dan pergerakan halus (Ken Burns).
              </p>
            </div>
            <div>
              {settings.headmaster_section_background ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5" />
                  ✓ Foto Aktif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-600">
                  Background Polos (Fallback)
                </span>
              )}
            </div>
          </div>

          {/* Upload Foto Background Sekolah */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <ImageUpload
              label="Upload Foto Gedung / Lingkungan Sekolah"
              helperText="Pilih atau tarik file foto sekolah lanskap beresolusi tinggi (format JPG, PNG, WEBP). Foto ini dapat diganti atau dihapus kapan saja."
              value={settings.headmaster_section_background || ''}
              onChange={(val) => setSettings({ ...settings, headmaster_section_background: val })}
              aspectRatio="wide"
            />
          </div>

          {settings.headmaster_section_background && (
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {/* Focal Point / Posisi Fokus Background */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Posisi Fokus Kamera (Background Position)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { key: 'center', label: 'Tengah' },
                      { key: 'top', label: 'Atas' },
                      { key: 'bottom', label: 'Bawah' },
                      { key: 'left', label: 'Kiri' },
                      { key: 'right', label: 'Kanan' },
                    ] as const
                  ).map((pos) => {
                    const isSelected = (settings.headmaster_background_position || 'center') === pos.key;
                    return (
                      <button
                        key={pos.key}
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            headmaster_background_position: pos.key,
                          })
                        }
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-yellow-500 text-slate-950 border-yellow-500 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-yellow-500/50'
                        }`}
                      >
                        {pos.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400">
                  Tentukan bagian bangunan yang menjadi fokus utama saat foto dipotong secara responsif di berbagai ukuran layar.
                </p>
              </div>

              {/* Opacity / Intensitas Background */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tingkat Kejelasan Background (Opacity)
                  </label>
                  <span className="text-xs font-extrabold text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">
                    {Math.round((settings.headmaster_background_opacity ?? 0.35) * 100)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {[
                    { val: 0.25, label: '25% (Halus)' },
                    { val: 0.35, label: '35% (Optimal)' },
                    { val: 0.5, label: '50% (Sedang)' },
                    { val: 0.75, label: '75% (Jelas)' },
                    { val: 1.0, label: '100% (Penuh)' },
                  ].map((lvl) => {
                    const currentOpacity = settings.headmaster_background_opacity ?? 0.35;
                    const isSelected = Math.abs(currentOpacity - lvl.val) < 0.04;
                    return (
                      <button
                        key={lvl.val}
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            headmaster_background_opacity: lvl.val,
                          })
                        }
                        className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-yellow-500 text-slate-950 border-yellow-500 shadow-sm ring-2 ring-yellow-400/30'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-yellow-500/50'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    );
                  })}
                </div>
                {/* Range Slider for granular control */}
                <div className="pt-1.5 flex items-center gap-3">
                  <input
                    type="range"
                    min="0.10"
                    max="1.00"
                    step="0.05"
                    value={settings.headmaster_background_opacity ?? 0.35}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        headmaster_background_opacity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Tingkat 75% dan 100% akan menampilkan foto bangunan sekolah dengan jelas dan tegas di belakang foto Kepala Sekolah.
                </p>
              </div>
            </div>
          )}

          {!settings.headmaster_section_background && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              Belum ada foto sekolah yang aktif. Section Kepala Sekolah di halaman utama saat ini menggunakan background bersih bawaan (clean card). Upload foto untuk mengaktifkan background sinematik.
            </div>
          )}
        </div>

        {/* SECTION 3: KONTAK & LAYANAN OPERASIONAL */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Kontak Resmi & Jam Layanan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Informasi alamat, nomor telepon PPDB, email, dan jam operasional sekolah.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor Telepon / WhatsApp PPDB *
              </label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Sekretariat Resmi *
              </label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Alamat Lengkap Sekolah *
            </label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Jam Operasional Layanan *
            </label>
            <input
              type="text"
              required
              value={settings.operating_hours}
              onChange={(e) => setSettings({ ...settings, operating_hours: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        {/* SECTION 4: SEJARAH, VISI & MISI */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Profil, Sejarah & Visi Misi Sekolah
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uraian sambutan, rekam jejak berdirinya sekolah, serta rumusan visi dan misi.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Ringkasan Deskripsi / Sambutan Sekolah
            </label>
            <textarea
              rows={3}
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Sejarah Lengkap Sekolah
            </label>
            <textarea
              rows={6}
              value={settings.history}
              onChange={(e) => setSettings({ ...settings, history: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Visi Sekolah
            </label>
            <input
              type="text"
              value={settings.vision}
              onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Misi Sekolah (Satu Poin Per Baris)
            </label>
            <textarea
              rows={5}
              value={settings.mission}
              onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
            ></textarea>
          </div>
        </div>

        {/* Submit Button Sticky Bar */}
        {can(Permission.MANAGE_SCHOOL_DATA) && (
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Pastikan seluruh data sudah benar sebelum menyimpan.
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-md shadow-yellow-500/20 active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Semua Perubahan Data Sekolah</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
