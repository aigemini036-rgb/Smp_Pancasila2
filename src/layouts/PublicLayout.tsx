import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/public/Header';
import Footer from '../components/public/Footer';
import { getSchoolSettings } from '../utils/storage';
import { MessageCircle, AlertTriangle } from 'lucide-react';

export default function PublicLayout() {
  const settings = getSchoolSettings();
  const whatsappNumber = settings.whatsapp_number || '6281234567890';
  const showWhatsapp = settings.whatsapp_chat_widget_enabled !== false;
  const isMaintenance = settings.maintenance_mode === true;

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d10] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-yellow-500 selection:text-slate-950">
      {/* Maintenance Mode Banner */}
      {isMaintenance && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Website sedang dalam mode pemeliharaan / sinkronisasi data berkala. Beberapa konten mungkin sedang diperbarui.</span>
        </div>
      )}

      <Header />
      <main className="flex-1 bg-white dark:bg-slate-950">
        <Outlet />
      </main>
      <Footer />

      {/* Floating WhatsApp Action Button */}
      {showWhatsapp && (
        <a
          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
            'Halo Admin SMP Pancasila Ponokawan, saya ingin menanyakan informasi seputar sekolah / PPDB.'
          )}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-all duration-200 text-xs font-bold tracking-wide"
          aria-label="Chat WhatsApp CS Sekolah"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span className="hidden sm:inline-block">
            Hubungi Kami (PPDB)
          </span>
        </a>
      )}
    </div>
  );
}
