import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Person } from '../../types';
import { Crown, ArrowRight, BookOpen, Eye } from 'lucide-react';

interface EditorialPortraitCardProps {
  person: Person;
  index: number;
  onQuickView?: (person: Person) => void;
  key?: React.Key;
}

export default function EditorialPortraitCard({
  person,
  index,
  onQuickView,
}: EditorialPortraitCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -30px 0px' });
  const shouldReduceMotion = useReducedMotion();

  const isHead = person.category === 'kepala_sekolah';
  const isTeacher = person.category === 'guru';

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      animate={inView || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.35,
        delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.2),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-yellow-500/50 hover:-translate-y-0.5 transition-all duration-300 p-5 flex flex-col justify-between group"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          {/* Portrait Container with subtle image hover feedback (scale 1-3%, slight movement, subtle accent & shadow) */}
          <div
            onClick={onQuickView ? () => onQuickView(person) : undefined}
            className={`group/photo relative shrink-0 overflow-hidden rounded-2xl w-20 h-24 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-yellow-500/50 hover:ring-2 hover:ring-yellow-500/20 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${
              onQuickView ? 'cursor-pointer' : ''
            }`}
          >
            <img
              src={person.photo}
              alt={person.name}
              loading="lazy"
              className="w-full h-full object-cover transition-all duration-300 ease-out group-hover/photo:scale-[1.025] group-hover/photo:-translate-y-0.5"
            />
            {/* Subtle sheen highlight on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/[0.04] to-white/10 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 pointer-events-none" />
            {isHead && (
              <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center shadow-md z-10">
                <Crown className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <span
              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1.5 ${
                isHead
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                  : isTeacher
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {isHead ? 'Kepala Sekolah' : isTeacher ? 'Dewan Guru' : 'Staff TU'}
            </span>

            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
              {person.name}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
              {person.position}
            </p>

            {person.subject && (
              <p className="text-[11px] text-yellow-600 dark:text-yellow-400 font-semibold line-clamp-1 mt-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3 shrink-0" />
                <span>{person.subject}</span>
              </p>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-700/60 text-slate-600 dark:text-slate-400">
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Pendidikan</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{person.education || '-'}</span>
          </div>
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">NIP / NUPTK</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{person.nip_nuptk || '-'}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        {onQuickView ? (
          <button
            type="button"
            onClick={() => onQuickView(person)}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 flex items-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau</span>
          </button>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">Status Aktif</span>
        )}
        <Link
          to={`/personel/${person.slug || person.id}`}
          className="text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 flex items-center gap-1 transition-colors"
        >
          <span>Profil Lengkap</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
