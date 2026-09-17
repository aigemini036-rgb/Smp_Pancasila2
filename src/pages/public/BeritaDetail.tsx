import { useParams, Link } from 'react-router-dom';
import { getNewsList } from '../../utils/storage';
import { ArrowLeft, Calendar, User, Newspaper } from 'lucide-react';
import NewsImageReveal from '../../components/public/NewsImageReveal';

export default function BeritaDetail() {
  const { slug } = useParams<{ slug: string }>();
  const newsList = getNewsList();
  const article = newsList.find((n) => n.slug === slug || n.id === slug);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <Newspaper className="w-16 h-16 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Berita Tidak Ditemukan
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Artikel berita yang Anda cari mungkin telah dipindahkan atau dihapus.
        </p>
        <Link
          to="/berita"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 text-slate-900 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Berita</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Back Link */}
      <Link
        to="/berita"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-yellow-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Berita</span>
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        <span className="inline-block px-3 py-1 rounded-md bg-yellow-500 text-slate-900 text-xs font-bold uppercase tracking-wider">
          {article.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-yellow-500" />
            Diterbitkan: {article.published_at}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-yellow-500" />
            Penulis: {article.author_name}
          </span>
        </div>
      </div>

      {/* 15. NEWS IMAGE REVEAL: Article Featured Image */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
        <NewsImageReveal
          src={article.thumbnail}
          alt={article.title}
          aspectRatio="aspect-video"
        />
      </div>

      {/* Article Content Body */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base whitespace-pre-line space-y-4">
        {article.content}
      </div>
    </article>
  );
}
