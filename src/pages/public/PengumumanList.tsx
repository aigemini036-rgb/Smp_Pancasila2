import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getAnnouncements } from '../../utils/storage';
import { Announcement } from '../../types';
import { Bell, Calendar, ArrowRight, Filter } from 'lucide-react';
import AnnouncementTransition from '../../components/public/AnnouncementTransition';

export default function PengumumanList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setAnnouncements(getAnnouncements().filter((a) => a.status === 'active'));
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const categories = ['Semua', 'PPDB', 'Akademik', 'Agenda'];

  const filteredAnnouncements = announcements.filter((item) => {
    if (activeCategory === 'Semua') return true;
    if (activeCategory === 'PPDB') {
      return item.title.toLowerCase().includes('ppdb') || item.content.toLowerCase().includes('ppdb');
    }
    if (activeCategory === 'Akademik') {
      return (
        item.title.toLowerCase().includes('asesmen') ||
        item.title.toLowerCase().includes('asts') ||
        item.title.toLowerCase().includes('ujian')
      );
    }
    if (activeCategory === 'Agenda') {
      return (
        item.title.toLowerCase().includes('ramadhan') ||
        item.title.toLowerCase().includes('kegiatan') ||
        item.title.toLowerCase().includes('libur')
      );
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-3 relative"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider">
          <Bell className="w-3.5 h-3.5" />
          Pemberitahuan Resmi
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Pengumuman Sekolah
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Informasi edaran resmi, jadwal akademis, kegiatan siswa, dan petunjuk PPDB SMP Pancasila Ponokawan.
        </p>
      </motion.div>

      {/* 
        ========================================================================
        17. ANNOUNCEMENT TRANSITION: Featured Announcement Spotlight
        ========================================================================
      */}
      {announcements.length > 0 && (
        <AnnouncementTransition
          announcements={announcements}
          variant="spotlight"
          autoPlayInterval={7000}
        />
      )}

      {/* Category Filter Tabs with Smooth Transition */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <span>Kategori:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-yellow-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 
        ========================================================================
        Announcement List Transition on Category Change (Subtle Crossfade)
        ========================================================================
      */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
              Tidak ada pengumuman dalam kategori ini.
            </div>
          ) : (
            filteredAnnouncements.map((item, index) => (
              <motion.div
                key={item.id}
                initial={
                  reducedMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 12,
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: reducedMotion ? 0 : index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                        y: -2,
                        transition: { duration: 0.2 },
                      }
                }
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-yellow-500 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-yellow-600 dark:text-yellow-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Mulai: {item.start_date}</span>
                    {item.end_date && <span>• Berakhir: {item.end_date}</span>}
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-snug group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                <Link
                  to={`/pengumuman/${item.slug}`}
                  className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Detail Info</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
