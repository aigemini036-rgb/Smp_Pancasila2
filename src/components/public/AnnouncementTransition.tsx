import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pin,
  Pause,
  Play,
  FileText,
} from 'lucide-react';
import { Announcement } from '../../types';

/**
 * ============================================================================
 * 17. ANNOUNCEMENT TRANSITION
 * ============================================================================
 * 
 * Konsep:
 * CURRENT ANNOUNCEMENT
 *       ↓
 *   TRANSITION (Fade + Slight Slide + Subtle Crossfade)
 *       ↓
 * NEW ANNOUNCEMENT
 * 
 * Karakteristik Perubahan:
 * - Subtle crossfade via AnimatePresence (mode="wait")
 * - Slight slide (6px - 8px directional displacement)
 * - Editorial calm easing curve: [0.16, 1, 0.3, 1]
 * - Waktu transisi terukur (350ms masuk, 260ms keluar)
 * 
 * Proteksi & Anti-Slop:
 * - NO hard cut yang patah
 * - NO giant card flip
 * - NO dramatic animation / 3D rotation
 * - Anti-flicker & Anti-shift: Dimensi kontainer stabil dengan min-height tetap,
 *   sehingga teks tidak berkedip atau bergeser tidak stabil saat berganti konten.
 * - Aksesibilitas: Menghormati prefers-reduced-motion (pure opacity crossfade).
 * - Tactile controls: Prev, Next, pagination dots, dan auto-play dengan pause on hover.
 */

export interface AnnouncementTransitionProps {
  announcements: Announcement[];
  autoPlayInterval?: number; // ms, default 6500ms
  variant?: 'spotlight' | 'compact' | 'ticker';
  className?: string;
  onAnnouncementChange?: (index: number, announcement: Announcement) => void;
}

