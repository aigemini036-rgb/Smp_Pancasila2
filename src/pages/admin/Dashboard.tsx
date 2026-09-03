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

export default function Dashboard() {
  const people = getPeople();
  const newsList = getNewsList();
  const announcements = getAnnouncements();
  const achievements = getAchievements();
  const facilities = getFacilities();
  const galleryAlbums = getGalleryAlbums();
  const settings = getSchoolSettings();
  const adminUsers = getAdminUsers();

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
