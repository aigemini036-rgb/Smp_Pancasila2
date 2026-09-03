import React, { useState, useEffect } from 'react';
import { getNewsList, saveNews, deleteNews } from '../../utils/storage';
import { News } from '../../types';
import { Newspaper, Plus, Edit2, Trash2, Check, X, Search, Calendar } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import { usePermission, Permission } from '../../utils/permissions';

export default function BeritaManager() {
  const { can } = usePermission();
  const [news, setNews] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<News> | null>(null);

  useEffect(() => {
    setNews(getNewsList());
  }, []);

  const handleOpenAdd = () => {
    setEditingArticle({
      title: '',
      content: '',
      category: 'Kegiatan',
      thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      published_at: new Date().toISOString().split('T')[0],
      author_name: 'Humas SMP Pancasila',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: News) => {
    setEditingArticle({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus artikel berita "${title}"?`)) {
      deleteNews(id);
      setNews(getNewsList());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title || !editingArticle?.content) return;

    const slug =
      editingArticle.slug ||
      editingArticle.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const articleToSave: News = {
      id: editingArticle.id || `news-${Date.now()}`,
      title: editingArticle.title,
      content: editingArticle.content,
      category: editingArticle.category || 'Kegiatan',
      thumbnail: editingArticle.thumbnail || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
      published_at: editingArticle.published_at || new Date().toISOString().split('T')[0],
      author_name: editingArticle.author_name || 'Humas SMP Pancasila',
      author_id: editingArticle.author_id || 'admin-1',
      status: editingArticle.status || 'published',
      slug,
      created_at: editingArticle.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveNews(articleToSave);
    setNews(getNewsList());
    setIsModalOpen(false);
    setEditingArticle(null);
  };

  const filtered = news.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-yellow-500" />
            <span>Manajemen Berita & Artikel</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola publikasi warta kegiatan, prestasi, dan kabar seputar sekolah.
          </p>
        </div>

        {can(Permission.CREATE_NEWS) && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-yellow-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Berita Baru</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul berita atau kategori..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Thumbnail & Judul</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Tanggal Terbit</th>
                <th className="p-4">Penulis</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-4 flex items-center gap-3 max-w-xs">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.content}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 font-bold uppercase text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-yellow-500" />
                      {item.published_at}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{item.author_name}</td>
                  <td className="p-4">
                    {item.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 dark:text-green-400">
                        <Check className="w-3.5 h-3.5" />
                        Terbit
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {can(Permission.EDIT_NEWS) && (
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-yellow-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Edit Berita"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {can(Permission.DELETE_NEWS) && (
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Hapus Berita"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {editingArticle.id ? 'Edit Berita / Artikel' : 'Tulis Berita Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Berita Utama *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="Judul artikel berita..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Berita *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.category || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    placeholder="Kegiatan / Prestasi / Akademik"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Penulis / Redaksi *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArticle.author_name || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author_name: e.target.value })}
                    placeholder="Humas SMP Pancasila"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  label="Upload Sampul / Thumbnail Berita"
                  helperText="Format JPG, PNG, WEBP. Drag & drop atau klik untuk memilih gambar sampul berita (Rasio 16:9 disarankan)."
                  value={editingArticle.thumbnail || ''}
                  onChange={(dataUrl) => setEditingArticle({ ...editingArticle, thumbnail: dataUrl })}
                  aspectRatio="video"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Isi Konten Berita Lengkap *
                </label>
                <textarea
                  rows={6}
                  required
                  value={editingArticle.content || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  placeholder="Tuliskan berita lengkap di sini..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                ></textarea>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Terbit *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingArticle.published_at || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, published_at: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status Publikasi *
                  </label>
                  <select
                    value={editingArticle.status || 'published'}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        status: e.target.value as 'draft' | 'published',
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="published">Terbit Publik</option>
                    <option value="draft">Draft Draf Internal</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold"
                >
                  Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
