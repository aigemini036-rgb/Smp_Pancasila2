import { motion } from 'motion/react';
import Section from './Section';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function CTAContact() {
 return (
 <>
 {/* PPDB CTA */}
 <section id="ppdb" className="py-24 px-6 relative overflow-hidden">
 <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 -z-10"></div>
 {/* Floating shapes */}
 <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
 <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
 
 <div className="max-w-4xl mx-auto text-center">
 <motion.h2 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight"
 >
 Siap Menjadi Bagian dari <br className="hidden md:block"/>Keluarga Besar Kami?
 </motion.h2>
 <motion.p 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.2 }}
 className="text-xl text-slate-900 dark:text-white mb-10"
 >
 Daftarkan dirimu sekarang dan mulai perjalanan pendidikan yang luar biasa bersama SchoolHub. Pendaftaran Tahun Ajaran 2026/2027 telah dibuka!
 </motion.p>
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.4 }}
 >
 <button className="bg-white dark:bg-slate-800 text-yellow-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl shadow-black/20 flex items-center gap-2 mx-auto">
 Daftar Sekarang
 <Send className="w-5 h-5" />
 </button>
 </motion.div>
 </div>
 </section>

 {/* Contact Section */}
 <Section id="kontak" subtitle="Hubungi Kami" title="Pusat Informasi SchoolHub">
 <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
 <motion.div
 initial={{ opacity: 0, x: -30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 >
 <div className="space-y-8 mb-12">
 <div className="flex gap-4">
 <div className="w-12 h-12 shrink-0 bg-blue-50 rounded-2xl flex items-center justify-center text-yellow-600 ">
 <MapPin className="w-6 h-6" />
 </div>
 <div>
 <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Alamat Kampus</h4>
 <p className="text-slate-900 dark:text-white ">Jl. Pendidikan No. 123, Kota Pelajar, Provinsi Pengetahuan 12345</p>
 </div>
 </div>
 <div className="flex gap-4">
 <div className="w-12 h-12 shrink-0 bg-blue-50 rounded-2xl flex items-center justify-center text-yellow-600 ">
 <Phone className="w-6 h-6" />
 </div>
 <div>
 <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Telepon</h4>
 <p className="text-slate-900 dark:text-white ">+62 21 5555 1234</p>
 </div>
 </div>
 <div className="flex gap-4">
 <div className="w-12 h-12 shrink-0 bg-blue-50 rounded-2xl flex items-center justify-center text-yellow-600 ">
 <Mail className="w-6 h-6" />
 </div>
 <div>
 <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Email</h4>
 <p className="text-slate-900 dark:text-white ">info@schoolhub.sch.id</p>
 </div>
 </div>
 <div className="flex gap-4">
 <div className="w-12 h-12 shrink-0 bg-blue-50 rounded-2xl flex items-center justify-center text-yellow-600 ">
 <Clock className="w-6 h-6" />
 </div>
 <div>
 <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Jam Pelayanan</h4>
 <p className="text-slate-900 dark:text-white ">Senin - Jumat: 07:00 - 15:00 WIB</p>
 </div>
 </div>
 </div>

 {/* Maps Placeholder */}
 <div className="w-full h-64 bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-200 dark:border-slate-700 ">
 <iframe 
 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.2407519694!2d106.758748!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x100c5e82dd4b820!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
 className="absolute inset-0 w-full h-full border-0 grayscale opacity-80 mix-blend-multiply " 
 loading="lazy" 
 referrerPolicy="no-referrer-when-downgrade"
 ></iframe>
 </div>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, x: 30 }}
 whileInView={{ opacity: 1, x: 0 }}
 viewport={{ once: true }}
 className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-200 dark:border-slate-700 "
 >
 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Kirim Pesan</h3>
 <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
 <div className="grid sm:grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Nama Lengkap</label>
 <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all " placeholder="Masukkan nama" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Email</label>
 <input type="email" className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all " placeholder="nama@email.com" />
 </div>
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Subjek</label>
 <input type="text" className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all " placeholder="Tujuan pesan" />
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Pesan</label>
 <textarea rows={4} className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" placeholder="Tulis pesan Anda disini..."></textarea>
 </div>
 <button className="w-full bg-blue-600 hover:bg-yellow-500 text-slate-900 font-bold font-semibold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-yellow-500/25 flex items-center justify-center gap-2">
 Kirim Pesan
 <Send className="w-5 h-5" />
 </button>
 </form>
 </motion.div>
 </div>
 </Section>
 </>
 );
}
