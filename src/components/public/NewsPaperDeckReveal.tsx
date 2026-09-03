import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { News } from '../../types';

interface NewsPaperDeckRevealProps {
  newsList: News[];
}

/**
 * NewsPaperDeckReveal
 * 
 * Implements the Editorial Newspaper Opening & Card Stack-to-Grid effect:
 * - Newspaper unfold entrance when entering viewport
 * - Initial layered stack offset that smoothly separates into final positions
 * - Staggered entrance timing
 * - Subtle hover micro-interactions (1.02x image scale, gentle arrow shift)
 */
export default function NewsPaperDeckReveal({ newsList }: NewsPaperDeckRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-60px' });

  // Show up to 4 featured news items
  const displayNews = newsList.slice(0, 4);

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 
        NEWSPAPER EDITORIAL HEADER
        Opens with smooth clip-reveal and subtle downward fold
      */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Kabar Terkini & Informasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Warta & Agenda Sekolah
          </h2>
        </div>

        <Link
          to="/berita"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-700 dark:text-yellow-400 hover:text-yellow-600 transition-colors uppercase tracking-wider group"
        >
          <span>Lihat Semua Berita & Kegiatan</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* 
        STACK TO GRID SEPARATION
        Cards start in a compact layered stack offset and separate into grid
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayNews.map((item, index) => {
          // Pre-separation stacked offsets
          const stackOffsetY = 24 + index * 8;
          const stackRotate = index === 0 ? -1.5 : index === 1 ? 1 : index === 2 ? -1 : 1.5;

          return (
            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                y: stackOffsetY,
                rotate: stackRotate,
                scale: 0.96,
              }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                    }
                  : {
                      opacity: 0,
                      y: stackOffsetY,
                      rotate: stackRotate,
                      scale: 0.96,
                    }
              }
              transition={{
                duration: 0.75,
                delay: 0.15 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-yellow-500/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Reveal Container */}
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700 relative">
                  <motion.img
                    src={item.thumbnail || 'https://picsum.photos/seed/pancasila-news/600/400'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-yellow-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase shadow-xs">
                    {item.category || 'Warta'}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <Calendar className="w-3 h-3 text-yellow-600 dark:text-yellow-500" />
                    <span>{item.published_at?.slice(0, 10) || 'Terbaru'}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-0">
                <Link
                  to={`/berita/${item.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 transition-colors group/link"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
