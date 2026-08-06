import { GraduationCap, Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
 return (
 <footer className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white pt-20 pb-10 border-t border-slate-200 dark:border-slate-700">
 <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
 {/* Brand */}
 <div>
 <div className="flex items-center gap-2 mb-6">
 <GraduationCap className="w-8 h-8 text-yellow-600" />
 <span className="text-2xl font-bold text-slate-900 dark:text-white">SchoolHub</span>
 </div>
 <p className="text-slate-900 dark:text-white mb-8 leading-relaxed">
 Membangun generasi cerdas, kreatif, dan berkarakter untuk masa depan yang lebih baik melalui pendidikan berkualitas dan inovatif.
 </p>
 <div className="flex items-center gap-4">
 <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-slate-900 dark:text-white transition-all transform hover:scale-110">
 <Facebook className="w-5 h-5" />
 </a>
 <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-slate-900 dark:text-white transition-all transform hover:scale-110">
 <Twitter className="w-5 h-5" />
 </a>
 <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-slate-900 dark:text-white transition-all transform hover:scale-110">
 <Instagram className="w-5 h-5" />
 </a>
 <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-slate-900 dark:text-white transition-all transform hover:scale-110">
 <Youtube className="w-5 h-5" />
 </a>
 </div>
 </div>

 {/* Quick Links */}
 <div>
 <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Tautan Cepat</h4>
 <ul className="space-y-4">
 {['Tentang Kami', 'Program Keahlian', 'Fasilitas Sekolah', 'Berita & Pengumuman', 'Galeri Kegiatan', 'Informasi PPDB'].map((link, i) => (
 <li key={i}>
 <a href="#" className="hover:text-yellow-600 hover:translate-x-2 inline-block transition-all">
 {link}
 </a>
 </li>
 ))}
 <li>
 <a href="/admin" className="hover:text-yellow-600 hover:translate-x-2 inline-block transition-all text-yellow-600">
 Panel Admin
 </a>
 </li>
 </ul>
 </div>

 {/* Contact Info */}
 <div>
 <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Hubungi Kami</h4>
 <ul className="space-y-4">
 <li className="flex items-start gap-3">
 <MapPin className="w-5 h-5 text-yellow-600 shrink-0 mt-1" />
 <span>Jl. Pendidikan No. 123, Kota Pelajar, Provinsi Pengetahuan 12345</span>
 </li>
 <li className="flex items-center gap-3">
 <Phone className="w-5 h-5 text-yellow-600 shrink-0" />
 <span>+62 21 5555 1234</span>
 </li>
 <li className="flex items-center gap-3">
 <Mail className="w-5 h-5 text-yellow-600 shrink-0" />
 <span>info@schoolhub.sch.id</span>
 </li>
 </ul>
 </div>

 {/* Newsletter */}
 <div>
 <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Buletin Sekolah</h4>
 <p className="text-slate-900 dark:text-white mb-4">Dapatkan informasi terbaru seputar kegiatan dan prestasi sekolah kami.</p>
 <form className="flex flex-col gap-3" onSubmit={e => e.preventDefault()}>
 <input 
 type="email" 
 placeholder="Alamat Email" 
 className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-200 text-slate-900 dark:text-white placeholder-slate-500 transition-colors"
 />
 <button className="bg-blue-600 hover:bg-yellow-500 text-slate-900 font-bold px-4 py-3 rounded-xl font-semibold transition-colors">
 Berlangganan
 </button>
 </form>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-6 border-t border-slate-200 dark:border-slate-700 pt-8 text-center text-sm text-slate-900 dark:text-white">
 <p>&copy; {new Date().getFullYear()} SchoolHub. Hak Cipta Dilindungi Undang-Undang.</p>
 </div>
 </footer>
 );
}
