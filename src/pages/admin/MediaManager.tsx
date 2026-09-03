import { useState, useEffect } from 'react';
import { getMediaFiles, saveMediaFiles, saveMediaFile, deleteMediaFile } from '../../utils/storage';
import { MediaFile } from '../../types';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  FileText,
  ExternalLink,
  Download,
  Filter,
} from 'lucide-react';
import MultiImageUpload from '../../components/admin/MultiImageUpload';
import { usePermission, Permission } from '../../utils/permissions';

export default function MediaManager() {
  const { can } = usePermission();
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);
  const [uploadedBatch, setUploadedBatch] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'doc'>('all');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = () => {
    setMediaList(getMediaFiles());
  };

  const handleSaveUploadedBatch = (images: string[]) => {
    if (images.length === 0) return;

    const newFiles: MediaFile[] = images.map((imgDataUrl, idx) => ({
      id: `media-${Date.now()}-${idx}`,
      file_name: `upload-${new Date().toISOString().slice(0, 10)}-${idx + 1}.jpg`,
      file_path: imgDataUrl,
      file_type: 'image/jpeg',
      file_size: Math.round(imgDataUrl.length * 0.75), // approximate byte size
      alt_text: 'SMP Pancasila Media',
      uploaded_by: 'Admin SMP Pancasila',
      created_at: new Date().toISOString(),
    }));

    const updated = [...newFiles, ...mediaList];
    saveMediaFiles(updated);
    setMediaList(updated);
    setUploadedBatch([]);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus file media "${name}"?`)) {
      deleteMediaFile(id);
      loadMedia();
      if (previewMedia?.id === id) setPreviewMedia(null);
    }
  };

  const handleCopy = (path: string, id: string) => {
    navigator.clipboard.writeText(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filtered = mediaList.filter((item) => {
    const matchesSearch = item.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'image') return item.file_type.startsWith('image/');
    if (filterType === 'doc') return !item.file_type.startsWith('image/');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-yellow-500" />
            <span>Pusat Penyimpanan Media (Media Library)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unggah, kelola, dan salin file foto serta dokumen langsung dari perangkat Anda.
          </p>
        </div>
      </div>

      {/* Upload Zone Card */}
      {can(Permission.UPLOAD_MEDIA) && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <MultiImageUpload
            images={uploadedBatch}
            onChange={(imgs) => {
              setUploadedBatch(imgs);
              handleSaveUploadedBatch(imgs);
            }}
            label="Unggah File Gambar Baru (Pilih / Tarik File ke Kotak di Bawah)"
            helperText="Format JPG, PNG, WEBP, SVG. Gambar akan langsung dikompresi dan disimpan ke dalam sistem."
          />
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama file..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-yellow-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'all'
                ? 'bg-yellow-500 text-slate-900'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Semua ({mediaList.length})
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'image'
                ? 'bg-yellow-500 text-slate-900'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Gambar ({mediaList.filter((m) => m.file_type.startsWith('image/')).length})
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setPreviewMedia(item)}
            className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            <div className="aspect-square bg-slate-100 dark:bg-slate-900 relative overflow-hidden flex items-center justify-center">
              {item.file_type.startsWith('image/') ? (
                <img
                  src={item.file_path}
                  alt={item.file_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <FileText className="w-12 h-12 text-slate-400" />
              )}

              {/* Quick Actions Hover Overlay */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(item.file_path, item.id);
                  }}
                  className="p-2 rounded-xl bg-yellow-500 text-slate-900 hover:bg-yellow-400 font-bold shadow"
                  title="Salin Data URI / URL"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-slate-900" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {can(Permission.DELETE_MEDIA) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id, item.file_name);
                    }}
                    className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-500 font-bold shadow"
                    title="Hapus File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 text-[11px] space-y-1">
              <p className="font-bold text-slate-900 dark:text-white truncate">{item.file_name}</p>
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>{formatBytes(item.file_size)}</span>
                <span>{item.created_at?.slice(0, 10)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700">
          <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            Belum ada file media
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Gunakan kotak upload di atas untuk mengunggah gambar dari komputer Anda.
          </p>
        </div>
      )}

      {/* Preview Dialog */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                {previewMedia.file_name}
              </h3>
              <button
                onClick={() => setPreviewMedia(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="max-h-80 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
              <img
                src={previewMedia.file_path}
                alt={previewMedia.file_name}
                className="max-h-80 w-auto object-contain rounded-2xl"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">
                    Ukuran File:
                  </span>
                  <span>{formatBytes(previewMedia.file_size)}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">
                    Tipe File:
                  </span>
                  <span>{previewMedia.file_type}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">
                    Tanggal Upload:
                  </span>
                  <span>{previewMedia.created_at}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">
                    Diupload Oleh:
                  </span>
                  <span>{previewMedia.uploaded_by}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleCopy(previewMedia.file_path, previewMedia.id)}
                className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold text-xs flex items-center gap-2"
              >
                {copiedId === previewMedia.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Data Gambar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