export default function AnnouncementTransition({
  announcements,
  autoPlayInterval = 6500,
  variant = 'spotlight',
  className = '',
  onAnnouncementChange,
}: AnnouncementTransitionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Deteksi preferensi reduced-motion pengguna
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const total = announcements?.length || 0;

  // Navigasi ke pengumuman berikutnya
  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => {
      const nextIndex = (prev + 1) % total;
      onAnnouncementChange?.(nextIndex, announcements[nextIndex]);
      return nextIndex;
    });
  }, [total, announcements, onAnnouncementChange]);

  // Navigasi ke pengumuman sebelumnya
  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => {
      const prevIndex = (prev - 1 + total) % total;
      onAnnouncementChange?.(prevIndex, announcements[prevIndex]);
      return prevIndex;
    });
  }, [total, announcements, onAnnouncementChange]);

  // Lompat ke indeks tertentu secara langsung
  const handleSelectIndex = useCallback(
    (index: number) => {
      if (index === currentIndex || index < 0 || index >= total) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
      onAnnouncementChange?.(index, announcements[index]);
    },
    [currentIndex, total, announcements, onAnnouncementChange]
  );

  // Timer rotasi halus otomatis (berhenti jika di-hover atau pengguna berinteraksi)
  useEffect(() => {
    if (total <= 1 || isPaused || reducedMotion) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused, reducedMotion, autoPlayInterval, handleNext]);

  if (!announcements || announcements.length === 0) {
    return null;
  }

  const current = announcements[currentIndex] || announcements[0];

  /**
   * 17. ANNOUNCEMENT TRANSITION VARIANTS:
   * Menggunakan kombinasi subtle crossfade (opacity) + slight slide (y / x terukur)
   * Bebas dari rotasi dramatis atau card-flip masif.
   */
  const spotlightVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      y: reducedMotion ? 0 : dir > 0 ? 8 : -8,
      transition: { duration: 0.1 },
    }),
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.2 : 0.36,
        ease: [0.16, 1, 0.3, 1], // Editorial deceleration curve
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      y: reducedMotion ? 0 : dir > 0 ? -6 : 6,
      transition: {
        duration: reducedMotion ? 0.15 : 0.24,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const tickerVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: reducedMotion ? 0 : dir > 0 ? 10 : -10,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: reducedMotion ? 0.2 : 0.32,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: reducedMotion ? 0 : dir > 0 ? -10 : 10,
      transition: {
        duration: reducedMotion ? 0.15 : 0.22,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  // ==========================================================================
  // VARIANT: TICKER / COMPACT (Untuk Header atau Sub-bar Informasi Ringkas)
  // ==========================================================================
  if (variant === 'ticker' || variant === 'compact') {
    return (
      <div
        className={`relative flex items-center justify-between gap-3 bg-yellow-500/10 border border-yellow-500/30 dark:border-yellow-500/20 px-3.5 py-1.5 rounded-xl text-xs overflow-hidden ${className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="region"
        aria-label="Pengumuman Sekolah Berjalan"
      >
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 bg-yellow-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono shadow-xs">
            <Bell className="w-3 h-3" />
            <span>Pengumuman</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
            {currentIndex + 1}/{total}
          </span>
        </div>

        {/* Dynamic Transition Text Container (Stabil tanpa flicker/shift) */}
        <div className="flex-1 min-w-0 h-5 overflow-hidden relative flex items-center">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={current.id}
              custom={direction}
              variants={tickerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex items-center gap-2 truncate transform-gpu"
            >
              <Link
                to={`/pengumuman/${current.slug}`}
                className="truncate font-semibold text-slate-900 dark:text-slate-100 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                title={current.title}
              >
                {current.title}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Micro Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            to={`/pengumuman/${current.slug}`}
            className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-yellow-700 dark:text-yellow-400 hover:underline mr-1"
          >
            <span>Rincian</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </Link>

          {total > 1 && (
            <div className="flex items-center gap-0.5 border-l border-slate-200 dark:border-slate-700 pl-1.5">
              <button
                type="button"
                onClick={handlePrev}
                className="w-5 h-5 rounded flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Pengumuman sebelumnya"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-5 h-5 rounded flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Pengumuman berikutnya"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VARIANT: SPOTLIGHT (Untuk Papan Pengumuman Utama di Homepage)
  // ==========================================================================
  return (
    <div
      className={`relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Papan Sorotan Pengumuman Sekolah"
    >
      {/* Top Status Strip */}
      <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-800 dark:text-yellow-400 text-[11px] font-mono font-bold tracking-wide">
            <Pin className="w-3 h-3" />
            <span>PENGUMUMAN UTAMA</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
            {currentIndex + 1} dari {total}
          </span>
        </div>

        {/* Pause / Play status & Quick Controls */}
        <div className="flex items-center gap-2">
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
                title={isPaused ? 'Lanjutkan rotasi otomatis' : 'Jeda rotasi otomatis'}
                aria-label={isPaused ? 'Play' : 'Pause'}
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </button>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-all active:scale-95"
                  aria-label="Pengumuman sebelumnya"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xs transition-all active:scale-95"
                  aria-label="Pengumuman berikutnya"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 
        ========================================================================
        17. ANNOUNCEMENT TRANSITION STAGE
        Struktur kontainer dengan min-height yang stabil untuk mencegah layout shift.
        Text tidak berkedip, transisi halus: CURRENT -> TRANSITION -> NEW
        ========================================================================
      */}
      <div className="p-5 sm:p-6 min-h-[160px] sm:min-h-[148px] relative overflow-hidden flex flex-col justify-between">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={spotlightVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full space-y-3 transform-gpu"
          >
            {/* Meta Row: Tanggal & Validitas */}
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-yellow-500" />
                <span>Mulai {current.start_date || current.created_at?.slice(0, 10)}</span>
              </span>
              {current.end_date && (
                <span className="font-mono text-[11px] text-slate-400">
                  • Berakhir {current.end_date}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
              <Link to={`/pengumuman/${current.slug}`}>{current.title}</Link>
            </h3>

            {/* Body Excerpt */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
              {current.content}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action & Pagination Strip */}
      <div className="px-5 sm:px-6 py-3 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Pagination Dots / Selector */}
        {total > 1 && (
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Pilih Pengumuman">
            {announcements.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-6 bg-yellow-500'
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                  aria-label={`Lihat pengumuman ${idx + 1}: ${item.title}`}
                  aria-selected={isActive}
                  role="tab"
                />
              );
            })}
          </div>
        )}

        {/* Read Full Detail Link */}
        <Link
          to={`/pengumuman/${current.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-700 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 transition-colors uppercase tracking-wider ml-auto group"
        >
          <span>Baca Selengkapnya</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
