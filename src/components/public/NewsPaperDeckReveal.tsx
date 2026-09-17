import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { Calendar, ArrowRight, Newspaper, Clock } from 'lucide-react';
import { News } from '../../types';
import NewsImageReveal from './NewsImageReveal';

interface NewsPaperDeckRevealProps {
  newsList: News[];
}

/**
 * NewsPaperDeckReveal
 * 
 * Implements:
 * 11. NEWS NEWSPAPER OPENING EFFECT:
 * - Editorial masthead unfold with dateline and classical double rule
 * - Controlled broadsheet opening
 * 
 * 12. NEWS STACKED CARD REVEAL:
 * - Kondisi awal: CARD A, CARD B, CARD C, CARD D berada dalam layered/stacked arrangement.
 * - Flow: STACK -> CARDS SEPARATE -> CARDS MOVE INTO FINAL POSITIONS -> SETTLE
 * - Movement halus & terkontrol (cubic-bezier [0.16, 1, 0.3, 1], strictly NO bounce,
 *   NO spring-heavy, NO jelly, NO rubber, NO excessive 3D).
 * - Setelah selesai: card tetap berada pada posisi final, transform dinetralkan (none),
 *   dan TIDAK ADA continuous floating animation.
 * - Aksesibilitas: supports prefers-reduced-motion.
 * 
 * 13. NEWS CARD STAGGER:
 * - Card berita tidak muncul semuanya secara bersamaan (stagger reveal).
 * - Urutan sekuensial terarah:
 *   CARD 1 (index 0, delay 0ms)
 *   ↓
 *   CARD 2 (index 1, delay 75ms)
 *   ↓
 *   CARD 3 (index 2, delay 150ms)
 *   ↓
 *   CARD 4 (index 3, delay 225ms)
 * - Delay antar-card kecil (75ms): memberikan sense of sequence yang natural.
 * - Delay tidak berlebihan agar user tidak perlu menunggu lama untuk membaca berita.
 * - Menjadi subtle tactile enhancement, bukan obstacle interaksi.
 * 
 * 14. NEWS CARD HOVER:
 * - Interaksi hover halus, responsif, dan tenang (calm & tactile).
 * - Image scale sangat kecil: ~2.5% (scale-[1.025], strictly within 1-3%).
 * - Card sedikit terangkat: movement kecil 4px (y: -4).
 * - Arrow bergerak sedikit: 6px ke kanan (translate-x-1.5).
 * - Accent berubah halus: teks judul & link highlight amber/gold, border ke yellow-500/40.
 * - Shadow berubah sedikit: transisi shadow-sm ke shadow-md lembut tanpa glow berlebihan.
 * - Strictly NO flip card, NO rotate ekstrem, NO glow berlebihan, NO bounce, NO card terbang jauh.
 * 
 * 15. NEWS IMAGE REVEAL:
 * - Ketika News content pertama kali masuk viewport, image memiliki reveal effect yang halus.
 * - Alur konseptual:
 *   IMAGE HIDDEN (clipPath inset curtain, opacity 0, slight scale 1.05)
 *   ↓
 *   IMAGE REVEAL (curtain unmasks to inset(0), opacity fades to 1, scale settles to 1.0)
 *   ↓
 *   IMAGE STABLE (kondisi normal & stabil, tidak ada animasi terus menerus)
 * - Setelah reveal selesai: image tetap normal dan tidak terus bergerak.
 */
