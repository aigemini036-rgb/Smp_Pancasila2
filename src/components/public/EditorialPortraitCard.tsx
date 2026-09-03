import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import { Person } from '../../types';
import { Crown, GraduationCap, Briefcase, ArrowRight, BookOpen, Award } from 'lucide-react';

interface EditorialPortraitCardProps {
  person: Person;
  index: number;
  key?: React.Key;
}

export default function EditorialPortraitCard({ person, index }: EditorialPortraitCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const isHead = person.category === 'kepala_sekolah';
  const isTeacher = person.category === 'guru';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-yellow-500/50 transition-all p-5 flex flex-col justify-between group"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          {/* Portrait Container with Mask Opening & Zoom */}
          <div className="relative shrink-0 overflow-hidden rounded-2xl w-20 h-24 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <motion.img
              initial={{ scale: 1.15, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : { scale: 1.15, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + Math.min(index * 0.08, 0.4) }}
              src={person.photo}
              alt={person.name}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            />
            {isHead && (
              <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center shadow-md">
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
        <span className="text-[11px] text-slate-400 font-medium">Status Aktif</span>
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
