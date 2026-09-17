import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import { getSchoolSettings, getAnnouncements } from '../../utils/storage';
import AnnouncementTransition from './AnnouncementTransition';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reduceMotion = useReducedMotion();

  const location = useLocation();
  const settings = getSchoolSettings();
  const [activeAnnouncements] = useState(() =>
    getAnnouncements().filter((a) => a.status === 'active')
  );
  const showBannerAnnouncement = settings.banner_announcement_enabled !== false;

  // Scroll listener for liquid glass transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll(); // Initial check on mount
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
    <header
      className={`sticky top-0 z-50 text-slate-100 transition-all duration-300 ease-out ${
        isScrolled
          ? 'bg-[#0c0d10]/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-[#0c0d10]/35 backdrop-blur-sm border-b border-transparent shadow-none'
      }`}
    >
      {/* 
        ========================================================================
        TOP BAR: Dark Header Strip matching original UI
        ========================================================================
      */}
      <div
        className={`text-yellow-500/90 text-xs py-1.5 px-4 sm:px-8 border-b transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-[#0b0c0e]/85 backdrop-blur-sm border-white/5'
            : 'bg-[#0b0c0e]/30 border-transparent'
        }`}
      >
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

          <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
              <span>{settings.operating_hours || 'Senin - Jumat: 07.00 - 15.00 WIB'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        17. ANNOUNCEMENT TRANSITION: Header Ticker Strip
        Smooth fade + slight slide transition between active school announcements
        ========================================================================
      */}
      {showBannerAnnouncement && activeAnnouncements.length > 0 && (
        <div className="px-4 sm:px-6 pt-1.5 -mb-0.5">
          <div className="max-w-7xl mx-auto">
            <AnnouncementTransition
              announcements={activeAnnouncements}
              variant="ticker"
              autoPlayInterval={6500}
            />
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        FLOATING NAVBAR PILL: Off-White Liquid Glass Capsule Card
        ========================================================================
      */}
      <div className="px-4 sm:px-6 py-2 sm:py-2.5">
        <div
          className={`max-w-7xl mx-auto text-slate-900 rounded-2xl md:rounded-3xl border px-4 sm:px-6 py-2 flex items-center justify-between transition-all duration-300 ease-out ${
            isScrolled
              ? 'bg-[#f4f4f6]/92 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_12px_28px_rgba(0,0,0,0.14)] border-slate-300/80'
              : 'bg-[#f4f4f6]/75 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_4px_18px_rgba(0,0,0,0.06)] border-white/50'
          }`}
        >
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
                PONOKAWAN - SIDOARJO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-[13.5px]">
            {/* Beranda */}
            <Link
              to="/"
              className={`relative px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 ease-out flex items-center justify-center ${
                isCurrentActive('/', true)
                  ? 'text-slate-950 font-bold bg-yellow-400/25 border border-yellow-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(202,138,4,0.12)]'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50 border border-transparent'
              }`}
            >
              <span>Beranda</span>
              <span
                className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-yellow-500 transition-all duration-200 ease-out pointer-events-none ${
                  isCurrentActive('/', true) ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
                }`}
              />
            </Link>

            {/* Dropdown: Profil Sekolah */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter('profil')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                className={`relative px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 ease-out flex items-center gap-1 ${
                  isCurrentActive('/profil')
                    ? 'text-slate-950 font-bold bg-yellow-400/25 border border-yellow-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(202,138,4,0.12)]'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50 border border-transparent'
                }`}
              >
                <span>Profil Sekolah</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'profil' ? 'rotate-180 text-slate-950' : 'opacity-70'
                  }`}
                />
                <span
                  className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-yellow-500 transition-all duration-200 ease-out pointer-events-none ${
                    isCurrentActive('/profil') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
                  }`}
                />
              </button>

              {activeDropdown === 'profil' && (
                <div className="absolute top-full left-0 w-56 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white border border-slate-200 rounded-xl shadow-2xl py-2 text-slate-800">
                    <Link
                      to="/profil/sejarah"
                      className={`block px-4 py-2 text-xs font-medium transition-colors ${
                        location.pathname === '/profil/sejarah'
                          ? 'bg-yellow-500/15 text-yellow-900 font-bold border-l-2 border-yellow-500'
                          : 'text-slate-700 hover:bg-yellow-50 hover:text-yellow-800'
                      }`}
                    >
                      Sejarah & Latar Belakang
                    </Link>
                    <Link
                      to="/profil/visi-misi"
                      className={`block px-4 py-2 text-xs font-medium transition-colors ${
                        location.pathname === '/profil/visi-misi'
                          ? 'bg-yellow-500/15 text-yellow-900 font-bold border-l-2 border-yellow-500'
                          : 'text-slate-700 hover:bg-yellow-50 hover:text-yellow-800'
                      }`}
                    >
                      Visi, Misi & Cita-Cita
                    </Link>
                    <Link
                      to="/profil/struktur"
                      className={`block px-4 py-2 text-xs font-medium transition-colors ${
                        location.pathname === '/profil/struktur'
                          ? 'bg-yellow-500/15 text-yellow-900 font-bold border-l-2 border-yellow-500'
                          : 'text-slate-700 hover:bg-yellow-50 hover:text-yellow-800'
                      }`}
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
                className={`relative px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 ease-out flex items-center gap-1 ${
                  isCurrentActive('/personel')
                    ? 'text-slate-950 font-bold bg-yellow-400/25 border border-yellow-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(202,138,4,0.12)]'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50 border border-transparent'
                }`}
              >
                <span>Personel</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'personel' ? 'rotate-180 text-slate-950' : 'opacity-70'
                  }`}
                />
                <span
                  className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-yellow-500 transition-all duration-200 ease-out pointer-events-none ${
                    isCurrentActive('/personel') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
                  }`}
                />
              </button>

              {activeDropdown === 'personel' && (
                <div className="absolute top-full left-0 w-56 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white border border-slate-200 rounded-xl shadow-2xl py-2 text-slate-800">
                    <Link
                      to="/personel/kepala-sekolah"
                      className={`block px-4 py-2 text-xs font-medium transition-colors ${
                        location.pathname === '/personel/kepala-sekolah'
                          ? 'bg-yellow-500/15 text-yellow-900 font-bold border-l-2 border-yellow-500'
                          : 'text-slate-700 hover:bg-yellow-50 hover:text-yellow-800'
                      }`}
                    >
                      Kepala Sekolah
                    </Link>
                    <Link
                      to="/personel?cat=guru"
                      className={`block px-4 py-2 text-xs font-medium transition-colors ${
                        location.search === '?cat=guru'
                          ? 'bg-yellow-500/15 text-yellow-900 font-bold border-l-2 border-yellow-500'
                          : 'text-slate-700 hover:bg-yellow-50 hover:text-yellow-800'
                      }`}
                    >
                      Dewan Guru & Pengajar
                    </Link>
                    <Link
                      to="/personel?cat=staff_tu"
                      className={`block px-4 py-2 text-xs font-medium transition-colors ${
                        location.search === '?cat=staff_tu'
                          ? 'bg-yellow-500/15 text-yellow-900 font-bold border-l-2 border-yellow-500'
                          : 'text-slate-700 hover:bg-yellow-50 hover:text-yellow-800'
                      }`}
                    >
                      Staff Tata Usaha (TU)
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <Link
                      to="/personel"
                      className={`block px-4 py-2 text-xs font-bold transition-colors ${
                        location.pathname === '/personel' && !location.search
                          ? 'bg-yellow-500/15 text-yellow-900 border-l-2 border-yellow-500'
                          : 'text-yellow-700 hover:bg-yellow-50'
                      }`}
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
              className={`relative px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 ease-out flex items-center justify-center ${
                isCurrentActive('/prestasi')
                  ? 'text-slate-950 font-bold bg-yellow-400/25 border border-yellow-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(202,138,4,0.12)]'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50 border border-transparent'
              }`}
            >
              <span>Prestasi</span>
              <span
                className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-yellow-500 transition-all duration-200 ease-out pointer-events-none ${
                  isCurrentActive('/prestasi') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
                }`}
              />
            </Link>

            {/* Berita */}
            <Link
              to="/berita"
              className={`relative px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 ease-out flex items-center justify-center ${
                isCurrentActive('/berita')
                  ? 'text-slate-950 font-bold bg-yellow-400/25 border border-yellow-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(202,138,4,0.12)]'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50 border border-transparent'
              }`}
            >
              <span>Berita</span>
              <span
                className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-yellow-500 transition-all duration-200 ease-out pointer-events-none ${
                  isCurrentActive('/berita') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
                }`}
              />
            </Link>

            {/* Pengumuman */}
            <Link
              to="/pengumuman"
              className={`relative px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 ease-out flex items-center justify-center ${
                isCurrentActive('/pengumuman')
                  ? 'text-slate-950 font-bold bg-yellow-400/25 border border-yellow-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(202,138,4,0.12)]'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50 border border-transparent'
              }`}
            >
              <span>Pengumuman</span>
              <span
                className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-yellow-500 transition-all duration-200 ease-out pointer-events-none ${
                  isCurrentActive('/pengumuman') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
                }`}
              />
            </Link>

            {/* Galeri */}
            <Link
              to="/galeri"
              className={`relative px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 ease-out flex items-center justify-center ${
                isCurrentActive('/galeri')
                  ? 'text-slate-950 font-bold bg-yellow-400/25 border border-yellow-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(202,138,4,0.12)]'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50 border border-transparent'
              }`}
            >
              <span>Galeri</span>
              <span
                className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-yellow-500 transition-all duration-200 ease-out pointer-events-none ${
                  isCurrentActive('/galeri') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
                }`}
              />
            </Link>

            {/* Fasilitas */}
            <Link
              to="/fasilitas"
              className={`relative px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 ease-out flex items-center justify-center ${
                isCurrentActive('/fasilitas')
                  ? 'text-slate-950 font-bold bg-yellow-400/25 border border-yellow-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(202,138,4,0.12)]'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50 border border-transparent'
              }`}
            >
              <span>Fasilitas</span>
              <span
                className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-yellow-500 transition-all duration-200 ease-out pointer-events-none ${
                  isCurrentActive('/fasilitas') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
                }`}
              />
            </Link>

            {/* Kontak */}
            <Link
              to="/kontak"
              className={`relative px-3.5 py-1.5 rounded-full font-semibold transition-all duration-200 ease-out flex items-center justify-center ${
                isCurrentActive('/kontak')
                  ? 'text-slate-950 font-bold bg-yellow-400/25 border border-yellow-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(202,138,4,0.12)]'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/50 border border-transparent'
              }`}
            >
              <span>Kontak</span>
              <span
                className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-yellow-500 transition-all duration-200 ease-out pointer-events-none ${
                  isCurrentActive('/kontak') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
                }`}
              />
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:bg-slate-200/60 active:scale-95 transition-all focus:outline-none"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        49 & 50. MOBILE MENU REVEAL & CLOSE (Controlled, Subtle, Smooth)
        ========================================================================
      */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="xl:hidden border-t border-slate-800/80 bg-[#0c0d10]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="space-y-1 text-sm font-medium">
              <Link
                to="/"
                className={`block px-3.5 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isCurrentActive('/', true)
                    ? 'bg-yellow-500/20 text-yellow-400 font-bold border-l-2 border-yellow-400 pl-3'
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
                className={`block pl-6 pr-3 py-1.5 text-xs transition-colors duration-200 ${
                  location.pathname === '/profil/sejarah'
                    ? 'text-yellow-400 font-bold bg-yellow-500/10'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Sejarah & Latar Belakang
              </Link>
              <Link
                to="/profil/visi-misi"
                className={`block pl-6 pr-3 py-1.5 text-xs transition-colors duration-200 ${
                  location.pathname === '/profil/visi-misi'
                    ? 'text-yellow-400 font-bold bg-yellow-500/10'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Visi, Misi & Cita-Cita
              </Link>
              <Link
                to="/profil/struktur"
                className={`block pl-6 pr-3 py-1.5 text-xs transition-colors duration-200 ${
                  location.pathname === '/profil/struktur'
                    ? 'text-yellow-400 font-bold bg-yellow-500/10'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Struktur Organisasi
              </Link>

              <div className="pt-2 pb-1 px-3 text-[11px] font-mono font-bold text-yellow-500 uppercase tracking-wider">
                Personel & Tenaga Pendidik
              </div>
              <Link
                to="/personel/kepala-sekolah"
                className={`block pl-6 pr-3 py-1.5 text-xs transition-colors duration-200 ${
                  location.pathname === '/personel/kepala-sekolah'
                    ? 'text-yellow-400 font-bold bg-yellow-500/10'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Kepala Sekolah
              </Link>
              <Link
                to="/personel?cat=guru"
                className={`block pl-6 pr-3 py-1.5 text-xs transition-colors duration-200 ${
                  location.search === '?cat=guru'
                    ? 'text-yellow-400 font-bold bg-yellow-500/10'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Dewan Guru & Pengajar
              </Link>
              <Link
                to="/personel?cat=staff_tu"
                className={`block pl-6 pr-3 py-1.5 text-xs transition-colors duration-200 ${
                  location.search === '?cat=staff_tu'
                    ? 'text-yellow-400 font-bold bg-yellow-500/10'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Staff Tata Usaha
              </Link>
              <Link
                to="/personel"
                className={`block pl-6 pr-3 py-1.5 text-xs font-bold transition-colors duration-200 ${
                  location.pathname === '/personel' && !location.search
                    ? 'text-yellow-400 underline underline-offset-4'
                    : 'text-yellow-400/90 hover:text-yellow-300'
                }`}
              >
                Lihat Direktori Personel Lengkap →
              </Link>

              <div className="pt-2 border-t border-slate-800"></div>

              <Link
                to="/prestasi"
                className={`block px-3.5 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isCurrentActive('/prestasi')
                    ? 'bg-yellow-500/20 text-yellow-400 font-bold border-l-2 border-yellow-400 pl-3'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                Prestasi
              </Link>
              <Link
                to="/berita"
                className={`block px-3.5 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isCurrentActive('/berita')
                    ? 'bg-yellow-500/20 text-yellow-400 font-bold border-l-2 border-yellow-400 pl-3'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                Berita
              </Link>
              <Link
                to="/pengumuman"
                className={`block px-3.5 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isCurrentActive('/pengumuman')
                    ? 'bg-yellow-500/20 text-yellow-400 font-bold border-l-2 border-yellow-400 pl-3'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                Pengumuman
              </Link>
              <Link
                to="/galeri"
                className={`block px-3.5 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isCurrentActive('/galeri')
                    ? 'bg-yellow-500/20 text-yellow-400 font-bold border-l-2 border-yellow-400 pl-3'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                Galeri
              </Link>
              <Link
                to="/fasilitas"
                className={`block px-3.5 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isCurrentActive('/fasilitas')
                    ? 'bg-yellow-500/20 text-yellow-400 font-bold border-l-2 border-yellow-400 pl-3'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                Fasilitas
              </Link>
              <Link
                to="/kontak"
                className={`block px-3.5 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isCurrentActive('/kontak')
                    ? 'bg-yellow-500/20 text-yellow-400 font-bold border-l-2 border-yellow-400 pl-3'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                Kontak
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
