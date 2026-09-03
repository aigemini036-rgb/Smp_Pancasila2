import React, { useEffect, useState, useRef } from 'react';

/**
 * AtmosphericCloudsBackground
 * 
 * Multi-layer seamless animated atmospheric cloud system for the Hero section.
 * 
 * Features:
 * - 3 calibrated depth layers (Far, Mid, Near) with distinct altitudes, opacities, speeds, and shapes.
 * - Calibrated color palette (warm gray, muted olive-slate, subtle golden atmospheric horizon glow)
 *   engineered specifically for clear visual contrast against the dark midnight sky.
 * - 100% seamless GPU-accelerated horizontal drift (w-[200%] flex dual-panel translate3d(-50%, 0, 0))
 *   with ZERO teleportation, flicker, or visible seams.
 * - Soft organic volumetric masses with layered radial falloffs and feathered edges.
 * - Accessibility: full prefers-reduced-motion support (renders as a static atmospheric scene).
 * - Performance: IntersectionObserver pauses GPU animation when out of viewport.
 * - pointer-events: none layer, keeping 100% of hero content interactive.
 */
export default function AtmosphericCloudsBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Accessibility Check: Prefers reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', motionHandler);

    // 2. Performance: Pause CSS keyframes when not in viewport
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
      mq.removeEventListener?.('change', motionHandler);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      <style>{`
        @keyframes cloudDriftFar {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes cloudDriftMid {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes cloudDriftNear {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        .anim-cloud-far {
          animation: cloudDriftFar 120s linear infinite;
        }
        .anim-cloud-mid {
          animation: cloudDriftMid 75s linear infinite;
        }
        .anim-cloud-near {
          animation: cloudDriftNear 48s linear infinite;
        }

        .anim-cloud-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* 
        ========================================================================
        LAYER 1: FAR HIGH-ALTITUDE CLOUDS (Deep Atmospheric Base Masses)
        - High altitude, slow stately drift (~120s)
        - Soft diffuse volume, warm gray/slate tones (#94a3b8, #64748b)
        - Opacity calibrated to ~0.12 for distinct yet subtle sky depth
        ========================================================================
      */}
      <div
        className={`absolute top-0 left-0 w-[200%] h-full flex anim-cloud-far ${
          reducedMotion || !isVisible ? 'anim-cloud-paused' : ''
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* Panel 1 */}
        <div className="w-1/2 h-full shrink-0 relative opacity-75">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="farGrad1" cx="40%" cy="30%" r="55%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.22" />
                <stop offset="50%" stopColor="#64748b" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="farGrad2" cx="75%" cy="25%" r="50%">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.18" />
                <stop offset="60%" stopColor="#475569" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
              <filter id="farBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
            </defs>

            <g filter="url(#farBlur)">
              {/* Cloud Formation Left */}
              <ellipse cx="280" cy="140" rx="320" ry="110" fill="url(#farGrad1)" />
              <ellipse cx="440" cy="110" rx="260" ry="95" fill="url(#farGrad1)" />
              <ellipse cx="160" cy="160" rx="220" ry="80" fill="url(#farGrad1)" />

              {/* Cloud Formation Right */}
              <ellipse cx="1080" cy="130" rx="380" ry="120" fill="url(#farGrad2)" />
              <ellipse cx="1280" cy="160" rx="300" ry="90" fill="url(#farGrad2)" />
              <ellipse cx="920" cy="100" rx="240" ry="85" fill="url(#farGrad2)" />
            </g>
          </svg>
        </div>

        {/* Panel 2 (Identical Seamless Duplicate) */}
        <div className="w-1/2 h-full shrink-0 relative opacity-75">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#farBlur)">
              <ellipse cx="280" cy="140" rx="320" ry="110" fill="url(#farGrad1)" />
              <ellipse cx="440" cy="110" rx="260" ry="95" fill="url(#farGrad1)" />
              <ellipse cx="160" cy="160" rx="220" ry="80" fill="url(#farGrad1)" />

              <ellipse cx="1080" cy="130" rx="380" ry="120" fill="url(#farGrad2)" />
              <ellipse cx="1280" cy="160" rx="300" ry="90" fill="url(#farGrad2)" />
              <ellipse cx="920" cy="100" rx="240" ry="85" fill="url(#farGrad2)" />
            </g>
          </svg>
        </div>
      </div>

      {/* 
        ========================================================================
        LAYER 2: MID-ALTITUDE VOLUMETRIC CLOUDS (Main Cumulostratus Formations)
        - Medium altitude, majestic medium speed (~75s)
        - Rich organic billowing contours, muted olive-gray and silver highlights
        - Opacity calibrated to ~0.16 - 0.20 for unmistakable atmospheric presence
        ========================================================================
      */}
      <div
        className={`absolute top-0 left-0 w-[200%] h-full flex anim-cloud-mid ${
          reducedMotion || !isVisible ? 'anim-cloud-paused' : ''
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* Panel 1 */}
        <div className="w-1/2 h-full shrink-0 relative opacity-85">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Mid Cloud Billow 1: Silver Slate with subtle body */}
              <radialGradient id="midGrad1" cx="50%" cy="35%" r="50%">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.26" />
                <stop offset="45%" stopColor="#94a3b8" stopOpacity="0.14" />
                <stop offset="85%" stopColor="#475569" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>

              {/* Mid Cloud Billow 2: Desaturated Olive-Silver */}
              <radialGradient id="midGrad2" cx="50%" cy="35%" r="50%">
                <stop offset="0%" stopColor="#a1a1aa" stopOpacity="0.24" />
                <stop offset="40%" stopColor="#788b7e" stopOpacity="0.12" />
                <stop offset="85%" stopColor="#334155" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>

              {/* Subtle Warm Horizon Ambient Sheen */}
              <radialGradient id="warmAtmosphere" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#eab308" stopOpacity="0.06" />
                <stop offset="60%" stopColor="#ca8a04" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>

              <filter id="midBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="16" />
              </filter>
            </defs>

            <g filter="url(#midBlur)">
              {/* Central Cumulus Mass (Drifting gracefully across mid section) */}
              <ellipse cx="650" cy="220" rx="380" ry="125" fill="url(#midGrad1)" />
              <ellipse cx="500" cy="240" rx="260" ry="95" fill="url(#midGrad1)" />
              <ellipse cx="820" cy="190" rx="310" ry="110" fill="url(#midGrad2)" />
              <ellipse cx="980" cy="230" rx="240" ry="85" fill="url(#midGrad2)" />

              {/* Left Mid Formation */}
              <ellipse cx="120" cy="260" rx="290" ry="105" fill="url(#midGrad2)" />
              <ellipse cx="280" cy="230" rx="220" ry="85" fill="url(#midGrad1)" />

              {/* Right Mid Formation */}
              <ellipse cx="1320" cy="210" rx="340" ry="115" fill="url(#midGrad1)" />
              <ellipse cx="1180" cy="250" rx="240" ry="90" fill="url(#midGrad2)" />

              {/* Warm Golden Sheen Accent along upper cloud ridges */}
              <ellipse cx="720" cy="170" rx="460" ry="80" fill="url(#warmAtmosphere)" />
            </g>
          </svg>
        </div>

        {/* Panel 2 (Identical Seamless Duplicate) */}
        <div className="w-1/2 h-full shrink-0 relative opacity-85">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#midBlur)">
              <ellipse cx="650" cy="220" rx="380" ry="125" fill="url(#midGrad1)" />
              <ellipse cx="500" cy="240" rx="260" ry="95" fill="url(#midGrad1)" />
              <ellipse cx="820" cy="190" rx="310" ry="110" fill="url(#midGrad2)" />
              <ellipse cx="980" cy="230" rx="240" ry="85" fill="url(#midGrad2)" />

              <ellipse cx="120" cy="260" rx="290" ry="105" fill="url(#midGrad2)" />
              <ellipse cx="280" cy="230" rx="220" ry="85" fill="url(#midGrad1)" />

              <ellipse cx="1320" cy="210" rx="340" ry="115" fill="url(#midGrad1)" />
              <ellipse cx="1180" cy="250" rx="240" ry="90" fill="url(#midGrad2)" />

              <ellipse cx="720" cy="170" rx="460" ry="80" fill="url(#warmAtmosphere)" />
            </g>
          </svg>
        </div>
      </div>

      {/* 
        ========================================================================
        LAYER 3: NEAR HORIZON MIST & WISPS (Low-Altitude Atmospheric Ground Drift)
        - Lower altitude skimming just above the horizon / school silhouette
        - Faster relative movement (~48s) creating dynamic multi-plane parallax depth
        - Opacity ~0.18 - 0.22 with feathered edges
        ========================================================================
      */}
      <div
        className={`absolute top-0 left-0 w-[200%] h-full flex anim-cloud-near ${
          reducedMotion || !isVisible ? 'anim-cloud-paused' : ''
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* Panel 1 */}
        <div className="w-1/2 h-full shrink-0 relative opacity-90">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="nearMistGrad1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.22" />
                <stop offset="40%" stopColor="#94a3b8" stopOpacity="0.12" />
                <stop offset="80%" stopColor="#475569" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="nearMistGrad2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.20" />
                <stop offset="45%" stopColor="#64748b" stopOpacity="0.10" />
                <stop offset="85%" stopColor="#1e293b" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>

              <filter id="nearBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="13" />
              </filter>
            </defs>

            <g filter="url(#nearBlur)">
              {/* Low drifting mist formations */}
              <ellipse cx="380" cy="390" rx="420" ry="90" fill="url(#nearMistGrad1)" />
              <ellipse cx="200" cy="420" rx="280" ry="75" fill="url(#nearMistGrad2)" />
              <ellipse cx="880" cy="380" rx="460" ry="95" fill="url(#nearMistGrad1)" />
              <ellipse cx="1120" cy="410" rx="340" ry="80" fill="url(#nearMistGrad2)" />
              <ellipse cx="640" cy="430" rx="360" ry="85" fill="url(#nearMistGrad2)" />
            </g>
          </svg>
        </div>

        {/* Panel 2 (Identical Seamless Duplicate) */}
        <div className="w-1/2 h-full shrink-0 relative opacity-90">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#nearBlur)">
              <ellipse cx="380" cy="390" rx="420" ry="90" fill="url(#nearMistGrad1)" />
              <ellipse cx="200" cy="420" rx="280" ry="75" fill="url(#nearMistGrad2)" />
              <ellipse cx="880" cy="380" rx="460" ry="95" fill="url(#nearMistGrad1)" />
              <ellipse cx="1120" cy="410" rx="340" ry="80" fill="url(#nearMistGrad2)" />
              <ellipse cx="640" cy="430" rx="360" ry="85" fill="url(#nearMistGrad2)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
