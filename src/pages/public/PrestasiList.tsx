import { useState, useEffect } from 'react';
import { getAchievements } from '../../utils/storage';
import { Achievement } from '../../types';
import { Trophy, Award, Calendar } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
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

      {/* Tabs */}
      <div className="flex justify-center items-center gap-2">
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

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full"
          >
            <div>
              <div className="aspect-video relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img
                  src={item.documentation}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-yellow-500 text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                  {item.category}
                </span>
                <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                  Level {item.level}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-500 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Tahun {item.year}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-snug">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {item.recipient_name && (
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500 shrink-0" />
                <span>Penerima: <strong className="text-slate-900 dark:text-white">{item.recipient_name}</strong></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
