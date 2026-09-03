import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, RefreshCw, Check, AlertCircle, Plus } from 'lucide-react';
import { processAndCompressImage } from './ImageUpload';

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  helperText?: string;
  maxFiles?: number;
  className?: string;
}

export default function MultiImageUpload({
  images,
  onChange,
  label = 'Upload Foto-Foto Galeri',
  helperText = 'Format JPG, PNG, WEBP (Bisa pilih/tarik beberapa foto sekaligus)',
  maxFiles = 20,
  className = '',
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));

    if (fileArray.length === 0) {
      setError('Tidak ada file gambar valid yang dipilih.');
      return;
    }

    if (images.length + fileArray.length > maxFiles) {
      setError(`Maksimal ${maxFiles} foto dalam satu waktu.`);
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const processed = await Promise.all(
        fileArray.map((file) => processAndCompressImage(file, 1400, 1400, 0.85))
      );
      onChange([...images, ...processed]);
    } catch (err) {
      console.error('Error processing batch images:', err);
      setError('Sebagian gambar gagal diproses.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label} ({images.length} foto)
        </label>
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] font-bold text-red-500 hover:text-red-600 transition-colors"
          >
            Hapus Semua
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />

      {/* Grid of uploaded images + Add Button */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <img
              src={imgUrl}
              alt={`Upload ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
              title="Hapus foto ini"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
              #{idx + 1}
            </span>
          </div>
        ))}

        {/* Dropzone / Add Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`aspect-square rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-3 text-center ${
            isDragging
              ? 'border-yellow-500 bg-yellow-500/10'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:border-yellow-500 hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-1.5 text-yellow-600 dark:text-yellow-400">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-[10px] font-bold">Mengunggah...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <div className="w-9 h-9 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Tambah Foto
              </span>
              <span className="text-[10px] text-slate-400">Pilih / Tarik File</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500">{helperText}</p>

      {error && (
        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
