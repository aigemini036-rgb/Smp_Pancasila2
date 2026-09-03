import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Trophy,
  Bell,
  Newspaper,
  CheckCircle2,
  Users,
  Award,
  Calendar,
  Sparkles,
  Quote,
  GraduationCap,
  Images,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import {
  getSchoolSettings,
  getPeople,
  getNewsList,
  getAnnouncements,
  getAchievements,
  getGalleries,
  getGalleryImages,
} from '../../utils/storage';
import { Achievement, Gallery, GalleryImage } from '../../types';
import HangingHeadmasterPhoto from '../../components/public/HangingHeadmasterPhoto';
import OfficialNoticeReveal from '../../components/public/OfficialNoticeReveal';
import AnimatedCounter from '../../components/public/AnimatedCounter';
import CylinderGallery3D from '../../components/public/CylinderGallery3D';
import GalleryLightboxModal from '../../components/public/GalleryLightboxModal';
import InteractiveParticleGrid from '../../components/public/InteractiveParticleGrid';
import CinematicApertureReveal from '../../components/public/CinematicApertureReveal';
import NewsPaperDeckReveal from '../../components/public/NewsPaperDeckReveal';
import AchievementStackShuffle from '../../components/public/AchievementStackShuffle';

export default function Home() {
  const settings = getSchoolSettings();
  const people = getPeople();
  const newsList = getNewsList().filter((n) => n.status === 'published').slice(0, 4);
  const announcements = getAnnouncements().filter((a) => a.status === 'active').slice(0, 3);
  const achievements = getAchievements().filter((ac) => ac.status === 'published').slice(0, 3);
  const galleries = getGalleries().filter((g) => g.status === 'published');
  const allGalleryImages = getGalleryImages().filter((img) => img.status === 'published');

  const [activeGalleryId, setActiveGalleryId] = useState<string>(galleries[0]?.id || '');
  const activeGallery = galleries.find((g) => g.id === activeGalleryId) || galleries[0] || null;

  const currentGalleryImages = activeGallery
    ? allGalleryImages.filter((img) => img.gallery_id === activeGallery.id)
    : allGalleryImages.slice(0, 8);

  const albumList = galleries.map((g) => ({
    id: g.id,
    title: g.title,
    count: allGalleryImages.filter((img) => img.gallery_id === g.id).length,
  }));

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleNextPhoto = () => {
    if (currentGalleryImages.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % currentGalleryImages.length);
  };

  const handlePrevPhoto = () => {
    if (currentGalleryImages.length === 0) return;
    setLightboxIndex((prev) => (prev - 1 + currentGalleryImages.length) % currentGalleryImages.length);
  };

  const headmaster = people.find((p) => p.category === 'kepala_sekolah');

  return (
    <div className="space-y-20 sm:space-y-28 relative">
      {/* Cinematic Aperture Entry Reveal (One-time polite opening) */}
      <CinematicApertureReveal />

      {/* 
        ========================================================================
        HERO SECTION: Centered School Identity with Golden Dot Particle Matrix
        ========================================================================
      */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#0c0d10] text-white border-b border-slate-800">
        {/* Interactive Golden Dot Particle Canvas Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <InteractiveParticleGrid />
        </div>

        {/* Ambient Warm Golden Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-yellow-500/10 blur-[130px] rounded-full pointer-events-none z-0" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-yellow-500/40 text-yellow-400 text-xs font-mono tracking-wider uppercase font-semibold backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>SMP PANCASILA PONOKAWAN — KRIAN, SIDOARJO</span>
          </div>

          {/* Subtitle Serif Italic */}
          <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-slate-100 font-light mt-4 tracking-normal">
            Lembaga Pendidikan Menengah Pertama
          </p>

          {/* Main H1 Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.12] mt-3 max-w-4xl mx-auto">
            Membentuk Generasi<br className="hidden sm:inline" />{' '}
            Berkarakter Pancasila & Unggul<br className="hidden sm:inline" />{' '}
            Prestasi
          </h1>

          {/* Descriptive Narrative */}
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
            Mengabdi dengan keteladanan, ilmu pengetahuan, dan budi pekerti luhur di Desa Ponokawan, Kecamatan Krian, Kabupaten Sidoarjo.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              to="/profil/sejarah"
              className="px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center gap-2 group"
            >
              <span>Jelajahi Profil Sekolah</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/pengumuman"
              className="px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-medium text-sm transition-all border border-yellow-500/30 shadow-md flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-yellow-400" />
              <span>Informasi PPDB Online</span>
            </Link>
          </div>

          {/* 
            ====================================================================
            INSTITUTIONAL METRIC STRIP: Clean Architectural Dividers
            ====================================================================
          */}
          <div className="mt-14 pt-8 border-t border-slate-800/90 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800 w-full">
            <div className="py-3 px-4 text-center">
              <span className="font-mono text-2xl sm:text-3xl font-black text-yellow-400 block tracking-tight">
                <AnimatedCounter value={settings.total_students || '450+'} />
              </span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mt-1">
                {settings.stat_students_label || 'Peserta Didik Aktif'}
              </span>
            </div>

            <div className="py-3 px-4 text-center">
              <span className="font-mono text-2xl sm:text-3xl font-black text-yellow-400 block tracking-tight">
                <AnimatedCounter value={settings.total_teachers || '28+'} />
              </span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mt-1">
                {settings.stat_teachers_label || 'Guru & Tenaga Kependidikan'}
              </span>
            </div>

            <div className="py-3 px-4 text-center">
              <span className="font-mono text-2xl sm:text-3xl font-black text-yellow-400 block tracking-tight">
                <AnimatedCounter value={settings.total_achievements || '50+'} />
              </span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mt-1">
                {settings.stat_achievements_label || 'Prestasi & Kejuaraan'}
              </span>
            </div>

            <div className="py-3 px-4 text-center">
              <span className="font-mono text-2xl sm:text-3xl font-black text-yellow-400 block tracking-tight">
                <AnimatedCounter value={settings.accreditation || 'Akreditasi A'} />
              </span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mt-1">
                {settings.accreditation_label || 'Status Akreditasi'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 1: SAMBUTAN KEPALA SEKOLAH (Editorial Leadership Statement)
        ========================================================================
      */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {headmaster && (
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <HangingHeadmasterPhoto
                src={headmaster.photo}
                alt={headmaster.name}
                className="w-48 h-56 sm:w-56 sm:h-64 rounded-2xl object-cover shadow-md border-2 border-yellow-500/40"
              />
              <div className="mt-4 space-y-0.5">
                <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
                  {headmaster.name}
                </h3>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 font-mono font-bold uppercase tracking-wider">
                  {headmaster.position}
                </p>
                {headmaster.nip_nuptk && (
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    NIP/NUPTK: {headmaster.nip_nuptk}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Sambutan Pimpinan Sekolah</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Mendidik dengan Keteladanan, Merajut Masa Depan Generasi Bangsa
            </h2>
            <div className="relative pl-4 border-l-2 border-yellow-500/60 my-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base italic">
              <Quote className="w-4 h-4 text-yellow-500/40 absolute -left-2 top-0 -translate-x-1/2 bg-white dark:bg-slate-800 rounded-full" />
              "{settings.description}"
            </div>
            <div className="pt-2">
              <Link
                to="/personel/kepala-sekolah"
                className="inline-flex items-center gap-2 text-xs font-bold text-yellow-700 dark:text-yellow-400 hover:underline group"
              >
                <span>Baca Profil & Gagasan Kepala Sekolah</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 2: VISI & MISI (Editorial Institutional Layout)
        ========================================================================
      */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-200 dark:border-slate-800">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[11px] font-mono font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest block">
              Arah & Cita-Cita Kami
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Visi Sekolah
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {settings.vision ||
                'Terwujudnya peserta didik yang beriman, bertakwa, berakhlak mulia, unggul dalam prestasi akademik dan non-akademik, serta berwawasan kebangsaan yang berlandaskan nilai-nilai Pancasila.'}
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3 lg:border-l lg:border-slate-200 lg:dark:border-slate-800 lg:pl-10">
            <span className="text-[11px] font-mono font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest block">
              Pilar Pelaksanaan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Misi Pendidikan
            </h2>
            <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-2">
              <p>
                1. Melaksanakan pembelajaran yang aktif, inovatif, kreatif, dan menyenangkan untuk mengoptimalkan potensi peserta didik.
              </p>
              <p>
                2. Menanamkan nilai-nilai religius dan keteladanan budi pekerti dalam seluruh aktivitas sekolah.
              </p>
              <p>
                3. Mengembangkan bakat minat siswa melalui program ekstrakurikuler terarah dan berprestasi.
              </p>
              <p>
                4. Mewujudkan lingkungan sekolah yang asri, aman, inklusif, dan berwawasan lingkungan hidup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        SECTION 3: PENGUMUMAN RESMI (Official Notices Board)
        ========================================================================
      */}
      {announcements.length > 0 && (
        <OfficialNoticeReveal announcements={announcements} />
      )}

      {/* 
        ========================================================================
        SECTION 4: BERITA & AGENDA SEKOLAH (Newspaper Opening & Card Stack Effect)
        ========================================================================
      */}
      {newsList.length > 0 && (
        <NewsPaperDeckReveal newsList={newsList} />
      )}

      {/* 
        ========================================================================
        SECTION 5: PRESTASI & PENGHARGAAN (Layered Stack Shuffle & Settle)
        ========================================================================
      */}
      {achievements.length > 0 && (
        <AchievementStackShuffle achievements={achievements} />
      )}

      {/* 
        ========================================================================
        SECTION 6: GALERI FOTO DOKUMENTASI KEGIATAN
        ========================================================================
      */}
      {currentGalleryImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
            <div>
              <span className="text-[11px] font-mono font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest block mb-1">
                Dokumentasi & Aktivitas
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Galeri Foto Sekolah
              </h2>
            </div>

            <Link
              to="/galeri"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-yellow-400 hover:text-yellow-600 transition-colors uppercase tracking-wider"
            >
              <span>Lihat Semua Album</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <CylinderGallery3D
            key={activeGallery?.id || 'home-gallery'}
            images={currentGalleryImages}
            albumTitle={activeGallery?.title}
            albumDescription={activeGallery?.description}
            albums={albumList}
            activeAlbumId={activeGallery?.id}
            onSelectAlbum={(id) => setActiveGalleryId(id)}
            onOpenLightbox={handleOpenLightbox}
          />

          <GalleryLightboxModal
            images={currentGalleryImages}
            currentIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            onNext={handleNextPhoto}
            onPrev={handlePrevPhoto}
            albumTitle={activeGallery?.title}
          />
        </section>
      )}

      {/* 
        ========================================================================
        SECTION 7: KONTAK & SEKRETARIAT (Clean Institutional Card)
        ========================================================================
      */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-mono font-bold text-yellow-400 uppercase tracking-widest block">
              Sekretariat & Pendaftaran
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Siap Bergabung dengan SMP Pancasila Ponokawan?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
              Kunjungi kampus kami di Ponokawan, Krian, Sidoarjo atau hubungi tim administrasi sekolah untuk informasi pendaftaran peserta didik baru (PPDB).
            </p>

            <div className="space-y-2 pt-2 text-xs sm:text-sm text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>{settings.address || 'Desa Ponokawan, Kec. Krian, Kab. Sidoarjo, Jawa Timur'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>{settings.phone || '(031) 8971234'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>{settings.email || 'info@smppancasilaponokawan.sch.id'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <Link
              to="/kontak"
              className="px-6 py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs sm:text-sm transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Hubungi Kontak Sekolah</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pengumuman"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm transition-all border border-slate-700 text-center"
            >
              <span>Informasi Pendaftaran (PPDB)</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
