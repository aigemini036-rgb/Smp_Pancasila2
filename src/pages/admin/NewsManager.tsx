import React, { useState, useEffect } from 'react';
import { getNews, saveNews, NewsItem } from '../../utils/storage';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function NewsManager() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Akademik',
    date: '',
    image: '',
    desc: '',
  });

  useEffect(() => {
    setNewsList(getNews());
  }, []);

  const handleOpenModal = (item?: NewsItem) => {
    if (item) {
      const anyItem = item as any;
      setEditingId(item.id);
      setFormData({
        title: item.title,
        category: item.category,
        date: anyItem.date || anyItem.published_at || '',
        image: anyItem.image || anyItem.thumbnail || '',
        desc: anyItem.desc || anyItem.content?.slice(0, 120) || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        category: 'Akademik',
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        image: '',
        desc: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList;
    if (editingId) {
      updatedList = newsList.map((item) =>
        item.id === editingId ? { ...item, ...formData, thumbnail: formData.image } : item
      );
    } else {
      const newItem: any = {
        id: `news-${Date.now()}`,
        ...formData,
        thumbnail: formData.image,
        content: formData.desc,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: 'published',
        published_at: new Date().toISOString().split('T')[0],
      };
      updatedList = [newItem, ...newsList];
    }
    setNewsList(updatedList);
    saveNews(updatedList as any);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      const updatedList = newsList.filter((item) => item.id !== id);
      setNewsList(updatedList);
      saveNews(updatedList as any);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Kelola Berita</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Tambahkan, ubah, atau hapus berita dan pengumuman sekolah.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Berita
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Judul</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Kategori</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white">Tanggal</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {newsList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Belum ada berita.
                  </td>
                </tr>
              ) : (
                newsList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image || item.thumbnail || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=400&q=80'}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <span className="font-medium text-slate-900 dark:text-white max-w-[200px] md:max-w-md truncate">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-semibold">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">
                      {item.date || item.published_at}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseModal}
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingId ? 'Ubah Berita' : 'Tambah Berita'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <form id="news-form" onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Judul Berita *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500 text-xs"
                      placeholder="Masukkan judul berita..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Kategori *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500 text-xs"
                      >
                        <option value="Akademik">Akademik</option>
                        <option value="Prestasi">Prestasi</option>
                        <option value="Kegiatan">Kegiatan</option>
                        <option value="Pengumuman">Pengumuman</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Tanggal Terbit
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500 text-xs"
                        placeholder="Contoh: 15 Okt 2026"
                      />
                    </div>
                  </div>

                  <div>
                    <ImageUpload
                      label="Upload Sampul Gambar Berita"
                      helperText="Pilih atau tarik file foto sampul berita (Format JPG, PNG, WEBP, Maks 5MB)."
                      value={formData.image}
                      onChange={(dataUrl) => setFormData({ ...formData, image: dataUrl })}
                      aspectRatio="video"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Deskripsi / Isi Berita *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.desc}
                      onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500 text-xs"
                      placeholder="Tulis ringkasan atau isi berita lengkap..."
                    ></textarea>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="news-form"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-sm transition-colors"
                >
                  Simpan Berita
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
