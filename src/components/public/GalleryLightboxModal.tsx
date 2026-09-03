import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryImage } from '../../types';
import { X, ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';

interface GalleryLightboxModalProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  albumTitle?: string;
}

export default function GalleryLightboxModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  albumTitle,
}: GalleryLightboxModalProps) {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onNext, onPrev, onClose]);

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold">
                  {currentIndex + 1} / {images.length}
                </span>
                {albumTitle && (
                  <span className="text-white font-bold text-sm truncate max-w-xs sm:max-w-md">
                    {albumTitle}
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-yellow-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors"
                aria-label="Tutup Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image Stage */}
            <div className="relative flex-1 bg-slate-950 min-h-[300px] sm:min-h-[420px] flex items-center justify-center overflow-hidden p-2">
              <motion.img
                key={currentImage.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                src={currentImage.image}
                alt={currentImage.caption || 'Foto Galeri'}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={onPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-yellow-500 hover:text-slate-950 text-white flex items-center justify-center transition-all border border-slate-700 shadow-lg"
                    aria-label="Foto Sebelumnya"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={onNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-yellow-500 hover:text-slate-950 text-white flex items-center justify-center transition-all border border-slate-700 shadow-lg"
                    aria-label="Foto Selanjutnya"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Caption / Metadata Bar */}
            {currentImage.caption && (
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60">
                <p className="text-sm text-slate-200 font-medium leading-relaxed">
                  {currentImage.caption}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