export default function NewsPaperDeckReveal({ newsList }: NewsPaperDeckRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const inView = useInView(containerRef, { once: true, margin: '-60px' });
  const [reducedMotion, setReducedMotion] = useState(false);

  // Stacked reveal lifecycle stages:
  // 'initial' -> 'stacked' -> 'separating' -> 'settled'
  const [stage, setStage] = useState<'initial' | 'stacked' | 'separating' | 'settled'>('initial');
  const [stackOffsets, setStackOffsets] = useState<{ x: number; y: number }[]>([]);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) {
      setStage('settled');
    }
    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) setStage('settled');
    };
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  // Compute exact pixel offsets to stack all cards neatly at the center of the grid
  useEffect(() => {
    const computeOffsets = () => {
      if (!gridRef.current) return;
      const gridRect = gridRef.current.getBoundingClientRect();
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length === 0) return;

      const firstCard = cards[0];
      const cardWidth = firstCard.offsetWidth;

      // Target center of the grid
      const centerX = (gridRect.width - cardWidth) / 2;
      const centerY = 0;

      const offsets = cards.map((card, i) => {
        const curLeft = card.offsetLeft;
        const curTop = card.offsetTop;
        return {
          x: centerX - curLeft,
          // Subtle vertical cascade in the stack (8px per card layer)
          y: centerY - curTop + i * 8,
        };
      });

      setStackOffsets(offsets);
    };

    computeOffsets();
    window.addEventListener('resize', computeOffsets);
    return () => window.removeEventListener('resize', computeOffsets);
  }, [newsList]);

  // Orchestrate STACK -> CARDS SEPARATE -> CARDS MOVE INTO FINAL POSITIONS -> SETTLE
  useEffect(() => {
    if (!inView || reducedMotion) return;

    // 1. Initial Stack appearance
    setStage('stacked');

    // 2. STACK pause, then CARDS SEPARATE and glide into final grid slots
    const separateTimer = setTimeout(() => {
      setStage('separating');
    }, 320);

    // 3. SETTLE: transition finishes, transforms normalized, crisp final state
    const settleTimer = setTimeout(() => {
      setStage('settled');
    }, 1250);

    return () => {
      clearTimeout(separateTimer);
      clearTimeout(settleTimer);
    };
  }, [inView, reducedMotion]);

  // Show up to 4 featured news items
  const displayNews = newsList.slice(0, 4);

  // Format dateline for editorial newspaper header
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // Subtle aesthetic paper stack parameters (clean physical broadsheet feel)
  const stackRotations = [-1.8, 1.4, -1.0, 1.8];
  const stackScales = [1.0, 0.97, 0.94, 0.91];
  const stackZIndexes = [40, 30, 20, 10];

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 
        ========================================================================
        11. NEWSPAPER BROADSHEET MASTHEAD
        Unfolds gently from top crease with classical editorial double rule
        ========================================================================
      */}
      <div style={{ perspective: reducedMotion ? 'none' : '1200px' }}>
        <motion.div
          initial={
            !reducedMotion
              ? {
                  opacity: 0,
                  rotateX: -12,
                  y: -14,
                  scale: 0.98,
                  transformOrigin: 'top center',
                }
              : { opacity: 1, rotateX: 0, y: 0, scale: 1 }
          }
          animate={
            inView
              ? {
                  opacity: 1,
                  rotateX: 0,
                  y: 0,
                  scale: 1,
                }
              : !reducedMotion
              ? {
                  opacity: 0,
                  rotateX: -12,
                  y: -14,
                  scale: 0.98,
                }
              : {}
          }
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-8"
        >
          {/* Editorial Dateline & Masthead Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-yellow-600 dark:text-yellow-400">
                WARTA PANCASILA
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Kanal Berita & Agenda Resmi</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{todayFormatted}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Edisi Terkini
              </span>
            </div>
          </div>

          {/* Masthead Main Header with Classic Double Border */}
          <div className="py-4 border-b-2 border-double border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Newspaper className="w-3.5 h-3.5" />
                <span>Publikasi & Liputan Kegiatan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Berita & Warta Sekolah
              </h2>
            </div>

            <Link
              to="/berita"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-700 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors uppercase tracking-wider group shrink-0"
            >
              <span>Buka Semua Liputan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 
        ========================================================================
        12. NEWS STACKED CARD REVEAL
        - Kondisi awal: CARD A, CARD B, CARD C, CARD D berada dalam layered/stacked arrangement.
        - Kemudian: STACK -> CARDS SEPARATE -> CARDS MOVE INTO FINAL POSITIONS -> SETTLE.
        - Movement halus & terkontrol (NO bounce, NO spring-heavy, NO jelly, NO rubber).
        - Setelah selesai: card tetap berada pada posisi final, TANPA continuous floating animation.
        ========================================================================
      */}
      <div className="relative py-1">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayNews.map((item, index) => {
            const isSettled = stage === 'settled';
            const isSeparating = stage === 'separating';

            // Stacked offset calculation for this card
            const offset = stackOffsets[index] || {
              // Fallback percentage before client measurement
              x: index === 0 ? 150 : index === 1 ? 50 : index === 2 ? -50 : -150,
              y: index * 8,
            };

            const initialX = offset.x;
            const initialY = offset.y;
            const initialRotate = stackRotations[index] || 0;
            const initialScale = stackScales[index] || 1;
            const zIndexVal = isSettled ? 1 : (stackZIndexes[index] || 1);

            return (
              <motion.div
                key={item.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                initial={
                  !reducedMotion
                    ? {
                        opacity: 0,
                        x: initialX,
                        y: initialY,
                        rotate: initialRotate,
                        scale: initialScale,
                      }
                    : {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 1,
                      }
                }
                animate={
                  reducedMotion || isSettled || isSeparating
                    ? {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 1,
                      }
                    : stage === 'stacked'
                    ? {
                        opacity: 1,
                        x: initialX,
                        y: initialY,
                        rotate: initialRotate,
                        scale: initialScale,
                      }
                    : {
                        opacity: 0,
                        x: initialX,
                        y: initialY,
                        rotate: initialRotate,
                        scale: initialScale,
                      }
                }
                transition={{
                  // Halus & terkontrol: cubic-bezier deceleration, no spring bounce, no jelly
                  // 13. NEWS CARD STAGGER: Urutan sekuensial CARD 1 -> CARD 2 -> CARD 3 -> CARD 4
                  // Delay antar-card kecil (75ms): memberikan sense of sequence yang jelas tanpa membuat user menunggu
                  duration: 0.75,
                  delay: reducedMotion ? 0 : index * 0.075,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={
                  isSettled && !reducedMotion
                    ? {
                        y: -4,
                        transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                      }
                    : undefined
                }
                style={{
                  zIndex: zIndexVal,
                }}
                className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 flex flex-col justify-between group ${
                  isSettled
                    ? 'hover:shadow-md hover:border-yellow-500/40 dark:hover:border-yellow-500/30'
                    : ''
                }`}
              >
                <div>
                  {/* 15. NEWS IMAGE REVEAL: Thumbnail with Masked Clip + Fade + Scale Reveal */}
                  <NewsImageReveal
                    src={item.thumbnail || 'https://picsum.photos/seed/pancasila-news/600/400'}
                    alt={item.title}
                    aspectRatio="aspect-[16/10]"
                    trigger={stage === 'separating' || stage === 'settled'}
                    delay={index * 0.075}
                  >
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                      <span className="bg-yellow-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase shadow-xs">
                        {item.category || 'Warta'}
                      </span>
                      {index === 0 && (
                        <span className="bg-slate-900/90 text-white text-[9.5px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider backdrop-blur-xs">
                          Headline
                        </span>
                      )}
                    </div>
                  </NewsImageReveal>

                  {/* Editorial Article Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <Calendar className="w-3 h-3 text-yellow-600 dark:text-yellow-500" />
                      <span>{item.published_at?.slice(0, 10) || 'Terbaru'}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-200">
                      {item.title}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>

                {/* Read More Action with subtle responsive arrow move */}
                <div className="px-4 pb-4 pt-0">
                  <Link
                    to={`/berita/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-600 dark:text-yellow-500 group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors duration-200"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


