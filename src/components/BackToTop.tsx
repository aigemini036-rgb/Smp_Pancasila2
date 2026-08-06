import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BackToTop() {
 const [isVisible, setIsVisible] = useState(false);

 useEffect(() => {
 const handleScroll = () => {
 setIsVisible(window.scrollY > 500);
 };
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const scrollToTop = () => {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 return (
 <AnimatePresence>
 {isVisible && (
 <motion.button
 initial={{ opacity: 0, scale: 0.5 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.5 }}
 onClick={scrollToTop}
 className="fixed bottom-6 right-6 p-3 bg-blue-600 hover:bg-yellow-500 text-slate-900 font-bold rounded-full shadow-lg shadow-yellow-500/25 z-40 transition-colors"
 >
 <ChevronUp className="w-6 h-6" />
 </motion.button>
 )}
 </AnimatePresence>
 );
}
