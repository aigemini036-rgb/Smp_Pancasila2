import { motion } from 'motion/react';
import Section from './Section';
import { CheckCircle2, MonitorPlay, BookMarked, Users, Monitor, Shield, Trophy } from 'lucide-react';

export default function About() {
 const values = [
 { title: 'Integritas', desc: 'Menjunjung tinggi kejujuran dan etika.' },
 { title: 'Inovasi', desc: 'Berpikir maju dan kreatif dalam belajar.' },
 { title: 'Kolaborasi', desc: 'Bekerja sama untuk mencapai tujuan.' },
 { title: 'Keunggulan', desc: 'Berusaha mencapai prestasi terbaik.' },
 ];

 return (
 <Section id="profil" subtitle="Tentang Sekolah Kami" title="Membangun Karakter, Mencetak Prestasi">
 <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
 {/* Image Side */}
 <motion.div
 initial={{ opacity: 0, x: -50 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8 }}
 className="relative"
 >
 <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
 <img 
 src="https://images.unsplash.com/pho?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
 alt="Gedung Sekolah" 
 className="object-cover w-full h-full"
 />
 <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 "></div>
 </div>
 <div className="absolute -bottom-10 -right-10 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl hidden md:block">
 <div className="flex items-center gap-4">
 <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-yellow-600 ">
 <Trophy className="w-8 h-8" />
 </div>
 <div>
 <div className="text-3xl font-bold text-slate-900 dark:text-white ">A</div>
 <div className="text-sm font-medium text-slate-900 dark:text-white ">Akreditasi Unggul</div>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Content Side */}
 <motion.div
 initial={{ opacity: 0, x: 50 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.8, delay: 0.2 }}
 >
 <p className="text-lg text-slate-900 dark:text-white mb-6 leading-relaxed">
 Didirikan pada tahun 2001, SchoolHub telah menjadi lembaga pendidikan terdepan yang tidak hanya berfokus pada keunggulan akademis, tetapi juga pada pengembangan karakter dan keterampilan praktis siswa untuk menghadapi tantangan masa depan.
 </p>
 
 <div className="space-y-8 mb-10">
 <div>
 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Visi</h3>
 <p className="text-slate-900 dark:text-white ">Menjadi sekolah menengah kejuruan rujukan nasional yang menghasilkan lulusan kompeten, berkarakter mulia, dan berwawasan lingkungan.</p>
 </div>
 <div>
 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Misi</h3>
 <ul className="space-y-3">
 {[
 'Menyelenggarakan pembelajaran berbasis proyek (Project Based Learning).',
 'Meningkatkan kompetensi pendidik dan tenaga kependidikan.',
 'Menjalin kemitraan strategis dengan dunia usaha dan industri.',
 'Menanamkan nilai-nilai kepemimpinan dan kewirausahaan.'
 ].map((item, i) => (
 <li key={i} className="flex items-start gap-3 text-slate-900 dark:text-white ">
 <CheckCircle2 className="w-6 h-6 text-yellow-600 shrink-0" />
 <span>{item}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>

 <a href="#selengkapnya" className="inline-flex items-center gap-2 text-yellow-600 font-semibold hover:text-yellow-600 transition-colors">
 Baca Selengkapnya
 <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>&rarr;</motion.span>
 </a>
 </motion.div>
 </div>

 {/* Values */}
 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
 {values.map((val, i) => (
 <motion.div
 key={i}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.5, delay: i * 0.1 }}
 className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow group"
 >
 <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform">
 <Shield className="w-6 h-6" />
 </div>
 <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{val.title}</h4>
 <p className="text-slate-900 dark:text-white text-sm leading-relaxed">{val.desc}</p>
 </motion.div>
 ))}
 </div>
 </Section>
 );
}
