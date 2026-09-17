import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';

interface HeadmasterSectionBackgroundProps {
  imageSrc?: string;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  opacity?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * HeadmasterSectionBackground
 * 
 * 10. PRINCIPAL BACKGROUND IMAGE MOVEMENT:
 * - Subtle depth/movement responding gently to page scroll:
 *   - Background dapat bergeser sedikit (micro Y translation: ±7px)
 *   - Background dapat memiliki subtle scale (1.00 -> 1.018 -> 1.00)
 *   - Foreground tetap lebih stabil
 *   - Movement background jauh lebih kecil daripada gerakan foreground
 * - Strictly avoids:
 *   - NO zoom ekstrem (max scale 1.018)
 *   - NO continuous camera movement (no infinite Ken Burns looping drift)
 *   - NO aggressive parallax (clean, spring-damped micro offset)
 *   - NO image distortion (natural aspect ratio, subtle saturation/contrast)
 * - Text readability preserved via multi-stop high-contrast atmospheric scrims
 * - Full prefers-reduced-motion support (settles safely into static display)
 */
export default function HeadmasterSectionBackground({
  imageSrc,
  position = 'center',
  opacity = 0.35,
  children,
  className = '',
}: HeadmasterSectionBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: '80px 0px' });
  const [hasRevealed, setHasRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // 10. PRINCIPAL BACKGROUND SCROLL KINEMATICS
  // Drives subtle background depth without re-rendering the component
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    damping: 36,
    stiffness: 85,
  });

  // Micro-movement: far smaller than foreground, minimal depth response
  // - Sedikit bergeser (Y translation: -6.5px to +6.5px)
  const bgTranslateY = useTransform(smoothScroll, [0, 1], [-6.5, 6.5]);
  
  // - Sedikit scale (subtle 1.00 -> 1.018 -> 1.00, no extreme zoom)
  const bgScale = useTransform(smoothScroll, [0, 0.5, 1], [1.00, 1.018, 1.00]);

  useEffect(() => {
    // Accessibility: Check prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', motionHandler);

    return () => {
      mq.removeEventListener?.('change', motionHandler);
    };
  }, []);

  useEffect(() => {
    if (isInView && !hasRevealed) {
      setHasRevealed(true);
    }
  }, [isInView, hasRevealed]);

  // Map position prop to CSS object-position
  const getObjectPosition = () => {
    switch (position) {
      case 'top':
        return 'center top';
      case 'bottom':
        return 'center bottom';
      case 'left':
        return 'left center';
      case 'right':
        return 'right center';
      default:
        return 'center center';
    }
  };

  const hasValidImage = Boolean(imageSrc && imageSrc.trim().length > 0);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 transition-colors ${className}`}
    >
      {/* 
        ========================================================================
        DYNAMIC SCHOOL BACKGROUND LAYER WITH SCROLL-REACTIVE DEPTH
        ========================================================================
      */}
      {hasValidImage && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          {/* 
            Mask Reveal Wrapper:
            Smoothly expands clip-path when entering viewport for the first time
          */}
          <motion.div
            initial={
              !reducedMotion
                ? {
                    clipPath: 'polygon(0% 12%, 100% 0%, 100% 88%, 0% 100%)',
                    opacity: 0,
                  }
                : {
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    opacity: 1,
                  }
            }
            animate={
              hasRevealed || reducedMotion
                ? {
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    opacity: 1,
                  }
                : {}
            }
            transition={{
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full h-full relative"
          >
            {/* 
              10. BACKGROUND DEPTH & MOVEMENT LAYER:
              - Grounded & calm: NO continuous camera drift/looping
              - Sedikit translate Y & subtle scale reacting strictly to scroll
              - Significantly smaller displacement than foreground elements
            */}
            <motion.div
              style={{
                y: reducedMotion ? 0 : bgTranslateY,
                scale: reducedMotion ? 1 : bgScale,
                willChange: 'transform',
              }}
              className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)]"
            >
              <img
                src={imageSrc}
                alt="Gedung Sekolah SMP Pancasila"
                loading="lazy"
                decoding="async"
                style={{
                  objectPosition: getObjectPosition(),
                  filter: 'saturate(0.85) contrast(1.02)',
                  opacity: opacity,
                }}
                className="w-full h-full object-cover transition-opacity duration-700"
              />
            </motion.div>

            {/* 
              ATMOSPHERIC CONTRAST & READABILITY OVERLAYS:
              Preserves crystal-clear text readability on foreground text and headmaster photo
            */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/80 to-white/92 dark:from-slate-900/92 dark:via-slate-900/80 dark:to-slate-900/92 transition-opacity duration-500"
              style={{
                opacity: opacity >= 0.9 ? 0.55 : opacity >= 0.7 ? 0.72 : opacity >= 0.45 ? 0.88 : 0.95,
              }}
              aria-hidden="true"
            />
            {/* Soft Edge Depth Vignette */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/55 dark:from-slate-900/35 dark:via-transparent dark:to-slate-900/55 transition-opacity duration-500"
              style={{
                opacity: opacity >= 0.75 ? 0.6 : 1,
              }}
              aria-hidden="true"
            />
          </motion.div>
        </div>
      )}

      {/* 
        ========================================================================
        CONTENT LAYER (Foreground Principal Portrait + Welcome Statement)
        Kept at z-10 for complete interactivity, stability, and maximum sharpness.
        ========================================================================
      */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
