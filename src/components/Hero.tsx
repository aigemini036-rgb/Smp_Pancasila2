import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

function Counter({ end, suffix = '', title }: { end: number, suffix?: string, title: string }) {
 const [count, setCount] = useState(0);

 useEffect(() => {
 let start = 0;
 const duration = 2000;
 const increment = end / (duration / 16);
 
 const timer = setInterval(() => {
 start += increment;
 if (start >= end) {
 setCount(end);
 clearInterval(timer);
 } else {
 setCount(Math.floor(start));
 }
 }, 16);
 return () => clearInterval(timer);
 }, [end]);

 return (
 <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-700 hover:bg-white/20 transition-colors">
 <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
 {count}{suffix}
 </div>
 <div className="text-slate-900 dark:text-white font-medium text-sm uppercase tracking-wide text-center">
 {title}
 </div>
 </div>
 );
}

export default function Hero() {
 const text = "Membangun Generasi Cerdas, Kreatif, dan Berkarakter";
 
 return (
 <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[100vh] flex flex-col justify-center">
 
 {/* 
 BACKGROUND IMAGE PLACEHOLDER
 Ganti nilai 'src' di bawah ini dengan URL atau path gambar foto sekolah Anda.
 */}
 <div className="absolute inset-0 z-0">
 <img 
 src="https://images.unsplash.com/pho?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
 alt="Background Sekolah" 
 className="w-full h-full object-cover"
 />
 {/* Overlay gelap agar teks putih tetap terbaca sempurna di atas foto apapun */}
 <div className="absolute inset-0 bg-slate-900/80"></div>
 </div>

 <div className="max-w-7xl mx-auto px-6 text-center relative z-10 w-full mt-10">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-slate-900 dark:text-white font-medium text-sm mb-8 border border-slate-200 dark:border-slate-700"
 >
 <span className="relative flex h-2.5 w-2.5">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
 </span>
 Selamat Datang di Website Resmi Sekolah
 </motion.div>

 <h1 className="text-5xl md:text-7xl font-bold text-gradient-animated mb-6 leading-tight max-w-5xl mx-auto tracking-tight drop-shadow-lg">
 {text.split(' ').map((word, i) => (
 <motion.span
 key={i}
 initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
 animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
 transition={{ delay: i * 0.1, duration: 0.8 }}
 className="inline-block mr-3 md:mr-4 last:mr-0"
 >
 {word}
 </motion.span>
 ))}
 </h1>

 <motion.p
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.8, duration: 0.6 }}
 className="text-lg md:text-xl text-slate-900 dark:text-white mb-10 max-w-2xl mx-auto drop-shadow-md"
 >
 Kami berkomitmen untuk memberikan pendidikan terbaik yang mengintegrasikan teknologi modern dengan nilai-nilai karakter bangsa.
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 1, duration: 0.6 }}
 className="flex flex-col sm:flex-row items-center justify-center gap-4"
 >
 <a href="#profil" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-yellow-500 text-slate-900 font-bold rounded-full font-semibold text-lg transition-all hover:shadow-lg hover:shadow-yellow-500/25 flex items-center justify-center gap-2 group border border-blue-200">
 Jelajahi Sekolah
 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
 </a>
 <a href="#ppdb" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-slate-900 dark:text-white rounded-full font-semibold text-lg transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2">
 <BookOpen className="w-5 h-5" />
 Informasi PPDB
 </a>
 </motion.div>
 </div>

 {/* Stats Section */}
 <div className="max-w-6xl mx-auto px-6 mt-20 md:mt-32 relative z-10 w-full pb-10">
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
 >
 <Counter end={1200} suffix="+" title="Siswa" />
 <Counter end={80} suffix="+" title="Guru & Staff" />
 <Counter end={8} title="Jurusan" />
 <Counter end={25} suffix="+" title="Tahun Berdiri" />
 </motion.div>
 </div>
 </section>
 );
}
