import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Compass, Target, CheckCircle2 } from 'lucide-react';

interface PaperDocumentRevealProps {
  vision: string;
  missionLines: string[];
}

export default function PaperDocumentReveal({ vision, missionLines }: PaperDocumentRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-50px' });

  return (
    <div ref={containerRef} className="space-y-10">
      {/* Visi Document Sheet */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 6 }}
        animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 30, rotateX: 6 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-4 relative overflow-hidden"
      >
        {/* Subtle decorative watermark */}
        <div className="absolute right-4 -bottom-6 text-slate-800/40 pointer-events-none select-none font-black text-9xl">
          VISI
        </div>

        <div className="flex items-center gap-3 text-yellow-500 relative z-10">
          <Compass className="w-8 h-8" />
          <h2 className="text-2xl font-extrabold text-white">Visi Sekolah</h2>
        </div>
        <p className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed pl-4 border-l-4 border-yellow-500 italic relative z-10">
          "{vision}"
        </p>
      </motion.div>

      {/* Misi Document Sheet with Staggered List */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 6 }}
        animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 30, rotateX: 6 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 relative overflow-hidden"
      >
        <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-500">
          <Target className="w-8 h-8" />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Misi Sekolah</h2>
        </div>

        <div className="space-y-4">
          {missionLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              transition={{
                duration: 0.5,
                delay: 0.35 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-yellow-500/30 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-slate-700 dark:text-slate-300 font-medium text-sm sm:text-base leading-relaxed">
                {line.replace(/^\d+\.\s*/, '')}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
