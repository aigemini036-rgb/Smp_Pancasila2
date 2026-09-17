import { useState, useEffect } from 'react';
import { getAchievements } from '../../utils/storage';
import { Achievement } from '../../types';
import { Trophy, Award, Calendar } from 'lucide-react';
import AchievementCardStack from '../../components/public/AchievementCardStack';

export default function PrestasiList() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<'semua' | 'sekolah' | 'individu'>('semua');

  useEffect(() => {
    setAchievements(getAchievements().filter((a) => a.status === 'published'));
  }, []);

  const filtered = achievements.filter((a) =>
    activeTab === 'semua' ? true : a.level === activeTab
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" />
          <span>Kebanggaan Sekolah</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Prestasi & Penghargaan
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Daftar capaian kejuaraan akademik, kebudayaan, olahraga, dan inovasi teknologi SMP Pancasila Ponokawan Krian Sidoarjo.
        </p>
      </div>

      {/* 
        ========================================================================
        18. ACHIEVEMENT CARD STACK (Sorotan Prestasi Utama - Layered Stack)
        ========================================================================
      */}
      {achievements.length > 0 && (
        <AchievementCardStack
          achievements={achievements}
          title="Sorotan Prestasi Utama"
          subtitle="Tumpukan Prestasi Pilihan"
          autoTransitionToGrid={false}
        />
      )}

      {/* Arsip Lengkap Divider */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-6">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Katalog Lengkap Prestasi Sekolah
          </span>
        </div>

        {/* Tabs */}
        <div className="flex justify-center items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('semua')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'semua'
              ? 'bg-yellow-500 text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Semua Prestasi ({achievements.length})
        </button>
        <button
          onClick={() => setActiveTab('sekolah')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'sekolah'
              ? 'bg-yellow-500 text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Tingkat Sekolah
        </button>
        <button
          onClick={() => setActiveTab('individu')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'individu'
              ? 'bg-yellow-500 text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Individu Siswa / Guru
        </button>
      </div>

      {/* Achievements Grid (22. ACHIEVEMENT CARD HOVER - UI pre-ACS) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-yellow-500/50 dark:hover:border-yellow-500/50 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 hover:-translate-y-1.5 hover:scale-[1.012] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between h-full cursor-pointer"
          >
            <div>
              <div className="aspect-video relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img
                  src={item.documentation}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-yellow-500 text-slate-900 group-hover:bg-yellow-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase transition-colors shadow-xs">
                  {item.category}
                </span>
                <span className="absolute top-3 right-3 bg-slate-900/80 group-hover:bg-slate-900 backdrop-blur-sm text-white group-hover:text-yellow-300 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase transition-colors border border-transparent group-hover:border-yellow-500/30">
                  Level {item.level}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-500 font-semibold">
                  <Calendar className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Tahun {item.year}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 text-lg leading-snug transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {item.recipient_name && (
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 transition-colors group-hover:bg-yellow-500/5">
                <Award className="w-4 h-4 text-yellow-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Penerima: <strong className="text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">{item.recipient_name}</strong></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}
