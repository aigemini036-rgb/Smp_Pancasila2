import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getPeople } from '../../utils/storage';
import { Person, CategoryPerson } from '../../types';
import InteractivePersonnelGallery from '../../components/public/InteractivePersonnelGallery';
import {
  Users,
  GraduationCap,
  Briefcase,
  Crown,
} from 'lucide-react';

export default function PersonelList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine active category based on URL pathname and search parameters
  const activeCategory: 'semua' | CategoryPerson = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/personel/kepala-sekolah') || path.endsWith('/kepala-sekolah')) {
      return 'kepala_sekolah';
    }
    if (path.includes('/personel/guru') || path.endsWith('/guru')) {
      return 'guru';
    }
    if (path.includes('/personel/staff') || path.endsWith('/staff')) {
      return 'staff';
    }

    const catParam = searchParams.get('cat');
    if (catParam === 'kepala_sekolah' || catParam === 'guru' || catParam === 'staff') {
      return catParam as CategoryPerson;
    }
    return 'semua';
  }, [location.pathname, searchParams]);

  useEffect(() => {
    setPeople(getPeople().filter((p) => p.published && p.status === 'active'));
  }, []);

  const handleTabChange = (category: 'semua' | CategoryPerson) => {
    if (category === 'semua') {
      navigate('/personel');
    } else if (category === 'kepala_sekolah') {
      navigate('/personel/kepala-sekolah');
    } else if (category === 'guru') {
      navigate('/personel/guru');
    } else if (category === 'staff') {
      navigate('/personel/staff');
    }
  };

  const getHeadingDetails = () => {
    switch (activeCategory) {
      case 'kepala_sekolah':
        return {
          badge: 'Pimpinan Sekolah',
          title: 'Kepala Sekolah SMP Pancasila',
          desc: 'Profil dan dedikasi Kepala Sekolah SMP Pancasila Ponokawan dalam memajukan mutu pendidikan dan karakter siswa.',
          icon: Crown,
        };
      case 'guru':
        return {
          badge: 'Tenaga Pendidik',
          title: 'Dewan Guru & Tenaga Pengajar',
          desc: 'Daftar pendidik profesional dan berdedikasi tinggi yang membimbing peserta didik SMP Pancasila Ponokawan.',
          icon: GraduationCap,
        };
      case 'staff':
        return {
          badge: 'Tenaga Kependidikan',
          title: 'Staff & Tata Usaha (TU)',
          desc: 'Tim kependidikan yang mendukung kelancaran layanan administrasi, keuangan, perpustakaan, dan sarana prasarana.',
          icon: Briefcase,
        };
      default:
        return {
          badge: 'SDM Sekolah',
          title: 'Direktori Personel Sekolah',
          desc: 'Mengenal pimpinan, dewan guru pengajar, dan staf kependidikan SMP Pancasila Ponokawan Krian Sidoarjo.',
          icon: Users,
        };
    }
  };

  const heading = getHeadingDetails();
  const HeadingIcon = heading.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider">
          <HeadingIcon className="w-3.5 h-3.5" />
          <span>{heading.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {heading.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {heading.desc}
        </p>
      </div>

      {/* Interactive Personnel Gallery with Spatial FLIP layout and live fuzzy search */}
      <InteractivePersonnelGallery
        people={people}
        activeCategory={activeCategory}
        onCategoryChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
}

