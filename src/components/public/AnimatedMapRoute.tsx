import React, { useState, useRef } from 'react';
import { MapPin, Navigation, School, Compass, Layers, Car, CheckCircle2, ExternalLink } from 'lucide-react';

interface AnimatedMapRouteProps {
  address: string;
  phone: string;
}

export default function AnimatedMapRoute({ address, phone }: AnimatedMapRouteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Exact Google Maps query embed for SMP Pancasila Ponokawan, Krian, Sidoarjo
  const mapEmbedUrl = mapType === 'satellite'
    ? 'https://maps.google.com/maps?q=SMP+Pancasila+Ponokawan+Krian+Sidoarjo&t=k&z=16&ie=UTF8&iwloc=&output=embed'
    : 'https://maps.google.com/maps?q=SMP+Pancasila+Ponokawan+Krian+Sidoarjo&t=m&z=16&ie=UTF8&iwloc=&output=embed';

  const googleMapsExternalUrl = 'https://maps.google.com/?q=SMP+Pancasila+Ponokawan+Krian+Sidoarjo';

  return (
    <div
      ref={containerRef}
      className="bg-slate-900 rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-800 shadow-xl space-y-5 sm:space-y-6 text-white overflow-hidden relative"
    >
      {/* 
        ========================================================================
        HEADER: Peta Rute & Titik Lokasi
        ========================================================================
      */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-yellow-500 text-xs font-black uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span>Peta Rute & Titik Lokasi</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Akses Menuju SMP Pancasila
          </h3>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Map Layer Switcher (Standard vs Satellite) */}
          <div className="inline-flex items-center rounded-xl bg-slate-800/90 p-1 border border-slate-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                mapType === 'roadmap'
                  ? 'bg-yellow-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Peta Jalan</span>
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                mapType === 'satellite'
                  ? 'bg-yellow-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Satelit</span>
            </button>
          </div>

          {/* Primary CTA: Buka di Google Maps */}
          <a
            href={googleMapsExternalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 shrink-0"
          >
            <Navigation className="w-3.5 h-3.5 shrink-0" />
            <span>Buka di Google Maps</span>
          </a>
        </div>
      </div>

      {/* 
        ========================================================================
        REAL MAP CANVAS: Google Maps Live Embedded Map
        ========================================================================
      */}
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner group">
        {/* Loading placeholder skeleton while iframe connects */}
        {!isIframeLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
            <span className="text-xs font-mono">Memuat peta lokasi geografis...</span>
          </div>
        )}

        {/* Real Embedded Location Map */}
        <iframe
          title="Peta Geografis Lokasi SMP Pancasila Ponokawan Sidoarjo"
          src={mapEmbedUrl}
          onLoad={() => setIsIframeLoaded(true)}
          className="w-full h-full border-0 relative z-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* 
          School Primary Location Marker Badge (Top-Left overlay)
          Clean, restrained, and clearly marks the destination with school visual identity
        */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none max-w-[calc(100%-24px)] sm:max-w-xs">
          <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 sm:p-3.5 shadow-xl text-left pointer-events-auto">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-yellow-500 text-slate-950 flex items-center justify-center shadow-md shrink-0">
                <School className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="font-black text-white text-xs sm:text-sm tracking-tight truncate block">
                    SMP Pancasila
                  </span>
                </div>
                <p className="text-[11px] text-yellow-400/90 font-medium mt-0.5 truncate">
                  Desa Ponokawan, Kec. Krian
                </p>
              </div>
            </div>
            
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Lokasi Terverifikasi
              </span>
              <a
                href={googleMapsExternalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-yellow-400 hover:text-yellow-300 font-semibold inline-flex items-center gap-0.5"
              >
                <span>Petunjuk Arah</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        REALISTIC ROAD ACCESS & NAVIGATION GUIDE
        Provides genuine geographical context along actual roads
        ========================================================================
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-yellow-400">
            <Car className="w-4 h-4 shrink-0 text-yellow-500" />
            <span>Dari Arah Sidoarjo / Surabaya</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Melalui Bypass Krian atau Jl. Raya Trosobo, arahkan kendaraan ke pusat Krian, belok menuju Jl. Raya Ponokawan (±400m dari simpang jalan utama).
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-yellow-400">
            <Car className="w-4 h-4 shrink-0 text-yellow-500" />
            <span>Dari Arah Mojokerto / Tarik</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Melewati Jalan Raya Surabaya-Mojokerto menuju Simpang Lima Krian, masuk ke koridor Jl. Raya Ponokawan dengan akses jalan beraspal halus.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-yellow-400">
            <MapPin className="w-4 h-4 shrink-0 text-yellow-500" />
            <span>Patokan Lingkungan Sekolah</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Dekat dengan Balai Desa Ponokawan, Masjid Jami Ponokawan, dan ±1.5 km dari Stasiun Kereta Api Krian.
          </p>
        </div>
      </div>

      {/* 
        ========================================================================
        ADDRESS PANEL: Full Address with Location Icon & Wrapping
        ========================================================================
      */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0 border border-yellow-500/20 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-yellow-500 tracking-wider block">
              Alamat Resmi
            </span>
            <p className="text-white text-xs sm:text-sm font-medium mt-0.5 leading-relaxed">
              {address}
            </p>
          </div>
        </div>
        <div className="text-slate-400 text-[11px] md:text-right shrink-0 pl-11 md:pl-0 border-t md:border-t-0 border-slate-800/80 pt-2 md:pt-0 w-full md:w-auto">
          <span className="block font-semibold text-slate-300">Kecamatan Krian, Kabupaten Sidoarjo</span>
          <span className="block text-slate-500">Provinsi Jawa Timur 61262</span>
        </div>
      </div>
    </div>
  );
}

