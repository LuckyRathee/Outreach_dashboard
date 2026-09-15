import clsx from 'clsx'
import type { WhatsAppQueueItem } from '../../lib/types'
import Button from '../common/Button'
import Badge from '../common/Badge'

interface QueueItemProps {
  item: WhatsAppQueueItem
  onOpen: () => void
  onMarkSent: () => void
  onSkip: () => void
  loading?: boolean
}

const statusColors: Record<string, string> = {
  READY: 'border-gray-200',
  OPENED: 'border-yellow-400 bg-yellow-50',
  SENT: 'border-green-400 bg-green-50',
}

export default function QueueItem({ item, onOpen, onMarkSent, onSkip, loading }: QueueItemProps) {
  return (
    <div
      className={clsx(
        'bg-white shadow rounded-lg border-2 p-6 transition-all',
        statusColors[item.status]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{item.company_name}</h3>
            {item.status === 'OPENED' && (
              <Badge variant="warning">Opened</Badge>
            )}
            {item.status === 'SENT' && (
              <Badge variant="success">Sent</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>{item.employees} employees</span>
            <span>•</span>
            <span>{item.city}</span>
            <span>•</span>
            <span>{item.industry}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Template:</span>
            <span className="font-medium text-gray-700">{item.template}</span>
          </div>

          {item.priority_score !== undefined && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-gray-500">Priority Score:</span>
              <span className="font-semibold text-primary-600">{item.priority_score}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        {item.status === 'READY' && (
          <>
            <Button onClick={onOpen} loading={loading}>
              Open WhatsApp
            </Button>
            <Button variant="secondary" onClick={onSkip} disabled={loading}>
              Skip
            </Button>
          </>
        )}
        
        {item.status === 'OPENED' && (
          <>
            <Button onClick={onMarkSent} loading={loading}>
              Mark as Sent
            </Button>
            <Button variant="secondary" onClick={onOpen} disabled={loading}>
              Reopen WhatsApp
            </Button>
          </>
        )}
        
        {item.status === 'SENT' && (
          <div className="flex items-center gap-2 text-success text-sm font-medium">
            <CheckIcon />
            Message sent successfully
          </div>
        )}
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
