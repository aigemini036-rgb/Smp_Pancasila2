import { motion } from 'motion/react';
import React from 'react';

interface Props {
 id: string;
 title?: string;
 subtitle?: string;
 children: React.ReactNode;
 className?: string;
}

export default function Section({ id, title, subtitle, children, className = '' }: Props) {
 return (
 <section id={id} className={`py-20 md:py-28 px-6 max-w-7xl mx-auto ${className}`}>
 {(title || subtitle) && (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ duration: 0.6 }}
 className="text-center mb-16"
 >
 {subtitle && (
 <span className="text-yellow-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
 {subtitle}
 </span>
 )}
 {title && (
 <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white ">
 {title}
 </h2>
 )}
 </motion.div>
 )}
 {children}
 </section>
 );
}
