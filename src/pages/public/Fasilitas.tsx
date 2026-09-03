import { useState, useEffect } from 'react';
import { getFacilities } from '../../utils/storage';
import { Facility } from '../../types';
import { Landmark } from 'lucide-react';
import EditorialUnderlineHeading from '../../components/public/EditorialUnderlineHeading';
import CinematicFacilityCard from '../../components/public/CinematicFacilityCard';

export default function Fasilitas() {
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    setFacilities(getFacilities().filter((f) => f.status === 'published' || f.published !== false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
      {/* Editorial Header */}
      <EditorialUnderlineHeading
        badge="Sarana & Prasarana"
        badgeIcon={Landmark}
        title="Fasilitas Pembelajaran Modern"
        subtitle="SMP Pancasila Ponokawan menyediakan ruang belajar kondusif, laboratorium lengkap, perpustakaan digital, serta sarana olahraga yang representatif."
      />

      {/* Facilities Grid with Cinematic Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((fac, index) => (
          <CinematicFacilityCard key={fac.id} facility={fac} index={index} />
        ))}
      </div>
    </div>
  );
}

