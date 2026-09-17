import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { Trophy, ArrowRight, Award, Sparkles } from 'lucide-react';
import { Achievement } from '../../types';

export type ShuffleStage =
  | 'stack'
  | 'card_a_moves'
  | 'card_b_moves'
  | 'card_c_moves'
  | 'reposition'
  | 'settle'
  | 'stable'
  | 'final';

export type ViewportBreakpoint = 'desktop' | 'tablet' | 'mobile';

interface AchievementCardStackProps {
  achievements: Achievement[];
  title?: string;
  subtitle?: string;
  autoPlayShuffle?: boolean;
  autoTransitionToGrid?: boolean;
  autoPlayDelay?: number; // Delay in ms before starting shuffle on inView
  maxCards?: number; // Max cards to display in the stack (default 3)
}

/**
 * 18. ACHIEVEMENT CARD STACK, 19. ACHIEVEMENT SHUFFLE / REPOSITION,
 * & 20. ACHIEVEMENT AUTO POSITION ADJUSTMENT
 * 
 * After stack/shuffle/reposition finishes:
 * - Automatically adjusts position to:
 *   1. Number of cards (1, 2, or 3+)
 *   2. Container width (via ResizeObserver)
 *   3. Viewport width & Breakpoints (Desktop, Tablet, Mobile)
 * - Desktop: Layout follows desktop space (up to 3 columns, full span).
 * - Tablet: Layout adjusts cleanly (2-column adaptive flow, centered 3rd card, no horizontal overflow).
 * - Mobile: Layout remains tidy and vertical, never forcing rigid desktop structures.
 * - Zero fixed coordinates (all transforms use relative container percentages and CSS Grid).
 * - Responsive behavior is never compromised by animation.
 */
