import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface CinematicApertureRevealProps {
  children: React.ReactNode;
  onRevealComplete?: () => void;
}

/**
 * CinematicApertureReveal
 * 
 * Implements the authentic SMP Pancasila Cinematic Mask / Aperture Reveal:
 * 
 * Behavior sequence:
 * PAGE LOAD
 * ↓
 * MASK / APERTURE berada pada kondisi awal (focal ring at center, mask closed)
 * ↓
 * mask terbuka secara cinematic (radial iris expands smoothly with [0.16, 1, 0.3, 1] cubic-bezier)
 * ↓
 * Hero terungkap (institutional canvas, particle grid, and ambient glow unveiled)
 * ↓
 * content Hero muncul dengan halus (staggered emergence)
 * ↓
 * animation selesai (clip-path clears to 'none', overlay cleanly unmounts)
 * ↓
 * Hero tetap stabil (100% stable DOM, zero ongoing loops, fully interactive)
 */
export interface CinematicApertureContextValue {
  isOpen: boolean;
  isCompleted: boolean;
}

export const CinematicApertureContext = React.createContext<CinematicApertureContextValue>({
  isOpen: true,
  isCompleted: true,
});

export function useCinematicAperture() {
  return React.useContext(CinematicApertureContext);
}

export default function CinematicApertureReveal({
  children,
  onRevealComplete,
}: CinematicApertureRevealProps) {
  const prefersReduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Immediate bypass for accessibility (prefers-reduced-motion)
    if (prefersReduced) {
      setIsOpen(true);
      setIsCompleted(true);
      onRevealComplete?.();
      return;
    }

    // 1. PAGE LOAD: Aperture starts at initial condition
    // After 180ms, initiate the smooth cinematic aperture opening
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 180);

    // 2. Animation completion at 1550ms:
    // Completely unmounts overlay and clears clipPath to 'none' for rock-solid stability
    const completeTimer = setTimeout(() => {
      setIsCompleted(true);
      onRevealComplete?.();
    }, 1550);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(completeTimer);
    };
  }, [prefersReduced, onRevealComplete]);

  // If user prefers reduced motion, render children immediately without any mask
  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full overflow-hidden bg-[#0c0d10]">
      {/* 
        HERO CONTAINER WITH CINEMATIC APERTURE MASK
        Initially clipped at focal center (50% 40%), then expands outward to 150%
        When complete, clipPath is set to 'none' so no clipping or GPU overhead remains
      */}
      <motion.div
        initial={{ clipPath: 'circle(0% at 50% 40%)' }}
        animate={{
          clipPath: isOpen ? 'circle(150% at 50% 40%)' : 'circle(0% at 50% 40%)',
        }}
        transition={{
          duration: 1.25,
          ease: [0.16, 1, 0.3, 1], // Cinematic smooth deceleration cubic-bezier
        }}
        style={{
          clipPath: isCompleted ? 'none' : undefined,
          willChange: isCompleted ? 'auto' : 'clip-path',
        }}
        className="w-full h-full"
      >
        <CinematicApertureContext.Provider value={{ isOpen, isCompleted }}>
          {children}
        </CinematicApertureContext.Provider>
      </motion.div>

      {/* 
        CINEMATIC APERTURE LENS & SHUTTER OVERLAY
        Visible at initial condition, expands smoothly outward and fades away
        Unmounts cleanly upon animation completion
      */}
      <AnimatePresence>
        {!isCompleted && (
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center z-30 overflow-hidden"
            style={{ top: 0, left: 0 }}
          >
            {/* Focal Aperture Mechanism centered at 50% 40% */}
            <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              {/* Expanding Iris Frame */}
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{
                  scale: isOpen ? 2.4 : 1,
                  opacity: isOpen ? 0 : 1,
                }}
                transition={{
                  duration: 0.95,
                  ease: [0.16, 1, 0.3, 1],
                  delay: isOpen ? 0.05 : 0,
                }}
                className="relative flex items-center justify-center"
              >
                {/* Outer Precision Lens Ring */}
                <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.25)] flex items-center justify-center relative">
                  {/* Subtle 8-axis Aperture Blade Ticks */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="rgba(234, 179, 8, 0.35)"
                      strokeWidth="0.75"
                      strokeDasharray="2 10"
                    />
                    {/* Aperture blades radial guide lines */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                      <line
                        key={deg}
                        x1="50"
                        y1="10"
                        x2="50"
                        y2="16"
                        stroke="rgba(234, 179, 8, 0.6)"
                        strokeWidth="1.2"
                        transform={`rotate(${deg} 50 50)`}
                      />
                    ))}
                  </svg>

                  {/* Inner Concentric Hairline Ring */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-yellow-500/35 flex items-center justify-center">
                    {/* Core Reticle */}
                    <div className="w-8 h-8 rounded-full border border-yellow-400/50 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.9)]" />
                    </div>
                  </div>
                </div>

                {/* Ambient Warm Golden Focal Aura */}
                <div className="absolute w-44 h-44 sm:w-60 sm:h-60 bg-yellow-500/20 rounded-full blur-2xl pointer-events-none" />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
