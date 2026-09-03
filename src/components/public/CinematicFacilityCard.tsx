import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Facility } from '../../types';

interface CinematicFacilityCardProps {
  facility: Facility;
  index: number;
  key?: React.Key;
}

export default function CinematicFacilityCard({ facility, index }: CinematicFacilityCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  // 3 cinematic camera motion variations
  const motionType = index % 3;
  const imageSrc = facility.image || facility.photo || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80';
  const condition = facility.condition || 'Sangat Baik';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.65,
        delay: (index % 3) * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-yellow-500/50 transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Cinematic Aspect-Video Container */}
        <div className="aspect-video relative overflow-hidden bg-slate-900">
          <motion.img
            src={imageSrc}
            alt={facility.name}
            initial={{
              scale: motionType === 0 ? 1.08 : motionType === 1 ? 1 : 1.12,
              x: motionType === 1 ? '-2%' : '0%',
            }}
            animate={
              inView
                ? {
                    scale: motionType === 0 ? 1 : motionType === 1 ? 1.08 : 1.03,
                    x: motionType === 1 ? '2%' : '0%',
                  }
                : {}
            }
            transition={{
              duration: 12,
              ease: 'linear',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <span className="absolute top-3 left-3 bg-yellow-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
            Kondisi: {condition}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="p-6 space-y-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
            {facility.name}
          </h3>
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
