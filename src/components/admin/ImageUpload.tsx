import React, { useState, useRef, ChangeEvent, DragEvent, MouseEvent } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide' | 'auto';
  className?: string;
  required?: boolean;
}

/**
 * Resizes and compresses an image file to a base64 Data URL to optimize localStorage usage
 */
export async function processAndCompressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> {
  // If SVG or gif, keep as is
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Upload Gambar',
  helperText = 'Format JPG, PNG, WEBP, atau SVG (Maks. 5MB). Drag & drop atau klik untuk memilih file.',
  aspectRatio = 'video',
  className = '',
  required = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square max-w-[220px]';
      case 'portrait':
        return 'aspect-[3/4] max-w-[240px]';
      case 'wide':
        return 'aspect-[21/9]';
      case 'video':
        return 'aspect-video';
      default:
        return 'min-h-[160px]';
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('File yang dipilih bukan gambar yang didukung.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file terlalu besar. Harap pilih gambar di bawah 5MB.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const dataUrl = await processAndCompressImage(file);
      onChange(dataUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2500);
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Gagal memproses gambar. Silakan coba file lain.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {value && (
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Gambar Terpasang
            </span>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />

      {/* Upload Dropzone Container */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`group relative w-full ${getAspectClass()} rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center p-4 select-none ${
          isDragging
            ? 'border-yellow-500 bg-yellow-500/10 scale-[0.99]'
            : value
            ? 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/60 hover:border-yellow-500'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 hover:border-yellow-500 hover:bg-slate-50 dark:hover:bg-slate-900'
        }`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <p className="text-xs font-bold">Mengompresi & Memproses Gambar...</p>
          </div>
        ) : value ? (
          <>
            {/* Image Preview */}
            <img
              src={value}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Ganti File</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <X className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>

            {/* Success indicator badge */}
            {uploadSuccess && (
              <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                <Check className="w-3 h-3" />
                Berhasil Diunggah!
              </div>
            )}
          </>
        ) : (
          /* Empty State Dropzone */
          <div className="flex flex-col items-center justify-center gap-2.5 text-slate-500 dark:text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Pilih File Gambar atau Tarik ke Sini
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 max-w-xs">
                {helperText}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <ImageIcon className="w-3.5 h-3.5 text-yellow-500" />
              Telusuri Komputer
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-medium mt-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
