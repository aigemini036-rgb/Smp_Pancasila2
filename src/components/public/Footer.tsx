import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';
import { getSchoolSettings } from '../../utils/storage';
import AnimatedWaterWaveBackground from './AnimatedWaterWaveBackground';
import SchoolLogo from '../common/SchoolLogo';

export default function Footer() {
  const settings = getSchoolSettings();

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <footer className="relative overflow-hidden bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* 
        ========================================================================
        39 & 40: ANIMATED WATER WAVE & MULTI-LAYER DEPTH
        Gentle speed, horizontal flow, background depth, pointer-events: none.
        ========================================================================
      */}
      <AnimatedWaterWaveBackground />

      {/* 
        ========================================================================
        41. FOOTER CONTENT REVEAL
        Staggered entrance: Brand, Links, Information, Contact & Copyright.
        ========================================================================
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Col 1: Identity & Socials */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={columnVariants}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <SchoolLogo
                src={settings.logo}
                alt={settings.school_name || 'Logo SMP Pancasila'}
                size="md"
              />
              <div>
                <span className="text-base font-extrabold tracking-tight text-white block leading-tight">
                  {settings.school_name || 'SMP PANCASILA'}
                </span>
                <span className="text-[11px] font-mono font-bold text-yellow-500 tracking-wider block uppercase">
                  PONOKAWAN KRIAN
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Lembaga Pendidikan Menengah Pertama {settings.accreditation ? (settings.accreditation.toLowerCase().startsWith('akreditasi') ? `Ter${settings.accreditation.toLowerCase()}` : `Terakreditasi ${settings.accreditation}`) : 'Terakreditasi A'} di Ponokawan, Kecamatan Krian, Kabupaten Sidoarjo. Berkomitmen membentuk generasi berkarakter Pancasila, berprestasi, dan berakhlak mulia.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {settings.social_links.facebook && (
                <a
                  href={settings.social_links.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-md bg-slate-800 hover:bg-yellow-500 hover:text-slate-950 flex items-center justify-center transition-colors text-slate-300"
                  aria-label="Facebook SMP Pancasila"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.social_links.instagram && (
                <a
                  href={settings.social_links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-md bg-slate-800 hover:bg-yellow-500 hover:text-slate-950 flex items-center justify-center transition-colors text-slate-300"
                  aria-label="Instagram SMP Pancasila"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.social_links.youtube && (
                <a
                  href={settings.social_links.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-md bg-slate-800 hover:bg-yellow-500 hover:text-slate-950 flex items-center justify-center transition-colors text-slate-300"
                  aria-label="YouTube SMP Pancasila"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Col 2: Navigation Links */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={columnVariants}
            className="space-y-3"
          >
            <h3 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-wider">
              Profil & Institusi
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link to="/profil/sejarah" className="hover:text-white transition-colors">
                  Sejarah & Latar Belakang
                </Link>
              </li>
              <li>
                <Link to="/profil/visi-misi" className="hover:text-white transition-colors">
                  Visi, Misi & Tujuan
                </Link>
              </li>
              <li>
                <Link to="/profil/struktur" className="hover:text-white transition-colors">
                  Struktur Organisasi
                </Link>
              </li>
              <li>
                <Link to="/personel/kepala-sekolah" className="hover:text-white transition-colors">
                  Profil Kepala Sekolah
                </Link>
              </li>
              <li>
                <Link to="/personel" className="hover:text-white transition-colors">
                  Dewan Guru & Tenaga Kependidikan
                </Link>
              </li>
              <li>
                <Link to="/fasilitas" className="hover:text-white transition-colors">
                  Sarana & Fasilitas Kampus
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Col 3: Information & PPDB */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={columnVariants}
            className="space-y-3"
          >
            <h3 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-wider">
              Informasi Publik
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link to="/berita" className="hover:text-white transition-colors">
                  Berita & Agenda Terkini
                </Link>
              </li>
              <li>
                <Link to="/pengumuman" className="hover:text-white transition-colors">
                  Pengumuman & Info PPDB
                </Link>
              </li>
              <li>
                <Link to="/prestasi" className="hover:text-white transition-colors">
                  Galeri Prestasi & Juara
                </Link>
              </li>
              <li>
                <Link to="/galeri" className="hover:text-white transition-colors">
                  Dokumentasi Foto Kegiatan
                </Link>
              </li>
              <li>
                <Link to="/kontak" className="hover:text-white transition-colors">
                  Peta Lokasi & Kontak
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Col 4: Contact & Location */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={columnVariants}
            className="space-y-3"
          >
            <h3 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-wider">
              Sekretariat & Alamat
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <span>{settings.address || 'Desa Ponokawan, Kec. Krian, Kab. Sidoarjo, Jawa Timur'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-yellow-500 shrink-0" />
                <span>{settings.phone || '(031) 8971234'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-yellow-500 shrink-0" />
                <span>{settings.email || 'info@smppancasilaponokawan.sch.id'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <span>{settings.operating_hours || 'Senin - Jumat: 07.00 - 15.00 WIB'}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Copyright Bar */}
        <motion.div
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          variants={columnVariants}
          className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-3"
        >
          <p>
            © {new Date().getFullYear()} SMP Pancasila Ponokawan. Seluruh Hak Cipta Dilindungi.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-slate-400">
            <span>Situs Resmi Informasi & Pembelajaran</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span id="footer-support-credit" className="text-slate-300 font-medium">
              Supported by XII RPL 2 SMK Krian 1
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
