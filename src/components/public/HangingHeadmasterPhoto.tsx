import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface HangingHeadmasterPhotoProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  badge?: React.ReactNode;
}

/**
 * HangingHeadmasterPhoto
 * 
 * Implements the physical suspended photo effect:
 * - Hanging wire / physical anchor bracket at the top
 * - Subtle gentle physical pendulum sway (-1.2° to +1.2°, 7s loop)
 * - Pointer-reactive subtle tilt without bouncing
 * - Full prefers-reduced-motion support (settles on static slight tilt)
 */
export default function HangingHeadmasterPhoto({
  src,
  alt,
  className = 'w-48 h-56 sm:w-56 sm:h-64 rounded-2xl object-cover shadow-xl border-2 border-yellow-500/40',
  containerClassName = '',
  badge,
}: HangingHeadmasterPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Mouse tilt motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Soft spring to avoid rubbery/bouncy physics
  const springConfig = { damping: 25, stiffness: 90 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Subtle angle shift based on pointer
  const pointerRotate = useTransform(smoothX, [-0.5, 0.5], [-2, 2]);
  const pointerTranslateX = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);

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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex flex-col items-center select-none pt-4 ${containerClassName}`}
    >
      {/* 
        PHYSICAL SUSPENSION MOUNT
        Subtle wall nail/bracket and dual suspension cords
      */}
      <div className="flex flex-col items-center z-10 -mb-1 pointer-events-none">
        {/* Brass Anchor Wall Pin */}
        <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border border-amber-700/60 shadow-md flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900/60" />
        </div>

        {/* Hanging Wire V-Strings */}
        <svg
          className="w-24 h-6 text-amber-500/50 overflow-visible"
          viewBox="0 0 96 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="48" y1="0" x2="8" y2="24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="48" y1="0" x2="88" y2="24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 
        SUSPENDED PHOTO FRAME
        Pivots from top center (hang cord apex) with continuous gentle pendulum sway
      */}
      <motion.div
        style={{
          originX: 0.5,
          originY: 0,
          rotate: pointerRotate,
          x: pointerTranslateX,
        }}
        animate={
          reducedMotion
            ? { rotate: -0.5 }
            : {
                rotate: [-1.2, 1.2, -1.2],
              }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
        className="relative rounded-2xl p-1 bg-gradient-to-b from-yellow-500/40 via-slate-700/40 to-yellow-500/20 shadow-2xl backdrop-blur-xs transition-shadow hover:shadow-yellow-500/10"
      >
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={src}
            alt={alt}
            className={`${className} transition-transform duration-500 hover:scale-[1.02]`}
          />
          {badge && <div className="absolute bottom-2 right-2">{badge}</div>}
        </div>
      </motion.div>
    </div>
  );
}