export default function AchievementCardStack({
  achievements,
  title = 'Kebanggaan Civitas Akademika',
  subtitle = 'Arsip Prestasi & Kejuaraan',
  autoPlayShuffle,
  autoTransitionToGrid,
  autoPlayDelay = 1000,
  maxCards = 3,
}: AchievementCardStackProps) {
  const shouldAutoPlay = autoPlayShuffle !== undefined ? autoPlayShuffle : (autoTransitionToGrid ?? true);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-60px' });

  // Current choreography stage
  const [stage, setStage] = useState<ShuffleStage>('stack');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Responsive container & breakpoint tracking (20. ACHIEVEMENT AUTO POSITION ADJUSTMENT)
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Timers tracker
  const timerRefs = useRef<number[]>([]);

  // Display items adapted to available achievements & maxCards (1, 2, or 3)
  const displayItems = useMemo(() => {
    return achievements.slice(0, Math.max(1, Math.min(achievements.length, maxCards)));
  }, [achievements, maxCards]);

  const cardCount = displayItems.length;

  // Derive responsive breakpoint from container width & viewport width
  // Desktop: container >= 960px and viewport >= 1024px
  // Tablet: (600px <= container < 960px) or (640px <= viewport < 1024px)
  // Mobile: container < 600px or viewport < 640px
  const breakpoint: ViewportBreakpoint = useMemo(() => {
    if (containerWidth < 600 || viewportWidth < 640) {
      return 'mobile';
    }
    if (containerWidth < 960 || viewportWidth < 1024) {
      return 'tablet';
    }
    return 'desktop';
  }, [containerWidth, viewportWidth]);

  // Active columns based on breakpoint and actual card count
  const activeColumns = useMemo(() => {
    if (breakpoint === 'mobile' || cardCount === 1) return 1;
    if (breakpoint === 'tablet') return Math.min(cardCount, 2);
    return Math.min(cardCount, 3);
  }, [breakpoint, cardCount]);

  // Track viewport & container resize via ResizeObserver
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);

    const handleWindowResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleWindowResize);

    // Attach ResizeObserver to gridContainer
    let ro: ResizeObserver | null = null;
    if (gridContainerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect) {
            setContainerWidth(entry.contentRect.width);
          }
        }
      });
      ro.observe(gridContainerRef.current);
    } else if (gridContainerRef.current) {
      setContainerWidth(gridContainerRef.current.clientWidth);
    }

    return () => {
      mq.removeEventListener?.('change', handler);
      window.removeEventListener('resize', handleWindowResize);
      if (ro) ro.disconnect();
      clearAllTimers();
    };
  }, []);

  const clearAllTimers = () => {
    timerRefs.current.forEach((id) => window.clearTimeout(id));
    timerRefs.current = [];
  };

  // Choreographed Sequence adapted to card count:
  // STACK -> CARD A/B/C (MOVE) -> REPOSITION (DECELERATE) -> SETTLE (FINAL POSITION) -> STABLE
  const runSequence = (fromBeginning = true) => {
    clearAllTimers();
    setIsPlaying(true);

    if (fromBeginning) {
      setStage('stack');
    }

    if (reducedMotion) {
      // For reduced motion users, jump directly to stable arrangement
      setStage('stable');
      setIsPlaying(false);
      return;
    }

    if (cardCount === 1) {
      // Single card: stack -> move -> decelerate -> settle -> stable
      const t1 = window.setTimeout(() => setStage('card_a_moves'), 600);
      const t2 = window.setTimeout(() => setStage('reposition'), 1200);
      const t3 = window.setTimeout(() => setStage('settle'), 1800);
      const t4 = window.setTimeout(() => {
        setStage('stable');
        setIsPlaying(false);
      }, 2400);
      timerRefs.current = [t1, t2, t3, t4];
      return;
    }

    if (cardCount === 2) {
      // Two cards: stack -> card_a (move) -> card_b (move) -> reposition (decelerate) -> settle -> stable
      const t1 = window.setTimeout(() => setStage('card_a_moves'), 700);
      const t2 = window.setTimeout(() => setStage('card_b_moves'), 1450);
      const t3 = window.setTimeout(() => setStage('reposition'), 2150);
      const t4 = window.setTimeout(() => setStage('settle'), 2850);
      const t5 = window.setTimeout(() => {
        setStage('stable');
        setIsPlaying(false);
      }, 3450);
      timerRefs.current = [t1, t2, t3, t4, t5];
      return;
    }

    // 3 or more cards: full sequence
    // STACK -> CARD A MOVES -> CARD B MOVES -> CARD C MOVES -> DECELERATE -> SETTLE -> STABLE
    const t1 = window.setTimeout(() => setStage('card_a_moves'), 700);
    const t2 = window.setTimeout(() => setStage('card_b_moves'), 1450);
    const t3 = window.setTimeout(() => setStage('card_c_moves'), 2200);
    const t4 = window.setTimeout(() => setStage('reposition'), 2950);
    const t5 = window.setTimeout(() => setStage('settle'), 3650);
    const t6 = window.setTimeout(() => {
      setStage('stable');
      setIsPlaying(false);
    }, 4250);

    timerRefs.current = [t1, t2, t3, t4, t5, t6];
  };

  // Auto-play when scrolled in view
  useEffect(() => {
    if (inView && shouldAutoPlay && !hasAutoPlayed && !reducedMotion) {
      const initTimer = window.setTimeout(() => {
        setHasAutoPlayed(true);
        runSequence(true);
      }, autoPlayDelay);
      return () => window.clearTimeout(initTimer);
    }
  }, [inView, shouldAutoPlay, hasAutoPlayed, reducedMotion, autoPlayDelay]);

  /**
   * 20. ACHIEVEMENT AUTO POSITION ADJUSTMENT & 21. ACHIEVEMENT CARD SETTLE
   * 
   * Dynamic relative transforms per card according to:
   * - Breakpoint (desktop, tablet, mobile)
   * - Active columns
   * - Card count (1, 2, 3)
   * 
   * Motion flow:
   * MOVE -> DECELERATE (reposition) -> FINAL POSITION (settle) -> STABLE
   * 
   * In 'settle', 'stable', and 'final' stages:
   * ALL coordinates return to exact zero ({ x: 0, y: 0, rotate: 0, scale: 1 }),
   * resting completely in CSS Grid flow with zero residual offsets.
   */
  const getCardTransform = (cardIndex: number) => {
    // FINAL POSITION & STABLE: pure resting coordinates in CSS Grid
    if (stage === 'settle' || stage === 'stable' || stage === 'final') {
      return { x: 0, y: 0, rotate: 0, scale: 1.0, zIndex: 10 };
    }

    // DECELERATE (reposition stage):
    // Cards arrive near their slots with deceleration, holding a subtle
    // micro-lift (2-3px) & gentle micro-tilt before performing the settle transition.
    if (stage === 'reposition') {
      if (cardIndex === 0) {
        return { x: '0%', y: -2.5, rotate: -0.25, scale: 1.004, zIndex: 22 };
      }
      if (cardIndex === 1) {
        return { x: '0%', y: -3.5, rotate: 0.3, scale: 1.004, zIndex: 21 };
      }
      return { x: '0%', y: -2.5, rotate: -0.2, scale: 1.004, zIndex: 20 };
    }

    // If single card:
    if (cardCount === 1) {
      if (stage === 'stack') {
        return { x: 0, y: -8, rotate: -1.5, scale: 0.98, zIndex: 20 };
      }
      return { x: 0, y: 0, rotate: 0, scale: 1.0, zIndex: 10 };
    }

    // If Desktop (3 columns when 3 cards, 2 columns when 2 cards):
    if (breakpoint === 'desktop') {
      if (cardCount === 2) {
        // 2 cards on desktop
        switch (stage) {
          case 'stack': {
            if (cardIndex === 0) {
              return { x: 'calc(50% + 0.75rem)', y: 0, rotate: -2, scale: 1.0, zIndex: 30 };
            }
            return { x: 'calc(-50% - 0.75rem)', y: 6, rotate: 2, scale: 0.96, zIndex: 20 };
          }
          case 'card_a_moves': {
            if (cardIndex === 0) {
              return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 30 };
            }
            return { x: 'calc(-50% - 0.75rem)', y: 4, rotate: 1.5, scale: 0.97, zIndex: 20 };
          }
          case 'card_b_moves':
          case 'card_c_moves': {
            return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 20 };
          }
          default:
            return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 10 };
        }
      } else {
        // 3 cards on desktop
        switch (stage) {
          case 'stack': {
            if (cardIndex === 0) {
              // CARD A: on top of center slot
              return { x: 'calc(100% + 1.5rem)', y: 0, rotate: -2, scale: 1.0, zIndex: 30 };
            }
            if (cardIndex === 1) {
              // CARD B: middle of center slot
              return { x: '0%', y: 6, rotate: 1.5, scale: 0.97, zIndex: 20 };
            }
            // CARD C: bottom of center slot
            return { x: 'calc(-100% - 1.5rem)', y: 12, rotate: 3.5, scale: 0.94, zIndex: 10 };
          }
          case 'card_a_moves': {
            if (cardIndex === 0) {
              return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 30 };
            }
            if (cardIndex === 1) {
              return { x: '0%', y: 4, rotate: 1.5, scale: 0.97, zIndex: 20 };
            }
            return { x: 'calc(-100% - 1.5rem)', y: 10, rotate: 3.5, scale: 0.94, zIndex: 10 };
          }
          case 'card_b_moves': {
            if (cardIndex === 0) {
              return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 20 };
            }
            if (cardIndex === 1) {
              return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 25 };
            }
            return { x: 'calc(-100% - 1.5rem)', y: 6, rotate: 2.5, scale: 0.95, zIndex: 15 };
          }
          case 'card_c_moves': {
            return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 20 };
          }
          default:
            return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 10 };
        }
      }
    }

    // If Tablet (2-column adaptive layout):
    if (breakpoint === 'tablet') {
      switch (stage) {
        case 'stack': {
          if (cardIndex === 0) {
            // Card A centered over slot 0
            return { x: 'calc(50% + 0.75rem)', y: 0, rotate: -2, scale: 1.0, zIndex: 30 };
          }
          if (cardIndex === 1) {
            // Card B stacked under Card A at center
            return { x: 'calc(-50% - 0.75rem)', y: 6, rotate: 2, scale: 0.96, zIndex: 20 };
          }
          // Card C (row 2) stacked behind at center
          return { x: 0, y: 'calc(-100% - 1.5rem)', rotate: 3.5, scale: 0.93, zIndex: 10 };
        }
        case 'card_a_moves': {
          if (cardIndex === 0) {
            return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 30 };
          }
          if (cardIndex === 1) {
            return { x: 'calc(-50% - 0.75rem)', y: 4, rotate: 1.5, scale: 0.96, zIndex: 20 };
          }
          return { x: 0, y: 'calc(-100% - 1.5rem)', rotate: 3.5, scale: 0.93, zIndex: 10 };
        }
        case 'card_b_moves': {
          if (cardIndex === 0) {
            return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 20 };
          }
          if (cardIndex === 1) {
            return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 25 };
          }
          return { x: 0, y: 'calc(-100% - 1.5rem)', rotate: 2.5, scale: 0.94, zIndex: 15 };
        }
        case 'card_c_moves': {
          return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 20 };
        }
        default:
          return { x: '0%', y: 0, rotate: 0, scale: 1.0, zIndex: 10 };
      }
    }

    // If Mobile (1 column vertical stack):
    switch (stage) {
      case 'stack': {
        if (cardIndex === 0) {
          return { x: 0, y: '0%', rotate: -1.5, scale: 1.0, zIndex: 30 };
        }
        if (cardIndex === 1) {
          return { x: 4, y: 'calc(-100% - 1.25rem)', rotate: 1.5, scale: 0.96, zIndex: 20 };
        }
        return { x: 8, y: 'calc(-200% - 2.5rem)', rotate: 3, scale: 0.92, zIndex: 10 };
      }
      case 'card_a_moves': {
        if (cardIndex === 0) {
          return { x: 0, y: '0%', rotate: 0, scale: 1.0, zIndex: 30 };
        }
        if (cardIndex === 1) {
          return { x: 4, y: 'calc(-100% - 1.25rem)', rotate: 1.5, scale: 0.96, zIndex: 20 };
        }
        return { x: 8, y: 'calc(-200% - 2.5rem)', rotate: 3, scale: 0.92, zIndex: 10 };
      }
      case 'card_b_moves': {
        if (cardIndex === 0) {
          return { x: 0, y: '0%', rotate: 0, scale: 1.0, zIndex: 20 };
        }
        if (cardIndex === 1) {
          return { x: 0, y: '0%', rotate: 0, scale: 1.0, zIndex: 25 };
        }
        return { x: 6, y: 'calc(-100% - 1.25rem)', rotate: 2, scale: 0.95, zIndex: 15 };
      }
      case 'card_c_moves': {
        return { x: 0, y: '0%', rotate: 0, scale: 1.0, zIndex: 20 };
      }
      default:
        return { x: 0, y: '0%', rotate: 0, scale: 1.0, zIndex: 10 };
    }
  };

  /**
   * 21. ACHIEVEMENT CARD SETTLE & 22. ACHIEVEMENT CARD HOVER
   * 
   * Easing transition per stage:
   * - settle: smooth decelerate transition into final position (ease: [0.22, 1, 0.36, 1])
   *   No overshoot (control points <= 1.0), no bounce, no spring, no rubber, no jelly.
   * - stable: smooth resting restore duration (0.28s) to gracefully transition back 
   *   from slight hover transforms (no card jumping, no abrupt snap).
   */
  const getCardTransition = (currentStage: ShuffleStage, cardIndex: number) => {
    if (reducedMotion) {
      return { duration: 0 };
    }

    if (currentStage === 'settle') {
      return {
        duration: 0.52,
        delay: cardIndex * 0.03, // Delicate micro-stagger for organic settle feel
        ease: [0.22, 1, 0.36, 1], // Pure smooth deceleration without overshoot, bounce, spring, rubber, or jelly
      };
    }

    if (currentStage === 'stable' || currentStage === 'final') {
      return {
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1], // Smooth and gentle return from hover interaction
      };
    }

    if (currentStage === 'reposition') {
      return {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1], // Decelerate smoothly towards target slot
      };
    }

    // MOVE stages (card_a_moves, card_b_moves, card_c_moves)
    return {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    };
  };

  // Determine grid container classes based on card count & breakpoint (Auto Position Adjustment)
  const gridClasses = useMemo(() => {
    if (cardCount === 1) {
      return 'grid grid-cols-1 max-w-lg mx-auto gap-6';
    }
    if (cardCount === 2) {
      return 'grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-6';
    }
    // 3 cards: 1 column on mobile, 2 columns on tablet, 3 columns on desktop
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  }, [cardCount]);

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Golden Halo */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/10 blur-[110px] rounded-full pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-5 border-b border-slate-800/90 pb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              <span>{subtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h2>
          </div>

          {/* Link to All Prestasi */}
          <Link
            to="/prestasi"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 group shrink-0"
          >
            <span>Semua Prestasi</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-yellow-400" />
          </Link>
        </div>

        {/* 
          ======================================================================
          RESPONSIVE CARD GRID WITH AUTO POSITION ADJUSTMENT
          - Grid tracks container width via ResizeObserver.
          - In 'final' arrangement, cards rest in pure CSS Grid flow without
            residual transforms, allowing fluid resizing across any viewport.
          - On Tablet with 3 cards: Card 3 spans or centers gracefully (col-span-2)
            instead of creating an asymmetrical blank spot.
          - On Mobile: Cards stack cleanly in 1 column, never forcing desktop structures.
          - On Desktop: Full multi-column expansive layout.
          ======================================================================
        */}
        <div ref={gridContainerRef} className="relative z-10 w-full">
          <div className={gridClasses}>
            {displayItems.map((item, index) => {
              const transform = getCardTransform(index);
              const isGold = index === 0;

              // On tablet with 3 cards: 3rd card is centered gracefully across 2 columns
              const isThirdCardOnTablet = cardCount === 3 && index === 2;
              const cardSpanClass = isThirdCardOnTablet
                ? 'md:col-span-2 md:max-w-md md:mx-auto lg:col-span-1 lg:max-w-none w-full'
                : 'w-full';

              return (
                <div key={item.id} className={cardSpanClass}>
                  <motion.div
                    initial={false}
                    animate={{
                      x: transform.x,
                      y: transform.y,
                      rotate: transform.rotate,
                      scale: transform.scale,
                      zIndex: transform.zIndex,
                    }}
                    whileHover={
                      !reducedMotion && (stage === 'stable' || stage === 'final')
                        ? {
                            y: -4, // slight translate: 4px lift (no jumping)
                            scale: 1.015, // slight scale: 1.5% (no giant zoom)
                            transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                          }
                        : !reducedMotion && stage === 'stack'
                        ? {
                            y: -2,
                            scale: 1.01,
                            transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                          }
                        : undefined
                    }
                    transition={getCardTransition(stage, index)}
                    onClick={() => {
                      if (stage === 'stack') {
                        runSequence(false);
                      }
                    }}
                    className={`relative flex flex-col justify-between rounded-2xl p-5 bg-slate-900/95 backdrop-blur-md border transition-all duration-300 group select-none h-full ${
                      stage === 'stack' ? 'cursor-pointer' : ''
                    } ${
                      isGold
                        ? 'border-yellow-500/50 hover:border-yellow-400/80 shadow-[0_20px_45px_rgba(0,0,0,0.6)] hover:shadow-[0_26px_50px_rgba(0,0,0,0.75)]'
                        : index === 1
                        ? 'border-slate-700/80 hover:border-yellow-500/40 shadow-[0_16px_36px_rgba(0,0,0,0.5)] hover:shadow-[0_22px_44px_rgba(0,0,0,0.65)]'
                        : 'border-slate-800 hover:border-yellow-500/40 shadow-[0_12px_28px_rgba(0,0,0,0.4)] hover:shadow-[0_18px_36px_rgba(0,0,0,0.55)]'
                    }`}
                    style={{
                      transformOrigin: 'center center',
                    }}
                  >
                    <div>
                      {/* Top Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 font-mono text-[10.5px] font-bold uppercase group-hover:bg-yellow-500/25 group-hover:border-yellow-500/50 transition-colors">
                          <Sparkles className="w-3 h-3 text-yellow-400 group-hover:scale-110 transition-transform" />
                          <span>{item.category || 'Prestasi Siswa'}</span>
                        </span>

                        <span className="text-[11px] font-mono text-slate-400">
                          {item.level ? `Tingkat ${item.level}` : `Tahun ${item.year}`}
                        </span>
                      </div>

                      {/* Image */}
                      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-800 relative mb-3">
                        <img
                          src={item.documentation}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-950/80 group-hover:bg-yellow-500 group-hover:text-slate-950 transition-colors backdrop-blur-xs text-yellow-400 text-[10px] font-mono font-bold uppercase">
                          {item.category}
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-2 text-[11px] text-yellow-400/90 group-hover:text-yellow-300 font-mono font-semibold mb-1.5 transition-colors">
                        <Trophy className="w-3.5 h-3.5 text-yellow-400 group-hover:scale-110 transition-transform" />
                        <span>Tahun {item.year}</span>
                        <span>•</span>
                        <span className="uppercase">Tingkat {item.level || 'Kabupaten'}</span>
                      </div>

                      <h3 className="font-bold text-white text-base leading-snug line-clamp-2 group-hover:text-yellow-300 transition-colors mb-2">
                        {item.title}
                      </h3>

                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed font-normal mb-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="truncate max-w-[150px]">
                        {item.recipient_name || 'SMP Pancasila'}
                      </span>
                      <Link
                        to="/prestasi"
                        className="text-yellow-400/90 font-semibold group-hover:text-yellow-300 inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Rincian</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
