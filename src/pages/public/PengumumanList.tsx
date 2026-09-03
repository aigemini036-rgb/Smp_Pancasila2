import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getAnnouncements } from '../../utils/storage';
import { Announcement } from '../../types';
import { Bell, Calendar, ArrowRight } from 'lucide-react';

export default function PengumumanList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setAnnouncements(getAnnouncements().filter((a) => a.status === 'active'));
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-3 relative"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider">
          <Bell className="w-3.5 h-3.5" />
          Pemberitahuan Resmi
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Pengumuman Sekolah
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Informasi edaran resmi, jadwal akademis, kegiatan siswa, dan petunjuk PPDB SMP Pancasila Ponokawan.
        </p>
      </motion.div>

      {/* List - Official Notice Sheets */}
      <div className="space-y-4">
        {announcements.map((item, index) => (
          <motion.div
            key={item.id}
            initial={
              reducedMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                    rotateZ: index % 2 === 0 ? -0.6 : 0.6,
                    scale: 0.98,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              rotateZ: 0,
              scale: 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 130,
              damping: 16,
              delay: reducedMotion ? 0 : index * 0.08,
            }}
            whileHover={
              reducedMotion
                ? undefined
                : {
                    y: -3,
                    transition: { duration: 0.2 },
                  }
            }
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-yellow-500 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-600 dark:text-yellow-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Mulai: {item.start_date}</span>
                {item.end_date && <span>• Berakhir: {item.end_date}</span>}
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-snug group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                {item.content}
              </p>
            </div>

            <Link
              to={`/pengumuman/${item.slug}`}
              className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Detail Info</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
