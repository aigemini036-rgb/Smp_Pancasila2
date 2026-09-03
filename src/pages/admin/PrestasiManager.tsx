import React, { useState, useEffect } from 'react';
import { getAchievements, saveAchievement, deleteAchievement } from '../../utils/storage';
import { Achievement, AchievementLevel, ContentStatus } from '../../types';
import { Trophy, Plus, Edit2, Trash2, Search, X, Check, Award } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import { usePermission, Permission } from '../../utils/permissions';

export default function PrestasiManager() {
  const { can } = usePermission();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Achievement> | null>(null);

  useEffect(() => {
    setAchievements(getAchievements());
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      description: '',
      category: 'Akademik',
      level: 'sekolah',
      recipient_name: '',
      year: new Date().getFullYear(),
      documentation: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Achievement) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data prestasi "${title}"?`)) {
      deleteAchievement(id);
      setAchievements(getAchievements());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title) return;

    const slug =
      editingItem.slug ||
      editingItem.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const achievementToSave: Achievement = {
      id: editingItem.id || `ach-${Date.now()}`,
      title: editingItem.title,
      description: editingItem.description || '',
      category: editingItem.category || 'Akademik',
      level: (editingItem.level as AchievementLevel) || 'sekolah',
      recipient_name: editingItem.recipient_name || '',
      year: editingItem.year ? Number(editingItem.year) : new Date().getFullYear(),
      documentation:
        editingItem.documentation ||
        'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
      status: (editingItem.status as ContentStatus) || 'published',
      slug,
      created_at: editingItem.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveAchievement(achievementToSave);
    setAchievements(getAchievements());
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filtered = achievements.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.recipient_name && item.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Manajemen Prestasi & Penghargaan</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola arsip medali, piala, dan piagam kejuaraan siswa maupun lembaga sekolah.
          </p>
        </div>

        {can(Permission.CREATE_ACHIEVEMENT) && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-yellow-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Prestasi</span>
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
            placeholder="Cari nama lomba, juara, atau peraih..."
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
                <th className="p-4">Foto & Prestasi</th>
                <th className="p-4">Kategori & Tingkat</th>
                <th className="p-4">Peraih / Tim</th>
                <th className="p-4">Tahun</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={item.documentation}
                      alt={item.title}
                      className="w-14 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 font-bold text-[10px]">
                        {item.category}
                      </span>
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                        Tingkat: {item.level}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                    {item.recipient_name || 'Sekolah / Tim'}
                  </td>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{item.year}</td>
                  <td className="p-4">
                    {item.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        Terbit
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400">Draft</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {can(Permission.EDIT_ACHIEVEMENT) && (
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-yellow-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Edit Prestasi"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {can(Permission.DELETE_ACHIEVEMENT) && (
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Hapus Prestasi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Tidak ada data prestasi yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>{editingItem.id ? 'Edit Data Prestasi' : 'Tambah Prestasi Baru'}</span>
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
                  Nama Prestasi / Judul Kejuaraan *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Contoh: Juara 1 Olimpiade Matematika SMP Tingkat Kabupaten"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Lomba *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="Akademik / Olahraga / Seni / Pramuka"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tingkat Kejuaraan
                  </label>
                  <select
                    value={editingItem.level || 'sekolah'}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, level: e.target.value as AchievementLevel })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="sekolah">Tingkat Sekolah / Lembaga</option>
                    <option value="individu">Individu / Perorangan</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Siswa / Tim Peraih
                  </label>
                  <input
                    type="text"
                    value={editingItem.recipient_name || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, recipient_name: e.target.value })
                    }
                    placeholder="Contoh: Ahmad Rizki (Kelas 8A)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tahun Perolehan *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingItem.year || new Date().getFullYear()}
                    onChange={(e) => setEditingItem({ ...editingItem, year: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              {/* Upload Foto Dokumentasi Prestasi */}
              <div>
                <ImageUpload
                  label="Upload Foto Piagam / Piala / Dokumentasi Prestasi"
                  helperText="Pilih atau tarik file foto piala, penyerahan hadiah, atau sertifikat juara (Maks. 5MB)."
                  value={editingItem.documentation || ''}
                  onChange={(dataUrl) =>
                    setEditingItem({ ...editingItem, documentation: dataUrl })
                  }
                  aspectRatio="video"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi / Keterangan Prestasi
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  placeholder="Keterangan singkat mengenai lomba dan perolehan skor..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.status === 'published'}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status: e.target.checked ? 'published' : 'draft',
                      })
                    }
                    className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-500"
                  />
                  <span>Publikasikan di Website</span>
                </label>
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
                  Simpan Prestasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
