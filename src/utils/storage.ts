import {
  SchoolSettings,
  Person,
  News,
  Announcement,
  Achievement,
  Gallery,
  GalleryImage,
  Facility,
  MediaFile,
} from '../types';
import { assertPermission, Permission } from './permissions';

// STORAGE KEYS
const KEYS = {
  SETTINGS: 'smp_pancasila_settings',
  PEOPLE: 'smp_pancasila_people',
  NEWS: 'smp_pancasila_news',
  ANNOUNCEMENTS: 'smp_pancasila_announcements',
  ACHIEVEMENTS: 'smp_pancasila_achievements',
  GALLERIES: 'smp_pancasila_galleries',
  GALLERY_IMAGES: 'smp_pancasila_gallery_images',
  FACILITIES: 'smp_pancasila_facilities',
  MEDIA: 'smp_pancasila_media',
};

// INITIAL SEED DATA
export const defaultSchoolSettings: SchoolSettings = {
  id: 'set-001',
  school_name: 'SMP Pancasila Ponokawan',
  logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=300&q=80',
  address: 'Jl. Raya Ponokawan No. 45, Desa Ponokawan, Kec. Krian, Kabupaten Sidoarjo, Jawa Timur 61262',
  phone: '(031) 8971234 / 0812-3456-7890',
  email: 'info@smppancasilaponokawan.sch.id',
  description: 'SMP Pancasila Ponokawan Kabupaten Sidoarjo adalah sekolah menengah pertama unggulan berakreditasi A yang bertekad membentuk generasi mandiri, cerdas, berkarakter Pancasila, serta tanggap teknologi.',
  vision: 'Terwujudnya Peserta Didik yang Berakhlak Mulia, Unggul dalam Prestasi, Berwawasan Global, dan Peduli Lingkungan Berdasarkan Nilai-Nilai Pancasila.',
  mission: `1. Melaksanakan pembelajaran dan bimbingan belajar yang inovatif, efektif, dan berbasis keimanan ketaqwaan.
2. Mengembangkan bakat, minat, dan potensi akademik serta non-akademik siswa secara optimal.
3. Menanamkan sikap disiplin, sopan santun, keteladanan, dan budi pekerti luhur sesuai jiwa Pancasila.
4. Membudayakan literasi, kesadaran digital yang sehat, serta kebersihan dan kelestarian lingkungan sekolah.`,
  history: `SMP Pancasila Ponokawan didirikan pada tahun 1982 oleh Yayasan Pendidikan Pancasila Sidoarjo sebagai upaya menyediakan sarana pendidikan menengah berkualitas bagi masyarakat Krian dan sekitarnya. 

Berawal dari 3 ruang kelas sederhana dengan jumlah murid puluhan orang, kini SMP Pancasila Ponokawan telah berkembang menjadi salah satu sekolah terfavorit di wilayah Ponokawan Krian Sidoarjo. Sekolah dilengkapi dengan gedung bertingkat modern, laboratorium IPA dan Komputer canggih, perpustakaan digital, serta berbagai fasilitas ekstrakurikuler unggulan.`,
  operating_hours: 'Senin - Jumat: 07.00 - 15.15 WIB | Sabtu: 07.00 - 12.30 WIB',
  npsn: '20501234',
  accreditation: 'Akreditasi A',
  accreditation_label: 'Unggul & Terpuji',
  total_students: '450+',
  stat_students_label: 'Siswa-Siswi',
  total_teachers: '28+',
  stat_teachers_label: 'Guru & Staff',
  total_achievements: '50+',
  stat_achievements_label: 'Prestasi Juara',
  social_links: {
    facebook: 'https://facebook.com/smppancasilaponokawan',
    instagram: 'https://instagram.com/smp_pancasila_ponokawan',
    youtube: 'https://youtube.com/@smppancasilaponokawan',
    tiktok: 'https://tiktok.com/@smppancasilaponokawan',
  },
  contact_other: 'Layanan Pengaduan & Informasi PPDB Online: 0812-3456-7890 (WhatsApp)',
  headmaster_section_background: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
  headmaster_background_position: 'center',
  headmaster_background_opacity: 0.35,
  updated_at: new Date().toISOString(),
};

