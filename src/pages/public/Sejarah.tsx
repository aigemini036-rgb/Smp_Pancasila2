import { getSchoolSettings } from '../../utils/storage';
import { BookOpen, Landmark } from 'lucide-react';
import EditorialUnderlineHeading from '../../components/public/EditorialUnderlineHeading';
import AnimatedTimelineDraw, { MilestoneItem } from '../../components/public/AnimatedTimelineDraw';

export default function Sejarah() {
  const settings = getSchoolSettings();

  const milestones: MilestoneItem[] = [
    {
      year: '1982',
      title: 'Pendirian Pertama',
      description: 'Didirikan oleh Yayasan Pendidikan Pancasila Sidoarjo dengan 3 ruang kelas dasar.',
      icon: 'calendar',
    },
    {
      year: '2005',
      title: settings.accreditation ? (settings.accreditation.toLowerCase().startsWith('akreditasi') ? settings.accreditation : `Akreditasi ${settings.accreditation}`) : 'Akreditasi A',
      description: `Meraih peringkat ${settings.accreditation || 'Akreditasi A'} dari Badan Akreditasi Nasional Sekolah/Madrasah.`,
      icon: 'shield',
    },
    {
      year: 'Sekarang',
      title: 'Digital & Modern',
      description: 'Dilengkapi CBT komputer, e-library, dan ekstrakurikuler berbasis teknologi & robotik.',
      icon: 'landmark',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
      {/* Editorial Header */}
      <EditorialUnderlineHeading
        badge="Profil Sekolah"
        badgeIcon={BookOpen}
        title="Sejarah SMP Pancasila Ponokawan"
        subtitle="Perjalanan dedikasi pendidikan menengah pertama sejak tahun 1982 di Desa Ponokawan, Kecamatan Krian, Kabupaten Sidoarjo."
      />

      {/* Hero Image & Content */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm space-y-8">
        <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80"
            alt="Gedung SMP Pancasila Ponokawan"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-base space-y-4 whitespace-pre-line">
          {settings.history}
        </div>

        {/* Milestone Timeline with Animated Draw */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-700 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-yellow-500" />
            <span>Milestone Perjalanan Sekolah</span>
          </h3>

          <AnimatedTimelineDraw milestones={milestones} />
        </div>
      </div>
    </div>
  );
}

