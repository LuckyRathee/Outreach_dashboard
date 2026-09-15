import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import type { Activity, ActivityType } from '../../lib/types'

interface ActivityFeedProps {
  activities: Activity[]
  maxItems?: number
}

const activityIcons: Record<ActivityType, { icon: string; color: string }> = {
  email_sent: { icon: '✉️', color: 'bg-blue-50' },
  whatsapp_opened: { icon: '💬', color: 'bg-green-50' },
  whatsapp_sent: { icon: '✅', color: 'bg-green-50' },
  follow_up_created: { icon: '📅', color: 'bg-yellow-50' },
  lead_created: { icon: '➕', color: 'bg-purple-50' },
  lead_updated: { icon: '✏️', color: 'bg-gray-50' },
}

const activityLabels: Record<ActivityType, string> = {
  email_sent: 'Email sent',
  whatsapp_opened: 'WhatsApp opened',
  whatsapp_sent: 'WhatsApp sent',
  follow_up_created: 'Follow-up created',
  lead_created: 'New lead',
  lead_updated: 'Lead updated',
}

export default function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems)

  if (displayedActivities.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500">
        No recent activity
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {displayedActivities.map((activity, idx) => {
          const config = activityIcons[activity.type]
          const isLast = idx === displayedActivities.length - 1

          return (
            <li key={activity.id}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${config.color}`}
                    >
                      <span className="text-sm">{config.icon}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        {activityLabels[activity.type]}
                      </span>
                      {activity.company_name && (
                        <>
                          <span className="text-gray-500 mx-1">for</span>
                          {activity.lead_id ? (
                            <Link
                              to={`/leads/${activity.lead_id}`}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                              {activity.company_name}
                            </Link>
                          ) : (
                            <span className="text-gray-900">{activity.company_name}</span>
                          )}
                        </>
                      )}
                    </div>
                    {activity.details && (
                      <p className="mt-0.5 text-sm text-gray-500">{activity.details}</p>
                    )}
                    <p className="mt-0.5 text-xs text-gray-400">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
