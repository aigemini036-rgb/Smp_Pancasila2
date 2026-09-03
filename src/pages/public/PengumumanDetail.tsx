import { useParams, Link } from 'react-router-dom';
import { getAnnouncements } from '../../utils/storage';
import { ArrowLeft, Calendar, Bell, FileText, Download } from 'lucide-react';

export default function PengumumanDetail() {
  const { slug } = useParams<{ slug: string }>();
  const announcements = getAnnouncements();
  const item = announcements.find((a) => a.slug === slug || a.id === slug);

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <Bell className="w-16 h-16 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Pengumuman Tidak Ditemukan
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Informasi pengumuman yang Anda cari mungkin telah kedaluwarsa atau dihapus.
        </p>
        <Link
          to="/pengumuman"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 text-slate-900 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pengumuman</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
      <Link
        to="/pengumuman"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-yellow-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Pengumuman</span>
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 rounded-md bg-yellow-500 text-slate-900 text-xs font-bold uppercase tracking-wider">
            Pengumuman Aktif
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {item.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-yellow-500" />
              Mulai Berlaku: {item.start_date}
            </span>
            {item.end_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-yellow-500" />
                Berakhir: {item.end_date}
              </span>
            )}
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base whitespace-pre-line border-t border-slate-100 dark:border-slate-700 pt-6">
          {item.content}
        </div>

        {item.attachment_url && (
          <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Dokumen Lampiran Resmi</p>
                <p className="text-[11px] text-slate-500">Silakan unduh atau buka berkas lampiran ini</p>
              </div>
            </div>
            <a
              href={item.attachment_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Berkas</span>
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
