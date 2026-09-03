import { useState, useEffect } from 'react';
import { getGalleries, getGalleryImages } from '../../utils/storage';
import { Gallery, GalleryImage } from '../../types';
import { Images, Calendar, Grid, Layers, Sparkles } from 'lucide-react';
import EditorialUnderlineHeading from '../../components/public/EditorialUnderlineHeading';
import CylinderGallery3D from '../../components/public/CylinderGallery3D';
import GalleryLightboxModal from '../../components/public/GalleryLightboxModal';

export default function GaleriList() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [activeGallery, setActiveGallery] = useState<Gallery | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d');

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    const list = getGalleries().filter((g) => g.status === 'published');
    const images = getGalleryImages().filter((img) => img.status === 'published');
    setGalleries(list);
    setGalleryImages(images);
    if (list.length > 0) {
      setActiveGallery(list[0]);
    }
  }, []);

  const currentImages = activeGallery
    ? galleryImages.filter((img) => img.gallery_id === activeGallery.id)
    : [];

  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleNextPhoto = () => {
    if (currentImages.length === 0) return;
    setSelectedPhotoIndex((prev) => (prev + 1) % currentImages.length);
  };

  const handlePrevPhoto = () => {
    if (currentImages.length === 0) return;
    setSelectedPhotoIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Editorial Header */}
      <EditorialUnderlineHeading
        badge="Dokumentasi Visual 3D"
        badgeIcon={Images}
        title="Galeri & Arsip Foto Sekolah"
        subtitle="Eksplorasi arsip foto kegiatan upacara, praktikum laboratorium sains, ekstrakurikuler, dan ragam dinamika SMP Pancasila Ponokawan Sidoarjo dalam ruang 3D Cylinder."
      />

      {/* Album Selection Bar & Mode Toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {galleries.map((album) => {
            const albumImageCount = galleryImages.filter((img) => img.gallery_id === album.id).length;
            const isSelected = activeGallery?.id === album.id;
            return (
              <button
                key={album.id}
                onClick={() => setActiveGallery(album)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-yellow-500 text-slate-950 border-yellow-500 shadow-md scale-102 font-extrabold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-yellow-500/50'
                }`}
              >
                <span>{album.title}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {albumImageCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Switcher: 3D Cylinder vs Archival Grid */}
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700 text-xs self-end">
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
              viewMode === '3d'
                ? 'bg-yellow-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Cylinder</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
              viewMode === 'grid'
                ? 'bg-yellow-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Tampilan Grid</span>
          </button>
        </div>
      </div>

      {/* 
        ========================================================================
        MAIN GALLERY PRESENTATION (3D CYLINDER OR ARCHIVE GRID)
        ========================================================================
      */}
      {viewMode === '3d' ? (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <CylinderGallery3D
            key={activeGallery?.id || 'cylinder-default'}
            images={currentImages}
            albumTitle={activeGallery?.title}
            albumDescription={activeGallery?.description}
            albums={galleries.map((g) => ({
              id: g.id,
              title: g.title,
              count: galleryImages.filter((img) => img.gallery_id === g.id).length,
            }))}
            activeAlbumId={activeGallery?.id}
            onSelectAlbum={(id) => {
              const target = galleries.find((g) => g.id === id);
              if (target) setActiveGallery(target);
            }}
            onOpenLightbox={handleOpenLightbox}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {activeGallery?.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              {activeGallery?.description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentImages.length > 0 ? (
              currentImages.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenLightbox(idx)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.caption || activeGallery?.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                    <div className="self-end p-1.5 rounded-full bg-yellow-500 text-slate-950 shadow-md">
                      <span className="text-[10px] font-mono font-bold">#{idx + 1}</span>
                    </div>
                    {item.caption && (
                      <p className="text-xs font-semibold text-white line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                Belum ada foto dalam album ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <GalleryLightboxModal
        images={currentImages}
        currentIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
        albumTitle={activeGallery?.title}
      />
    </div>
  );
}
