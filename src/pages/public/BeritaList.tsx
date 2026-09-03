import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNewsList } from '../../utils/storage';
import { News } from '../../types';
import { Newspaper, Search, Calendar, ArrowRight } from 'lucide-react';

export default function BeritaList() {
  const [news, setNews] = useState<News[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setNews(getNewsList().filter((n) => n.status === 'published'));
  }, []);

  const categories = ['semua', ...Array.from(new Set(news.map((n) => n.category)))];

  const filtered = news.filter((item) => {
    const matchesCat =
      selectedCategory === 'semua' ? true : item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-bold uppercase tracking-wider">
          <Newspaper className="w-3.5 h-3.5" />
          Kabar & Informasi
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Berita & Artikel Sekolah
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Informasi seputar kegiatan belajar mengajar, prestasi murid, ekstrakurikuler, dan agenda SMP Pancasila Ponokawan.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-yellow-500 text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      {/* News Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video relative overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img
                    src={item.thumbnail || 'https://picsum.photos/seed/pancasila-news/800/600'}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-yellow-500 text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500" />
                      <span>{item.published_at?.slice(0, 10) || 'Terbaru'}</span>
                    </span>
                    {item.author_name && (
                      <>
                        <span>•</span>
                        <span>{item.author_name}</span>
                      </>
                    )}
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0">
                <Link
                  to={`/berita/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <Newspaper className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Tidak ada berita yang ditemukan
          </h3>
          <p className="text-xs text-slate-500">
            Coba kata kunci pencarian lain atau pilih kategori lain.
          </p>
        </div>
      )}
    </div>
  );
}
