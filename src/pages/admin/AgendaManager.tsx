import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAgenda, saveAgenda, AgendaItem } from '../../utils/storage';
import { usePermission, Permission } from '../../utils/permissions';

export default function AgendaManager() {
  const { can } = usePermission();
  const [agendaList, setAgendaList] = useState<AgendaItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    status: 'Akan Datang'
  });

  useEffect(() => {
    setAgendaList(getAgenda());
  }, []);

  const handleOpenModal = (item?: AgendaItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        date: item.date,
        location: item.location,
        status: item.status
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        date: '',
        location: '',
        status: 'Akan Datang'
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
      updatedList = agendaList.map(item =>
        item.id === editingId ? { ...item, ...formData } : item
      );
    } else {
      const newItem: AgendaItem = {
        id: Date.now().toString(),
        ...formData
      };
      updatedList = [newItem, ...agendaList];
    }

    setAgendaList(updatedList);
    saveAgenda(updatedList);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
      const updatedList = agendaList.filter(item => item.id !== id);
      setAgendaList(updatedList);
      saveAgenda(updatedList);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Kelola Agenda</h1>
          <p className="text-slate-900 dark:text-white ">Tambahkan, ubah, atau hapus agenda kegiatan.</p>
        </div>
        {can(Permission.CREATE_AGENDA) && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Tambah Agenda
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 ">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white ">Judul</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white ">Tanggal</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white ">Lokasi</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white ">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 ">
              {agendaList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-900 dark:text-white">Belum ada agenda.</td>
                </tr>
              ) : (
                agendaList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:bg-slate-900 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white max-w-[200px] md:max-w-md truncate">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white text-sm">{item.date}</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white text-sm">{item.location}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {can(Permission.EDIT_AGENDA) && (
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="p-2 text-slate-900 dark:text-white hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {can(Permission.DELETE_AGENDA) && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-900 dark:text-white hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={handleCloseModal}
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white ">
                  {editingId ? 'Ubah Agenda' : 'Tambah Agenda'}
                </h3>
                <button onClick={handleCloseModal} className="text-slate-900 dark:text-white hover:text-yellow-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <form id="agenda-form" onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Judul Agenda</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-yellow-500 outline-none "
                      placeholder="Masukkan judul agenda"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Tanggal</label>
                      <input
                        required
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-yellow-500 outline-none "
                        placeholder="Misal: 15 Okt 2025"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-yellow-500 outline-none "
                      >
                        <option value="Akan Datang">Akan Datang</option>
                        <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Persiapan">Persiapan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Lokasi</label>
                    <input
                      required
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-yellow-500 outline-none "
                      placeholder="Misal: Aula Utama"
                    />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="agenda-form"
                  className="px-5 py-2.5 rounded-xl font-medium bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold shadow-sm transition-colors"
                >
                  Simpan Agenda
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
