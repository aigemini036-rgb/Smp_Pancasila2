import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CinematicApertureRevealProps {
  children?: React.ReactNode;
  onRevealComplete?: () => void;
}

/**
 * CinematicApertureReveal
 * 
 * Implements the one-time cinematic iris/aperture opening sequence on initial page load:
 * 1. Mask starts closed with a warm subtle focal aperture ring in center.
 * 2. Aperture iris expands smoothly (1.1s, cubic-bezier(0.22, 1, 0.36, 1)), revealing the Hero environment.
 * 3. Hero content and narrative stagger into view cleanly.
 * 4. Mask finishes and completely unmounts, leaving zero overhead.
 * 5. Strictly adheres to accessibility (prefers-reduced-motion immediately renders without mask).
 * 6. NO demo controls or buttons (as required by effect restoration guidelines).
 */
export default function CinematicApertureReveal({
  children,
  onRevealComplete,
}: CinematicApertureRevealProps) {
  const [isOpening, setIsOpening] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Accessibility Check
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReducedMotion(true);
      setIsOpening(false);
      setHasCompleted(true);
      onRevealComplete?.();
      return;
    }

    // Check session so it's a polite one-time entry experience per visit
    const hasSeenIntro = sessionStorage.getItem('pancasila_intro_seen');
    if (hasSeenIntro) {
      setIsOpening(false);
      setHasCompleted(true);
      onRevealComplete?.();
      return;
    }

    // Mark as seen for session
    sessionStorage.setItem('pancasila_intro_seen', 'true');

    // Trigger opening sequence
    const timer = setTimeout(() => {
      setIsOpening(false);
    }, 450);

    const completeTimer = setTimeout(() => {
      setHasCompleted(true);
      onRevealComplete?.();
    }, 1600);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onRevealComplete]);

  if (hasCompleted || reducedMotion) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* 
        Aperture Mask Shutter Overlay
        Opens smoothly with radial iris clip-path
      */}
      <AnimatePresence>
        {!hasCompleted && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={isOpening ? { opacity: 1 } : { opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
          >
            {/* Shutter Blade Mask */}
            <motion.div
              initial={{ clipPath: 'circle(0% at 50% 45%)' }}
              animate={
                isOpening
                  ? { clipPath: 'circle(12% at 50% 45%)' }
                  : { clipPath: 'circle(150% at 50% 45%)' }
              }
              transition={{
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-0 bg-slate-950/95 flex items-center justify-center"
            >
              {/* Center Focal Aperture Ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={
                  isOpening
                    ? { scale: 1, opacity: 0.9 }
                    : { scale: 2.2, opacity: 0 }
                }
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.15)] flex items-center justify-center pointer-events-none"
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-yellow-500/20" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {children}
    </div>
  );
}
