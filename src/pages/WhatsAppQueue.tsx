import { useState, useEffect } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import QueueItem from '../components/whatsapp/QueueItem'
import QueueStats from '../components/whatsapp/QueueStats'
import EmptyState from '../components/common/EmptyState'
import ConfirmationDialog from '../components/common/ConfirmationDialog'
import { dataAdapter } from '../lib/dataAdapter'
import { useRefresh } from '../hooks/useRefresh'
import type { WhatsAppQueueItem } from '../lib/types'

export default function WhatsAppQueue() {
  const { refreshKey, triggerRefresh } = useRefresh()
  const [queue, setQueue] = useState<WhatsAppQueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmItem, setConfirmItem] = useState<WhatsAppQueueItem | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchQueue()
  }, [refreshKey])

  const fetchQueue = async () => {
    try {
      setLoading(true)
      const response = await dataAdapter.getWhatsAppQueue()
      setQueue(response || [])
    } catch (error) {
      console.error('Failed to fetch WhatsApp queue:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = async (item: WhatsAppQueueItem) => {
    try {
      setActionLoading(item.lead_id)
      
      // Open WhatsApp URL immediately in new tab (don't wait for API)
      if (item.whatsapp_url) {
        window.open(item.whatsapp_url, '_blank')
      } else {
        console.error('No WhatsApp URL found for item:', item)
        alert('WhatsApp link not available')
        return
      }
      
      // Update local state immediately for responsive UI
      setQueue((prev) =>
        prev.map((i) =>
          i.lead_id === item.lead_id ? { ...i, status: 'OPENED' } : i
        )
      )
      
      // Call API in background (non-blocking)
      dataAdapter.markWhatsAppOpened(item.lead_id).catch((error) => {
        console.warn('Failed to mark WhatsApp as opened (background):', error)
        // Don't show error to user since the main action (opening WhatsApp) succeeded
      })
      
    } catch (error) {
      console.error('Failed to open WhatsApp:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkSentClick = (item: WhatsAppQueueItem) => {
    setConfirmItem(item)
  }

  const handleMarkSent = async () => {
    if (!confirmItem) return
    
    console.log('🔵 Mark as Sent - Starting for lead:', confirmItem.lead_id)
    
    try {
      setActionLoading(confirmItem.lead_id)
      setError(null)
      setSuccess(null)
      
      console.log('🔵 Calling API: markWhatsAppSent')
      console.log('🔵 Lead ID:', confirmItem.lead_id)
      console.log('🔵 Payload:', { confirmation: true, actor: 'dashboard-user' })
      
      // Call API
      await dataAdapter.markWhatsAppSent(confirmItem.lead_id)
      
      console.log('✅ API call successful')
      
      // Update local state
      setQueue((prev) =>
        prev.map((i) =>
          i.lead_id === confirmItem.lead_id ? { ...i, status: 'SENT' } : i
        )
      )
      
      // Show success message
      setSuccess(`✓ Marked as sent for ${confirmItem.company_name}`)
      setConfirmItem(null)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
      
      // Refresh dashboard data
      triggerRefresh()
    } catch (error) {
      console.error('❌ Failed to mark sent:', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to mark as sent. Please try again.'
      setError(`Failed to mark as sent: ${errorMsg}`)
      setConfirmItem(null) // Close dialog on error too
    } finally {
      setActionLoading(null)
    }
  }

  const handleSkip = (item: WhatsAppQueueItem) => {
    // Remove from local queue (user can process later)
    setQueue((prev) => prev.filter((i) => i.lead_id !== item.lead_id))
  }

  // Calculate stats
  const total = queue.length
  const processed = queue.filter((i) => i.status === 'SENT').length
  const remaining = queue.filter((i) => i.status !== 'SENT').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <QueueStats total={total} processed={processed} remaining={remaining} />
        
        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Queue Status</h3>
              <p className="text-sm text-gray-500 mt-1">
                Process WhatsApp messages in priority order
              </p>
            </div>
            <Button onClick={fetchQueue} variant="secondary">
              Refresh Queue
            </Button>
          </div>
        </div>
      </div>

      {/* Queue List */}
      {queue.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            title="Queue is empty"
            description="All WhatsApp messages have been processed"
            icon={
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {queue.map((item) => (
            <QueueItem
              key={item.lead_id}
              item={item}
              onOpen={() => handleOpen(item)}
              onMarkSent={() => handleMarkSentClick(item)}
              onSkip={() => handleSkip(item)}
              loading={actionLoading === item.lead_id}
            />
          ))}
        </div>
      )}
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmItem !== null}
        onConfirm={handleMarkSent}
        onCancel={() => setConfirmItem(null)}
        title="Confirm Manual Send"
        message={`Are you sure you want to mark the WhatsApp message to ${confirmItem?.company_name || 'this lead'} as manually sent? This will update the lead's status and schedule follow-up actions.`}
        confirmLabel="Yes, Mark as Sent"
        cancelLabel="Cancel"
        variant="primary"
      />
    </div>
  )
}
