import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// RBAC
import ProtectedRoute from './components/admin/ProtectedRoute';
import { Permission } from './utils/permissions';

// Public Pages
import Home from './pages/public/Home';
import Sejarah from './pages/public/Sejarah';
import VisiMisi from './pages/public/VisiMisi';
import Struktur from './pages/public/Struktur';
import PersonelList from './pages/public/PersonelList';
import PersonelDetail from './pages/public/PersonelDetail';
import PrestasiList from './pages/public/PrestasiList';
import BeritaList from './pages/public/BeritaList';
import BeritaDetail from './pages/public/BeritaDetail';
import PengumumanList from './pages/public/PengumumanList';
import PengumumanDetail from './pages/public/PengumumanDetail';
import GaleriList from './pages/public/GaleriList';
import Fasilitas from './pages/public/Fasilitas';
import Kontak from './pages/public/Kontak';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import SekolahSettings from './pages/admin/SekolahSettings';
import PersonelManager from './pages/admin/PersonelManager';
import BeritaManager from './pages/admin/BeritaManager';
import NewsManager from './pages/admin/NewsManager';
import AgendaManager from './pages/admin/AgendaManager';
import PrestasiManager from './pages/admin/PrestasiManager';
import GaleriManager from './pages/admin/GaleriManager';
import FasilitasManager from './pages/admin/FasilitasManager';
import PengumumanManager from './pages/admin/PengumumanManager';
import MediaManager from './pages/admin/MediaManager';
import PengaturanWebsite from './pages/admin/PengaturanWebsite';
import ManajemenAkun from './pages/admin/ManajemenAkun';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Main Header & Footer */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          
          {/* Profil */}
          <Route path="profil/sejarah" element={<Sejarah />} />
          <Route path="profil/visi-misi" element={<VisiMisi />} />
          <Route path="profil/struktur" element={<Struktur />} />

          {/* Personel */}
          <Route path="personel" element={<PersonelList />} />
          <Route path="personel/kepala-sekolah" element={<PersonelList />} />
          <Route path="personel/guru" element={<PersonelList />} />
          <Route path="personel/staff" element={<PersonelList />} />
          <Route path="personel/:id" element={<PersonelDetail />} />

          {/* Public Content */}
          <Route path="prestasi" element={<PrestasiList />} />
          <Route path="berita" element={<BeritaList />} />
          <Route path="berita/:id" element={<BeritaDetail />} />
          <Route path="pengumuman" element={<PengumumanList />} />
          <Route path="pengumuman/:id" element={<PengumumanDetail />} />
          <Route path="galeri" element={<GaleriList />} />
          <Route path="fasilitas" element={<Fasilitas />} />
          <Route path="kontak" element={<Kontak />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Panel Routes with Sidebar and RBAC Protection */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute permission={Permission.VIEW_DASHBOARD}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="sekolah"
            element={
              <ProtectedRoute permission={Permission.VIEW_SCHOOL_DATA}>
                <SekolahSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="personel"
            element={
              <ProtectedRoute permission={Permission.VIEW_PERSONNEL}>
                <PersonelManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="berita"
            element={
              <ProtectedRoute permission={Permission.VIEW_NEWS}>
                <BeritaManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="pengumuman"
            element={
              <ProtectedRoute permission={Permission.VIEW_ANNOUNCEMENT}>
                <PengumumanManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="prestasi"
            element={
              <ProtectedRoute permission={Permission.VIEW_ACHIEVEMENT}>
                <PrestasiManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="galeri"
            element={
              <ProtectedRoute permission={Permission.VIEW_GALLERY}>
                <GaleriManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="fasilitas"
            element={
              <ProtectedRoute permission={Permission.VIEW_FACILITY}>
                <FasilitasManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="media"
            element={
              <ProtectedRoute permission={Permission.VIEW_MEDIA}>
                <MediaManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="agenda"
            element={
              <ProtectedRoute permission={Permission.VIEW_AGENDA}>
                <AgendaManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="news"
            element={
              <ProtectedRoute permission={Permission.VIEW_NEWS}>
                <NewsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="pengaturan"
            element={
              <ProtectedRoute permission={Permission.VIEW_SETTINGS}>
                <PengaturanWebsite />
              </ProtectedRoute>
            }
          />
          <Route
            path="akun"
            element={
              <ProtectedRoute permission={Permission.MANAGE_USERS}>
                <ManajemenAkun />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
