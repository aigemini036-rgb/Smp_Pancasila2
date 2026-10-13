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
import {
  fetchServerSupabaseConfig,
  isSupabaseConfigured,
  getSupabaseConfig,
} from '../lib/supabase';
import {
  syncAllLocalToSupabase,
  syncAllSupabaseToLocal,
  SyncResult,
} from './supabaseService';

export interface CloudSyncStatus {
  serverConnected: boolean;
  supabaseConfigured: boolean;
  lastSyncedAt: string | null;
  syncSource: 'server' | 'supabase' | 'local';
}

/**
 * Initializes automatic cloud & multi-device sync
 * Runs on app startup on any device (phone, laptop, tablet, visitor)
 */
export async function initCloudSync(): Promise<{ success: boolean; message: string }> {
  if (typeof window === 'undefined') return { success: false, message: 'SSR environment' };

  try {
    // 1. First, check if backend server has a persistent Supabase configuration
    await fetchServerSupabaseConfig();

    // 2. Fetch central store from /api/data (synchronizes changes across all devices)
    let serverUpdated = false;
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const store = await res.json();
        if (store && typeof store === 'object') {
          // If server store has content, update local storage cache
          if (store.settings && store.settings.school_name) {
            localStorage.setItem('smp_pancasila_settings', JSON.stringify(store.settings));
            serverUpdated = true;
          }
          if (Array.isArray(store.people) && store.people.length > 0) {
            localStorage.setItem('smp_pancasila_people', JSON.stringify(store.people));
            serverUpdated = true;
          }
          if (Array.isArray(store.news) && store.news.length > 0) {
            localStorage.setItem('smp_pancasila_news', JSON.stringify(store.news));
            serverUpdated = true;
          }
          if (Array.isArray(store.announcements) && store.announcements.length > 0) {
            localStorage.setItem('smp_pancasila_announcements', JSON.stringify(store.announcements));
            serverUpdated = true;
          }
          if (Array.isArray(store.achievements) && store.achievements.length > 0) {
            localStorage.setItem('smp_pancasila_achievements', JSON.stringify(store.achievements));
            serverUpdated = true;
          }
          if (Array.isArray(store.galleries) && store.galleries.length > 0) {
            localStorage.setItem('smp_pancasila_galleries', JSON.stringify(store.galleries));
            serverUpdated = true;
          }
          if (Array.isArray(store.gallery_images) && store.gallery_images.length > 0) {
            localStorage.setItem('smp_pancasila_gallery_images', JSON.stringify(store.gallery_images));
            serverUpdated = true;
          }
          if (Array.isArray(store.facilities) && store.facilities.length > 0) {
            localStorage.setItem('smp_pancasila_facilities', JSON.stringify(store.facilities));
            serverUpdated = true;
          }
          if (Array.isArray(store.users) && store.users.length > 0) {
            localStorage.setItem('smp_pancasila_admin_users_list', JSON.stringify(store.users));
            serverUpdated = true;
          }
        } else {
          // If server store is empty, push this device's local data to initialize server
          await pushAllLocalDataToServer();
        }
      }
    } catch {
      // Backend server unavailable / offline mode
    }

    // 3. If Supabase is configured, pull latest cloud records
    let supabaseUpdated = false;
    if (isSupabaseConfigured()) {
      try {
        const supRes = await syncAllSupabaseToLocal();
        if (supRes.success) {
          supabaseUpdated = true;
        }
      } catch (err) {
        console.warn('[CloudSync] Supabase sync error:', err);
      }
    }

    // 4. Notify all components and hooks that data has been synchronized
    window.dispatchEvent(new CustomEvent('smp-data-sync-complete', {
      detail: { serverUpdated, supabaseUpdated, timestamp: new Date().toISOString() },
    }));

    return {
      success: true,
      message: 'Sinkronisasi cloud berhasil dijalankan.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Gagal melakukan sinkronisasi cloud.',
    };
  }
}

