import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPeople, savePerson, deletePerson } from '../../utils/storage';
import { Person, CategoryPerson } from '../../types';
import { usePermission, Permission } from '../../utils/permissions';
import { Users, Plus, Edit2, Trash2, Check, X, Search } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

export default function PersonelManager() {
  const { can } = usePermission();
  const [searchParams] = useSearchParams();
  const catFilter = searchParams.get('cat') as CategoryPerson | null;

  const [people, setPeople] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(catFilter || 'semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Partial<Person> | null>(null);

  useEffect(() => {
    setPeople(getPeople());
  }, []);

  useEffect(() => {
    if (catFilter) {
      setSelectedCategory(catFilter);
    }
  }, [catFilter]);

  const handleOpenAdd = () => {
    setEditingPerson({
      name: '',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      position: '',
      category: 'guru',
      nip_nuptk: '',
      education: 'S1 Pendidikan',
      subject: '',
      education_history: '',
      work_history: '',
      short_bio: '',
      contact: '',
      published: true,
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (person: Person) => {
    setEditingPerson({ ...person });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data personel "${name}"?`)) {
      deletePerson(id);
      setPeople(getPeople());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerson?.name || !editingPerson?.position) return;

    const slug =
      editingPerson.slug ||
      editingPerson.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const personToSave: Person = {
      id: editingPerson.id || `person-${Date.now()}`,
      name: editingPerson.name,
      photo: editingPerson.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      position: editingPerson.position,
      category: (editingPerson.category as CategoryPerson) || 'guru',
      nip_nuptk: editingPerson.nip_nuptk || '',
      education: editingPerson.education || '',
      subject: editingPerson.subject || '',
      education_history: editingPerson.education_history || '',
      work_history: editingPerson.work_history || '',
      short_bio: editingPerson.short_bio || '',
      achievements_note: editingPerson.achievements_note || '',
      contact: editingPerson.contact || '',
      published: editingPerson.published ?? true,
      status: editingPerson.status || 'active',
      slug,
      created_at: editingPerson.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    savePerson(personToSave);
    setPeople(getPeople());
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  const filtered = people.filter((p) => {
    const matchesCat = selectedCategory === 'semua' ? true : p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-yellow-500" />
            <span>Manajemen Personel Sekolah</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola data Kepala Sekolah, Dewan Guru / Pengajar, dan Tata Usaha.
          </p>
        </div>

        {can(Permission.CREATE_PERSONNEL) && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-yellow-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Personel Baru</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
          <button
            onClick={() => setSelectedCategory('semua')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedCategory === 'semua'
                ? 'bg-yellow-500 text-slate-900'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setSelectedCategory('kepala_sekolah')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedCategory === 'kepala_sekolah'
                ? 'bg-yellow-500 text-slate-900'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Kepala Sekolah
          </button>
          <button
            onClick={() => setSelectedCategory('guru')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedCategory === 'guru'
                ? 'bg-yellow-500 text-slate-900'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Dewan Guru
          </button>
          <button
            onClick={() => setSelectedCategory('staff')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedCategory === 'staff'
                ? 'bg-yellow-500 text-slate-900'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Staff / TU
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari personel..."
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
                <th className="p-4">Foto & Nama</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Jabatan / Mapel</th>
                <th className="p-4">Pendidikan</th>
                <th className="p-4">Status Publikasi</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map((person) => (
                <tr key={person.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={person.photo}
                      alt={person.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{person.name}</p>
                      <p className="text-[11px] text-slate-400">{person.nip_nuptk || 'NIP: -'}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 font-bold uppercase text-[10px]">
                      {person.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                    {person.position}
                    {person.subject && (
                      <span className="block text-[11px] font-normal text-slate-500">
                        Mapel: {person.subject}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{person.education}</td>
                  <td className="p-4">
                    {person.published ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 dark:text-green-400">
                        <Check className="w-3.5 h-3.5" />
                        Tampil di Web
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400">
                        Draft / Tersembunyi
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {can(Permission.EDIT_PERSONNEL) && (
                      <button
                        onClick={() => handleOpenEdit(person)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-yellow-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Edit Personel"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {can(Permission.DELETE_PERSONNEL) && (
                      <button
                        onClick={() => handleDelete(person.id, person.name)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Hapus Personel"
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
      {isModalOpen && editingPerson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                {editingPerson.id ? 'Edit Data Personel' : 'Tambah Personel Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPerson.name || ''}
                    onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })}
                    placeholder="Drs. H. Ahmad Wijaya, M.Pd."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Personel *
                  </label>
                  <select
                    value={editingPerson.category || 'guru'}
                    onChange={(e) =>
                      setEditingPerson({
                        ...editingPerson,
                        category: e.target.value as CategoryPerson,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  >
                    <option value="kepala_sekolah">Kepala Sekolah</option>
                    <option value="guru">Guru / Tenaga Pendidik</option>
                    <option value="staff">Staff / Tata Usaha</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jabatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPerson.position || ''}
                    onChange={(e) => setEditingPerson({ ...editingPerson, position: e.target.value })}
                    placeholder="Kepala Sekolah / Guru Matematika"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mata Pelajaran (Jika Guru)
                  </label>
                  <input
                    type="text"
                    value={editingPerson.subject || ''}
                    onChange={(e) => setEditingPerson({ ...editingPerson, subject: e.target.value })}
                    placeholder="Matematika / IPA / Bahasa Indonesia"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIP / NUPTK
                  </label>
                  <input
                    type="text"
                    value={editingPerson.nip_nuptk || ''}
                    onChange={(e) => setEditingPerson({ ...editingPerson, nip_nuptk: e.target.value })}
                    placeholder="19750812 200003 1 002"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    value={editingPerson.education || ''}
                    onChange={(e) => setEditingPerson({ ...editingPerson, education: e.target.value })}
                    placeholder="S1 Pendidikan Matematika Unesa"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  label="Upload Foto Profil Personel"
                  helperText="Format JPG, PNG, WEBP. Drag & drop atau klik untuk memilih pas foto (Rasio 3:4 portrait disarankan)."
                  value={editingPerson.photo || ''}
                  onChange={(dataUrl) => setEditingPerson({ ...editingPerson, photo: dataUrl })}
                  aspectRatio="portrait"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Riwayat Pendidikan (Pisahkan dengan Tanda |)
                </label>
                <input
                  type="text"
                  value={editingPerson.education_history || ''}
                  onChange={(e) =>
                    setEditingPerson({ ...editingPerson, education_history: e.target.value })
                  }
                  placeholder="S1 Pendidikan Unesa (1998) | S2 Manajemen Pendidikan Unair (2008)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Riwayat Pekerjaan (Pisahkan dengan Tanda |)
                </label>
                <input
                  type="text"
                  value={editingPerson.work_history || ''}
                  onChange={(e) => setEditingPerson({ ...editingPerson, work_history: e.target.value })}
                  placeholder="Guru SMP Pancasila (2000 - Sekarang) | Wakasek Kurikulum (2015-2020)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ringkasan Biografi / Sambutan
                </label>
                <textarea
                  rows={3}
                  value={editingPerson.short_bio || ''}
                  onChange={(e) => setEditingPerson({ ...editingPerson, short_bio: e.target.value })}
                  placeholder="Deskripsi singkat seputar pengabdian dan prinsip mengajar..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPerson.published ?? true}
                    onChange={(e) =>
                      setEditingPerson({ ...editingPerson, published: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-500"
                  />
                  <span>Tampilkan di Website Publik</span>
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
                  Simpan Data Personel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
