import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface EditorialUnderlineHeadingProps {
  badge?: string;
  badgeIcon?: React.ElementType;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  id?: string;
  useSerif?: boolean;
}

/**
 * EditorialUnderlineHeading
 * 
 * Reusable editorial heading with refined typography hierarchy and subtle hairline accent.
 */
export default function EditorialUnderlineHeading({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  align = 'center',
  className = '',
  id,
  useSerif = false,
}: EditorialUnderlineHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div id={id} ref={ref} className={`space-y-3 ${alignClass} ${className}`}>
      {badge && (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-mono font-bold tracking-wider uppercase ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
          <span>{badge}</span>
        </div>
      )}

      <div className="relative inline-block pb-2">
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight font-heading"
        >
          {title}
        </h2>
        {/* Subtle Hairline Accent Draw */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{ originX: align === 'center' ? 0.5 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500/70 dark:bg-yellow-400/70 rounded-full"
        />
      </div>

      {subtitle && (
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
