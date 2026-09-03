import React, { useState, useEffect } from 'react';
import {
  getGalleries,
  saveGallery,
  deleteGallery,
  getGalleryImages,
  saveGalleryImages,
} from '../../utils/storage';
import { Gallery, GalleryImage } from '../../types';
import { Images, Plus, Edit2, Trash2, Search, X, Check, Eye } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import MultiImageUpload from '../../components/admin/MultiImageUpload';
import { usePermission, Permission } from '../../utils/permissions';

export default function GaleriManager() {
  const { can } = usePermission();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [activeGalleryForPhotos, setActiveGalleryForPhotos] = useState<Gallery | null>(null);
  const [editingGallery, setEditingGallery] = useState<Partial<Gallery> | null>(null);
  const [batchNewPhotos, setBatchNewPhotos] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setGalleries(getGalleries());
    setGalleryImages(getGalleryImages());
  };

  const handleOpenAdd = () => {
    setEditingGallery({
      title: '',
      description: '',
      cover_image:
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Gallery) => {
    setEditingGallery({ ...item });
    setIsModalOpen(true);
  };

  const handleDeleteGallery = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus album galeri "${title}" beserta seluruh fotonya?`)) {
      deleteGallery(id);
      // Also delete associated photos
      const remainingImages = galleryImages.filter((img) => img.gallery_id !== id);
      saveGalleryImages(remainingImages);
      loadData();
    }
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery?.title) return;

    const galleryToSave: Gallery = {
      id: editingGallery.id || `gal-${Date.now()}`,
      title: editingGallery.title,
      description: editingGallery.description || '',
      cover_image:
        editingGallery.cover_image ||
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      status: editingGallery.status || 'published',
      created_at: editingGallery.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveGallery(galleryToSave);
    loadData();
    setIsModalOpen(false);
    setEditingGallery(null);
  };

  const handleOpenManagePhotos = (gallery: Gallery) => {
    setActiveGalleryForPhotos(gallery);
    setBatchNewPhotos([]);
    setIsPhotoModalOpen(true);
  };

  const handleSaveBatchPhotos = () => {
    if (!activeGalleryForPhotos || batchNewPhotos.length === 0) return;

    const newItems: GalleryImage[] = batchNewPhotos.map((imgUrl, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      gallery_id: activeGalleryForPhotos.id,
      image: imgUrl,
      caption: `${activeGalleryForPhotos.title} - Foto ${idx + 1}`,
      date: new Date().toISOString().split('T')[0],
      status: 'published',
      created_at: new Date().toISOString(),
    }));

    saveGalleryImages([...newItems, ...galleryImages]);
    loadData();
    setBatchNewPhotos([]);
  };

  const handleDeleteSinglePhoto = (photoId: string) => {
    const updated = galleryImages.filter((img) => img.id !== photoId);
    saveGalleryImages(updated);
    setGalleryImages(updated);
  };

  const filtered = galleries.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Images className="w-6 h-6 text-yellow-500" />
            <span>Manajemen Galeri & Album Dokumentasi</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola album kegiatan sekolah dan unggah foto-foto dokumentasi secara langsung.
          </p>
        </div>

        {can(Permission.CREATE_GALLERY) && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-yellow-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Album Baru</span>
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
            placeholder="Cari nama album galeri..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      {/* Grid of Albums */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((gallery) => {
          const photoCount = galleryImages.filter((img) => img.gallery_id === gallery.id).length;
          return (
            <div
              key={gallery.id}
              className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col group"
            >
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <img
                  src={gallery.cover_image}
                  alt={gallery.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-bold backdrop-blur-sm">
                  {photoCount} Foto
                </span>
                {gallery.status === 'published' ? (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold">
                    Terbit
                  </span>
                ) : (
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-600 text-white text-[10px] font-bold">
                    Draft
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1">
                    {gallery.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {gallery.description || 'Tidak ada keterangan album.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenManagePhotos(gallery)}
                    className="px-3 py-1.5 rounded-xl bg-yellow-500/10 hover:bg-yellow-500 text-yellow-700 dark:text-yellow-400 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Images className="w-3.5 h-3.5" />
                    <span>Kelola Foto ({photoCount})</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {can(Permission.EDIT_GALLERY) && (
                      <button
                        onClick={() => handleOpenEdit(gallery)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-yellow-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Edit Album"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {can(Permission.DELETE_GALLERY) && (
                      <button
                        onClick={() => handleDeleteGallery(gallery.id, gallery.title)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Hapus Album"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Album */}
      {isModalOpen && editingGallery && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Images className="w-5 h-5 text-yellow-500" />
                <span>{editingGallery.id ? 'Edit Album Galeri' : 'Buat Album Galeri Baru'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama / Judul Album *
                </label>
                <input
                  type="text"
                  required
                  value={editingGallery.title || ''}
                  onChange={(e) =>
                    setEditingGallery({ ...editingGallery, title: e.target.value })
                  }
                  placeholder="Contoh: Upacara Hari Kemerdekaan RI Ke-81"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                />
              </div>

              {/* Upload Cover Album */}
              <div>
                <ImageUpload
                  label="Upload Foto Sampul Album (Cover Image)"
                  helperText="Pilih atau tarik file foto utama sebagai sampul album (Maks. 5MB)."
                  value={editingGallery.cover_image || ''}
                  onChange={(dataUrl) =>
                    setEditingGallery({ ...editingGallery, cover_image: dataUrl })
                  }
                  aspectRatio="video"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi / Keterangan Album
                </label>
                <textarea
                  rows={3}
                  value={editingGallery.description || ''}
                  onChange={(e) =>
                    setEditingGallery({ ...editingGallery, description: e.target.value })
                  }
                  placeholder="Keterangan singkat seputar kegiatan yang didokumentasikan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-yellow-500"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingGallery.status === 'published'}
                    onChange={(e) =>
                      setEditingGallery({
                        ...editingGallery,
                        status: e.target.checked ? 'published' : 'draft',
                      })
                    }
                    className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-500"
                  />
                  <span>Publikasikan Album di Website</span>
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
                  Simpan Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Manage Photos in Album */}
      {isPhotoModalOpen && activeGalleryForPhotos && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Images className="w-5 h-5 text-yellow-500" />
                  <span>Kelola Foto Album: {activeGalleryForPhotos.title}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Unggah beberapa foto sekaligus langsung dari perangkat Anda.
                </p>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Batch Upload Section */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <MultiImageUpload
                images={batchNewPhotos}
                onChange={setBatchNewPhotos}
                label="Pilih / Tarik Foto-Foto Baru Untuk Ditambahkan"
                helperText="Pilih beberapa foto sekaligus. Klik 'Simpan Foto ke Album' setelah selesai memilih."
              />

              {batchNewPhotos.length > 0 && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveBatchPhotos}
                    className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs flex items-center gap-2 shadow"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan {batchNewPhotos.length} Foto Baru ke Album</span>
                  </button>
                </div>
              )}
            </div>

            {/* Existing Photos List */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Foto Dalam Album Ini (
                {
                  galleryImages.filter((img) => img.gallery_id === activeGalleryForPhotos.id)
                    .length
                }
                )
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryImages
                  .filter((img) => img.gallery_id === activeGalleryForPhotos.id)
                  .map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    >
                      <img
                        src={photo.image}
                        alt={photo.caption || 'Foto Galeri'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteSinglePhoto(photo.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                        title="Hapus foto ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {photo.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <p className="text-[10px] text-white font-medium truncate">
                            {photo.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
