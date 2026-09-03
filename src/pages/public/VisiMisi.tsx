import { getSchoolSettings } from '../../utils/storage';
import { Target } from 'lucide-react';
import EditorialUnderlineHeading from '../../components/public/EditorialUnderlineHeading';
import PaperDocumentReveal from '../../components/public/PaperDocumentReveal';

export default function VisiMisi() {
  const settings = getSchoolSettings();
  const missionLines = settings.mission ? settings.mission.split('\n').filter(Boolean) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
      {/* Editorial Header */}
      <EditorialUnderlineHeading
        badge="Arah & Pedoman Sekolah"
        badgeIcon={Target}
        title="Visi & Misi Sekolah"
        subtitle="Pedoman utama dalam membentuk iklim belajar yang berkualitas dan berkarakter di SMP Pancasila Ponokawan Krian Sidoarjo."
      />

      {/* Paper Document Reveal Container */}
      <PaperDocumentReveal
        vision={settings.vision}
        missionLines={missionLines}
      />
    </div>
  );
}

