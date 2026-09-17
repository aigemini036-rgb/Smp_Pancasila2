import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView, useScroll } from 'motion/react';

export interface HangingHeadmasterPhotoProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  badge?: React.ReactNode;
  extendWireToTop?: boolean;
  name?: string;
  position?: string;
  nip?: string;
  restingTilt?: number;
  showPlaque?: boolean;
}

/**
 * HangingHeadmasterPhoto
 * 
 * Restores the authentic physical suspended principal photo treatment with subtle sway:
 * - Controlled harmonic sway sequence: LEFT -> CENTER -> RIGHT -> CENTER -> LEFT
 * - Tiny subtle rotation (±1.0°) and tiny translation (±2.5px) for natural suspended physics
 * - Smooth easeInOut harmonic timing (8.5s duration) without elastic, bounce, or jelly effects
 * - 9. SCROLL-REACTIVE PRINCIPAL MOVEMENT:
 *   - Sedikit rotation (±0.65°) responding to scroll direction and inertia
 *   - Sedikit translate & perubahan posisi (Y ±3.5px, X ±1.2px)
 *   - Sedikit depth response (scale 0.993 -> 1.006 -> 0.993, pitch rotateX ±0.75°, depth shadow)
 *   - Minimal, grounded, prevents photo flying or heavy parallax
 * - Active only when in viewport (useInView) to prevent unneeded background animation
 * - Full prefers-reduced-motion support (settles safely into resting tilt)
 * - Sharp, crystal-clear readability preserved at all times
 */
