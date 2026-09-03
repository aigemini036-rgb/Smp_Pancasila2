import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';

interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  className?: string;
}

/**
 * AnimatedCounter
 * 
 * Extracts numeric value dynamically from string (e.g. "450+", "28 Guru", "50+ Prestasi")
 * and smoothly animates from 0 when in view. Respects prefers-reduced-motion.
 */
export default function AnimatedCounter({
  value,
  duration = 1800,
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(value);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (!inView || reducedMotion) {
      setDisplayValue(value);
      return;
    }

    const strValue = String(value);
    const match = strValue.match(/^(\D*)(\d+)(\D*)$/);

    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || '';
    const targetNumber = parseInt(match[2], 10);
    const suffix = match[3] || '';

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Smooth easeOutQuad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const currentNumber = Math.floor(easedProgress * targetNumber);

      setDisplayValue(`${prefix}${currentNumber}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [inView, value, duration, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
