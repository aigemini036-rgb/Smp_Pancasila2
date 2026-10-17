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

// -----------------------------------------------------------------------------
// Auto-Sync Engine Variables & Broadcast Channel
// -----------------------------------------------------------------------------
let autoSyncTimer: any = null;
let autoPushDebounceTimer: any = null;
let isSyncing = false;
let lastSyncedAtTimestamp: string | null = null;
let broadcastChannel: BroadcastChannel | null = null;

const AUTO_SYNC_ENABLED_KEY = 'smp_auto_sync_enabled';
const AUTO_SYNC_INTERVAL_KEY = 'smp_auto_sync_interval_sec';
const DEFAULT_INTERVAL_SEC = 15;

// Initialize cross-tab BroadcastChannel if supported
if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
  try {
    broadcastChannel = new BroadcastChannel('smp_school_sync_broadcast');
    broadcastChannel.onmessage = (event) => {
      if (event?.data?.type === 'DATA_MUTATED') {
        // Another tab on the same device modified data: pull updates
        initCloudSync(true).catch(() => {});
      }
    };
  } catch {
    // BroadcastChannel unsupported or restricted in sandbox
  }
}

/**
 * Returns whether auto-sync is currently enabled by user preference
 */
export function isAutoSyncEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(AUTO_SYNC_ENABLED_KEY);
  return val === null ? true : val === 'true';
}

/**
 * Enable or disable automatic background sync
 */
export function setAutoSyncEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTO_SYNC_ENABLED_KEY, enabled ? 'true' : 'false');
  if (enabled) {
    startAutoSync();
  } else {
    stopAutoSync();
  }
  notifyAutoSyncStatus();
}

/**
 * Get configured auto-sync interval in seconds (default: 15s)
 */
export function getAutoSyncInterval(): number {
  if (typeof window === 'undefined') return DEFAULT_INTERVAL_SEC;
  const val = localStorage.getItem(AUTO_SYNC_INTERVAL_KEY);
  const parsed = val ? parseInt(val, 10) : DEFAULT_INTERVAL_SEC;
  return isNaN(parsed) || parsed < 5 ? DEFAULT_INTERVAL_SEC : parsed;
}

/**
 * Set auto-sync interval in seconds
 */
export function setAutoSyncInterval(seconds: number): void {
  if (typeof window === 'undefined') return;
  const safeSec = Math.max(5, Math.min(300, seconds));
  localStorage.setItem(AUTO_SYNC_INTERVAL_KEY, safeSec.toString());
  if (isAutoSyncEnabled()) {
    startAutoSync(safeSec);
  }
  notifyAutoSyncStatus();
}

/**
 * Check if the auto-sync interval timer is actively running
 */
export function isAutoSyncRunning(): boolean {
  return autoSyncTimer !== null;
}

/**
 * Get formatted timestamp of the last successful synchronization
 */
export function getLastSyncTime(): string | null {
  return lastSyncedAtTimestamp;
}

function notifyAutoSyncStatus() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('smp-auto-sync-status-changed', {
      detail: {
        enabled: isAutoSyncEnabled(),
        running: isAutoSyncRunning(),
        interval: getAutoSyncInterval(),
        lastSync: lastSyncedAtTimestamp,
      },
    })
  );
}

/**
 * Starts automatic background polling and event-driven synchronization
 */
export function startAutoSync(intervalSeconds?: number): void {
  if (typeof window === 'undefined') return;

  stopAutoSync();

  const sec = intervalSeconds || getAutoSyncInterval();
  const intervalMs = sec * 1000;

  // Periodic background sync
  autoSyncTimer = setInterval(() => {
    if (!document.hidden) {
      initCloudSync(false).catch(() => {});
    }
  }, intervalMs);

  notifyAutoSyncStatus();
}

/**
 * Stops automatic background polling
 */
export function stopAutoSync(): void {
  if (autoSyncTimer) {
    clearInterval(autoSyncTimer);
    autoSyncTimer = null;
  }
  notifyAutoSyncStatus();
}

