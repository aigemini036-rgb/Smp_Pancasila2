import React, { useState, useEffect } from 'react';
import { GalleryImage } from '../../types';
import { Maximize2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface CylinderGallery3DProps {
  key?: React.Key;
  images: GalleryImage[];
  albumTitle?: string;
  albumDescription?: string;
  albums?: { id: string; title: string; count?: number }[];
  activeAlbumId?: string;
  onSelectAlbum?: (albumId: string) => void;
  onOpenLightbox: (index: number) => void;
  className?: string;
}

export default function CylinderGallery3D({
  images,
  albumTitle,
  albumDescription,
  albums = [],
  activeAlbumId,
  onSelectAlbum,
  onOpenLightbox,
  className = '',
}: CylinderGallery3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className={`text-center py-12 text-slate-500 ${className}`}>
        <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Belum ada foto dalam galeri ini.</p>
      </div>
    );
  }

  const activeImage = images[currentIndex] || images[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Album Filter Tabs */}
      {albums.length > 0 && onSelectAlbum && (
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {albums.map((album) => {
            const isActive = album.id === activeAlbumId;
            return (
              <button
                key={album.id}
                onClick={() => onSelectAlbum(album.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {album.title} {album.count !== undefined ? `(${album.count})` : ''}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Photographic Feature */}
      <div className="grid lg:grid-cols-12 gap-6 items-center">
        {/* Large Stage Display */}
        <div className="lg:col-span-8">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 shadow-md group">
            <img
              key={activeImage.id || currentIndex}
              src={activeImage.image}
              alt={activeImage.caption || albumTitle || 'Dokumentasi Sekolah'}
              className="w-full h-full object-cover"
            />

            {/* Subtle Gradient for Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Caption & Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
              <div className="space-y-1 max-w-lg">
                <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest block">
                  Foto {currentIndex + 1} dari {images.length}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                  {activeImage.caption || albumTitle || 'Dokumentasi Kegiatan'}
                </h4>
                {albumDescription && (
                  <p className="text-xs text-slate-300 line-clamp-1 hidden sm:block">
                    {albumDescription}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors backdrop-blur-sm border border-white/10"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors backdrop-blur-sm border border-white/10"
                  aria-label="Foto Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenLightbox(currentIndex)}
                  className="w-8 h-8 rounded-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 flex items-center justify-center transition-colors font-bold ml-1"
                  aria-label="Buka Gambar Layar Penuh"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails Sidebar */}
        <div className="lg:col-span-4 grid grid-cols-4 lg:grid-cols-2 gap-3">
          {images.slice(0, 4).map((img, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={img.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 transition-all ${
                  isSelected
                    ? 'ring-2 ring-yellow-500 ring-offset-2 dark:ring-offset-slate-900 opacity-100 scale-102'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img.image}
                  alt={img.caption || `Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
