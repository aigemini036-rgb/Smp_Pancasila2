import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initCloudSync,
  pushAllLocalDataToServer,
  pullAllDataFromServer,
  exportBackupJson,
  importBackupJson,
  startAutoSync,
  stopAutoSync,
  isAutoSyncEnabled,
  setAutoSyncEnabled,
  getAutoSyncInterval,
  setAutoSyncInterval,
  isAutoSyncRunning,
  getLastSyncTime,
} from '../services/cloudSync';
import { isSupabaseConfigured, getSupabaseConfig } from '../lib/supabase';

let globalSyncPromise: Promise<any> | null = null;
let autoSyncStarted = false;

export function useDataSync() {
  const [dataVersion, setDataVersion] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(getLastSyncTime());
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [supabaseReady, setSupabaseReady] = useState(isSupabaseConfigured());
  
  // Auto-sync status
  const [autoSyncActive, setAutoSyncActive] = useState<boolean>(isAutoSyncEnabled());
  const [autoSyncRunningState, setAutoSyncRunningState] = useState<boolean>(isAutoSyncRunning());
  const [autoSyncIntervalSec, setAutoSyncIntervalSec] = useState<number>(getAutoSyncInterval());

  const initialRun = useRef(false);

  // Listen to cross-component sync event
  useEffect(() => {
    const handleSyncComplete = (e: any) => {
      setDataVersion((v) => v + 1);
      const time = e?.detail?.displayTime || new Date().toLocaleTimeString('id-ID');
      setLastSyncTime(time);
      setSupabaseReady(isSupabaseConfigured());
      if (e?.detail?.message) {
        setStatusMessage(e.detail.message);
      }
    };

    const handleAutoSyncStatus = (e: any) => {
      if (e?.detail) {
        setAutoSyncActive(e.detail.enabled);
        setAutoSyncRunningState(e.detail.running);
        setAutoSyncIntervalSec(e.detail.interval);
        if (e.detail.lastSync) {
          setLastSyncTime(e.detail.lastSync);
        }
      }
    };

    window.addEventListener('smp-data-sync-complete', handleSyncComplete);
    window.addEventListener('smp-auto-sync-status-changed', handleAutoSyncStatus);

    return () => {
      window.removeEventListener('smp-data-sync-complete', handleSyncComplete);
      window.removeEventListener('smp-auto-sync-status-changed', handleAutoSyncStatus);
    };
  }, []);

  // Run initial cloud & server sync once on component mount, and start auto-sync
  useEffect(() => {
    if (!initialRun.current) {
      initialRun.current = true;
      if (!globalSyncPromise) {
        setIsSyncing(true);
        globalSyncPromise = initCloudSync().finally(() => {
          setIsSyncing(false);
          setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
          setSupabaseReady(isSupabaseConfigured());
          globalSyncPromise = null;
        });
      }

      // Automatically launch background auto-sync engine if enabled
      if (!autoSyncStarted && isAutoSyncEnabled()) {
        autoSyncStarted = true;
        startAutoSync();
        setAutoSyncRunningState(true);
      }
    }
  }, []);

  const pushToServer = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await pushAllLocalDataToServer();
      setStatusMessage(res.message);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
      setDataVersion((v) => v + 1);
      return res;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const pullFromServer = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await pullAllDataFromServer();
      setStatusMessage(res.message);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
      setDataVersion((v) => v + 1);
      return res;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const toggleAutoSync = useCallback((enable?: boolean) => {
    const nextState = typeof enable === 'boolean' ? enable : !autoSyncActive;
    setAutoSyncEnabled(nextState);
    setAutoSyncActive(nextState);
    setAutoSyncRunningState(nextState);
    if (nextState) {
      // Trigger an immediate sync when turning on
      initCloudSync(false).catch(() => {});
    }
  }, [autoSyncActive]);

  const changeAutoSyncInterval = useCallback((sec: number) => {
    setAutoSyncInterval(sec);
    setAutoSyncIntervalSec(sec);
  }, []);

  return {
    dataVersion,
    isSyncing,
    lastSyncTime,
    statusMessage,
    supabaseReady,
    supabaseConfig: getSupabaseConfig(),
    // Auto sync controls
    autoSyncActive,
    autoSyncRunning: autoSyncRunningState,
    autoSyncInterval: autoSyncIntervalSec,
    toggleAutoSync,
    changeAutoSyncInterval,
    // Actions
    pushToServer,
    pullFromServer,
    exportBackup: exportBackupJson,
    importBackup: importBackupJson,
  };
}
