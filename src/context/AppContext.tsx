import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface AppContextType {
  lastSyncTime: Date | null
  refreshKey: number
  isSyncing: boolean
  triggerRefresh: () => void
  setLastSyncTime: (time: Date) => void
  setIsSyncing: (syncing: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
    setLastSyncTime(new Date())
  }, [])

  const value: AppContextType = {
    lastSyncTime,
    refreshKey,
    isSyncing,
    triggerRefresh,
    setLastSyncTime,
    setIsSyncing,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
