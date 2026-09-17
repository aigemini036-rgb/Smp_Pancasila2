import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface NewsImageRevealProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  imgClassName?: string;
  delay?: number;
  trigger?: boolean;
  children?: React.ReactNode;
}

/**
 * 15. NEWS IMAGE REVEAL
 * 
 * Konsep:
 * 1. IMAGE HIDDEN
 *    - Dimulai dalam kondisi tersembunyi / ter-masking:
 *    - Clip-path: inset(0% 0% 100% 0%) [curtain shutter reveal]
 *    - Opacity: 0
 *    - Slight scale: 1.05 [skala awal sangat halus]
 * 
 * 2. IMAGE REVEAL
 *    - Dipicu saat konten berita pertama kali masuk viewport (atau dipicu fase pemisahan deck)
 *    - Transisi pembukaan halus:
 *      - Clip-path membuka ke inset(0% 0% 0% 0%)
 *      - Fade in 0 -> 1
 *      - Slight scale melambat menuju stabil 1.05 -> 1.0
 *    - Kurva perlambatan elegan [0.16, 1, 0.3, 1], durasi ~0.75s
 * 
 * 3. IMAGE STABLE
 *    - Begitu reveal selesai (onAnimationComplete):
 *    - Image berstatus STABLE (isStable = true)
 *    - Transform dinetralkan, tidak ada animasi continuous / looping
 *    - Image tetap normal, responsif terhadap interaksi hover halus (group-hover:scale-[1.025])
 */
export default function NewsImageReveal({
  src,
  alt,
  aspectRatio = 'aspect-[16/10]',
  className = '',
  imgClassName = '',
  delay = 0,
  trigger,
  children,
}: NewsImageRevealProps) {
  const reducedMotion = useReducedMotion();
  const [isStable, setIsStable] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Jika reduced motion aktif, langsung masuk kondisi STABLE
  const isReduced = Boolean(reducedMotion);

  // Fallback placeholder jika gambar gagal dimuat
  const imageSource = imgError
    ? 'https://picsum.photos/seed/pancasila-news-fallback/600/400'
    : src;

  // Konfigurasi animasi reveal
  const revealVariants = {
    hidden: {
      opacity: 0,
      scale: 1.05,
      clipPath: 'inset(0% 0% 100% 0%)',
    },
    visible: {
      opacity: 1,
      scale: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: {
        duration: 0.75,
        delay: isReduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 dark:bg-slate-700 ${aspectRatio} ${className}`}
    >
      {/* 
        Container Gambar dengan Reveal Halus (Clip + Fade + Slight Scale)
        Setelah selesai, beralih ke state STABLE murni
      */}
      {!isReduced && !isStable ? (
        <motion.div
          className="w-full h-full relative"
          initial="hidden"
          animate={trigger !== undefined ? (trigger ? 'visible' : 'hidden') : undefined}
          whileInView={trigger === undefined ? 'visible' : undefined}
          viewport={{ once: true, amount: 0.2 }}
          variants={revealVariants}
          onAnimationComplete={() => {
            // Setelah reveal selesai, image masuk ke kondisi STABLE dan tidak bergerak lagi
            setIsStable(true);
          }}
        >
          <img
            src={imageSource}
            alt={alt}
            loading="lazy"
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover select-none transition-transform duration-400 ease-out group-hover:scale-[1.025] ${imgClassName}`}
          />
        </motion.div>
      ) : (
        /* Kondisi IMAGE STABLE (atau mode reduced motion): Gambar normal tanpa animasi loop */
        <div className="w-full h-full relative">
          <img
            src={imageSource}
            alt={alt}
            loading="lazy"
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover select-none transition-transform duration-400 ease-out group-hover:scale-[1.025] ${imgClassName}`}
          />
        </div>
      )}

      {/* Badges / Overlay Elements (misal Kategori / Label Headline) */}
      {children}
    </div>
  );
}