export const defaultPeople: Person[] = [
  {
    id: 'p-001',
    name: 'Drs. H. Bambang Sugierto, M.Pd.',
    slug: 'drs-h-bambang-sugierto-mpd',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    position: 'Kepala Sekolah',
    category: 'kepala_sekolah',
    nip_nuptk: '19680312 199403 1 005',
    education: 'S2 Manajemen Pendidikan (UNESA)',
    subject: 'Manajemen Pendidikan & Kewirausahaan',
    education_history: 'S1 Pendidikan Universitas Negeri Surabaya (1992) | S2 Manajemen Pendidikan UNESA (2008)',
    work_history: 'Guru Matematika (1994-2010) | Wakasek Kurikulum (2010-2018) | Kepala Sekolah SMP Pancasila Ponokawan (2018-Sekarang)',
    short_bio: 'Berpengalaman lebih dari 28 tahun memimpin tata kelola sekolah, berdedikasi membangun iklim sekolah islami, inklusif, berprestasi, dan ramah anak.',
    contact: 'kepala.sekolah@smppancasilaponokawan.sch.id',
    status: 'active',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-002',
    name: 'Dra. Hj. Siti Rahmah, M.Pd.',
    slug: 'dra-hj-siti-rahmah-mpd',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    position: 'Guru Bahasa Indonesia & Pembina OSIS',
    category: 'guru',
    nip_nuptk: '19720510 199802 2 003',
    education: 'S2 Pendidikan Bahasa Indonesia',
    subject: 'Bahasa Indonesia',
    education_history: 'S1 Pendidikan Bahasa Indonesia (Airlangga) | S2 Pendidikan Bahasa',
    work_history: 'Pengajar Bahasa Indonesia SMP Pancasila Ponokawan (1998-Sekarang)',
    short_bio: 'Aktif mendampingi kegiatan OSIS, gerakan literasi sekolah, serta pembinaan lomba debat dan cipta puisi tingkat kabupaten.',
    contact: 'siti.rahmah@smppancasilaponokawan.sch.id',
    status: 'active',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-003',
    name: 'Ahmad Nur Kholis, S.Pd.',
    slug: 'ahmad-nur-kholis-spd',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    position: 'Guru Matematika & Pembina Pramuka',
    category: 'guru',
    nip_nuptk: '19850914 201001 1 012',
    education: 'S1 Pendidikan Matematika (ITS)',
    subject: 'Matematika',
    education_history: 'S1 Matematika Institut Teknologi Sepuluh Nopember',
    work_history: 'Guru Matematika SMP Pancasila Ponokawan (2010-Sekarang)',
    short_bio: 'Pengajar matematika dengan metode numerasi interaktif dan pelatih regu Pramuka Penggalang prestasi.',
    contact: 'ahmad.kholis@smppancasilaponokawan.sch.id',
    status: 'active',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-004',
    name: 'Maya Indriani, S.Kom.',
    slug: 'maya-indriani-skom',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    position: 'Guru TIK & Prakarya',
    category: 'guru',
    nip_nuptk: '19910418 201503 2 004',
    education: 'S1 Teknik Informatika',
    subject: 'Informatika / TIK',
    education_history: 'S1 Informatika Universitas Pembangunan Nasional',
    work_history: 'Pengajar TIK & Kepala Lab Komputer SMP Pancasila (2015-Sekarang)',
    short_bio: 'Mendorong siswa mahir koding dasar, desain grafis, dan pemanfaatan AI yang bijak untuk pembelajaran.',
    contact: 'maya.indriani@smppancasilaponokawan.sch.id',
    status: 'active',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-005',
    name: 'Rina Wijaya, A.Md.',
    slug: 'rina-wijaya-amd',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    position: 'Kepala Tata Usaha',
    category: 'staff',
    nip_nuptk: '19881120 201402 2 008',
    education: 'D3 Administrasi Perkantoran',
    subject: 'Administrasi Sekolah',
    education_history: 'D3 Administrasi Perkantoran UNESA',
    work_history: 'Staf Administrasi (2014) | Kepala Tata Usaha (2019-Sekarang)',
    short_bio: 'Mengelola administrasi persuratan, data pokok pendidikan (Dapodik), dan layanan wali murid.',
    contact: 'tu@smppancasilaponokawan.sch.id',
    status: 'active',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'p-006',
    name: 'Supriyadi, S.IP.',
    slug: 'supriyadi-sip',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    position: 'Kepala Perpustakaan Digital',
    category: 'staff',
    nip_nuptk: '19830215 201101 1 007',
    education: 'S1 Ilmu Perpustakaan',
    subject: 'Layanan Perpustakaan',
    education_history: 'S1 Ilmu Perpustakaan Universitas Airlangga',
    work_history: 'Pustakawan SMP Pancasila Ponokawan (2011-Sekarang)',
    short_bio: 'Pengelola e-library dan gerakan pojok baca kelas di lingkungan SMP Pancasila Ponokawan.',
    contact: 'perpustakaan@smppancasilaponokawan.sch.id',
    status: 'active',
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const defaultNews: News[] = [
  {
    id: 'n-001',
    title: 'Siswa SMP Pancasila Ponokawan Sidoarjo Meraih Juara 1 Lomba Web & Robotik Kabupaten',
    slug: 'siswa-smp-pancasila-ponokawan-sidoarjo-juara-1-robotik',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    content: `Tim Ekstrakurikuler Robotik dan TIK SMP Pancasila Ponokawan Sidoarjo mengukir prestasi gemilang dengan meraih Juara 1 dalam ajang Kompetisi Inovasi Teknologi Pelajar se-Kabupaten Sidoarjo.

Kompetisi yang berlangsung di Pendopo Kabupaten Sidoarjo ini diikuti oleh lebih dari 50 tim dari berbagai sekolah menengah. Tim SMP Pancasila membawakan karya 'Sistem Pemilah Sampah Otomatis Berbasis Sensor Arduino' yang dinilai sangat aplikatif untuk program Sekolah Adiwiyata.

Kepala Sekolah Drs. H. Bambang Sugierto, M.Pd. menyampaikan apresiasi setinggi-tingginya kepada para siswa pendamping dan pembina atas kerja keras yang berbuah manis.`,
    author_id: 'adm-001',
    author_name: 'Humas SMP Pancasila',
    category: 'Prestasi',
    status: 'published',
    created_at: '2026-02-10T08:00:00Z',
    updated_at: '2026-02-10T08:00:00Z',
    published_at: '10 Feb 2026',
  },
  {
    id: 'n-002',
    title: 'Pelaksanaan Ujian Tengah Semester (UTS) Genap Tahun Ajaran 2025/2026',
    slug: 'pelaksanaan-uts-genap-2025-2026',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    content: `Seluruh siswa kelas VII, VIII, dan IX SMP Pancasila Ponokawan akan mengikuti Pelaksanaan Asesmen Tengah Semester (UTS) Genap yang dijadwalkan pada tanggal 2 - 7 Maret 2026.

Ujian dilaksanakan secara hybrid menggunakan CBT (Computer Based Test) melalui laboratorium komputer sekolah dan tablet belajar. Dihimbau kepada seluruh wali murid untuk mendampingi belajar putra-putrinya di rumah.`,
    author_id: 'adm-001',
    author_name: 'Kurikulum',
    category: 'Akademik',
    status: 'published',
    created_at: '2026-02-01T08:00:00Z',
    updated_at: '2026-02-01T08:00:00Z',
    published_at: '01 Feb 2026',
  },
  {
    id: 'n-003',
    title: 'Kemah Pramuka Penggalang Penegak Karakter Pancasila di Claket Mojokerto',
    slug: 'kemah-pramuka-penggalang-ponokawan-2026',
    thumbnail: 'https://images.unsplash.com/photo-1533240332313-0bc69f50e8a7?auto=format&fit=crop&w=800&q=80',
    content: `Pramuka Gugus Depan SMP Pancasila Ponokawan sukses menyelenggarakan Perkemahan Jumat-Sabtu-Minggu (Perjusami) di Bumi Perkemahan Claket, Mojokerto.

Kegiatan diikuti 320 siswa kelas VII dan VIII dengan agenda penjelajahan alam, outbond kepemimpinan, bakti sosial masyarakat desa, serta malam keakraban api unggun.`,
    author_id: 'adm-001',
    author_name: 'Pembina Pramuka',
    category: 'Kegiatan',
    status: 'published',
    created_at: '2026-01-20T08:00:00Z',
    updated_at: '2026-01-20T08:00:00Z',
    published_at: '20 Jan 2026',
  },
];

export const defaultAnnouncements: Announcement[] = [
  {
    id: 'a-001',
    slug: 'penerimaan-peserta-didik-baru-ppdb-2026-2027',
    title: 'Penerimaan Peserta Didik Baru (PPDB) SMP Pancasila Ponokawan TA 2026/2027',
    content: 'Pendaftaran Murid Baru Gelombang 1 dibuka mulai 1 Februari s/d 30 April 2026. Dapatkan potongan biaya pendaftaran bagi pendaftar jalur prestasi dan alumni SD mitra di Krian Sidoarjo.',
    status: 'active',
    start_date: '2026-02-01',
    end_date: '2026-04-30',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a-002',
    slug: 'jadwal-libur-menyambut-bulan-suci-ramadhan',
    title: 'Jadwal Kegatan Pondok Ramadhan & Libur Awal Puasa',
    content: 'Diberitahukan kepada seluruh siswa dan wali murid bahwa Libur Permulaan Puasa dimulai tanggal 11-13 Maret 2026. Kegiatan Pondok Ramadhan dilaksanakan tanggal 16-20 Maret 2026.',
    status: 'active',
    start_date: '2026-03-01',
    end_date: '2026-03-25',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const defaultAchievements: Achievement[] = [
  {
    id: 'ac-001',
    slug: 'juara-1-lomba-karawitan-se-sidoarjo',
    title: 'Juara 1 Lomba Seni Karawitan & Tari Tradisional Sidoarjo',
    description: 'Tim Sanggar Seni SMP Pancasila Ponokawan meraih peringkat pertama kategori SMP se-Kabupaten Sidoarjo.',
    category: 'Seni & Budaya',
    level: 'sekolah',
    year: 2025,
    documentation: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ac-002',
    slug: 'juara-2-olimpiade-matematika-nasional-siswa',
    title: 'Juara 2 Olimpiade Matematika Pelajar Nasional',
    description: 'Ananda Muhammad Rizky Pratama (Kelas VIII A) menyabet medali perak kompetisi numerasi tingkat nasional.',
    category: 'Akademik',
    level: 'individu',
    recipient_name: 'Muhammad Rizky Pratama',
    recipient_id: 'p-003',
    year: 2025,
    documentation: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const defaultGalleries: Gallery[] = [
  {
    id: 'g-001',
    title: 'Peringatan Hari Kemerdekaan & Porak Sekolah 2025',
    description: 'Dokumentasi perlombaan antar kelas, jalan sehat, upacara khidmat, dan pentas seni kebudayaan murid SMP Pancasila Ponokawan Sidoarjo.',
    cover_image: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'g-002',
    title: 'Kegiatan Praktikum Sains & Laboratorium Komputer',
    description: 'Aktivitas pengamatan mikroskop, percobaan fisika biologi, dan simulasi CBT siswa kelas VII & VIII.',
    cover_image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'g-003',
    title: 'Ekstrakurikuler & Pembinaan Karakter Pancasila',
    description: 'Dokumentasi kegiatan Pramuka Penggalang, Paskibra, PMR Madya, dan tim robotik berprestasi.',
    cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const defaultGalleryImages: GalleryImage[] = [
  // Album 1: Hari Kemerdekaan & Porak (8 photos)
  {
    id: 'gi-001',
    gallery_id: 'g-001',
    image: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?auto=format&fit=crop&w=1000&q=80',
    caption: 'Lomba tarik tambang antar kelas dengan antusiasme tinggi seluruh siswa',
    date: '17 Agu 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-002',
    gallery_id: 'g-001',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    caption: 'Pentas Seni Tari Tradisional Nusantara oleh siswi kelas IX di panggung utama',
    date: '17 Agu 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-003',
    gallery_id: 'g-001',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    caption: 'Upacara Bendera Peringatan HUT RI ke-80 dipimpin oleh Kepala Sekolah',
    date: '17 Agu 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-004',
    gallery_id: 'g-001',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    caption: 'Keceriaan barisan peserta jalan sehat menyusuri desa Ponokawan Krian',
    date: '16 Agu 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-005',
    gallery_id: 'g-001',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80',
    caption: 'Lomba cipta puisi perjuangan dan orasi kebangsaan siswa antar kelas',
    date: '15 Agu 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-006',
    gallery_id: 'g-001',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
    caption: 'Pertandingan final turnamen futsal Porak di lapangan olahraga sekolah',
    date: '18 Agu 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-007',
    gallery_id: 'g-001',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    caption: 'Bazar kewirausahaan siswa menyajikan aneka jajanan tradisional sehat',
    date: '18 Agu 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-008',
    gallery_id: 'g-001',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    caption: 'Foto bersama panitia OSIS dan dewan guru setelah penutupan perayaan',
    date: '19 Agu 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },

  // Album 2: Praktikum Sains & Lab Komputer (6 photos)
  {
    id: 'gi-009',
    gallery_id: 'g-002',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
    caption: 'Pengamatan struktur jaringan epidermis daun pada praktikum Biologi Lab IPA',
    date: '10 Sep 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-010',
    gallery_id: 'g-002',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
    caption: 'Simulasi asesmen berbasis komputer (CBT) di Laboratorium Komputer Modern',
    date: '15 Sep 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-011',
    gallery_id: 'g-002',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1000&q=80',
    caption: 'Uji coba rangkaian elektronika fisika sederhana oleh kelompok siswa kelas VIII',
    date: '20 Sep 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-012',
    gallery_id: 'g-002',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
    caption: 'Diskusi kelompok pembuatan laporan ilmiah praktikum terpadu',
    date: '25 Sep 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-013',
    gallery_id: 'g-002',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
    caption: 'Pembelajaran literasi sains digital di perpustakaan sekolah ber-AC',
    date: '02 Okt 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-014',
    gallery_id: 'g-002',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    caption: 'Presentasi hasil karya sains interaktif di depan kelas',
    date: '08 Okt 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },

  // Album 3: Ekstrakurikuler & Karakter Pancasila (6 photos)
  {
    id: 'gi-015',
    gallery_id: 'g-003',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
    caption: 'Klub Robotik & TIK merakit prototype inovasi teknologi sensor ramah lingkungan',
    date: '12 Nov 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-016',
    gallery_id: 'g-003',
    image: 'https://images.unsplash.com/photo-1533240332313-0bc69f50e8a7?auto=format&fit=crop&w=1000&q=80',
    caption: 'Kegiatan Perkemahan Pramuka Penggalang di Bumi Perkemahan Claket',
    date: '20 Nov 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-017',
    gallery_id: 'g-003',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80',
    caption: 'Latihan rutin Paskibra membina kedisiplinan dan baris-berbaris',
    date: '28 Nov 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-018',
    gallery_id: 'g-003',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    caption: 'Simulasi pertolongan pertama oleh anggota PMR Madya SMP Pancasila',
    date: '05 Des 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-019',
    gallery_id: 'g-003',
    image: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?auto=format&fit=crop&w=1000&q=80',
    caption: 'Aksi peduli lingkungan dan penanaman bibit pohon di halaman sekolah',
    date: '10 Des 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
  {
    id: 'gi-020',
    gallery_id: 'g-003',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    caption: 'Penerimaan piala penghargaan regu Pramuka teladan tingkat kabupaten',
    date: '15 Des 2025',
    status: 'published',
    created_at: new Date().toISOString(),
  },
];

export const defaultFacilities: Facility[] = [
  {
    id: 'f-001',
    name: 'Laboratorium Komputer & Bahasa',
    description: 'Ruangan ber-AC dilengkapi 40 unit PC modern berkecepatan tinggi dan akses internet jaringan fiber optik untuk CBT dan pembelajaran koding.',
    photo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    location: 'Lantai 2 Gedung Utama',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f-002',
    name: 'Perpustakaan & E-Library',
    description: 'Koleksi ribuan buku pelajaran, novel sains, ensiklopedia, serta sudut baca digital nyaman berkarpet.',
    photo: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    location: 'Lantai 1 Sayap Timur',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f-003',
    name: 'Lapangan Olahraga Serbaguna',
    description: 'Lapangan luas standar nasional untuk Futsal, Basket, Voli, dan Upacara Bendera sekolah.',
    photo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    location: 'Area Halaman Tengah',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f-004',
    name: 'Musholla Al-Hikmah',
    description: 'Tempat ibadah nyaman dan bersih penunjang Sholat Dzuhur berjamaah, Istighosah, dan kajian keagamaan.',
    photo: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    location: 'Sayap Barat Sekolah',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const defaultMedia: MediaFile[] = [
  {
    id: 'm-001',
    file_name: 'logo-smp-pancasila.png',
    file_path: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=300&q=80',
    file_type: 'image/png',
    file_size: 102400,
    alt_text: 'Logo Resmi SMP Pancasila Ponokawan Sidoarjo',
    uploaded_by: 'adm-001',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm-002',
    file_name: 'gedung-sekolah-depan.jpg',
    file_path: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    file_type: 'image/jpeg',
    file_size: 450000,
    alt_text: 'Tampak Depan Gedung SMP Pancasila Ponokawan',
    uploaded_by: 'adm-001',
    created_at: new Date().toISOString(),
  },
];

// DATA ACCESS FUNCTIONS

// Settings
export function getSchoolSettings(): SchoolSettings {
  const stored = localStorage.getItem(KEYS.SETTINGS);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return { ...defaultSchoolSettings, ...parsed };
    } catch { /* ignore */ }
  }
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSchoolSettings));
  return defaultSchoolSettings;
}

export function saveSchoolSettings(settings: SchoolSettings): SchoolSettings {
  assertPermission(Permission.MANAGE_SCHOOL_DATA, 'Menyimpan Pengaturan Sekolah');
  const updated = { ...settings, updated_at: new Date().toISOString() };
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
}

// People
export function getPeople(): Person[] {
  const stored = localStorage.getItem(KEYS.PEOPLE);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  localStorage.setItem(KEYS.PEOPLE, JSON.stringify(defaultPeople));
  return defaultPeople;
}

export function savePeople(people: Person[]): void {
  assertPermission(Permission.MANAGE_PERSONNEL, 'Menyimpan Data Personel');
  localStorage.setItem(KEYS.PEOPLE, JSON.stringify(people));
}

export function savePerson(person: Person): void {
  assertPermission(Permission.MANAGE_PERSONNEL, 'Menyimpan Profil Personel');
  const current = getPeople();
  const index = current.findIndex((p) => p.id === person.id);
  if (index >= 0) {
    current[index] = { ...person, updated_at: new Date().toISOString() };
  } else {
    current.unshift({ ...person, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  savePeople(current);
}

export function deletePerson(id: string): void {
  assertPermission(Permission.MANAGE_PERSONNEL, 'Menghapus Data Personel');
  const current = getPeople();
  const filtered = current.filter((p) => p.id !== id);
  savePeople(filtered);
}

// News
export function getNewsList(): News[] {
  const stored = localStorage.getItem(KEYS.NEWS);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  localStorage.setItem(KEYS.NEWS, JSON.stringify(defaultNews));
  return defaultNews;
}

export function saveNewsList(news: News[]): void {
  assertPermission(Permission.MANAGE_NEWS, 'Menyimpan Daftar Berita');
  localStorage.setItem(KEYS.NEWS, JSON.stringify(news));
}

export function saveNews(newsItem: News): void {
  assertPermission(Permission.MANAGE_NEWS, 'Menyimpan Artikel Berita');
  const current = getNewsList();
  const index = current.findIndex((n) => n.id === newsItem.id);
  if (index >= 0) {
    current[index] = { ...newsItem, updated_at: new Date().toISOString() };
  } else {
    current.unshift({ ...newsItem, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  saveNewsList(current);
}

export function deleteNews(id: string): void {
  assertPermission(Permission.DELETE_NEWS, 'Menghapus Berita');
  const current = getNewsList();
  const filtered = current.filter((n) => n.id !== id);
  saveNewsList(filtered);
}


export const getNews = getNewsList;
export type NewsItem = News;

export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  location: string;
  status: string;
}

export function getAgenda(): AgendaItem[] {
  const stored = localStorage.getItem('smp_pancasila_agendas');
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  const defaults: AgendaItem[] = [
    { id: 'ag-1', title: 'Ujian Tengah Semester (UTS) Genap', date: '02 - 07 Maret 2026', location: 'Ruang Kelas & Lab CBT', status: 'Akan Datang' },
    { id: 'ag-2', title: 'Pondok Ramadhan 1447 H', date: '16 - 20 Maret 2026', location: 'Musholla Al-Hikmah', status: 'Akan Datang' },
  ];
  localStorage.setItem('smp_pancasila_agendas', JSON.stringify(defaults));
  return defaults;
}

export function saveAgenda(agendas: AgendaItem[]): void {
  assertPermission(Permission.MANAGE_NEWS, 'Menyimpan Agenda Sekolah');
  localStorage.setItem('smp_pancasila_agendas', JSON.stringify(agendas));
}

// Announcements
export function getAnnouncements(): Announcement[] {

  const stored = localStorage.getItem(KEYS.ANNOUNCEMENTS);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(defaultAnnouncements));
  return defaultAnnouncements;
}

export function saveAnnouncements(announcements: Announcement[]): void {
  assertPermission(Permission.MANAGE_ANNOUNCEMENTS, 'Menyimpan Pengumuman');
  localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
}

export function saveAnnouncement(announcement: Announcement): void {
  assertPermission(Permission.MANAGE_ANNOUNCEMENTS, 'Menyimpan Data Pengumuman');
  const current = getAnnouncements();
  const index = current.findIndex((a) => a.id === announcement.id);
  if (index >= 0) {
    current[index] = { ...announcement, updated_at: new Date().toISOString() };
  } else {
    current.unshift({ ...announcement, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  saveAnnouncements(current);
}

export function deleteAnnouncement(id: string): void {
  assertPermission(Permission.MANAGE_ANNOUNCEMENTS, 'Menghapus Pengumuman');
  const current = getAnnouncements();
  saveAnnouncements(current.filter((a) => a.id !== id));
}

// Achievements
export function getAchievements(): Achievement[] {
  const stored = localStorage.getItem(KEYS.ACHIEVEMENTS);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(defaultAchievements));
  return defaultAchievements;
}

export function saveAchievements(achievements: Achievement[]): void {
  assertPermission(Permission.MANAGE_ACHIEVEMENTS, 'Menyimpan Prestasi');
  localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

export function saveAchievement(achievement: Achievement): void {
  assertPermission(Permission.MANAGE_ACHIEVEMENTS, 'Menyimpan Data Prestasi');
  const current = getAchievements();
  const index = current.findIndex((a) => a.id === achievement.id);
  if (index >= 0) {
    current[index] = { ...achievement, updated_at: new Date().toISOString() };
  } else {
    current.unshift({ ...achievement, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  saveAchievements(current);
}

export function deleteAchievement(id: string): void {
  assertPermission(Permission.MANAGE_ACHIEVEMENTS, 'Menghapus Prestasi');
  const current = getAchievements();
  saveAchievements(current.filter((a) => a.id !== id));
}


// Galleries
export function getGalleries(): Gallery[] {
  const stored = localStorage.getItem(KEYS.GALLERIES);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  localStorage.setItem(KEYS.GALLERIES, JSON.stringify(defaultGalleries));
  return defaultGalleries;
}

export const getGalleryAlbums = getGalleries;

export function saveGalleries(galleries: Gallery[]): void {
  assertPermission(Permission.MANAGE_GALLERIES, 'Menyimpan Album Galeri');
  localStorage.setItem(KEYS.GALLERIES, JSON.stringify(galleries));
}

export function saveGallery(gallery: Gallery): void {
  assertPermission(Permission.MANAGE_GALLERIES, 'Menyimpan Data Galeri');
  const current = getGalleries();
  const index = current.findIndex((g) => g.id === gallery.id);
  if (index >= 0) {
    current[index] = { ...gallery, updated_at: new Date().toISOString() };
  } else {
    current.unshift({ ...gallery, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  saveGalleries(current);
}

export function deleteGallery(id: string): void {
  assertPermission(Permission.MANAGE_GALLERIES, 'Menghapus Album Galeri');
  const current = getGalleries();
  saveGalleries(current.filter((g) => g.id !== id));
}

// Gallery Images
export function getGalleryImages(): GalleryImage[] {
  const stored = localStorage.getItem(KEYS.GALLERY_IMAGES);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  localStorage.setItem(KEYS.GALLERY_IMAGES, JSON.stringify(defaultGalleryImages));
  return defaultGalleryImages;
}

export function saveGalleryImages(images: GalleryImage[]): void {
  assertPermission(Permission.MANAGE_GALLERIES, 'Menyimpan Foto Galeri');
  localStorage.setItem(KEYS.GALLERY_IMAGES, JSON.stringify(images));
}

export function saveGalleryImage(item: GalleryImage): void {
  assertPermission(Permission.MANAGE_GALLERIES, 'Menyimpan Foto Galeri');
  const current = getGalleryImages();
  const index = current.findIndex((img) => img.id === item.id);
  if (index >= 0) {
    current[index] = item;
  } else {
    current.unshift(item);
  }
  saveGalleryImages(current);
}

export function deleteGalleryImage(id: string): void {
  assertPermission(Permission.MANAGE_GALLERIES, 'Menghapus Foto Galeri');
  const current = getGalleryImages();
  saveGalleryImages(current.filter((img) => img.id !== id));
}

// Facilities
export function getFacilities(): Facility[] {
  const stored = localStorage.getItem(KEYS.FACILITIES);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  localStorage.setItem(KEYS.FACILITIES, JSON.stringify(defaultFacilities));
  return defaultFacilities;
}

export function saveFacilities(facilities: Facility[]): void {
  assertPermission(Permission.MANAGE_FACILITIES, 'Menyimpan Fasilitas Sekolah');
  localStorage.setItem(KEYS.FACILITIES, JSON.stringify(facilities));
}

export function saveFacility(facility: Facility): void {
  assertPermission(Permission.MANAGE_FACILITIES, 'Menyimpan Data Fasilitas');
  const current = getFacilities();
  const index = current.findIndex((f) => f.id === facility.id);
  if (index >= 0) {
    current[index] = { ...facility, updated_at: new Date().toISOString() };
  } else {
    current.unshift({ ...facility, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  saveFacilities(current);
}

export function deleteFacility(id: string): void {
  assertPermission(Permission.MANAGE_FACILITIES, 'Menghapus Fasilitas');
  const current = getFacilities();
  saveFacilities(current.filter((f) => f.id !== id));
}

// Media
export function getMediaFiles(): MediaFile[] {
  const stored = localStorage.getItem(KEYS.MEDIA);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  localStorage.setItem(KEYS.MEDIA, JSON.stringify(defaultMedia));
  return defaultMedia;
}

export function saveMediaFiles(media: MediaFile[]): void {
  assertPermission(Permission.UPLOAD_MEDIA, 'Menyimpan File Media');
  localStorage.setItem(KEYS.MEDIA, JSON.stringify(media));
}

export function saveMediaFile(file: MediaFile): void {
  assertPermission(Permission.UPLOAD_MEDIA, 'Mengunggah File Media');
  const current = getMediaFiles();
  const index = current.findIndex((m) => m.id === file.id);
  if (index >= 0) {
    current[index] = file;
  } else {
    current.unshift(file);
  }
  saveMediaFiles(current);
}

export function deleteMediaFile(id: string): void {
  assertPermission(Permission.UPLOAD_MEDIA, 'Menghapus File Media');
  const current = getMediaFiles();
  saveMediaFiles(current.filter((m) => m.id !== id));
}

// HELPER FOR SLUGS
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// FULL CMS BACKUP & RESTORE UTILITIES
export function exportAllSchoolData(): string {
  assertPermission(Permission.BACKUP_RESTORE, 'Ekspor Data Cadangan Sistem');
  const allData = {
    exported_at: new Date().toISOString(),
    version: '1.0',
    school_name: 'SMP Pancasila Ponokawan',
    settings: getSchoolSettings(),
    people: getPeople(),
    news: getNewsList(),
    announcements: getAnnouncements(),
    achievements: getAchievements(),
    galleries: getGalleries(),
    gallery_images: getGalleryImages(),
    facilities: getFacilities(),
    media: getMediaFiles(),
    agendas: getAgenda(),
  };
  return JSON.stringify(allData, null, 2);
}

export function importAllSchoolData(jsonString: string): { success: boolean; message: string } {
  try {
    assertPermission(Permission.BACKUP_RESTORE, 'Impor Data Cadangan Sistem');
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') {
      return { success: false, message: 'Format data JSON tidak valid.' };
    }
    if (data.settings) saveSchoolSettings(data.settings);
    if (Array.isArray(data.people)) savePeople(data.people);
    if (Array.isArray(data.news)) saveNewsList(data.news);
    if (Array.isArray(data.announcements)) saveAnnouncements(data.announcements);
    if (Array.isArray(data.achievements)) saveAchievements(data.achievements);
    if (Array.isArray(data.galleries)) saveGalleries(data.galleries);
    if (Array.isArray(data.gallery_images)) saveGalleryImages(data.gallery_images);
    if (Array.isArray(data.facilities)) saveFacilities(data.facilities);
    if (Array.isArray(data.media)) saveMediaFiles(data.media);
    if (Array.isArray(data.agendas)) saveAgenda(data.agendas);

    return { success: true, message: 'Seluruh data CMS berhasil diimpor dan diperbarui!' };
  } catch (err: any) {
    return { success: false, message: 'Gagal memproses file JSON: ' + (err.message || 'Error tidak diketahui') };
  }
}

export function resetAllToDefaults(): void {
  assertPermission(Permission.SYSTEM_MAINTENANCE, 'Reset Data Sistem ke Default');
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSchoolSettings));
  localStorage.setItem(KEYS.PEOPLE, JSON.stringify(defaultPeople));
  localStorage.setItem(KEYS.NEWS, JSON.stringify(defaultNews));
  localStorage.setItem(KEYS.ANNOUNCEMENTS, JSON.stringify(defaultAnnouncements));
  localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(defaultAchievements));
  localStorage.setItem(KEYS.GALLERIES, JSON.stringify(defaultGalleries));
  localStorage.setItem(KEYS.GALLERY_IMAGES, JSON.stringify(defaultGalleryImages));
  localStorage.setItem(KEYS.FACILITIES, JSON.stringify(defaultFacilities));
  localStorage.setItem(KEYS.MEDIA, JSON.stringify(defaultMedia));
}

