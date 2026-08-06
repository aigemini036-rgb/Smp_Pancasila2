import { motion } from 'motion/react';
import Section from './Section';
import { Monitor, Cpu, Wrench, Bike, Code } from 'lucide-react';

const majors = [
 {
 icon: Code,
 title: 'Rekayasa Perangkat Lunak',
 desc: 'Mempelajari pengembangan aplikasi web, mobile, dan desktop menggunakan teknologi terbaru.',
 color: ' ',
 lightColor: 'bg-blue-50 text-yellow-600 '
 },
 {
 icon: Monitor,
 title: 'Teknik Komputer Jaringan',
 desc: 'Fokus pada infrastruktur jaringan, administrasi server, dan keamanan siber.',
 color: ' ',
 lightColor: 'bg-blue-50 text-yellow-600 '
 },
 {
 icon: Cpu,
 title: 'Teknik Elektronika',
 desc: 'Merakit, memelihara, dan memperbaiki sistem elektronika industri dan robotika.',
 color: ' ',
 lightColor: 'bg-blue-50 text-yellow-600 '
 },
 {
 icon: Wrench,
 title: 'Teknik Kendaraan Ringan',
 desc: 'Mempelajari sistem kerja, pemeliharaan, dan perbaikan kendaraan roda empat modern.',
 color: ' ',
 lightColor: 'bg-blue-50 text-yellow-600 '
 },
 {
 icon: Bike,
 title: 'Teknik Sepeda Motor',
 desc: 'Fokus pada perbaikan, perawatan, dan modifikasi mesin sepeda motor modern.',
 color: ' ',
 lightColor: 'bg-blue-50 text-yellow-600 '
 }
];

export default function Academics() {
 return (
 <Section id="jurusan" subtitle="Program Keahlian" title="Pilihan Jurusan Masa Depan" className="bg-slate-50 dark:bg-slate-900 ">
 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
 {majors.map((major, i) => {
 const Icon = major.icon;
 return (
 <motion.div
 key={i}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5, delay: i * 0.1 }}
 className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 group relative overflow-hidden"
 >
 {/* Gradient hover background effect */}
 <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none "></div>
 
 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-2 ${major.lightColor}`}>
 <Icon className="w-7 h-7" />
 </div>
 
 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-yellow-600 transition-colors">{major.title}</h3>
 <p className="text-slate-900 dark:text-white leading-relaxed mb-8">{major.desc}</p>
 
 <a href="#" className="inline-flex items-center font-semibold text-sm text-slate-900 dark:text-white group-hover:text-yellow-600 transition-colors">
 Lihat Detail
 <motion.span 
 className="ml-2 inline-block opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
 >
 &rarr;
 </motion.span>
 </a>
 </motion.div>
 );
 })}
 </div>
 </Section>
 );
}
