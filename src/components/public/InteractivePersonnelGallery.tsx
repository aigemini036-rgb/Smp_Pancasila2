import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Person, CategoryPerson } from '../../types';
import HangingHeadmasterPhoto from './HangingHeadmasterPhoto';
import {
  Users,
  Search,
  ArrowRight,
  UserCheck,
  GraduationCap,
  Briefcase,
  BookOpen,
  Crown,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Quote,
  Eye,
} from 'lucide-react';
import PersonnelProfileModal from './PersonnelProfileModal';

interface InteractivePersonnelGalleryProps {
  people: Person[];
  activeCategory: 'semua' | CategoryPerson;
  onCategoryChange: (category: 'semua' | CategoryPerson) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Bounded physical DOM pool configuration
const POOL_SIZE = 8; // Exactly 8 physical DOM slots kept in memory (buffer above, visible slots, buffer below)
const ITEM_HEIGHT_DESKTOP = 490; // Height per editorial profile slot in pixels on desktop
const ITEM_HEIGHT_MOBILE = 580; // Height per slot on mobile screens

/**
 * Typo-Tolerant & Multi-Field Fuzzy Search Relevance Scoring
 * Evaluates matches across name, position, subject, education, bio, and NIP/NUPTK.
 */
function calculateRelevanceScore(person: Person, query: string): number {
  if (!query || !query.trim()) return 100;

  const q = query.toLowerCase().trim();
  const name = person.name.toLowerCase();
  const position = person.position.toLowerCase();
  const subject = (person.subject || '').toLowerCase();
  const education = (person.education || '').toLowerCase();
  const nip = (person.nip_nuptk || '').toLowerCase();
  const bio = (person.short_bio || '').toLowerCase();

  // 1. Exact match on name
  if (name === q) return 1000;

  // 2. Name starts with query
  if (name.startsWith(q)) return 800;

  // 3. Name contains query
  if (name.includes(q)) return 600;

  // 4. Token matches in name
  const nameWords = name.split(/\s+/);
  const qTokens = q.split(/\s+/).filter(Boolean);
  const allTokensInName = qTokens.every((token) =>
    nameWords.some((w) => w.startsWith(token) || w.includes(token))
  );
  if (allTokensInName) return 500;

  // 5. Subject or Position match
  if (position.includes(q) || subject.includes(q)) return 400;

  // 6. Education or NIP match
  if (education.includes(q) || nip.includes(q)) return 300;

  // 7. Bio match
  if (bio.includes(q)) return 200;

  // 8. Fuzzy / Levenshtein approximate match on name
  const isFuzzyClose = nameWords.some((w) =>
    qTokens.some((token) => isLevenshteinClose(w, token, 1))
  );
  if (isFuzzyClose) return 100;

  return 0;
}

/**
 * Levenshtein distance check for typo tolerance
 */
function isLevenshteinClose(a: string, b: string, maxDistance: number): boolean {
  if (Math.abs(a.length - b.length) > maxDistance) return false;
  if (a === b) return true;
  if (a.startsWith(b) || b.startsWith(a)) return true;

  let distance = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      distance++;
      if (distance > maxDistance) return false;
    }
  }
  distance += Math.abs(a.length - b.length);
  return distance <= maxDistance;
}

/**
 * EDITORIAL PROFILE SCENE
 * Memoized profile card with stable DOM references and cached image assets.
 */
interface EditorialProfileCardProps {
  person: Person;
  compositionIndex: number;
  isInitialReveal?: boolean;
  onQuickView?: (person: Person) => void;
}

