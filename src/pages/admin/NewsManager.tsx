import { useState, useEffect } from 'react';
import { getNews, saveNews, NewsItem } from '../../utils/storage';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
 desc: ''
 });

 useEffect(() => {
 setNewsList(getNews());
 }, []);

 const handleOpenModal = (item?: NewsItem) => {
 if (item) {
 setEditingId(item.id);
 setFormData({
 title: item.title,
 category: item.category,
 date: item.date,
 image: item.image,
 desc: item.desc
 });
 } else {
 setEditingId(null);
 setFormData({
 title: '',
 category: 'Akademik',
 date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
 image: '',
 desc: ''
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
 updatedList = newsList.map(item =>
 item.id === editingId ? { ...item, ...formData } : item
 );
 } else {
 const newItem: NewsItem = {
 id: Date.now().toString(),
 ...formData
 };
 updatedList = [newItem, ...newsList];
 }
 setNewsList(updatedList);
 saveNews(updatedList);
 handleCloseModal();
 };

 const handleDelete = (id: string) => {
 if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
 const updatedList = newsList.filter(item => item.id !== id);
 setNewsList(updatedList);
 saveNews(updatedList);
 }
 };

 return (
 <div className="p-6 md:p-8">
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
 <div>
 <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Kelola Berita</h1>
 <p className="text-slate-900 dark:text-white ">Tambahkan, ubah, atau hapus berita dan pengumuman.</p>
 </div>
 <button
 onClick={() => handleOpenModal()}
 className="bg-blue-600 hover:bg-yellow-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-sm"
 >
 <Plus className="w-5 h-5" />
 Tambah Berita
 </button>
 </div>

 <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 ">
 <tr>
 <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white ">Judul</th>
 <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white ">Kategori</th>
 <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white ">Tanggal</th>
 <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white text-right">Aksi</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-200 ">
 {newsList.length === 0 ? (
 <tr>
 <td colSpan={4} className="px-6 py-12 text-center text-slate-900 dark:text-white">Belum ada berita.</td>
 </tr>
 ) : (
 newsList.map((item) => (
 <tr key={item.id} className="hover:bg-slate-50 dark:bg-slate-900 transition-colors">
 <td className="px-6 py-4">
 <div className="flex items-center gap-4">
 <img src={item.image || 'https://via.placeholder.com/150'} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-slate-50 dark:bg-slate-900" />
 <span className="font-medium text-slate-900 dark:text-white max-w-[200px] md:max-w-md truncate">{item.title}</span>
 </div>
 </td>
 <td className="px-6 py-4">
 <span className="px-3 py-1 bg-blue-50 text-yellow-600 rounded-full text-xs font-semibold">
 {item.category}
 </span>
 </td>
 <td className="px-6 py-4 text-slate-900 dark:text-white text-sm">{item.date}</td>
 <td className="px-6 py-4">
 <div className="flex items-center justify-end gap-2">
 <button
 onClick={() => handleOpenModal(item)}
 className="p-2 text-slate-900 dark:text-white hover:text-yellow-600 hover:bg-blue-50 rounded-lg transition-colors"
 >
 <Edit2 className="w-4 h-4" />
 </button>
 <button
 onClick={() => handleDelete(item.id)}
 className="p-2 text-slate-900 dark:text-white hover:text-yellow-600 hover:bg-blue-50 rounded-lg transition-colors"
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
 className="absolute inset-0 bg-white/10 backdrop-blur-sm"
 onClick={handleCloseModal}
 ></motion.div>
 
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]"
 >
 <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
 <h3 className="text-xl font-bold text-slate-900 dark:text-white ">
 {editingId ? 'Ubah Berita' : 'Tambah Berita'}
 </h3>
 <button onClick={handleCloseModal} className="text-slate-900 dark:text-white hover:text-slate-900 dark:text-white">
 <X className="w-6 h-6" />
 </button>
 </div>
 
 <div className="p-6 overflow-y-auto flex-1">
 <form id="news-form" onSubmit={handleSubmit} className="space-y-5">
 <div>
 <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Judul Berita</label>
 <input
 required
 type="text"
 value={formData.title}
 onChange={(e) => setFormData({...formData, title: e.target.value})}
 className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none "
 placeholder="Masukkan judul berita"
 />
 </div>
 
 <div className="grid grid-cols-2 gap-5">
 <div>
 <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Kategori</label>
 <select
 value={formData.category}
 onChange={(e) => setFormData({...formData, category: e.target.value})}
 className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none "
 >
 <option value="Akademik">Akademik</option>
 <option value="Prestasi">Prestasi</option>
 <option value="Kegiatan">Kegiatan</option>
 <option value="Pengumuman">Pengumuman</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Tanggal</label>
 <input
 required
 type="text"
 value={formData.date}
 onChange={(e) => setFormData({...formData, date: e.target.value})}
 className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none "
 placeholder="15 Okt 2025"
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">URL Gambar</label>
 <input
 required
 type="url"
 value={formData.image}
 onChange={(e) => setFormData({...formData, image: e.target.value})}
 className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none "
 placeholder="https://images.unsplash.com/..."
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Deskripsi Singkat</label>
 <textarea
 required
 rows={3}
 value={formData.desc}
 onChange={(e) => setFormData({...formData, desc: e.target.value})}
 className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
 placeholder="Tulis ringkasan berita..."
 ></textarea>
 </div>
 </form>
 </div>
 
 <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
 <button
 type="button"
 onClick={handleCloseModal}
 className="px-5 py-2.5 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:bg-slate-900 transition-colors"
 >
 Batal
 </button>
 <button
 type="submit"
 form="news-form"
 className="px-5 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-yellow-500 text-slate-900 font-bold shadow-sm transition-colors"
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
