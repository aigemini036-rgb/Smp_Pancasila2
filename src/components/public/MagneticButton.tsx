import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  id?: string;
}

/**
 * MagneticButton
 * 
 * Provides a very subtle magnetic pull effect towards cursor on desktop.
 * Automatically disabled on touch screens / mobile and prefers-reduced-motion.
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 12,
  onClick,
  id,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) / (rect.width / 2);
    const distanceY = (e.clientY - centerY) / (rect.height / 2);

    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      id={id}
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
