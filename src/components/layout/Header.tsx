import { useLocation } from 'react-router-dom'
import { useRefresh } from '../../hooks/useRefresh'
import { triggerSync } from '../../lib/api'
import clsx from 'clsx'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/leads': 'Leads',
  '/whatsapp': 'WhatsApp Queue',
  '/followups': 'Follow-ups',
  '/reports': 'Reports',
}

export default function Header() {
  const location = useLocation()
  const { lastSyncTime, isSyncing, setIsSyncing, triggerRefresh } = useRefresh()
  
  const pageTitle = pageTitles[location.pathname] || 'Dashboard'

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await triggerSync()
      triggerRefresh()
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never'
    const now = new Date()
    const diff = Math.floor((now.getTime() - lastSyncTime.getTime()) / 1000)
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="text-sm text-gray-500">
            Last sync: <span className="font-medium text-gray-700">{formatLastSync()}</span>
          </div>
          
          {/* Sync button */}
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className={clsx(
              'inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm',
              isSyncing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
            )}
          >
            <RefreshIcon className={clsx('h-4 w-4', isSyncing && 'animate-spin')} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>
    </header>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  )
}
