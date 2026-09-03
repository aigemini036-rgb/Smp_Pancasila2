import React from 'react';

interface SchoolSilhouetteProps {
  className?: string;
  opacity?: number;
  alt?: string;
}

/**
 * SchoolSilhouette (Placeholder Component)
 * 
 * Architecture Note:
 * This component decouples the school building horizon silhouette from the hero layout
 * and motion system.
 * 
 * Currently serves as a temporary architectural placeholder.
 * When real SMP Pancasila building photography/asset is ready in the future:
 * - Replace the SVG path or pass an <img> inside this component.
 * - The hero's layering, clouds, particles, and responsive container will automatically
 *   work without any refactoring needed.
 */
export default function SchoolSilhouette({
  className = '',
  opacity = 0.28,
  alt = 'Siluet Gedung Sekolah SMP Pancasila (Placeholder)',
}: SchoolSilhouetteProps) {
  return (
    <div
      className={`w-full pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-label={alt}
    >
      {/* 
        Clean architectural school building silhouette placeholder
        Features: flagpole, central administrative pavilion, classroom wings, gabled roofs, and trees.
      */}
      <svg
        viewBox="0 0 1440 220"
        fill="currentColor"
        preserveAspectRatio="none"
        className="w-full h-24 sm:h-32 md:h-44 text-slate-950/90"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle vertical gradient for natural atmospheric depth */}
          <linearGradient id="silhouetteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#090d16" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#050811" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Base Horizon Ground Line */}
        <rect x="0" y="210" width="1440" height="10" fill="url(#silhouetteGrad)" />

        {/* Flanking Trees & Landscape Foliage (Left Side) */}
        <path
          d="M0 215 C15 190 30 185 45 215 C55 180 75 175 90 215 C100 195 120 190 135 215 Z"
          fill="url(#silhouetteGrad)"
          opacity="0.9"
        />
        <circle cx="65" cy="180" r="22" fill="url(#silhouetteGrad)" />
        <circle cx="105" cy="188" r="18" fill="url(#silhouetteGrad)" />

        {/* Left Wing Classrooms */}
        <rect x="140" y="140" width="180" height="72" fill="url(#silhouetteGrad)" />
        <polygon points="135,140 230,105 325,140" fill="url(#silhouetteGrad)" />
        {/* Left Wing Small Windows */}
        <g fill="#1e293b" opacity="0.3">
          <rect x="155" y="152" width="22" height="18" rx="2" />
          <rect x="190" y="152" width="22" height="18" rx="2" />
          <rect x="225" y="152" width="22" height="18" rx="2" />
          <rect x="260" y="152" width="22" height="18" rx="2" />
          <rect x="295" y="152" width="22" height="18" rx="2" />
        </g>

        {/* Left Connector Corridor */}
        <rect x="320" y="155" width="120" height="57" fill="url(#silhouetteGrad)" />
        <polygon points="315,155 380,130 445,155" fill="url(#silhouetteGrad)" />

        {/* Central Administrative Building / Hall (Taller center section) */}
        <rect x="440" y="115" width="260" height="97" fill="url(#silhouetteGrad)" />
        {/* Main Central Gabled Roof & Cupola */}
        <polygon points="430,115 570,65 710,115" fill="url(#silhouetteGrad)" />
        {/* Bell Tower / Central Crest Tower */}
        <rect x="555" y="42" width="30" height="25" fill="url(#silhouetteGrad)" />
        <polygon points="550,42 570,18 590,42" fill="url(#silhouetteGrad)" />
        {/* Flagpole */}
        <line x1="570" y1="18" x2="570" y2="0" stroke="#090d16" strokeWidth="2.5" />
        <polygon points="570,0 588,6 570,12" fill="url(#silhouetteGrad)" />

        {/* Central Entrance Pillars & Steps */}
        <rect x="530" y="165" width="80" height="47" fill="url(#silhouetteGrad)" />
        <polygon points="520,165 570,140 620,165" fill="url(#silhouetteGrad)" />
        <g fill="#1e293b" opacity="0.3">
          <rect x="460" y="130" width="24" height="22" rx="3" />
          <rect x="495" y="130" width="24" height="22" rx="3" />
          <rect x="620" y="130" width="24" height="22" rx="3" />
          <rect x="655" y="130" width="24" height="22" rx="3" />
        </g>

        {/* Right Connector Corridor */}
        <rect x="700" y="155" width="120" height="57" fill="url(#silhouetteGrad)" />
        <polygon points="695,155 760,130 825,155" fill="url(#silhouetteGrad)" />

        {/* Right Wing Classrooms & Laboratories */}
        <rect x="820" y="135" width="220" height="77" fill="url(#silhouetteGrad)" />
        <polygon points="815,135 930,95 1045,135" fill="url(#silhouetteGrad)" />
        {/* Right Wing Windows */}
        <g fill="#1e293b" opacity="0.3">
          <rect x="840" y="150" width="22" height="20" rx="2" />
          <rect x="875" y="150" width="22" height="20" rx="2" />
          <rect x="910" y="150" width="22" height="20" rx="2" />
          <rect x="945" y="150" width="22" height="20" rx="2" />
          <rect x="980" y="150" width="22" height="20" rx="2" />
          <rect x="1015" y="150" width="22" height="20" rx="2" />
        </g>

        {/* Rightmost Science / Library Annex */}
        <rect x="1040" y="150" width="160" height="62" fill="url(#silhouetteGrad)" />
        <polygon points="1035,150 1120,120 1205,150" fill="url(#silhouetteGrad)" />

        {/* Flanking Trees & Landscape Foliage (Right Side) */}
        <circle cx="1235" cy="180" r="25" fill="url(#silhouetteGrad)" />
        <circle cx="1275" cy="175" r="28" fill="url(#silhouetteGrad)" />
        <circle cx="1320" cy="182" r="24" fill="url(#silhouetteGrad)" />
        <circle cx="1370" cy="178" r="30" fill="url(#silhouetteGrad)" />
        <circle cx="1415" cy="185" r="22" fill="url(#silhouetteGrad)" />
        <path
          d="M1200 215 C1225 185 1250 180 1275 215 C1300 170 1340 165 1375 215 C1395 180 1420 185 1440 215 Z"
          fill="url(#silhouetteGrad)"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
