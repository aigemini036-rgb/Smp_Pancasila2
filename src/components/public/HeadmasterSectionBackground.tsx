import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

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
 * Implements a dynamic, animated cinematic school environment background for the
 * Sambutan Kepala Sekolah section, fed directly from the Admin Panel.
 * 
 * Features:
 * - Dynamic image loading from Admin Panel (with instant fallback to plain card if no image)
 * - Viewport Mask Reveal (triggers when section enters viewport via IntersectionObserver)
 * - Slow, adaptive Ken Burns camera drift (imperceptible, continuous environment feel)
 * - Subtle scroll parallax (0.04x)
 * - Desaturation & contrast balancing with glass vignette overlay ensuring the Principal
 *   portrait remains the primary physical focal point.
 * - Full prefers-reduced-motion support (renders as a static background).
 */
export default function HeadmasterSectionBackground({
  imageSrc,
  position = 'center',
  opacity = 0.35,
  children,
  className = '',
}: HeadmasterSectionBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollYOffset, setScrollYOffset] = useState(0);

  useEffect(() => {
    // 1. Accessibility: Check prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', motionHandler);

    // 2. Viewport Detection for Mask Reveal
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setHasRevealed(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // 3. Subtle Parallax (very low intensity to keep background stable)
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Calculate offset relative to viewport center
        const offset = (rect.top - windowHeight / 2) * 0.04;
        setScrollYOffset(offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      mq.removeEventListener?.('change', motionHandler);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
        DYNAMIC ANIMATED SCHOOL BACKGROUND LAYER
        Only rendered if an image is provided in Admin Panel.
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
                    clipPath: 'polygon(0% 15%, 100% 0%, 100% 85%, 0% 100%)',
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
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier
            }}
            className="w-full h-full relative"
          >
            {/* 
              Ken Burns Camera Motion + Subtle Parallax Layer:
              Very slow, majestic scale (1.00 -> 1.035) and tiny drift
            */}
            <motion.div
              animate={
                !reducedMotion && isInView
                  ? {
                      scale: [1, 1.035, 1],
                      x: ['0%', '-1.2%', '0%'],
                      y: ['0%', '0.8%', '0%'],
                    }
                  : { scale: 1, x: 0, y: 0 }
              }
              transition={{
                duration: 26,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                transform: !reducedMotion ? `translateY(${scrollYOffset}px)` : 'none',
                willChange: 'transform',
              }}
              className="absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)]"
            >
              <img
                src={imageSrc}
                alt="Gedung Sekolah SMP Pancasila"
                loading="lazy"
                decoding="async"
                style={{
                  objectPosition: getObjectPosition(),
                  filter: 'saturate(0.85) contrast(1.05)',
                  opacity: opacity,
                }}
                className="w-full h-full object-cover transition-opacity duration-700"
              />
            </motion.div>

            {/* 
              Cinematic Multi-Stop Atmospheric Overlays:
              - Dynamically adapts based on user's selected opacity (25%, 35%, 50%, 75%, 100%)
              - Preserves crystal-clear text readability on the right and headmaster photo pop
            */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/75 to-white/90 dark:from-slate-900/90 dark:via-slate-900/75 dark:to-slate-900/90 transition-opacity duration-500"
              style={{
                opacity: opacity >= 0.9 ? 0.45 : opacity >= 0.7 ? 0.65 : opacity >= 0.45 ? 0.85 : 0.95,
              }}
              aria-hidden="true"
            />
            {/* Subtle Top & Bottom Shadow Gradients for Card Edge Depth */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50 dark:from-slate-900/30 dark:via-transparent dark:to-slate-900/50 transition-opacity duration-500"
              style={{
                opacity: opacity >= 0.75 ? 0.5 : 1,
              }}
              aria-hidden="true"
            />
          </motion.div>
        </div>
      )}

      {/* 
        ========================================================================
        CONTENT LAYER (Principal Portrait with Hanging Physics + Welcome Text)
        Kept at z-10 for complete interactivity and focal sharpness.
        ========================================================================
      */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
