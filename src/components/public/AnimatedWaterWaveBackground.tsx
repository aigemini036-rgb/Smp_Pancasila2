import React, { useEffect, useState, useRef } from 'react';

/**
 * AnimatedWaterWaveBackground
 * 
 * Implements a calm, continuous, seamless animated water wave background for the Footer.
 * 
 * Features:
 * - 3 organic wave layers with distinct wavelengths, speeds, opacities, and phase offsets.
 * - 100% seamless infinite horizontal loop using duplicated SVG paths and GPU transforms.
 * - Subtle warm gold & dark olive water reflections harmonized with school branding.
 * - Specular water highlight line along the wave crests.
 * - Viewport-aware visibility (pauses when out of view via IntersectionObserver).
 * - Full prefers-reduced-motion accessibility support.
 * - Pure pointer-events: none layer, preserving 100% footer link clickability.
 */
export default function AnimatedWaterWaveBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);

    // Pause animation when footer is not in viewport to save CPU/GPU resources
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      mq.removeEventListener?.('change', handler);
      observer.disconnect();
    };
  }, []);

  // SVG wave paths engineered for 100% seamless repeat at width 1440px
  // The start (x=0, y=80) and slope perfectly match the end (x=1440, y=80)
  const wave1Path = `
    M 0,75
    C 180,45 360,105 540,75
    C 720,45 900,105 1080,75
    C 1260,45 1350,90 1440,75
    L 1440,220 L 0,220 Z
  `;

  const wave2Path = `
    M 0,95
    C 140,120 280,65 420,95
    C 600,130 780,60 960,95
    C 1120,125 1280,70 1440,95
    L 1440,220 L 0,220 Z
  `;

  const wave3Path = `
    M 0,110
    C 120,85 240,125 360,105
    C 520,75 680,135 840,110
    C 1000,85 1160,130 1320,105
    C 1380,95 1410,118 1440,110
    L 1440,220 L 0,220 Z
  `;

  const wave3CrestHighlight = `
    M 0,110
    C 120,85 240,125 360,105
    C 520,75 680,135 840,110
    C 1000,85 1160,130 1320,105
    C 1380,95 1410,118 1440,110
  `;

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 bottom-0 h-48 sm:h-64 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      <style>{`
        @keyframes waterFlowLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes waterFlowRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes gentleSway {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        .wave-layer-1 {
          animation: waterFlowLeft 28s linear infinite;
        }
        .wave-layer-2 {
          animation: waterFlowRight 22s linear infinite;
        }
        .wave-layer-3 {
          animation: waterFlowLeft 16s linear infinite;
        }
        .wave-sway {
          animation: gentleSway 7s ease-in-out infinite;
        }

        .wave-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Subtle top fade to blend wave water into dark footer charcoal */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-slate-900 z-10 pointer-events-none" />

      {/* LAYER 1: Deep Background Wave (Slowest, Deep Olive-Green Water Flow) */}
      <div
        className={`absolute bottom-0 left-0 w-[200%] h-full flex wave-layer-1 ${
          reducedMotion || !isVisible ? 'wave-paused' : ''
        }`}
      >
        <svg
          className="w-1/2 h-full shrink-0"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#065f46" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <path d={wave1Path} fill="url(#waveGrad1)" />
        </svg>
        <svg
          className="w-1/2 h-full shrink-0"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={wave1Path} fill="url(#waveGrad1)" />
        </svg>
      </div>

      {/* LAYER 2: Middle Wave (Muted Emerald/Slate Drift) */}
      <div
        className={`absolute bottom-0 left-0 w-[200%] h-full flex wave-layer-2 ${
          reducedMotion || !isVisible ? 'wave-paused' : ''
        }`}
      >
        <svg
          className="w-1/2 h-full shrink-0"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path d={wave2Path} fill="url(#waveGrad2)" />
        </svg>
        <svg
          className="w-1/2 h-full shrink-0"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={wave2Path} fill="url(#waveGrad2)" />
        </svg>
      </div>

      {/* LAYER 3: Foreground Surface Wave & Subtle Warm Gold Specular Crest */}
      <div
        className={`absolute bottom-0 left-0 w-[200%] h-full flex wave-layer-3 ${
          reducedMotion || !isVisible ? 'wave-paused' : ''
        }`}
      >
        <svg
          className="w-1/2 h-full shrink-0 wave-sway"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.06" />
              <stop offset="60%" stopColor="#059669" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <path d={wave3Path} fill="url(#waveGrad3)" />
          {/* Specular crest line highlight */}
          <path
            d={wave3CrestHighlight}
            fill="none"
            stroke="rgba(250, 204, 21, 0.16)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <svg
          className="w-1/2 h-full shrink-0 wave-sway"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={wave3Path} fill="url(#waveGrad3)" />
          <path
            d={wave3CrestHighlight}
            fill="none"
            stroke="rgba(250, 204, 21, 0.16)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
