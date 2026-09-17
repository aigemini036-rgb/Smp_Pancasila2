import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { getPeople } from '../../utils/storage';
import { Network, ArrowRight } from 'lucide-react';

export default function Struktur() {
  const shouldReduceMotion = useReducedMotion();
  const people = getPeople().filter((p) => p.published && p.status === 'active');
  const headmaster = people.find((p) => p.category === 'kepala_sekolah');
  const teachers = people.filter((p) => p.category === 'guru');
  const staff = people.filter((p) => p.category === 'staff');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider">
          <Network className="w-3.5 h-3.5" />
          Manajemen Sekolah
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Struktur Organisasi Sekolah
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Bagan tata kelola pimpinan, pimpinan kurikulum, pengajar, dan tata usaha di SMP Pancasila Ponokawan Krian Sidoarjo.
        </p>
      </div>

      {/* Organizational Structure Nodes */}
      <div className="space-y-10">
        {/* Headmaster Node */}
        {headmaster && (
          <div className="flex flex-col items-center">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-lg text-center max-w-sm w-full relative"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-500 text-slate-900 font-extrabold text-[10px] rounded-full uppercase">
                Pimpinan Utama
              </span>
              <div className="relative mx-auto mb-3 w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-500 shadow-md group/head hover:border-yellow-400 hover:ring-2 hover:ring-yellow-500/30 transition-all duration-300">
                <img
                  src={headmaster.photo}
                  alt={headmaster.name}
                  className="w-full h-full object-cover transition-all duration-300 ease-out group-hover/head:scale-[1.025] group-hover/head:-translate-y-0.5"
                />
              </div>
              <h3 className="font-extrabold text-base text-white">{headmaster.name}</h3>
              <p className="text-xs text-yellow-400 font-semibold">{headmaster.position}</p>
              <p className="text-[11px] text-slate-400 mt-1">{headmaster.education}</p>
              <Link
                to={`/personel/${headmaster.slug || headmaster.id}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-yellow-400 hover:underline mt-3"
              >
                <span>Lihat Profil Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
            {/* Vertical connector line */}
            <div className="w-0.5 h-10 bg-slate-300 dark:bg-slate-700"></div>
          </div>
        )}

        {/* Teachers Level */}
        <div>
          <h3 className="text-center text-sm font-bold uppercase text-slate-500 tracking-wider mb-6">
            Dewan Guru & Tenaga Pendidik
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teachers.map((item, index) => (
              <motion.div
                key={item.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.25),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:border-yellow-500 transition-colors group"
              >
                <div className="relative shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 group-hover:border-yellow-500/40 group-hover:ring-1 group-hover:ring-yellow-500/20 shadow-xs group-hover:shadow-md transition-all duration-300">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-16 h-16 object-cover transition-all duration-300 ease-out group-hover:scale-[1.025] group-hover:-translate-y-0.5"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-yellow-600 dark:text-yellow-500 font-semibold truncate">
                    {item.position}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.subject || item.education}
                  </p>
                  <Link
                    to={`/personel/${item.slug || item.id}`}
                    className="text-[11px] font-bold text-slate-900 dark:text-white hover:underline block mt-1"
                  >
                    Detail Profil →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Staff Level */}
        <div>
          <h3 className="text-center text-sm font-bold uppercase text-slate-500 tracking-wider mb-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            Tata Usaha & Layanan Pendukung
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {staff.map((item, index) => (
              <motion.div
                key={item.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.25),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:border-yellow-500 transition-colors group"
              >
                <div className="relative shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 group-hover:border-yellow-500/40 group-hover:ring-1 group-hover:ring-yellow-500/20 shadow-xs group-hover:shadow-md transition-all duration-300">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-16 h-16 object-cover transition-all duration-300 ease-out group-hover:scale-[1.025] group-hover:-translate-y-0.5"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-yellow-600 dark:text-yellow-500 font-semibold truncate">
                    {item.position}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.education}
                  </p>
                  <Link
                    to={`/personel/${item.slug || item.id}`}
                    className="text-[11px] font-bold text-slate-900 dark:text-white hover:underline block mt-1"
                  >
                    Detail Profil →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
