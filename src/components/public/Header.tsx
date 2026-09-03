import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { getSchoolSettings } from '../../utils/storage';
import { getAuthenticatedUser } from '../../utils/auth';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const settings = getSchoolSettings();
  const authUser = getAuthenticatedUser();

  // Scroll listener for liquid glass transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const isCurrentActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0c0d10] text-slate-100 transition-all duration-300">
      {/* 
        ========================================================================
        TOP BAR: Dark Header Strip matching original UI
        ========================================================================
      */}
      <div className="bg-[#0b0c0e] text-yellow-500/90 text-xs py-2 px-4 sm:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-xs text-yellow-500/90 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
              <span>{settings.address || 'Krian, Kab. Sidoarjo, Jawa Timur'}</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
              <span>
                {settings.phone || '(031) 8971234'} / {settings.whatsapp_number || '0812-3456-7890'}
              </span>
            </span>
            <span className="hidden lg:flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
              <span>{settings.email || 'info@smppancasilaponokawan.sch.id'}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
              title="Akses Portal Administrator Sekolah"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>
                Dashboard Admin (
                {authUser
                  ? `${authUser.full_name?.split(' ')[0]?.toUpperCase() || 'ADMIN'} (${authUser.role || 'Admin'})`
                  : 'ADMIN (Admin)'}
                )
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        FLOATING NAVBAR PILL: Off-White Liquid Glass Capsule Card
        ========================================================================
      */}
      <div className={`py-2 px-4 sm:px-6 transition-all duration-300 ${isScrolled ? 'py-1.5' : 'py-2.5'}`}>
        <div className={`max-w-7xl mx-auto text-slate-900 rounded-2xl md:rounded-3xl border px-4 sm:px-6 py-2 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? 'bg-[#f4f4f6]/95 backdrop-blur-md shadow-2xl border-slate-300/80'
            : 'bg-[#f4f4f6]/90 backdrop-blur-sm shadow-xl border-slate-200/70'
        }`}>
          {/* School Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 bg-yellow-400 rounded-xl p-1 shadow-sm flex items-center justify-center shrink-0 border border-yellow-500/40 transition-transform group-hover:scale-105">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.school_name || 'SMP Pancasila Ponokawan'}
                  className="w-full h-full object-contain"
                />
              ) : (
                <GraduationCap className="w-6 h-6 text-slate-950" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-950 text-base sm:text-lg tracking-tight leading-tight">
                {settings.school_name || 'SMP Pancasila Ponokawan'}
              </span>
              <span className="font-mono font-bold text-[10px] sm:text-[10.5px] text-yellow-600 tracking-wider uppercase">
                PONOKAWAN — SIDOARJO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-[13.5px]">
            {/* Beranda */}
            <Link
              to="/"
              className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
                isCurrentActive('/', true)
                  ? 'bg-[#eed58c] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              Beranda
            </Link>

            {/* Dropdown: Profil Sekolah */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter('profil')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  isCurrentActive('/profil')
                    ? 'text-yellow-700 font-bold'
                    : 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                <span>Profil Sekolah</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {activeDropdown === 'profil' && (
                <div className="absolute top-full left-0 w-56 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white border border-slate-200 rounded-xl shadow-2xl py-2 text-slate-800">
                    <Link
                      to="/profil/sejarah"
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-yellow-50 hover:text-yellow-800 font-medium transition-colors"
                    >
                      Sejarah & Latar Belakang
                    </Link>
                    <Link
                      to="/profil/visi-misi"
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-yellow-50 hover:text-yellow-800 font-medium transition-colors"
                    >
                      Visi, Misi & Cita-Cita
                    </Link>
                    <Link
                      to="/profil/struktur"
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-yellow-50 hover:text-yellow-800 font-medium transition-colors"
                    >
                      Struktur Organisasi
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown: Personel */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter('personel')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  isCurrentActive('/personel')
                    ? 'text-yellow-700 font-bold'
                    : 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/60'
                }`}
              >
                <span>Personel</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {activeDropdown === 'personel' && (
                <div className="absolute top-full left-0 w-56 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white border border-slate-200 rounded-xl shadow-2xl py-2 text-slate-800">
                    <Link
                      to="/personel/kepala-sekolah"
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-yellow-50 hover:text-yellow-800 font-medium transition-colors"
                    >
                      Kepala Sekolah
                    </Link>
                    <Link
                      to="/personel?cat=guru"
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-yellow-50 hover:text-yellow-800 font-medium transition-colors"
                    >
                      Dewan Guru & Pengajar
                    </Link>
                    <Link
                      to="/personel?cat=staff_tu"
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-yellow-50 hover:text-yellow-800 font-medium transition-colors"
                    >
                      Staff Tata Usaha (TU)
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <Link
                      to="/personel"
                      className="block px-4 py-2 text-xs text-yellow-700 hover:bg-yellow-50 font-bold transition-colors"
                    >
                      Lihat Direktori Lengkap →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Prestasi */}
            <Link
              to="/prestasi"
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                isCurrentActive('/prestasi')
                  ? 'text-yellow-700 font-bold'
                  : 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              Prestasi
            </Link>

            {/* Berita */}
            <Link
              to="/berita"
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                isCurrentActive('/berita')
                  ? 'text-yellow-700 font-bold'
                  : 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              Berita
            </Link>

            {/* Pengumuman */}
            <Link
              to="/pengumuman"
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                isCurrentActive('/pengumuman')
                  ? 'text-yellow-700 font-bold'
                  : 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              Pengumuman
            </Link>

            {/* Galeri */}
            <Link
              to="/galeri"
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                isCurrentActive('/galeri')
                  ? 'text-yellow-700 font-bold'
                  : 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              Galeri
            </Link>

            {/* Fasilitas */}
            <Link
              to="/fasilitas"
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                isCurrentActive('/fasilitas')
                  ? 'text-yellow-700 font-bold'
                  : 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              Fasilitas
            </Link>

            {/* Kontak */}
            <Link
              to="/kontak"
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                isCurrentActive('/kontak')
                  ? 'text-yellow-700 font-bold'
                  : 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              Kontak
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:bg-slate-200/60 focus:outline-none"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        MOBILE MENU DRAWER
        ========================================================================
      */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-[#0c0d10] px-4 pt-3 pb-6 space-y-3 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="space-y-1 text-sm font-medium">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-lg ${
                isCurrentActive('/', true)
                  ? 'bg-yellow-500/20 text-yellow-400 font-bold'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              Beranda
            </Link>

            <div className="pt-2 pb-1 px-3 text-[11px] font-mono font-bold text-yellow-500 uppercase tracking-wider">
              Profil Sekolah
            </div>
            <Link
              to="/profil/sejarah"
              className="block pl-6 pr-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              Sejarah & Latar Belakang
            </Link>
            <Link
              to="/profil/visi-misi"
              className="block pl-6 pr-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              Visi, Misi & Cita-Cita
            </Link>
            <Link
              to="/profil/struktur"
              className="block pl-6 pr-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              Struktur Organisasi
            </Link>

            <div className="pt-2 pb-1 px-3 text-[11px] font-mono font-bold text-yellow-500 uppercase tracking-wider">
              Personel & Tenaga Pendidik
            </div>
            <Link
              to="/personel/kepala-sekolah"
              className="block pl-6 pr-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              Kepala Sekolah
            </Link>
            <Link
              to="/personel?cat=guru"
              className="block pl-6 pr-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              Dewan Guru & Pengajar
            </Link>
            <Link
              to="/personel?cat=staff_tu"
              className="block pl-6 pr-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              Staff Tata Usaha
            </Link>
            <Link
              to="/personel"
              className="block pl-6 pr-3 py-1.5 text-xs text-yellow-400 font-bold"
            >
              Lihat Direktori Personel Lengkap →
            </Link>

            <div className="pt-2 border-t border-slate-800"></div>

            <Link
              to="/prestasi"
              className={`block px-3 py-2 rounded-lg ${
                isCurrentActive('/prestasi')
                  ? 'bg-yellow-500/20 text-yellow-400 font-bold'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              Prestasi
            </Link>
            <Link
              to="/berita"
              className={`block px-3 py-2 rounded-lg ${
                isCurrentActive('/berita')
                  ? 'bg-yellow-500/20 text-yellow-400 font-bold'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              Berita
            </Link>
            <Link
              to="/pengumuman"
              className={`block px-3 py-2 rounded-lg ${
                isCurrentActive('/pengumuman')
                  ? 'bg-yellow-500/20 text-yellow-400 font-bold'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              Pengumuman
            </Link>
            <Link
              to="/galeri"
              className={`block px-3 py-2 rounded-lg ${
                isCurrentActive('/galeri')
                  ? 'bg-yellow-500/20 text-yellow-400 font-bold'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              Galeri
            </Link>
            <Link
              to="/fasilitas"
              className={`block px-3 py-2 rounded-lg ${
                isCurrentActive('/fasilitas')
                  ? 'bg-yellow-500/20 text-yellow-400 font-bold'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              Fasilitas
            </Link>
            <Link
              to="/kontak"
              className={`block px-3 py-2 rounded-lg ${
                isCurrentActive('/kontak')
                  ? 'bg-yellow-500/20 text-yellow-400 font-bold'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              Kontak
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