/**
 * Schedule a debounced push of local changes to the central server and Supabase
 * Called automatically whenever an admin creates, updates, or deletes any item
 */
export function scheduleAutoPush(delayMs = 800): void {
  if (typeof window === 'undefined') return;

  if (autoPushDebounceTimer) {
    clearTimeout(autoPushDebounceTimer);
  }

  autoPushDebounceTimer = setTimeout(async () => {
    try {
      await pushAllLocalDataToServer();
      // Broadcast to other tabs on the same machine
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'DATA_MUTATED', timestamp: Date.now() });
      }
    } catch (e) {
      console.warn('[AutoSync] Background push error:', e);
    }
  }, delayMs);
}

// -----------------------------------------------------------------------------
// Window & Lifecycle Event Listeners for Instant Auto-Sync
// -----------------------------------------------------------------------------
if (typeof window !== 'undefined') {
  const handleWakeOrFocus = () => {
    if (isAutoSyncEnabled()) {
      initCloudSync(false).catch(() => {});
    }
  };

  // Re-sync when tab gains focus or user returns to browser
  window.addEventListener('focus', handleWakeOrFocus);

  // Re-sync when visibility changes from hidden to visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isAutoSyncEnabled()) {
      handleWakeOrFocus();
    }
  });

  // Re-sync when device regains network connectivity
  window.addEventListener('online', handleWakeOrFocus);

  // Listen to mutation event from storage.ts
  window.addEventListener('smp-trigger-auto-push', () => {
    scheduleAutoPush(800);
  });
}

/**
 * Initializes automatic cloud & multi-device sync
 * Runs on app startup and periodically in the background
 */
export async function initCloudSync(silent = false): Promise<{ success: boolean; message: string }> {
  if (typeof window === 'undefined') return { success: false, message: 'SSR environment' };

  if (isSyncing) {
    return { success: true, message: 'Sinkronisasi sedang berlangsung...' };
  }

  isSyncing = true;

  try {
    // 1. Check if backend server has a persistent Supabase configuration
    await fetchServerSupabaseConfig();

    // 2. Fetch central store from /api/data (synchronizes changes across all devices)
    let serverUpdated = false;
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const store = await res.json();
        if (store && typeof store === 'object') {
          // Compare updated_at to see if server has new data or local needs update
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

    lastSyncedAtTimestamp = new Date().toLocaleTimeString('id-ID');

    // 4. Notify all components and hooks that data has been synchronized
    window.dispatchEvent(
      new CustomEvent('smp-data-sync-complete', {
        detail: {
          serverUpdated,
          supabaseUpdated,
          silent,
          timestamp: new Date().toISOString(),
          displayTime: lastSyncedAtTimestamp,
        },
      })
    );

    notifyAutoSyncStatus();

    return {
      success: true,
      message: 'Sinkronisasi cloud berhasil dijalankan.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Gagal melakukan sinkronisasi cloud.',
    };
  } finally {
    isSyncing = false;
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

  lastSyncedAtTimestamp = new Date().toLocaleTimeString('id-ID');

  // Notify listeners
  window.dispatchEvent(
    new CustomEvent('smp-data-sync-complete', {
      detail: {
        pushed: true,
        timestamp: new Date().toISOString(),
        displayTime: lastSyncedAtTimestamp,
      },
    })
  );

  notifyAutoSyncStatus();

  const isSuccess = serverOk || (supabaseResult && supabaseResult.success);

  return {
    success: Boolean(isSuccess),
    message: isSuccess
      ? 'Perubahan berhasil disinkronkan otomatis ke server & Supabase! Perangkat lain (HP/Laptop) akan otomatis melihat pembaruan ini.'
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
  return await initCloudSync(false);
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

    window.dispatchEvent(
      new CustomEvent('smp-data-sync-complete', {
        detail: { imported: true, timestamp: new Date().toISOString() },
      })
    );

    return {
      success: true,
      message: 'File cadangan berhasil diimpor dan disinkronkan otomatis ke semua perangkat!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `File backup tidak valid: ${err.message}`,
    };
  }
}
