import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const isTouchHorizontalRef = useRef<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset index when images list change
  useEffect(() => {
    setCurrentIndex(0);
    setDragOffset(0);
  }, [images]);

  const total = images ? images.length : 0;

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  // Pointer / Mouse Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (total <= 1) return;
    // Don't drag if clicking buttons
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    setDragOffset(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartXRef.current;
    // Dampen drag slightly for natural inertia
    setDragOffset(diff * 0.85);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const threshold = 65;
    if (dragOffset < -threshold) {
      handleNext();
    } else if (dragOffset > threshold) {
      handlePrev();
    }
    setDragOffset(0);
  };

  // Touch Handlers with scroll-protection
  const handleTouchStart = (e: React.TouchEvent) => {
    if (total <= 1) return;
    const touch = e.touches[0];
    dragStartXRef.current = touch.clientX;
    dragStartYRef.current = touch.clientY;
    isTouchHorizontalRef.current = null;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartXRef.current;
    const dy = touch.clientY - dragStartYRef.current;

    // Detect gesture direction on first significant movement
    if (isTouchHorizontalRef.current === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        isTouchHorizontalRef.current = Math.abs(dx) > Math.abs(dy);
      }
    }

    // Only drag horizontally if horizontal swipe detected
    if (isTouchHorizontalRef.current === true) {
      if (e.cancelable) e.preventDefault();
      setDragOffset(dx * 0.9);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 55;
    if (isTouchHorizontalRef.current === true) {
      if (dragOffset < -threshold) {
        handleNext();
      } else if (dragOffset > threshold) {
        handlePrev();
      }
    }
    setDragOffset(0);
    isTouchHorizontalRef.current = null;
  };

  if (!images || total === 0) {
    return (
      <div className={`text-center py-12 text-slate-500 ${className}`}>
        <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Belum ada foto dalam galeri ini.</p>
      </div>
    );
  }

  const activeImage = images[currentIndex] || images[0];

  // Helper to compute visible slots around currentIndex (-2, -1, 0, 1, 2)
  const getSlot = (offset: number) => {
    const idx = (currentIndex + offset + total * 100) % total;
    return { index: idx, image: images[idx] };
  };

  const visibleOffsets = [-2, -1, 0, 1, 2];

  return (
    <div className={`space-y-6 select-none ${className}`}>
      {/* Album Filter Tabs */}
      {albums.length > 0 && onSelectAlbum && (
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {albums.map((album) => {
            const isActive = album.id === activeAlbumId;
            return (
              <button
                key={album.id}
                type="button"
                onClick={() => onSelectAlbum(album.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {album.title} {album.count !== undefined ? `(${album.count})` : ''}
              </button>
            );
          })}
        </div>
      )}

      {/* 
        ========================================================================
        27 & 28: 3D PERSPECTIVE & CURVED CYLINDRICAL GALLERY CONTAINER
        29 & 30: DRAG & TOUCH SWIPE INTERACTION
        31 & 32: SNAP TO IMAGE & ACTIVE IMAGE FOCUS
        ========================================================================
      */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full h-[320px] sm:h-[420px] md:h-[480px] flex items-center justify-center overflow-hidden py-4 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ perspective: '1100px' }}
      >
        {/* Curved 3D Cylinder Stage */}
        <div
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {visibleOffsets.map((offset) => {
            // When few images exist, avoid duplicate render of same image
            if (total < 5 && Math.abs(offset) > Math.floor((total - 1) / 2)) {
              return null;
            }

            const { index: slotIndex, image: slotImage } = getSlot(offset);
            const isCenter = offset === 0;

            // Compute dynamic 3D cylinder geometry
            // Continuous drag offset shifts the cylinder slightly in real-time
            const normalizedDrag = Math.max(-100, Math.min(100, dragOffset));
            const dragShiftPercent = (normalizedDrag / (containerRef.current?.clientWidth || 600)) * 60;

            let translateX = offset * 56 + dragShiftPercent;
            let translateZ = -Math.abs(offset) * 75 - Math.abs(dragShiftPercent) * 0.5;
            let rotateY = -offset * 18 - dragShiftPercent * 0.15;
            let scale = isCenter ? 1.04 : offset === -1 || offset === 1 ? 0.88 : 0.74;
            let opacity = isCenter ? 1 : offset === -1 || offset === 1 ? 0.85 : 0.55;
            let zIndex = isCenter ? 30 : offset === -1 || offset === 1 ? 20 : 10;

            return (
              <div
                key={`${slotIndex}-${offset}`}
                onClick={(e) => {
                  if (isDragging) return;
                  if (isCenter) {
                    onOpenLightbox(currentIndex);
                  } else {
                    e.stopPropagation();
                    if (offset < 0) handlePrev();
                    if (offset > 0) handleNext();
                  }
                }}
                className={`absolute w-[78%] sm:w-[62%] md:w-[52%] max-w-[620px] aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 border transition-all pointer-events-auto ${
                  isCenter
                    ? 'border-yellow-500/40 shadow-2xl ring-1 ring-yellow-500/30'
                    : 'border-slate-800 shadow-lg hover:opacity-95'
                } ${isDragging ? 'duration-75' : 'duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'}`}
                style={{
                  transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformOrigin: 'center center',
                  transformStyle: 'preserve-3d',
                }}
              >
                <img
                  src={slotImage.image}
                  alt={slotImage.caption || `Galeri Foto ${slotIndex + 1}`}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Active Focus Overlay & Metadata (Only on center card) */}
                {isCenter && (
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-4 text-white pointer-events-auto">
                    <div className="space-y-1 max-w-[80%]">
                      <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-widest block">
                        Foto {currentIndex + 1} dari {total}
                      </span>
                      <h4 className="text-xs sm:text-base font-bold text-white line-clamp-1 leading-snug">
                        {activeImage.caption || albumTitle || 'Dokumentasi Sekolah'}
                      </h4>
                      {albumDescription && (
                        <p className="text-[11px] text-slate-300 line-clamp-1 hidden sm:block">
                          {albumDescription}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenLightbox(currentIndex);
                      }}
                      className="w-9 h-9 rounded-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 flex items-center justify-center transition-all font-bold shadow-md shrink-0 active:scale-95"
                      aria-label="Buka Gambar Layar Penuh"
                      title="Perbesar Layar Penuh"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Previous & Next Navigation Buttons */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-yellow-500 hover:text-slate-950 text-white flex items-center justify-center transition-all backdrop-blur-md border border-slate-700 shadow-xl active:scale-95"
              aria-label="Foto Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-yellow-500 hover:text-slate-950 text-white flex items-center justify-center transition-all backdrop-blur-md border border-slate-700 shadow-xl active:scale-95"
              aria-label="Foto Berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots Indicator */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {images.slice(0, Math.min(total, 12)).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-yellow-500'
                  : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
              aria-label={`Pindah ke foto ${idx + 1}`}
            />
          ))}
          {total > 12 && (
            <span className="text-[10px] font-mono text-slate-400 ml-1">
              +{total - 12}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
