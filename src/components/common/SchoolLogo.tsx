import React, { useId } from 'react';

interface SchoolLogoProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  xs: 'w-7 h-8',
  sm: 'w-9 h-10',
  md: 'w-11 h-12',
  lg: 'w-14 h-16 sm:w-16 sm:h-18',
  xl: 'w-20 h-23 sm:w-24 sm:h-28',
};

/**
 * SchoolLogo
 * Menampilkan foto logo resmi SMP Pancasila Ponokawan (YTP Al-Hidayah Krian)
 * tanpa mengubah foto asli dari pengguna.
 * Frame luar disesuaikan secara presisi mengikuti bentuk perisai (shield) lambang,
 * menggantikan kotak persegi kaku.
 */
export default function SchoolLogo({
  src,
  alt = 'Logo Resmi SMP Pancasila Ponokawan Sidoarjo',
  size = 'md',
  className = '',
}: SchoolLogoProps) {
  const rawId = useId();
  const clipId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
  const dimensions = sizeMap[size] || sizeMap.md;

  // Menggunakan foto asli yang dikirim/diunggah pengguna
  const effectiveSrc =
    src && !src.includes('unsplash.com') && !src.includes('photo-1546410531')
      ? src
      : '/logo-smp-pancasila.png';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-300 ease-out group-hover:scale-105 select-none ${dimensions} ${className}`}
      title={alt}
    >
      {/* 
        Frame Bentuk Perisai (Shield Contour):
        Menyesuaikan frame luar agar persis mengikuti siluet perisai lambang 
        SMP Pancasila Ponokawan, bukan kotak persegi kaku.
      */}
      <svg
        viewBox="0 0 100 112"
        className="w-full h-full overflow-visible filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Shield Clip Path persis siluet perisai lambang */}
          <clipPath id={`shield-clip-${clipId}`}>
            <path
              d="M 50 2
                 C 55 2.5, 88 11, 96 30
                 L 83 88
                 C 73 98, 61 106, 50 108
                 C 39 106, 27 98, 17 88
                 L 4 30
                 C 12 11, 45 2.5, 50 2 Z"
            />
          </clipPath>
        </defs>

        {/* Latar belakang bentuk perisai */}
        <path
          d="M 50 2
             C 55 2.5, 88 11, 96 30
             L 83 88
             C 73 98, 61 106, 50 108
             C 39 106, 27 98, 17 88
             L 4 30
             C 12 11, 45 2.5, 50 2 Z"
          fill="#0f172a"
        />

        {/* Foto asli yang dikirim/diunggah pengguna (tanpa diubah) */}
        <g clipPath={`url(#shield-clip-${clipId})`}>
          <image
            href={effectiveSrc}
            x="0"
            y="0"
            width="100"
            height="112"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>

        {/* Frame Lis Luar Warna Kuning Emas / Gold mengikuti bentuk perisai */}
        <path
          d="M 50 2
             C 55 2.5, 88 11, 96 30
             L 83 88
             C 73 98, 61 106, 50 108
             C 39 106, 27 98, 17 88
             L 4 30
             C 12 11, 45 2.5, 50 2 Z"
          fill="none"
          stroke="#facc15"
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Lis Dalam Halus Berwarna Putih */}
        <path
          d="M 50 5
             C 54 5.5, 84 13.5, 92 31
             L 80 85
             C 70 95, 59 102, 50 104
             C 41 102, 30 95, 20 85
             L 8 31
             C 16 13.5, 46 5.5, 50 5 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeOpacity="0.8"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