/**
 * Push all local data from this device to the central server and Supabase
 * Use this when an admin edits on one device and wants to immediately broadcast to all devices
 */
export async function pushAllLocalDataToServer(): Promise<{
  success: boolean;
  message: string;
  supabaseResult?: SyncResult;
}> {
  const payload = {
    settings: getSchoolSettings(),
    people: getPeople(),
    news: getNewsList(),
    announcements: getAnnouncements(),
    achievements: getAchievements(),
    galleries: getGalleries(),
    gallery_images: getGalleryImages(),
    facilities: getFacilities(),
    users: getAdminUsers(),
    exported_at: new Date().toISOString(),
  };

  let serverOk = false;
  let serverMsg = '';

  // 1. Push to backend /api/data
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      serverOk = true;
      serverMsg = 'Data berhasil disimpan ke server pusat.';
    } else {
      serverMsg = `Server merespon status ${res.status}`;
    }
  } catch (err: any) {
    serverMsg = `Kendala koneksi ke server: ${err.message}`;
  }

  // 2. If Supabase configured, push to Supabase as well
  let supabaseResult: SyncResult | undefined = undefined;
  if (isSupabaseConfigured()) {
    try {
      supabaseResult = await syncAllLocalToSupabase();
    } catch (e: any) {
      console.warn('[CloudSync] Gagal push ke Supabase:', e);
    }
  }

  // Notify listeners
  window.dispatchEvent(new CustomEvent('smp-data-sync-complete', {
    detail: { pushed: true, timestamp: new Date().toISOString() },
  }));

  const isSuccess = serverOk || (supabaseResult && supabaseResult.success);

  return {
    success: Boolean(isSuccess),
    message: isSuccess
      ? 'Perubahan dari perangkat ini berhasil dikirim ke server & database! Sekarang perangkat lain (HP/Laptop) akan otomatis melihat pembaruan ini.'
      : `Gagal mengirim data: ${serverMsg}`,
    supabaseResult,
  };
}

/**
 * Pull all data from server and Supabase into this device's local storage
 */
export async function pullAllDataFromServer(): Promise<{
  success: boolean;
  message: string;
}> {
  return await initCloudSync();
}

/**
 * Export complete website data as a downloadable JSON backup file
 */
export function exportBackupJson(): void {
  const backupData = {
    school: 'SMP Pancasila Ponokawan Sidoarjo',
    version: '1.0',
    exported_at: new Date().toISOString(),
    settings: getSchoolSettings(),
    people: getPeople(),
    news: getNewsList(),
    announcements: getAnnouncements(),
    achievements: getAchievements(),
    galleries: getGalleries(),
    gallery_images: getGalleryImages(),
    facilities: getFacilities(),
    users: getAdminUsers(),
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(backupData, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `backup-smp-pancasila-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Import a backup JSON file and save to local storage, server, and Supabase
 */
export async function importBackupJson(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonString);

    if (data.settings) saveSchoolSettings(data.settings);
    if (Array.isArray(data.people)) savePeople(data.people);
    if (Array.isArray(data.news)) saveNewsList(data.news);
    if (Array.isArray(data.announcements)) saveAnnouncements(data.announcements);
    if (Array.isArray(data.achievements)) saveAchievements(data.achievements);
    if (Array.isArray(data.galleries)) saveGalleries(data.galleries);
    if (Array.isArray(data.gallery_images)) saveGalleryImages(data.gallery_images);
    if (Array.isArray(data.facilities)) saveFacilities(data.facilities);
    if (Array.isArray(data.users)) saveAdminUsers(data.users);

    // Sync to central server and Supabase
    await pushAllLocalDataToServer();

    window.dispatchEvent(new CustomEvent('smp-data-sync-complete', {
      detail: { imported: true, timestamp: new Date().toISOString() },
    }));

    return {
      success: true,
      message: 'File cadangan berhasil diimpor dan disinkronkan ke semua perangkat!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `File backup tidak valid: ${err.message}`,
    };
  }
}