const EditorialProfileCard = React.memo(function EditorialProfileCard({
  person,
  compositionIndex,
  isInitialReveal = false,
  onQuickView,
}: EditorialProfileCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const isHeadmaster = person.category === 'kepala_sekolah';
  const isTeacher = person.category === 'guru';

  // Alternating editorial composition layout
  const compositionType = isHeadmaster
    ? 'left-portrait'
    : compositionIndex % 2 === 0
    ? 'left-portrait'
    : 'right-portrait';

  return (
    <motion.div
      initial={isInitialReveal && !shouldReduceMotion ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.35,
        delay: shouldReduceMotion ? 0 : Math.min(compositionIndex * 0.05, 0.2),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all duration-300 shadow-sm hover:shadow-md ${
        isHeadmaster
          ? 'border-yellow-500/50 ring-1 ring-yellow-500/20 bg-gradient-to-br from-yellow-500/[0.04] via-transparent to-amber-500/[0.02]'
          : 'border-slate-200 dark:border-slate-800 hover:border-yellow-500/40'
      }`}
    >
      {/* Institutional Category Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 ${
              isHeadmaster
                ? 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30 font-black'
                : isTeacher
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {isHeadmaster && <Crown className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />}
            {isTeacher && <GraduationCap className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
            {!isHeadmaster && !isTeacher && <Briefcase className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
            <span>
              {isHeadmaster
                ? 'Kepala Sekolah'
                : isTeacher
                ? 'Dewan Guru Pengajar'
                : 'Staff & Tata Usaha'}
            </span>
          </span>
        </div>

        <div className="text-slate-400 dark:text-slate-500 text-[11px] font-mono tracking-widest uppercase flex items-center gap-2">
          <span>SMP Pancasila</span>
          {isHeadmaster && (
            <span className="text-yellow-600 dark:text-yellow-400 font-bold hidden xs:inline">
              • Pimpinan Utama
            </span>
          )}
        </div>
      </div>

      {/* Profile Content Layout */}
      <div className="grid md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
        {/* Portrait Column */}
        <div
          className={`md:col-span-5 lg:col-span-4 flex flex-col items-center text-center ${
            compositionType === 'right-portrait'
              ? 'md:order-2 md:items-end'
              : 'md:order-1 md:items-start'
          }`}
        >
          <div className="relative group w-full max-w-[260px] md:max-w-none">
            {isHeadmaster ? (
              <HangingHeadmasterPhoto
                src={person.photo}
                alt={person.name}
                className="w-full aspect-[4/5] rounded-3xl object-cover border-4 border-yellow-500/30 shadow-lg"
                badge={
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Pimpinan Sekolah
                  </span>
                }
              />
            ) : (
              <div
                onClick={onQuickView ? () => onQuickView(person) : undefined}
                className={`relative group/photo overflow-hidden rounded-3xl aspect-[4/5] bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md w-full transition-all duration-300 hover:border-yellow-500/50 hover:ring-2 hover:ring-yellow-500/20 hover:shadow-xl hover:-translate-y-0.5 ${
                  onQuickView ? 'cursor-pointer' : ''
                }`}
              >
                <img
                  src={person.photo}
                  alt={person.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-300 ease-out group-hover/photo:scale-[1.025] group-hover/photo:-translate-y-0.5"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/[0.04] to-white/10 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* Credentials & Narrative Column */}
        <div
          className={`md:col-span-7 lg:col-span-8 space-y-5 ${
            compositionType === 'right-portrait' ? 'md:order-1' : 'md:order-2'
          }`}
        >
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              {person.name}
            </h2>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-2 flex-wrap">
              <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                {person.position}
              </span>
              {person.nip_nuptk && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    NIP/NUPTK: {person.nip_nuptk}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Short Bio / Quote */}
          {person.short_bio && (
            <div className="relative pl-4 sm:pl-5 border-l-2 border-yellow-500/60 bg-slate-50/80 dark:bg-slate-950/60 p-4 rounded-r-2xl text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed italic">
              <Quote className="w-4 h-4 text-yellow-500/40 absolute -left-2 top-2 -translate-x-1/2 bg-white dark:bg-slate-900 rounded-full" />
              "{person.short_bio}"
            </div>
          )}

          {/* Credentials: Education & Subject/Specialty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                Pendidikan Terakhir
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block">
                {person.education || 'Sarjana Pendidikan'}
              </span>
            </div>

            {person.subject ? (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                  Bidang / Mata Pelajaran
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400 shrink-0" />
                  <span>{person.subject}</span>
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                  Status Penugasan
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs mt-0.5 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Aktif Bertugas</span>
                </span>
              </div>
            )}
          </div>

          {/* Profile CTA Action */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to={`/personel/${person.slug || person.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black transition-all shadow-sm hover:shadow-md active:scale-95 group"
            >
              <span>Profil Lengkap</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(person)}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
                <span>Pratinjau Cepat</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function InteractivePersonnelGallery({
  people,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: InteractivePersonnelGalleryProps) {
  const [modalPerson, setModalPerson] = useState<Person | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialReveal, setIsInitialReveal] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger brief initial reveal whenever category or search filter changes, then disable to keep virtual scroll blazing fast
  useEffect(() => {
    setIsInitialReveal(true);
    const timer = setTimeout(() => {
      setIsInitialReveal(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  // Check prefers-reduced-motion & mobile viewport
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      mq.removeEventListener?.('change', handler);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const itemHeight = isMobile ? ITEM_HEIGHT_MOBILE : ITEM_HEIGHT_DESKTOP;

  // Category counts computed directly from source dataset
  const categoryCounts = useMemo(() => {
    const counts = {
      semua: people.length,
      kepala_sekolah: 0,
      guru: 0,
      staff: 0,
    };
    people.forEach((p) => {
      if (p.category === 'kepala_sekolah') counts.kepala_sekolah++;
      else if (p.category === 'guru') counts.guru++;
      else if (p.category === 'staff') counts.staff++;
    });
    return counts;
  }, [people]);

  // Filter & Score people from source dataset
  // In 'semua' (no search), Headmaster is GUARANTEED to be index 0 (Canonical Origin)
  const filteredPeople = useMemo(() => {
    const filtered = people.filter((p) => {
      const matchesCategory =
        activeCategory === 'semua' ? true : p.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const score = calculateRelevanceScore(p, searchQuery);
      return score > 0;
    });

    // If searching, sort by relevance score descending
    if (searchQuery.trim()) {
      return [...filtered].sort((a, b) => {
        const scoreA = calculateRelevanceScore(a, searchQuery);
        const scoreB = calculateRelevanceScore(b, searchQuery);
        return scoreB - scoreA;
      });
    }

    // Default order: Headmaster first (Canonical Origin), then teachers, then staff
    return [...filtered].sort((a, b) => {
      const order = { kepala_sekolah: 0, guru: 1, staff: 2 };
      const catA = order[a.category] ?? 3;
      const catB = order[b.category] ?? 3;
      if (catA !== catB) return catA - catB;
      return a.name.localeCompare(b.name);
    });
  }, [people, activeCategory, searchQuery]);

  const totalCount = filteredPeople.length;

  // Preload all personnel photos into browser cache
  useEffect(() => {
    filteredPeople.forEach((person) => {
      if (person.photo) {
        const img = new Image();
        img.src = person.photo;
      }
    });
  }, [filteredPeople]);

  /**
   * HIGH-PERFORMANCE INFINITE CIRCULAR SCROLL ENGINE (NATURAL BROWSER SCROLL)
   *
   * 1. Uses 100% natural physical browser window scrolling (no wheel hijacking).
   * 2. Single lightweight requestAnimationFrame pipeline with passive scroll listener.
   * 3. Cached container layout measurements to prevent layout thrashing.
   * 4. Hysteresis buffer on slot index recalculation to prevent recycling thrashing.
   * 5. Fixed stable pool of 8 DOM slots with stable physical keys and hardware acceleration.
   */
  const [baseIndex, setBaseIndex] = useState(0);
  const baseIndexRef = useRef(0);
  const containerTopRef = useRef<number | null>(null);

  // Measure and cache container's absolute top position
  const measureContainerTop = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      containerTopRef.current = rect.top + window.scrollY;
    }
  };

  // Reset baseIndex and update container metrics on filter/search change
  useEffect(() => {
    baseIndexRef.current = 0;
    setBaseIndex(0);
    // Measure on next tick after filter DOM update
    requestAnimationFrame(() => {
      measureContainerTop();
    });
  }, [activeCategory, searchQuery]);

  // Single consolidated RAF scroll tracking loop
  useEffect(() => {
    if (totalCount <= 1) return;

    let rafId: number | null = null;
    measureContainerTop();

    const checkScroll = () => {
      if (containerTopRef.current === null) {
        measureContainerTop();
      }
      const containerTop = containerTopRef.current ?? 0;
      const scrollOffset = Math.max(0, window.scrollY - containerTop);

      // Compute raw item index from scroll offset
      const rawIndex = Math.floor(scrollOffset / itemHeight);
      const targetBase = Math.max(0, rawIndex - 2);
      const currentBase = baseIndexRef.current;

      // Safe Hysteresis Buffer:
      // - Moving downward: increment as soon as targetBase > currentBase
      // - Moving upward: decrement only when targetBase < currentBase - 1, or at the top (targetBase === 0)
      // This prevents boundary jitter and eliminates the reverse-scroll hitch completely.
      let nextBase = currentBase;
      if (targetBase > currentBase) {
        nextBase = targetBase;
      } else if (targetBase < currentBase - 1 || targetBase === 0) {
        nextBase = targetBase;
      }

      if (nextBase !== currentBase) {
        baseIndexRef.current = nextBase;
        setBaseIndex(nextBase);
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        checkScroll();
        rafId = null;
      });
    };

    const onResize = () => {
      measureContainerTop();
      onScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Initial check
    checkScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [totalCount, itemHeight]);

  // Dynamic track height: Always stays comfortably ahead of user scroll position
  const trackHeight = useMemo(() => {
    if (totalCount <= 1) return 'auto';
    return (baseIndex + POOL_SIZE + 12) * itemHeight;
  }, [baseIndex, totalCount, itemHeight]);

  // Fixed pool slots data mapping (8 permanent DOM slots)
  const poolSlots = useMemo(() => {
    if (totalCount <= 1) return [];

    return Array.from({ length: POOL_SIZE }, (_, slotIdx) => {
      const logicalIndex = baseIndex + slotIdx;
      const wrappedIndex = ((logicalIndex % totalCount) + totalCount) % totalCount;
      const person = filteredPeople[wrappedIndex];
      const translateY = logicalIndex * itemHeight;

      return {
        slotKey: `fixed-slot-${slotIdx}`,
        logicalIndex,
        translateY,
        person,
      };
    });
  }, [baseIndex, totalCount, filteredPeople, itemHeight]);

  return (
    <div className="space-y-8 sm:space-y-12 relative">
      {/* 
        ========================================================================
        EDITORIAL CONTROL BAR: Category Filter Navigation & Realtime Fuzzy Search
        ========================================================================
      */}
      <div className="bg-white dark:bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 sticky top-20 z-20">
        {/* Category Filter Tabs with Live Badge Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 hide-scrollbar">
          {(
            [
              {
                id: 'semua' as const,
                label: 'Semua Personel',
                icon: Users,
                count: categoryCounts.semua,
              },
              {
                id: 'kepala_sekolah' as const,
                label: 'Kepala Sekolah',
                icon: Crown,
                count: categoryCounts.kepala_sekolah,
              },
              {
                id: 'guru' as const,
                label: 'Dewan Guru',
                icon: GraduationCap,
                count: categoryCounts.guru,
              },
              {
                id: 'staff' as const,
                label: 'Staff / Tata Usaha',
                icon: Briefcase,
                count: categoryCounts.staff,
              },
            ] as const
          ).map((tab) => {
            const isActive = activeCategory === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id)}
                className={`relative px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 group select-none ${
                  isActive
                    ? 'text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute inset-0 bg-yellow-500 rounded-2xl -z-10 shadow-sm"
                  />
                )}
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? 'text-slate-950'
                      : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                  }`}
                />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                    isActive
                      ? 'bg-slate-950 text-yellow-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Realtime Fuzzy Search Input */}
        <div className="relative w-full lg:w-80 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama, mapel, NIP, keahlian..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-yellow-500 text-slate-900 dark:text-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              title="Hapus kata kunci pencarian"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-yellow-500 hover:text-slate-950 flex items-center justify-center text-[10px] font-bold transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 
        ========================================================================
        ACTIVE FILTER STATUS BAR (Count & Instant Reset)
        ========================================================================
      */}
      {(searchQuery.trim() || activeCategory !== 'semua') && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-yellow-500/10 dark:bg-yellow-500/15 border border-yellow-500/25 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400 shrink-0" />
            <span>
              Menampilkan <strong>{filteredPeople.length}</strong> dari {people.length} personel
              {searchQuery && (
                <> untuk pencarian "<strong>{searchQuery}</strong>"</>
              )}
            </span>
          </div>

          <button
            onClick={() => {
              onSearchChange('');
              onCategoryChange('semua');
            }}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 dark:text-yellow-400 hover:underline px-2.5 py-1 rounded-lg hover:bg-yellow-500/15 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      )}

      {/* 
        ========================================================================
        TRUE INFINITE CIRCULAR SCROLL STREAM (Fixed 8-Slot DOM Virtual Pool)
        ========================================================================
      */}
      {totalCount > 1 && (
        <div
          ref={containerRef}
          className="personnel-infinite-stream relative w-full"
          style={{
            height: typeof trackHeight === 'number' ? `${trackHeight}px` : trackHeight,
          }}
        >
          {poolSlots.map((slot) => (
            <div
              key={slot.slotKey}
              className="personnel-slot-wrapper absolute left-0 right-0 top-0 pb-8 sm:pb-12"
              style={{
                transform: `translate3d(0, ${slot.translateY}px, 0)`,
                height: `${itemHeight}px`,
                contain: 'content',
              }}
            >
              <EditorialProfileCard
                person={slot.person}
                compositionIndex={slot.logicalIndex}
                isInitialReveal={isInitialReveal}
                onQuickView={setModalPerson}
              />
            </div>
          ))}
        </div>
      )}

      {/* 
        ========================================================================
        SINGLE PERSON STATE (Clean single view when exactly 1 match)
        ========================================================================
      */}
      {totalCount === 1 && (
        <div className="w-full pb-8">
          <EditorialProfileCard
            person={filteredPeople[0]}
            compositionIndex={0}
            isInitialReveal={isInitialReveal}
            onQuickView={setModalPerson}
          />
        </div>
      )}

      {/* 
        ========================================================================
        EMPTY SEARCH STATE (No infinite loop when 0 results)
        ========================================================================
      */}
      {totalCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm p-6"
        >
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mx-auto">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Tidak Ada Personel yang Sesuai
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? `Tidak ditemukan personel dengan kata kunci "${searchQuery}". Coba gunakan nama lain, bidang pengajaran, atau jabatan.`
                : 'Belum ada data personel yang ditambahkan pada kategori ini.'}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
              >
                Hapus Kata Kunci
              </button>
            )}
            {activeCategory !== 'semua' && (
              <button
                onClick={() => onCategoryChange('semua')}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all"
              >
                Tampilkan Semua Personel
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Quick View Personnel Profile Modal */}
      <PersonnelProfileModal
        person={modalPerson}
        isOpen={!!modalPerson}
        onClose={() => setModalPerson(null)}
      />
    </div>
  );
}
