import { useState, useEffect } from 'react'
import Card from '../components/common/Card'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import FollowUpTabs from '../components/followups/FollowUpTabs'
import FollowUpItem from '../components/followups/FollowUpItem'
import RescheduleModal from '../components/followups/RescheduleModal'
import { getFollowUps, completeFollowUp, rescheduleFollowUp } from '../lib/api'
import { useRefresh } from '../hooks/useRefresh'
import type { FollowUp } from '../lib/types'

export default function FollowUps() {
  const { refreshKey, triggerRefresh } = useRefresh()
  const [activeTab, setActiveTab] = useState('today')
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rescheduleModal, setRescheduleModal] = useState<{
    isOpen: boolean
    followUp: FollowUp | null
  }>({ isOpen: false, followUp: null })

  useEffect(() => {
    fetchFollowUps()
  }, [refreshKey, activeTab])

  const fetchFollowUps = async () => {
    try {
      setLoading(true)
      const status = activeTab === 'all' ? undefined : activeTab
      const response = await getFollowUps(status)
      setFollowUps(response.data || [])
    } catch (error) {
      console.error('Failed to fetch follow-ups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (followUpId: string) => {
    try {
      setActionLoading(followUpId)
      await completeFollowUp(followUpId)
      setFollowUps((prev) => prev.filter((f) => f.id !== followUpId))
      triggerRefresh()
    } catch (error) {
      console.error('Failed to complete follow-up:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReschedule = async (newDate: string, reason: string) => {
    if (!rescheduleModal.followUp) return
    
    try {
      setActionLoading(rescheduleModal.followUp.id)
      await rescheduleFollowUp(rescheduleModal.followUp.id, newDate, reason)
      fetchFollowUps()
    } catch (error) {
      console.error('Failed to reschedule follow-up:', error)
    } finally {
      setActionLoading(null)
      setRescheduleModal({ isOpen: false, followUp: null })
    }
  }

  const openRescheduleModal = (followUp: FollowUp) => {
    setRescheduleModal({ isOpen: true, followUp })
  }

  const closeRescheduleModal = () => {
    setRescheduleModal({ isOpen: false, followUp: null })
  }

  // Calculate counts
  const counts = {
    today: followUps.filter((f) => {
      const dueDate = new Date(f.due_date)
      const today = new Date()
      return dueDate.toDateString() === today.toDateString()
    }).length,
    overdue: followUps.filter((f) => {
      const dueDate = new Date(f.due_date)
      const today = new Date()
      return dueDate < today && dueDate.toDateString() !== today.toDateString()
    }).length,
    upcoming: followUps.filter((f) => {
      const dueDate = new Date(f.due_date)
      const today = new Date()
      return dueDate > today
    }).length,
    all: followUps.length,
  }

  // Filter based on active tab
  const filteredFollowUps = followUps.filter((f) => {
    const dueDate = new Date(f.due_date)
    const today = new Date()

    switch (activeTab) {
      case 'today':
        return dueDate.toDateString() === today.toDateString()
      case 'overdue':
        return dueDate < today && dueDate.toDateString() !== today.toDateString()
      case 'upcoming':
        return dueDate > today
      case 'all':
        return true
      default:
        return true
    }
  })

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <FollowUpTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredFollowUps.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            title={`No ${activeTab === 'all' ? '' : activeTab} follow-ups`}
            description="You're all caught up!"
            icon={
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFollowUps.map((followUp) => (
            <FollowUpItem
              key={followUp.id}
              followUp={followUp}
              onComplete={() => handleComplete(followUp.id)}
              onReschedule={() => openRescheduleModal(followUp)}
              loading={actionLoading === followUp.id}
            />
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={rescheduleModal.isOpen}
        onClose={closeRescheduleModal}
        onSubmit={handleReschedule}
        companyName={rescheduleModal.followUp?.company_name || ''}
        loading={actionLoading !== null}
      />
    </div>
  )
}
