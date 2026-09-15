import { useAppContext } from '../context/AppContext'

/**
 * Hook to access refresh state and trigger data refresh
 */
export function useRefresh() {
  const { lastSyncTime, refreshKey, isSyncing, triggerRefresh, setIsSyncing } = useAppContext()
  
  return {
    lastSyncTime,
    refreshKey,
    isSyncing,
    triggerRefresh,
    setIsSyncing,
  }
}
