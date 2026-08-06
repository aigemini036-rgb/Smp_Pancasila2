import { motion } from 'motion/react';
import Section from './Section';
import { Camera, Search } from 'lucide-react';

const facilities = [
 { title: 'Laboratorium Komputer', img: 'https://images.unsplash.com/pho?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
 { title: 'Perpustakaan Modern', img: 'https://images.unsplash.com/pho?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
 { title: 'Ruang Kelas Nyaman', img: 'https://images.unsplash.com/pho?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
 { title: 'Bengkel Praktik', img: 'https://images.unsplash.com/pho?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
 { title: 'Lapangan Olahraga', img: 'https://images.unsplash.com/pho?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
 { title: 'Aula Utama', img: 'https://images.unsplash.com/pho?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

export default function GalleryFacilities() {
 return (
 <>
 <Section id="fasilitas" subtitle="Fasilitas" title="Sarana & Prasarana Lengkap">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {facilities.map((fac, i) => (
 <motion.div
 key={i}
 initial={{ opacity: 0, scale: 0.9 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5, delay: i * 0.1 }}
 className="relative aspect-video rounded-3xl overflow-hidden group cursor-pointer"
 >
 <img 
 src={fac.img} 
 alt={fac.title} 
 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
 />
 <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 opacity-80 group-hover:opacity-100 transition-opacity"></div>
 
 <div className="absolute inset-0 p-6 flex flex-col justify-end">
 <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
 <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{fac.title}</h4>
 </div>
 </div>
 
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
 <Search className="w-6 h-6 text-slate-900 dark:text-white" />
 </div>
 </motion.div>
 ))}
 </div>
 </Section>

 <Section id="galeri" className="bg-slate-50 dark:bg-slate-900 " subtitle="Galeri Kegiatan" title="Momen Berharga Kami">
 <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
 {[1,2,3,4,5,6].map((item, i) => (
 <motion.div
 key={i}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5, delay: i * 0.1 }}
 className="break-inside-avoid rounded-3xl overflow-hidden relative group"
 >
 <img 
 src={`https://images.unsplash.com/photo-${[
 '1523050854058-8df90110c9f1',
 '1504384308090-c894fdcc538d',
 '1427504058460-5a4dd00f3f22',
 '1517524008697-84bbe3c3fd98',
 '1577896851231-70ef18881754',
 '1523987355523-c7b5b0dd90a7'
 ][i]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} 
 alt="Galeri"
 className="w-full h-auto"
 />
 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
 <Camera className="w-8 h-8 text-slate-900 dark:text-white scale-50 group-hover:scale-100 transition-transform duration-300" />
 </div>
 </motion.div>
 ))}
 </div>
 <div className="text-center mt-12">
 <button className="px-8 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white hover:text-yellow-600 hover:border-blue-200 transition-colors">
 Lihat Semua Foto
 </button>
 </div>
 </Section>
 </>
 );
}
