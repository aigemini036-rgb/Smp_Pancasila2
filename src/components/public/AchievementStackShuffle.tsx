import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { Trophy, ArrowRight, Award } from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementStackShuffleProps {
  achievements: Achievement[];
}

/**
 * AchievementStackShuffle
 * 
 * Implements the layered card stack -> automatic shuffle/reposition -> settle sequence:
 * - Cards initially enter in a layered perspective stack
 * - When in view, cards shuffle and reposition smoothly into their clean grid slots
 * - Settles with solid stability (no bounce, no spring overshoot)
 * - Micro hover tactile feedback (gentle -translate-y-1, subtle border accent)
 */
export default function AchievementStackShuffle({ achievements }: AchievementStackShuffleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-50px' });

  // Display top 3 achievements
  const displayItems = achievements.slice(0, 3);

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Golden Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-slate-800/90 pb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              <span>Arsip Prestasi & Kejuaraan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Kebanggaan Civitas Akademika
            </h2>
          </div>

          <Link
            to="/prestasi"
            className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2 group"
          >
            <span>Lihat Semua Prestasi</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 
          STACK -> SHUFFLE -> SETTLE GRID
          Cards originate from layered stacked coordinates and reposition into the 3-column grid
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {displayItems.map((item, index) => {
            // Stack offset calculations
            const initialOffsetX = index === 0 ? -20 : index === 1 ? 0 : 20;
            const initialOffsetY = 30 + index * 6;
            const initialRotate = index === 0 ? -2 : index === 1 ? 0.5 : 2;

            return (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  x: initialOffsetX,
                  y: initialOffsetY,
                  rotate: initialRotate,
                  scale: 0.94,
                }}
                animate={
                  inView
                    ? {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 1,
                      }
                    : {
                        opacity: 0,
                        x: initialOffsetX,
                        y: initialOffsetY,
                        rotate: initialRotate,
                        scale: 0.94,
                      }
                }
                transition={{
                  duration: 0.8,
                  delay: 0.2 + index * 0.14,
                  ease: [0.16, 1, 0.3, 1], // Clean smooth settle, no spring
                }}
                className="bg-slate-900/90 backdrop-blur-xs rounded-2xl p-5 border border-slate-800 space-y-4 h-full flex flex-col justify-between hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/5 transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-800 relative">
                    <img
                      src={item.documentation}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-yellow-400 font-mono font-semibold">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Tahun {item.year}</span>
                    <span>•</span>
                    <span className="uppercase">{item.category}</span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-yellow-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Tingkat: {item.level || 'Kabupaten'}</span>
                  <span className="text-yellow-400/90 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Prestasi Sekolah →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
