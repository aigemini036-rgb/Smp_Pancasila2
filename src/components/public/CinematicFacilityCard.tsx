import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Facility } from '../../types';

interface CinematicFacilityCardProps {
  facility: Facility;
  index: number;
  key?: React.Key;
}

export default function CinematicFacilityCard({ facility, index }: CinematicFacilityCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  const imageSrc =
    facility.image ||
    facility.photo ||
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';
  const condition = facility.condition || 'Sangat Baik';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.08, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-yellow-500/50 transition-all duration-300 flex flex-col justify-between group"
    >
      <div>
        {/* 
          ========================================================================
          34. FACILITY IMAGE REVEAL & 35. FACILITY IMAGE HOVER
          Subtle entrance reveal, 101-103% scale on hover, subtle overlay,
          small text & arrow movement, subtle shadow change. No dramatic zoom.
          ========================================================================
        */}
        <div className="aspect-video relative overflow-hidden bg-slate-900">
          <motion.img
            src={imageSrc}
            alt={facility.name}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
          />
          <span className="absolute top-3 left-3 bg-yellow-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md z-10">
            Kondisi: {condition}
          </span>
          <div className="absolute inset-0 bg-slate-950/15 group-hover:bg-slate-950/25 transition-colors duration-300 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-yellow-600 dark:group-hover:text-yellow-400 group-hover:translate-x-0.5 transition-all duration-300 leading-snug">
              {facility.name}
            </h3>
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-400 group-hover:text-yellow-500 group-hover:bg-yellow-500/10 flex items-center justify-center shrink-0 transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            {facility.description}
          </p>
        </div>
      </div>

      {(facility.specifications || facility.location) && (
        <div className="p-6 pt-0">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block text-[11px] uppercase tracking-wider">
              {facility.specifications ? 'Spesifikasi & Kapasitas:' : 'Lokasi:'}
            </span>
            <p className="leading-relaxed">{facility.specifications || facility.location}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
