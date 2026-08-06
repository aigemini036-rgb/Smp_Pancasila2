import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../hooks/useTheme';

export default function Header() {
 const { isDark, toggleTheme } = useTheme();
 const [isScrolled, setIsScrolled] = useState(false);
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

 useEffect(() => {
 const handleScroll = () => setIsScrolled(window.scrollY > 20);
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const navLinks = [
 { name: 'Beranda', href: '#home' },
 { name: 'Profil', href: '#profil' },
 { name: 'Jurusan', href: '#jurusan' },
 { name: 'Berita', href: '#berita' },
 { name: 'Galeri', href: '#galeri' },
 { name: 'Fasilitas', href: '#fasilitas' },
 { name: 'Kontak', href: '#kontak' },
 ];

 return (
 <header
 className={`fixed top-0 w-full z-40 transition-all duration-300 ${
 isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
 }`}
 >
 <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
 <a href="#home" className="flex items-center gap-2 group">
 <GraduationCap className={`w-8 h-8 transition-transform group-hover:scale-110 ${isScrolled ? 'text-yellow-600 ' : 'text-slate-900 dark:text-white'}`} />
 <span className={`text-xl font-bold transition-colors ${isScrolled ? 'text-slate-900 dark:text-white ' : 'text-slate-900 dark:text-white'}`}>SchoolHub</span>
 </a>

 {/* Desktop Nav */}
 <nav className="hidden lg:flex items-center gap-8">
 {navLinks.map((link) => (
 <a
 key={link.name}
 href={link.href}
 className={`text-sm font-medium transition-colors ${
 isScrolled 
 ? 'text-slate-900 dark:text-white hover:text-yellow-600' 
 : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white'
 }`}
 >
 {link.name}
 </a>
 ))}
 
 <div className={`flex items-center gap-4 border-l pl-4 transition-colors ${isScrolled ? 'border-slate-200 dark:border-slate-700 ' : 'border-white/30'}`}>
 <button onClick={toggleTheme} className={`p-2 transition-colors ${isScrolled ? 'text-slate-900 dark:text-white hover:text-yellow-600' : 'text-slate-900 dark:text-white hover:text-yellow-600'}`}>
 {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
 </button>
 <a href="#ppdb" className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-yellow-500/25 ${isScrolled ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-blue-50'}`}>
 PPDB 2026
 </a>
 </div>
 </nav>

 {/* Mobile Toggle */}
 <div className="lg:hidden flex items-center gap-4">
 <button onClick={toggleTheme} className={`p-2 ${isScrolled ? 'text-slate-900 dark:text-white ' : 'text-slate-900 dark:text-white'}`}>
 {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
 </button>
 <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-2 ${isScrolled ? 'text-slate-900 dark:text-white ' : 'text-slate-900 dark:text-white'}`}>
 {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
 </button>
 </div>
 </div>

 {/* Mobile Menu */}
 <AnimatePresence>
 {isMobileMenuOpen && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 overflow-hidden absolute top-full w-full left-0 shadow-lg"
 >
 <div className="px-6 py-4 flex flex-col gap-4">
 {navLinks.map((link) => (
 <a
 key={link.name}
 href={link.href}
 onClick={() => setIsMobileMenuOpen(false)}
 className="text-base font-medium text-slate-900 dark:text-white "
 >
 {link.name}
 </a>
 ))}
 <a
 href="#ppdb"
 onClick={() => setIsMobileMenuOpen(false)}
 className="bg-yellow-500 text-slate-900 font-bold text-center py-3 rounded-xl font-semibold mt-2"
 >
 Informasi PPDB
 </a>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </header>
 );
}
