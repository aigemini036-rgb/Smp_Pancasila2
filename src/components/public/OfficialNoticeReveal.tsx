import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { Bell, Calendar, ArrowRight, FileText, Pin } from 'lucide-react';
import { Announcement } from '../../types';
import AnnouncementTransition from './AnnouncementTransition';

interface OfficialNoticeRevealProps {
  announcements: Announcement[];
  showAllLink?: boolean;
  containerClassName?: string;
}

export default function OfficialNoticeReveal({
  announcements,
  showAllLink = true,
  containerClassName = '',
}: OfficialNoticeRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-40px 0px' });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  if (!announcements || announcements.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName}`}
    >
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-yellow-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                Papan Informasi
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Pengumuman Resmi Sekolah
              </h2>
            </div>
          </div>

          {showAllLink && (
            <Link
              to="/pengumuman"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-yellow-400 hover:text-yellow-600 transition-colors uppercase tracking-wider"
            >
              <span>Lihat Semua Pengumuman</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* 
          ========================================================================
          17. ANNOUNCEMENT TRANSITION: Dynamic Spotlight Notice Card
          Smooth transition: CURRENT ANNOUNCEMENT -> TRANSITION -> NEW ANNOUNCEMENT
          Subtle crossfade + slight slide without layout shift or text flicker.
          ========================================================================
        */}
        <AnnouncementTransition
          announcements={announcements}
          variant="spotlight"
          autoPlayInterval={6500}
        />

        {/* Grid of All Current Notice Documents */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Daftar Edaran Resmi Terkini ({announcements.length})
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={!reducedMotion ? { opacity: 0, y: 15 } : false}
                animate={isInView || reducedMotion ? { opacity: 1, y: 0 } : false}
                transition={{
                  duration: 0.4,
                  delay: !reducedMotion ? idx * 0.08 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-white dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between hover:border-yellow-500/50 transition-colors group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 uppercase">
                      <Pin className="w-2.5 h-2.5" />
                      <span>Aktif {item.end_date ? `s.d ${item.end_date}` : ''}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.created_at?.slice(0, 10) || ''}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors line-clamp-2">
                    <Link to={`/pengumuman/${item.slug}`}>{item.title}</Link>
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2">
                    {item.content}
                  </p>
                </div>

                <Link
                  to={`/pengumuman/${item.slug}`}
                  className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 inline-flex items-center gap-1 text-xs font-bold text-yellow-700 dark:text-yellow-400 group-hover:underline"
                >
                  <span>Buka Dokumen</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
