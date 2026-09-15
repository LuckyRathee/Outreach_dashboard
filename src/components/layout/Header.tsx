import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useRefresh } from '../../hooks/useRefresh'
import { triggerSync } from '../../lib/api'
import clsx from 'clsx'
import ApiSettingsModal from '../common/ApiSettingsModal'

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
  const [showApiSettings, setShowApiSettings] = useState(false)
  
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
          
          {/* API Settings button */}
          <button
            type="button"
            onClick={() => setShowApiSettings(true)}
            className="inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <SettingsIcon className="h-4 w-4" />
            Settings
          </button>
          
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
      
      {/* API Settings Modal */}
      <ApiSettingsModal
        isOpen={showApiSettings}
        onClose={() => setShowApiSettings(false)}
      />
    </header>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  )
}
