import React, { useState, useEffect } from 'react';
import { getAnnouncements, saveAnnouncement, deleteAnnouncement } from '../../utils/storage';
import { Announcement, AnnouncementStatus } from '../../types';
import { Bell, Plus, Edit2, Trash2, Search, X, Check, Calendar } from 'lucide-react';
import { usePermission, Permission } from '../../utils/permissions';

export default function PengumumanManager() {
  const { can } = usePermission();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Announcement> | null>(null);

  useEffect(() => {
    setAnnouncements(getAnnouncements());
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      content: '',
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Announcement) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengumuman "${title}"?`)) {
      deleteAnnouncement(id);
      setAnnouncements(getAnnouncements());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.content) return;

    const slug =
      editingItem.slug ||
      editingItem.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const announcementToSave: Announcement = {
      id: editingItem.id || `ann-${Date.now()}`,
      title: editingItem.title,
      content: editingItem.content,
      status: (editingItem.status as AnnouncementStatus) || 'active',
      start_date: editingItem.start_date || new Date().toISOString().split('T')[0],
      end_date: editingItem.end_date || undefined,
      slug,
      created_at: editingItem.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveAnnouncement(announcementToSave);
    setAnnouncements(getAnnouncements());
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filtered = announcements.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-yellow-500" />
            <span>Manajemen Pengumuman Sekolah</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola edaran resmi, jadwal ujian, informasi libur, dan warta penting untuk siswa/wali murid.
          </p>
        </div>

        {can(Permission.CREATE_ANNOUNCEMENT) && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-yellow-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Pengumuman Baru</span>
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
            placeholder="Cari judul pengumuman..."
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
                <th className="p-4">Judul Pengumuman</th>
                <th className="p-4">Tanggal Berlaku</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.content}</p>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-yellow-500" />
                      {item.start_date} {item.end_date ? `s.d ${item.end_date}` : ''}
                    </span>
                  </td>
                  <td className="p-4">
                    {item.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        Aktif
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400">Non-Aktif</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {can(Permission.EDIT_ANNOUNCEMENT) && (
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-yellow-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Edit Pengumuman"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {can(Permission.DELETE_ANNOUNCEMENT) && (
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Hapus Pengumuman"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Tidak ada pengumuman.
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
                <Bell className="w-5 h-5 text-yellow-500" />
                <span>{editingItem.id ? 'Edit Pengumuman' : 'Tulis Pengumuman Baru'}</span>
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
                  Judul Pengumuman *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="Contoh: Pengumuman Libur Awal Ramadhan 1447 H"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Mulai Berlaku *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingItem.start_date || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, start_date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Berakhir (Opsional)
                  </label>
                  <input
                    type="date"
                    value={editingItem.end_date || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, end_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Isi Pengumuman Lengkap *
                </label>
                <textarea
                  rows={6}
                  required
                  value={editingItem.content || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Tuliskan detail pengumuman secara rinci..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.status === 'active'}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status: e.target.checked ? 'active' : 'inactive',
                      })
                    }
                    className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-500"
                  />
                  <span>Status Aktif (Tampilkan di Beranda & Halaman Pengumuman)</span>
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
                  Simpan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
