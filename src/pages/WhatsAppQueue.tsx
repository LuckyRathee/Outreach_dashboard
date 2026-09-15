import { useState, useEffect } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import QueueItem from '../components/whatsapp/QueueItem'
import QueueStats from '../components/whatsapp/QueueStats'
import EmptyState from '../components/common/EmptyState'
import { demoAdapter } from '../lib/demoAdapter'
import { markWhatsAppOpened, markWhatsAppSent } from '../lib/api'
import { useRefresh } from '../hooks/useRefresh'
import type { WhatsAppQueueItem } from '../lib/types'

export default function WhatsAppQueue() {
  const { refreshKey, triggerRefresh } = useRefresh()
  const [queue, setQueue] = useState<WhatsAppQueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchQueue()
  }, [refreshKey])

  const fetchQueue = async () => {
    try {
      setLoading(true)
      const response = await demoAdapter.getWhatsAppQueue()
      setQueue(response.data || [])
    } catch (error) {
      console.error('Failed to fetch WhatsApp queue:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = async (item: WhatsAppQueueItem) => {
    try {
      setActionLoading(item.lead_id)
      await markWhatsAppOpened(item.lead_id)
      
      // Open WhatsApp URL in new tab
      window.open(item.whatsapp_url, '_blank')
      
      // Update local state
      setQueue((prev) =>
        prev.map((i) =>
          i.lead_id === item.lead_id ? { ...i, status: 'OPENED' } : i
        )
      )
    } catch (error) {
      console.error('Failed to open WhatsApp:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkSent = async (item: WhatsAppQueueItem) => {
    try {
      setActionLoading(item.lead_id)
      await markWhatsAppSent(item.lead_id)
      
      // Update local state
      setQueue((prev) =>
        prev.map((i) =>
          i.lead_id === item.lead_id ? { ...i, status: 'SENT' } : i
        )
      )
      
      triggerRefresh()
    } catch (error) {
      console.error('Failed to mark sent:', error)
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
              onMarkSent={() => handleMarkSent(item)}
              onSkip={() => handleSkip(item)}
              loading={actionLoading === item.lead_id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
