import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import {
  SchoolSettings,
  Person,
  News,
  Announcement,
  Achievement,
  Gallery,
  GalleryImage,
  Facility,
  AdminUser,
} from '../types';
import {
  getSchoolSettings,
  getPeople,
  getNewsList,
  getAnnouncements,
  getAchievements,
  getGalleries,
  getGalleryImages,
  getFacilities,
  saveSchoolSettings,
  savePeople,
  saveNewsList,
  saveAnnouncements,
  saveAchievements,
  saveGalleries,
  saveGalleryImages,
  saveFacilities,
} from '../utils/storage';
import { getAdminUsers, saveAdminUsers } from '../utils/auth';

export interface SyncResult {
  success: boolean;
  message: string;
  counts: {
    settings: number;
    people: number;
    news: number;
    announcements: number;
    achievements: number;
    galleries: number;
    galleryImages: number;
    facilities: number;
    users: number;
  };
  errors?: string[];
}

/**
 * Upload all current local data (settings, teachers, news, etc.) to Supabase
 */
export async function syncAllLocalToSupabase(): Promise<SyncResult> {
  const client = getSupabase();
  if (!client || !isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase belum terkonfigurasi. Masukkan URL dan Anon Key terlebih dahulu.',
      counts: { settings: 0, people: 0, news: 0, announcements: 0, achievements: 0, galleries: 0, galleryImages: 0, facilities: 0, users: 0 },
    };
  }

  const errors: string[] = [];
  const counts = {
    settings: 0,
    people: 0,
    news: 0,
    announcements: 0,
    achievements: 0,
    galleries: 0,
    galleryImages: 0,
    facilities: 0,
    users: 0,
  };

  try {
    // 1. School Settings
    const settings = getSchoolSettings();
    const { error: errSettings } = await client
      .from('school_settings')
      .upsert(settings, { onConflict: 'id' });
    if (errSettings) errors.push(`Pengaturan Sekolah: ${errSettings.message}`);
    else counts.settings = 1;

    // 2. People (Teachers & Staff)
    const people = getPeople();
    if (people.length > 0) {
      const { error: errPeople } = await client
        .from('people')
        .upsert(people, { onConflict: 'id' });
      if (errPeople) errors.push(`Data Personel: ${errPeople.message}`);
      else counts.people = people.length;
    }

    // 3. News
    const news = getNewsList();
    if (news.length > 0) {
      const { error: errNews } = await client
        .from('news')
        .upsert(news, { onConflict: 'id' });
      if (errNews) errors.push(`Berita: ${errNews.message}`);
      else counts.news = news.length;
    }

    // 4. Announcements
    const announcements = getAnnouncements();
    if (announcements.length > 0) {
      const { error: errAnnounce } = await client
        .from('announcements')
        .upsert(announcements, { onConflict: 'id' });
      if (errAnnounce) errors.push(`Pengumuman: ${errAnnounce.message}`);
      else counts.announcements = announcements.length;
    }

    // 5. Achievements
    const achievements = getAchievements();
    if (achievements.length > 0) {
      const { error: errAchieve } = await client
        .from('achievements')
        .upsert(achievements, { onConflict: 'id' });
      if (errAchieve) errors.push(`Prestasi: ${errAchieve.message}`);
      else counts.achievements = achievements.length;
    }

    // 6. Galleries
    const galleries = getGalleries();
    if (galleries.length > 0) {
      const { error: errGal } = await client
        .from('galleries')
        .upsert(galleries, { onConflict: 'id' });
      if (errGal) errors.push(`Album Galeri: ${errGal.message}`);
      else counts.galleries = galleries.length;
    }

    // 7. Gallery Images
    const galleryImages = getGalleryImages();
    if (galleryImages.length > 0) {
      const { error: errGalImg } = await client
        .from('gallery_images')
        .upsert(galleryImages, { onConflict: 'id' });
      if (errGalImg) errors.push(`Foto Galeri: ${errGalImg.message}`);
      else counts.galleryImages = galleryImages.length;
    }

    // 8. Facilities
    const facilities = getFacilities();
    if (facilities.length > 0) {
      const { error: errFac } = await client
        .from('facilities')
        .upsert(facilities, { onConflict: 'id' });
      if (errFac) errors.push(`Fasilitas: ${errFac.message}`);
      else counts.facilities = facilities.length;
    }

    // 9. Admin Users
    const users = getAdminUsers();
    if (users.length > 0) {
      const { error: errUsers } = await client
        .from('admin_users')
        .upsert(users, { onConflict: 'id' });
      if (errUsers) errors.push(`Pengguna Admin: ${errUsers.message}`);
      else counts.users = users.length;
    }

    const hasErrors = errors.length > 0;
    const isMissingTables = errors.some(
      (e) => e.includes('schema cache') || e.includes('does not exist') || e.includes('PGRST205')
    );

    let message = 'Seluruh data lokal berhasil dimigrasikan ke database Supabase!';
    if (isMissingTables) {
      message = 'Tabel database sekolah belum dibuat di Supabase. Buka Tab 2 "Setup Database & SQL", lalu klik "Salin SQL Script" dan jalankan di SQL Editor Supabase.';
    } else if (hasErrors) {
      message = `Sinkronisasi selesai dengan beberapa catatan: ${errors.join(', ')}`;
    }

    return {
      success: !hasErrors,
      message,
      counts,
      errors: hasErrors ? errors : undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal melakukan sinkronisasi: ${err.message || 'Unknown error'}`,
      counts,
      errors: [err.message],
    };
  }
}

/**
 * Pull all data from Supabase and update local storage cache
 */
export async function syncAllSupabaseToLocal(): Promise<SyncResult> {
  const client = getSupabase();
  if (!client || !isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase belum terkonfigurasi.',
      counts: { settings: 0, people: 0, news: 0, announcements: 0, achievements: 0, galleries: 0, galleryImages: 0, facilities: 0, users: 0 },
    };
  }

  const counts = {
    settings: 0,
    people: 0,
    news: 0,
    announcements: 0,
    achievements: 0,
    galleries: 0,
    galleryImages: 0,
    facilities: 0,
    users: 0,
  };
  const errors: string[] = [];

  try {
    // 1. Settings
    const { data: settingsData, error: errSet } = await client
      .from('school_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (errSet) errors.push(`Settings: ${errSet.message}`);
    else if (settingsData) {
      localStorage.setItem('smp_pancasila_settings', JSON.stringify(settingsData));
      counts.settings = 1;
    }

    // 2. People
    const { data: peopleData, error: errPeo } = await client
      .from('people')
      .select('*');
    if (errPeo) errors.push(`People: ${errPeo.message}`);
    else if (peopleData && peopleData.length > 0) {
      localStorage.setItem('smp_pancasila_people', JSON.stringify(peopleData));
      counts.people = peopleData.length;
    }

    // 3. News
    const { data: newsData, error: errNews } = await client
      .from('news')
      .select('*');
    if (errNews) errors.push(`News: ${errNews.message}`);
    else if (newsData && newsData.length > 0) {
      localStorage.setItem('smp_pancasila_news', JSON.stringify(newsData));
      counts.news = newsData.length;
    }

    // 4. Announcements
    const { data: annData, error: errAnn } = await client
      .from('announcements')
      .select('*');
    if (errAnn) errors.push(`Announcements: ${errAnn.message}`);
    else if (annData && annData.length > 0) {
      localStorage.setItem('smp_pancasila_announcements', JSON.stringify(annData));
      counts.announcements = annData.length;
    }

    // 5. Achievements
    const { data: achData, error: errAch } = await client
      .from('achievements')
      .select('*');
    if (errAch) errors.push(`Achievements: ${errAch.message}`);
    else if (achData && achData.length > 0) {
      localStorage.setItem('smp_pancasila_achievements', JSON.stringify(achData));
      counts.achievements = achData.length;
    }

    // 6. Galleries
    const { data: galData, error: errGal } = await client
      .from('galleries')
      .select('*');
    if (errGal) errors.push(`Galleries: ${errGal.message}`);
    else if (galData && galData.length > 0) {
      localStorage.setItem('smp_pancasila_galleries', JSON.stringify(galData));
      counts.galleries = galData.length;
    }

    // 7. Gallery Images
    const { data: imgData, error: errImg } = await client
      .from('gallery_images')
      .select('*');
    if (errImg) errors.push(`Gallery Images: ${errImg.message}`);
    else if (imgData && imgData.length > 0) {
      localStorage.setItem('smp_pancasila_gallery_images', JSON.stringify(imgData));
      counts.galleryImages = imgData.length;
    }

    // 8. Facilities
    const { data: facData, error: errFac } = await client
      .from('facilities')
      .select('*');
    if (errFac) errors.push(`Facilities: ${errFac.message}`);
    else if (facData && facData.length > 0) {
      localStorage.setItem('smp_pancasila_facilities', JSON.stringify(facData));
      counts.facilities = facData.length;
    }

    // 9. Users
    const { data: usrData, error: errUsr } = await client
      .from('admin_users')
      .select('*');
    if (errUsr) errors.push(`Users: ${errUsr.message}`);
    else if (usrData && usrData.length > 0) {
      localStorage.setItem('smp_pancasila_admin_users_list', JSON.stringify(usrData));
      counts.users = usrData.length;
    }

    const hasErrors = errors.length > 0;
    const isMissingTables = errors.some(
      (e) => e.includes('schema cache') || e.includes('does not exist') || e.includes('PGRST205')
    );

    let message = 'Data dari Supabase berhasil disinkronkan ke cache lokal website!';
    if (isMissingTables) {
      message = 'Tabel database Supabase belum dibuat. Website saat ini tetap berjalan lancar menggunakan data server pusat & cache lokal.';
    } else if (hasErrors) {
      message = `Tarik data selesai dengan catatan: ${errors.join(', ')}`;
    }

    return {
      success: !hasErrors || isMissingTables,
      message,
      counts,
      errors: hasErrors && !isMissingTables ? errors : undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal menarik data dari Supabase: ${err.message || 'Unknown error'}`,
      counts,
      errors: [err.message],
    };
  }
}
