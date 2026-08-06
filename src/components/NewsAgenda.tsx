import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Section from './Section';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { getNews, NewsItem, getAgenda, AgendaItem } from '../utils/storage';

const categories = ['Semua', 'Akademik', 'Prestasi', 'Kegiatan', 'Pengumuman'];

const agendaData = [
 { title: 'Ujian Tengah Semester', date: '15-20 Okt 2025', location: 'Ruang Kelas', status: 'Akan Datang' },
 { title: 'Class Meeting', date: '25-28 Okt 2025', location: 'Lapangan Utama', status: 'Akan Datang' },
 { title: 'Praktik Kerja Lapangan', date: '1 Nov - 31 Des', location: 'Industri Mitra', status: 'Persiapan' },
];

export default function NewsAgenda() {
 const [activeCategory, setActiveCategory] = useState('Semua');
 const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [agendaData, setAgendaData] = useState<AgendaItem[]>([]);

 useEffect(() => {
 // Load news from localStorage
 setNewsData(getNews());
 }, []);

 const filteredNews = activeCategory === 'Semua' 
 ? newsData 
 : newsData.filter(news => news.category === activeCategory);


 return (
 <>
 <Section id="berita" subtitle="Berita & Informasi" title="Kabar Terbaru dari SchoolHub">
 {/* Filter */}
 <div className="flex flex-wrap justify-center gap-3 mb-12">
 {categories.map((cat) => (
 <button
 key={cat}
 onClick={() => setActiveCategory(cat)}
 className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
 activeCategory === cat
 ? 'bg-yellow-500 text-slate-900 font-bold shadow-lg shadow-yellow-500/25'
 : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-blue-200'
 }`}
 >
 {cat}
 </button>
 ))}
 </div>

 {/* News Grid */}
 <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
 <AnimatePresence mode="popLayout">
 {filteredNews.map((news) => (
 <motion.article
 key={news.id}
 layout
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.9 }}
 transition={{ duration: 0.3 }}
 className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 group"
 >
 <div className="aspect-[16/10] overflow-hidden relative">
 <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-yellow-600 ">
 {news.category}
 </div>
 </div>
 <div className="p-6">
 <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white mb-3">
 <Calendar className="w-4 h-4" />
 {news.date}
 </div>
 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-yellow-600 transition-colors">
 {news.title}
 </h3>
 <p className="text-slate-900 dark:text-white text-sm mb-6 line-clamp-3">
 {news.desc}
 </p>
 <a href="#" className="inline-flex items-center text-sm font-semibold text-yellow-600 hover:text-yellow-600">
 Baca Selengkapnya
 <ArrowRight className="w-4 h-4 ml-2" />
 </a>
 </div>
 </motion.article>
 ))}
 </AnimatePresence>
 </motion.div>
 </Section>

 {/* Agenda Section */}
 <Section id="agenda" className="bg-yellow-500 text-slate-900 font-bold !py-24 rounded-3xl relative overflow-hidden my-12 mx-6 md:mx-auto max-w-[calc(100%-3rem)] md:max-w-7xl">
 <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
 <div className="relative z-10 grid lg:grid-cols-3 gap-12 items-center px-6 md:px-12">
 <div className="lg:col-span-1">
 <h2 className="text-3xl md:text-4xl font-bold mb-4">Agenda Mendatang</h2>
 <p className="text-slate-900 dark:text-white mb-8 leading-relaxed">Jangan lewatkan berbagai kegiatan penting yang akan segera diselenggarakan di SchoolHub.</p>
 <button className="bg-white dark:bg-slate-800 text-yellow-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg shadow-black/10">
 Lihat Kalender Akademik
 </button>
 </div>
 <div className="lg:col-span-2 space-y-4">
 {agendaData.map((agenda, i) => (
 <motion.div
 key={agenda.id || i}
 initial={{ opacity: 0, x: 50 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5, delay: i * 0.1 }}
 className="bg-white/10 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/20 transition-colors"
 >
 <div>
 <h4 className="text-lg font-bold mb-2">{agenda.title}</h4>
 <div className="flex flex-wrap items-center gap-4 text-sm text-slate-900 dark:text-white">
 <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {agenda.date}</span>
 <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {agenda.location}</span>
 </div>
 </div>
 <div className="inline-flex shrink-0 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10">
 {agenda.status}
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </Section>
 </>
 );
}
