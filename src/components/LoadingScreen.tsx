import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 const timer = setTimeout(() => setIsLoading(false), 2000);
 return () => clearTimeout(timer);
 }, []);

 return (
 <AnimatePresence>
 {isLoading && (
 <motion.div
 initial={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.5 }}
 className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-800 "
 >
 <div className="flex flex-col items-center gap-4">
 <motion.div
 animate={{ rotate: 360, scale: [1, 1.2, 1] }}
 transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
 >
 <GraduationCap className="w-16 h-16 text-yellow-600 " />
 </motion.div>
 <motion.h1
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-2xl font-bold bg-slate-50 dark:bg-slate-900 bg-clip-text text-transparent"
 >
 SchoolHub
 </motion.h1>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
