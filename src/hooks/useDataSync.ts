import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initCloudSync,
  pushAllLocalDataToServer,
  pullAllDataFromServer,
  exportBackupJson,
  importBackupJson,
} from '../services/cloudSync';
import { isSupabaseConfigured, getSupabaseConfig } from '../lib/supabase';

let globalSyncPromise: Promise<any> | null = null;

export function useDataSync() {
  const [dataVersion, setDataVersion] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [supabaseReady, setSupabaseReady] = useState(isSupabaseConfigured());
  const initialRun = useRef(false);

  // Listen to cross-component sync event
  useEffect(() => {
    const handleSyncComplete = (e: any) => {
      setDataVersion((v) => v + 1);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
      setSupabaseReady(isSupabaseConfigured());
      if (e?.detail?.message) {
        setStatusMessage(e.detail.message);
      }
    };

    window.addEventListener('smp-data-sync-complete', handleSyncComplete);
    return () => {
      window.removeEventListener('smp-data-sync-complete', handleSyncComplete);
    };
  }, []);

  // Run initial cloud & server sync once on component mount
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

  return {
    dataVersion,
    isSyncing,
    lastSyncTime,
    statusMessage,
    supabaseReady,
    supabaseConfig: getSupabaseConfig(),
    pushToServer,
    pullFromServer,
    exportBackup: exportBackupJson,
    importBackup: importBackupJson,
  };
}
