import { useState, useEffect } from 'react';
import { motion, useScroll } from 'motion/react';

export default function ScrollProgress() {
 const { scrollYProgress } = useScroll();

 return (
 <motion.div
 className="fixed top-0 left-0 right-0 h-1 bg-slate-50 dark:bg-slate-900 origin-left z-50"
 style={{ scaleX: scrollYProgress }}
 />
 );
}
