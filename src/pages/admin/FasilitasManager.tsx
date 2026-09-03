import React, { useState, useEffect } from 'react';
import { getFacilities, saveFacility, deleteFacility } from '../../utils/storage';
import { Facility, ContentStatus } from '../../types';
import { Landmark, Plus, Edit2, Trash2, Search, X, Check, MapPin } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import { usePermission, Permission } from '../../utils/permissions';

export default function FasilitasManager() {
  const { can } = usePermission();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Facility> | null>(null);

  useEffect(() => {
    setFacilities(getFacilities());
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      name: '',
      description: '',
      photo:
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      location: 'Gedung Utama',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Facility) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data fasilitas "${name}"?`)) {
      deleteFacility(id);
      setFacilities(getFacilities());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name) return;

    const facilityToSave: Facility = {
      id: editingItem.id || `fac-${Date.now()}`,
      name: editingItem.name,
      description: editingItem.description || '',
      photo:
        editingItem.photo ||
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      location: editingItem.location || 'Kampus SMP Pancasila',
      status: (editingItem.status as ContentStatus) || 'published',
      created_at: editingItem.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveFacility(facilityToSave);
    setFacilities(getFacilities());
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const filtered = facilities.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-yellow-500" />
            <span>Manajemen Fasilitas & Sarana Prasarana</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola data laboratorium, perpustakaan, lapangan olahraga, dan sarana KBM sekolah.
          </p>
        </div>

        {can(Permission.CREATE_FACILITY) && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-yellow-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Fasilitas Baru</span>
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
            placeholder="Cari nama fasilitas atau lokasi..."
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
                <th className="p-4">Foto & Nama Fasilitas</th>
                <th className="p-4">Lokasi Gedung</th>
                <th className="p-4">Deskripsi</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="w-14 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                      {item.location}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {item.description}
                  </td>
                  <td className="p-4">
                    {item.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        Aktif
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400">Draft</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {can(Permission.EDIT_FACILITY) && (
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-yellow-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Edit Fasilitas"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {can(Permission.DELETE_FACILITY) && (
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Hapus Fasilitas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Tidak ada fasilitas yang ditemukan.
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
                <Landmark className="w-5 h-5 text-yellow-500" />
                <span>{editingItem.id ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}</span>
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
                  Nama Fasilitas / Ruangan *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Contoh: Laboratorium Komputer & CBT"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lokasi Gedung / Posisi *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.location || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  placeholder="Gedung B Lantai 2 / Area Barat"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                />
              </div>

              {/* Upload Foto Fasilitas */}
              <div>
                <ImageUpload
                  label="Upload Foto Fasilitas"
                  helperText="Pilih atau tarik file foto ruangan / fasilitas (Maks. 5MB)."
                  value={editingItem.photo || ''}
                  onChange={(dataUrl) => setEditingItem({ ...editingItem, photo: dataUrl })}
                  aspectRatio="video"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Sarana & Spesifikasi
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Kapasitas, kelengkapan AC, jumlah unit PC, proyektor, dsb..."
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
                  <span>Tampilkan di Profil Fasilitas Web</span>
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
                  Simpan Fasilitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
