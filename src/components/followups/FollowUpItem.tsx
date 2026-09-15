import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { format, formatDistanceToNow, isPast, isToday } from 'date-fns'
import type { FollowUp } from '../../lib/types'
import Button from '../common/Button'
import Badge from '../common/Badge'

interface FollowUpItemProps {
  followUp: FollowUp
  onComplete: () => void
  onReschedule: () => void
  loading?: boolean
}

export default function FollowUpItem({ followUp, onComplete, onReschedule, loading }: FollowUpItemProps) {
  const isOverdue = isPast(new Date(followUp.due_date)) && !isToday(new Date(followUp.due_date))
  const isDueToday = isToday(new Date(followUp.due_date))

  return (
    <div
      className={clsx(
        'bg-white shadow rounded-lg border-l-4 p-4',
        isOverdue && 'border-l-danger',
        isDueToday && 'border-l-warning',
        !isOverdue && !isDueToday && 'border-l-gray-200'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isOverdue && (
              <Badge variant="danger">Overdue</Badge>
            )}
            {isDueToday && (
              <Badge variant="warning">Due Today</Badge>
            )}
            
            <Link
              to={`/leads/${followUp.lead_id}`}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600"
            >
              {followUp.company_name}
            </Link>
          </div>

          <div className="text-sm text-gray-500 mb-2">
            Due: {format(new Date(followUp.due_date), 'MMM d, yyyy h:mm a')}
            {isOverdue && (
              <span className="ml-2 text-danger font-medium">
                ({formatDistanceToNow(new Date(followUp.due_date))} ago)
              </span>
            )}
          </div>

          {followUp.notes && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded p-2 mt-2">
              {followUp.notes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button
            size="sm"
            onClick={onComplete}
            loading={loading}
          >
            Complete
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onReschedule}
            disabled={loading}
          >
            Reschedule
          </Button>
          <Link
            to={`/leads/${followUp.lead_id}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View Lead
          </Link>
        </div>
      </div>
    </div>
  )
}
