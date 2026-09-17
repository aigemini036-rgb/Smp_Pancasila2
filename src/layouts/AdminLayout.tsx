import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  Users,
  Newspaper,
  Bell,
  Trophy,
  Images,
  Landmark,
  Image as ImageIcon,
  Settings,
  UserCheck,
  LogOut,
  GraduationCap,
  ArrowLeft,
  Menu,
  X,
  ChevronDown,
  Calendar,
  Shield,
  Globe,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { getAuthenticatedUser, logoutAdmin } from '../utils/auth';
import { getSchoolSettings } from '../utils/storage';
import { usePermission, Permission } from '../utils/permissions';
import SchoolLogo from '../components/common/SchoolLogo';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [personelExpanded, setPersonelExpanded] = useState(true);
  const [kontenExpanded, setKontenExpanded] = useState(true);

  const navigate = useNavigate();
  const user = getAuthenticatedUser();
  const settings = getSchoolSettings();
  const { can, role } = usePermission();

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sistem Admin CMS?')) {
      logoutAdmin();
      navigate('/admin/login', { replace: true });
    }
  };

  const hasAnyContentPermission =
    can(Permission.VIEW_NEWS) ||
    can(Permission.VIEW_ANNOUNCEMENT) ||
    can(Permission.VIEW_ACHIEVEMENT) ||
    can(Permission.VIEW_GALLERY) ||
    can(Permission.VIEW_AGENDA);

  const getRoleLabel = () => {
    switch (role) {
      case 'superadmin':
        return 'Super Administrator';
      case 'admin':
        return 'Administrator';
      case 'operator':
        return 'Operator Dapodik / IT';
      case 'editor':
        return 'Redaksi / Editor';
      default:
        return role || 'Pengguna';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex text-slate-900 dark:text-slate-100">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <SchoolLogo
              src={settings.logo}
              alt={settings.school_name || 'Logo SMP Pancasila'}
              size="sm"
            />
            <div>
              <span className="text-sm font-extrabold text-white block leading-tight tracking-wider group-hover:text-yellow-400 transition-colors">
                PANEL ADMIN
              </span>
              <span className="text-[10px] text-yellow-500 uppercase font-semibold">
                {settings.school_name || 'SMP PANCASILA'}
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Card */}
        <div className="p-4 mx-3 my-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold text-sm shrink-0">
            {user?.full_name?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-white truncate">{user?.full_name || 'Admin'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3 h-3 text-yellow-500 shrink-0" />
              <span className="text-[10px] font-semibold text-yellow-400 truncate">
                {getRoleLabel()}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-sm font-medium hide-scrollbar">
          {/* Overview */}
          {can(Permission.VIEW_DASHBOARD) && (
            <NavLink
              to="/admin"
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-yellow-500 text-slate-900 font-bold shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </NavLink>
          )}

          {/* Profil Sekolah / Data Sekolah */}
          {can(Permission.VIEW_SCHOOL_DATA) && (
            <NavLink
              to="/admin/sekolah"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-yellow-500 text-slate-900 font-bold shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Building className="w-4 h-4 shrink-0" />
              <span>Data Sekolah</span>
            </NavLink>
          )}

          {/* Group: Personel */}
          {can(Permission.VIEW_PERSONNEL) && (
            <div>
              <button
                onClick={() => setPersonelExpanded(!personelExpanded)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Personel</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    personelExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {personelExpanded && (
                <div className="ml-7 pl-2 border-l border-slate-700 space-y-1 mt-1">
                  <NavLink
                    to="/admin/personel?cat=kepala_sekolah"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-yellow-400 hover:bg-slate-800"
                  >
                    Kepala Sekolah
                  </NavLink>
                  <NavLink
                    to="/admin/personel?cat=guru"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-yellow-400 hover:bg-slate-800"
                  >
                    Guru & Pengajar
                  </NavLink>
                  <NavLink
                    to="/admin/personel?cat=staff"
                    onClick={() => setSidebarOpen(false)}
                    className="block px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-yellow-400 hover:bg-slate-800"
                  >
                    Staff & Tata Usaha
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Group: Konten Publik */}
          {hasAnyContentPermission && (
            <div>
              <button
                onClick={() => setKontenExpanded(!kontenExpanded)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Newspaper className="w-4 h-4 shrink-0" />
                  <span>Konten Publik</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    kontenExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {kontenExpanded && (
                <div className="ml-7 pl-2 border-l border-slate-700 space-y-1 mt-1">
                  {can(Permission.VIEW_NEWS) && (
                    <NavLink
                      to="/admin/berita"
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          isActive ? 'text-yellow-400 font-bold bg-slate-800' : 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800'
                        }`
                      }
                    >
                      <Newspaper className="w-3.5 h-3.5" />
                      Berita / Artikel
                    </NavLink>
                  )}
                  {can(Permission.VIEW_ANNOUNCEMENT) && (
                    <NavLink
                      to="/admin/pengumuman"
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          isActive ? 'text-yellow-400 font-bold bg-slate-800' : 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800'
                        }`
                      }
                    >
                      <Bell className="w-3.5 h-3.5" />
                      Pengumuman
                    </NavLink>
                  )}
                  {can(Permission.VIEW_AGENDA) && (
                    <NavLink
                      to="/admin/agenda"
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          isActive ? 'text-yellow-400 font-bold bg-slate-800' : 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800'
                        }`
                      }
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Agenda Kegiatan
                    </NavLink>
                  )}
                  {can(Permission.VIEW_ACHIEVEMENT) && (
                    <NavLink
                      to="/admin/prestasi"
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          isActive ? 'text-yellow-400 font-bold bg-slate-800' : 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800'
                        }`
                      }
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      Prestasi
                    </NavLink>
                  )}
                  {can(Permission.VIEW_GALLERY) && (
                    <NavLink
                      to="/admin/galeri"
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          isActive ? 'text-yellow-400 font-bold bg-slate-800' : 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800'
                        }`
                      }
                    >
                      <Images className="w-3.5 h-3.5" />
                      Galeri & Album
                    </NavLink>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Fasilitas */}
          {can(Permission.VIEW_FACILITY) && (
            <NavLink
              to="/admin/fasilitas"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-yellow-500 text-slate-900 font-bold shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Landmark className="w-4 h-4 shrink-0" />
              <span>Fasilitas</span>
            </NavLink>
          )}

          {/* Media */}
          {can(Permission.VIEW_MEDIA) && (
            <NavLink
              to="/admin/media"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-yellow-500 text-slate-900 font-bold shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>Pusat Media</span>
            </NavLink>
          )}

          {/* Pengaturan */}
          {can(Permission.VIEW_SETTINGS) && (
            <NavLink
              to="/admin/pengaturan"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-yellow-500 text-slate-900 font-bold shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Pengaturan Website</span>
            </NavLink>
          )}

          {/* Akun */}
          {can(Permission.MANAGE_USERS) && (
            <NavLink
              to="/admin/akun"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-yellow-500 text-slate-900 font-bold shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>Manajemen Akun</span>
            </NavLink>
          )}
        </nav>

        {/* Footer actions: Clear Separation of Navigation vs Logout */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="px-2 pt-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            Navigasi & Sesi
          </div>
          
          {/* Action 1: Kembali ke Web Publik (Navigasi Murni, Sesi Tetap Login) */}
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors group"
            title="Beralih ke tampilan web publik sekolah (Sesi akun admin Anda tetap aktif)"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="font-bold block text-slate-100">Kembali ke Web Publik</span>
                <span className="text-[10px] text-emerald-400/90 block">Tetap Login • Hanya Beralih</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Action 2: Keluar Sistem (Logout Sebenarnya) */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-colors group text-left"
            title="Akhiri sesi dan keluar dari sistem CMS"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400">
                <LogOut className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold block text-red-400">Keluar Sistem</span>
                <span className="text-[10px] text-red-400/70 block">Logout & Akhiri Sesi</span>
              </div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Topbar Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                CMS Administrator — SMP Pancasila Ponokawan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Sistem Pengelolaan Konten Website Resmi Sekolah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              title="Kunjungi website publik sekolah (sesi akun tetap aktif)"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>Lihat Web Publik</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1"
              title="Keluar dari sistem CMS (Logout)"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar Sistem</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
