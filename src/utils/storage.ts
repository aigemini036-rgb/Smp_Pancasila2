export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  desc: string;
}

export const defaultNews: NewsItem[] = [
  {
    id: '1',
    title: 'Siswa SchoolHub Meraih Juara 1 Lomba Web Nasional',
    category: 'Prestasi',
    date: '15 Okt 2025',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'Tim RPL SchoolHub berhasil menjuarai kompetisi web development tingkat nasional di Jakarta.'
  },
  {
    id: '2',
    title: 'Pelaksanaan Ujian Tengah Semester Ganjil 2025/2026',
    category: 'Akademik',
    date: '10 Okt 2025',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'Informasi lengkap mengenai jadwal dan tata tertib pelaksanaan UTS ganjil tahun ajaran ini.'
  },
  {
    id: '3',
    title: 'Kegiatan Perkemahan Pramuka Tingkat Penegak',
    category: 'Kegiatan',
    date: '05 Okt 2025',
    image: 'https://images.unsplash.com/photo-1533240332313-0bc69f50e8a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'Seluruh siswa kelas X wajib mengikuti perkemahan Jumat-Sabtu-Minggu (Perjusami) di Cibubur.'
  }
];

export const getNews = (): NewsItem[] => {
  const stored = localStorage.getItem('schoolhub_news');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('schoolhub_news', JSON.stringify(defaultNews));
  return defaultNews;
};

export const saveNews = (news: NewsItem[]) => {
  localStorage.setItem('schoolhub_news', JSON.stringify(news));
};

export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  location: string;
  status: string;
}

export const defaultAgenda: AgendaItem[] = [
  { id: '1', title: 'Ujian Tengah Semester', date: '15-20 Okt 2025', location: 'Ruang Kelas', status: 'Akan Datang' },
  { id: '2', title: 'Class Meeting', date: '25-28 Okt 2025', location: 'Lapangan Utama', status: 'Akan Datang' },
  { id: '3', title: 'Praktik Kerja Lapangan', date: '1 Nov - 31 Des', location: 'Industri Mitra', status: 'Persiapan' },
];

export const getAgenda = (): AgendaItem[] => {
  const stored = localStorage.getItem('schoolhub_agenda');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('schoolhub_agenda', JSON.stringify(defaultAgenda));
  return defaultAgenda;
};

export const saveAgenda = (agenda: AgendaItem[]) => {
  localStorage.setItem('schoolhub_agenda', JSON.stringify(agenda));
};