export default function HangingHeadmasterPhoto({
  src,
  alt,
  className = 'w-48 h-56 sm:w-56 sm:h-64 object-cover',
  containerClassName = '',
  badge,
  extendWireToTop = false,
  restingTilt = -2.2,
  showPlaque = true,
}: HangingHeadmasterPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: '80px 0px' });
  const [reducedMotion, setReducedMotion] = useState(false);

  // Mouse tilt motion values for subtle 3D interactive responsiveness
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Soft, physical spring avoiding rubbery/bouncy physics
  const springConfig = { damping: 32, stiffness: 75 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Subtle 3D tilt angles based on cursor location
  const pointerRotateY = useTransform(smoothX, [-0.5, 0.5], [-2.5, 2.5]);
  const pointerRotateX = useTransform(smoothY, [-0.5, 0.5], [1.8, -1.8]);

  // 9. SCROLL-REACTIVE PRINCIPAL MOVEMENT
  // Smooth scroll kinematics connecting the suspended portrait to page motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    damping: 34,
    stiffness: 85,
  });

  // Micro scroll reactions (strictly minimal: no flying, no large rotation, no heavy parallax)
  // - Sedikit rotation: ±0.65° natural suspended inertia responding to scroll progress
  const scrollRotate = useTransform(smoothScroll, [0, 0.5, 1], [-0.65, 0, 0.65]);

  // - Sedikit translate / perubahan posisi: Y ±3.5px, X ±1.2px
  const scrollTranslateY = useTransform(smoothScroll, [0, 0.5, 1], [3.5, 0, -3.5]);
  const scrollTranslateX = useTransform(smoothScroll, [0, 0.5, 1], [-1.2, 0, 1.2]);

  // - Sedikit depth response: subtle scale (0.993 -> 1.006 -> 0.993) & viewing pitch (±0.75°)
  const scrollScale = useTransform(smoothScroll, [0, 0.5, 1], [0.993, 1.006, 0.993]);
  const scrollPitchX = useTransform(smoothScroll, [0, 0.5, 1], [-0.75, 0, 0.75]);

  // Combined 3D tilt (pointer coordinates + scroll viewing pitch)
  const combinedRotateX = useTransform(
    [pointerRotateX, scrollPitchX],
    ([pX, sX]) => (pX as number) + (sX as number)
  );

  // Depth shadow scale modulation
  const scrollShadowScale = useTransform(smoothScroll, [0, 0.5, 1], [0.94, 1.02, 0.94]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Sway state determinations
  const isAnimating = !reducedMotion && isInView;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex flex-col items-center select-none pt-2 sm:pt-4 ${containerClassName}`}
    >
      {/* 
        1. UPPER ARCHITECTURAL SUSPENSION WIRE (Connection to top of section)
      */}
      {extendWireToTop && (
        <div className="absolute -top-7 sm:-top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-0">
          {/* Ceiling/rail anchor bracket */}
          <div className="w-6 h-1.5 rounded-xs bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 shadow-xs border-b border-amber-300/50" />
          {/* Vertical steel/brass tension line */}
          <div className="w-[1.5px] h-7 sm:h-10 bg-gradient-to-b from-amber-600/80 via-amber-400 to-amber-500 shadow-xs" />
        </div>
      )}

      {/* 
        2. PHYSICAL BRASS WALL PIN & V-SUSPENSION WIRE
      */}
      <div className="relative z-20 flex flex-col items-center pointer-events-none -mb-1">
        {/* Machined Brass Anchor Wall Pin */}
        <div className="relative w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 shadow-[0_2px_5px_rgba(0,0,0,0.35)] border border-amber-300/80 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900/80 shadow-inner border border-amber-900/40" />
        </div>

        {/* Dual Braided Suspension Wires (V-Harness) with Eyelet Rings */}
        <svg
          className="w-36 sm:w-44 h-7 text-amber-500/85 dark:text-amber-400/85 overflow-visible drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)]"
          viewBox="0 0 140 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hangingWireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          {/* Left cord */}
          <line x1="70" y1="2" x2="18" y2="26" stroke="url(#hangingWireGrad)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right cord */}
          <line x1="70" y1="2" x2="122" y2="26" stroke="url(#hangingWireGrad)" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Left eyelet screw ring attached to top of frame */}
          <circle cx="18" cy="26" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          <circle cx="18" cy="26" r="1.2" fill="#0f172a" />
          
          {/* Right eyelet screw ring attached to top of frame */}
          <circle cx="122" cy="26" r="3" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          <circle cx="122" cy="26" r="1.2" fill="#0f172a" />
        </svg>
      </div>

      {/* 
        3. SCROLL-REACTIVE PRINCIPAL MOVEMENT (Outer Inertial Grounding Layer)
        Connects the physical suspended portrait to page scrolling:
        - Sedikit rotation: ±0.65°
        - Sedikit translate: Y ±3.5px, X ±1.2px
        - Sedikit perubahan posisi
        - Sedikit depth response: scale 0.993 -> 1.006 -> 0.993
        Strictly minimal, zero photo flying, zero heavy parallax.
      */}
      <motion.div
        style={{
          originX: 0.5,
          originY: -0.15,
          y: reducedMotion ? 0 : scrollTranslateY,
          x: reducedMotion ? 0 : scrollTranslateX,
          rotate: reducedMotion ? 0 : scrollRotate,
          scale: reducedMotion ? 1 : scrollScale,
        }}
        className="relative z-10"
      >
        {/* 
          4. SUSPENDED PENDULUM SWAY (Harmonic Oscillation Layer)
          Controlled motion sequence:
          LEFT -> CENTER -> RIGHT -> CENTER (Seamlessly looping back to LEFT)
          Subtle rotation: ±1.0°
          Tiny translation: ±2.5px
          Timing: 8.5s duration with harmonic easeInOut
        */}
        <motion.div
          style={{
            originX: 0.5,
            originY: -0.15,
          }}
          animate={
            isAnimating
              ? {
                  rotate: [
                    restingTilt - 1.0, // LEFT
                    restingTilt,       // CENTER
                    restingTilt + 1.0, // RIGHT
                    restingTilt,       // CENTER
                    restingTilt - 1.0, // Return to LEFT
                  ],
                  x: [
                    -2.5, // LEFT
                    0,    // CENTER
                    2.5,  // RIGHT
                    0,    // CENTER
                    -2.5, // Return to LEFT
                  ],
                }
              : {
                  rotate: restingTilt,
                  x: 0,
                }
          }
          transition={
            isAnimating
              ? {
                  duration: 8.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.25, 0.5, 0.75, 1],
                }
              : {
                  duration: 0.3,
                }
          }
          className="relative"
        >
          {/* 
            5. INTERACTIVE 3D PERSPECTIVE TILT (Combined Pointer + Scroll Pitch)
          */}
          <motion.div
            style={{
              rotateX: reducedMotion ? 0 : combinedRotateX,
              rotateY: reducedMotion ? 0 : pointerRotateY,
              transformPerspective: 1000,
            }}
            className="relative group"
          >
            {/* 
              ARCHIVAL MUSEUM-GRADE PICTURE FRAME
              Deep mahogany/obsidian moulding with beveled edge, passe-partout matting, and gold accent
            */}
            <div className="relative rounded-2xl p-2 sm:p-2.5 bg-gradient-to-b from-stone-900 via-slate-900 to-stone-950 dark:from-stone-900 dark:via-slate-950 dark:to-black border-2 border-amber-500/40 shadow-[0_22px_45px_-12px_rgba(0,0,0,0.55),0_8px_20px_-6px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-1 ring-amber-400/25 transition-shadow duration-500 group-hover:shadow-[0_28px_55px_-12px_rgba(234,179,8,0.25)]">
              
              {/* Inner Passe-Partout Archival Matting */}
              <div className="relative rounded-xl p-1.5 sm:p-2 bg-stone-100 dark:bg-slate-900/90 border border-amber-500/20 shadow-inner">
                {/* Photo Viewport */}
                <div className="relative rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-xs">
                  <img
                    src={src}
                    alt={alt}
                    className={`${className} transition-transform duration-700 group-hover:scale-[1.02]`}
                    loading="lazy"
                  />

                  {/* Subtle Museum Glass Reflection Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none mix-blend-overlay" />

                  {badge && <div className="absolute bottom-2 right-2 z-10">{badge}</div>}
                </div>
              </div>

              {/* 
                BRASS NAMEPLATE PLAQUE (Anchored to frame bottom)
              */}
              {showPlaque && (
                <div className="mt-2 pt-1 border-t border-amber-500/20 flex flex-col items-center">
                  <div className="px-3 py-0.5 rounded-xs bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-300 text-slate-950 border border-amber-500/60 shadow-xs text-center">
                    <span className="text-[9.5px] font-black uppercase tracking-widest font-mono text-amber-950 block">
                      Kepala Sekolah
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* 
            6. SUSPENDED AMBIENT DEPTH SHADOW (Wall clearance harmonic sway + scroll depth response)
          */}
          <motion.div
            style={{
              scaleX: reducedMotion ? 0.95 : scrollShadowScale,
            }}
            animate={
              isAnimating
                ? {
                    x: [-2, 0, 2, 0, -2],
                    opacity: [0.32, 0.38, 0.32, 0.38, 0.32],
                  }
                : {
                    x: 0,
                    opacity: 0.35,
                  }
            }
            transition={
              isAnimating
                ? {
                    duration: 8.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    times: [0, 0.25, 0.5, 0.75, 1],
                  }
                : {
                    duration: 0.3,
                  }
            }
            className="w-4/5 h-4 mx-auto mt-2 bg-black/35 dark:bg-black/60 blur-md rounded-full pointer-events-none"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

