import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/common/Card'
import MetricCard from '../components/home/MetricCard'
import PipelineBar from '../components/home/PipelineBar'
import ActivityFeed from '../components/home/ActivityFeed'
import Spinner from '../components/common/Spinner'
import { useRefresh } from '../hooks/useRefresh'
import type { DashboardMetrics, Activity } from '../lib/types'
import { demoAdapter, isDemoMode } from '../lib/demoAdapter'

export default function Home() {
  const navigate = useNavigate()
  const { refreshKey } = useRefresh()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    fetchData()
  }, [refreshKey])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      setDemoMode(isDemoMode())
      
      const [metricsData, activitiesData] = await Promise.all([
        demoAdapter.getDashboardMetrics(),
        demoAdapter.getActivities(20),
      ])
      
      setMetrics(metricsData)
      setActivities(activitiesData.data || [])
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError('Failed to load dashboard data. Please check API connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleStageClick = (stage: string) => {
    navigate(`/leads?status=${stage}`)
  }

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <div className="text-danger text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Try again
          </button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800">Demo Mode</h3>
              <p className="text-xs text-blue-700 mt-0.5">
                Showing sample data. Configure your Azure API in Settings to see live data.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Emails Sent Today"
          value={metrics?.emails_sent_today ?? 0}
          trend="+5 today"
          icon={<EmailIcon />}
          onClick={() => navigate('/reports')}
        />
        <MetricCard
          title="WhatsApp Queue"
          value={metrics?.whatsapp_queue_count ?? 0}
          trend={metrics && metrics.whatsapp_queue_count > 0 ? 'pending' : 'empty'}
          icon={<ChatIcon />}
          onClick={() => navigate('/whatsapp')}
        />
        <MetricCard
          title="Follow-ups Due"
          value={metrics?.followups_due_today ?? 0}
          trend="today"
          icon={<CalendarIcon />}
          alert={metrics ? metrics.followups_due_today > 10 : false}
          onClick={() => navigate('/followups')}
        />
        <MetricCard
          title="Replies Today"
          value={metrics?.replies_today ?? 0}
          trend="responses"
          icon={<ReplyIcon />}
          onClick={() => navigate('/leads?status=responded')}
        />
      </div>

      {/* Pipeline Bar */}
      {metrics && (
        <PipelineBar
          pipeline={metrics.pipeline}
          onStageClick={handleStageClick}
        />
      )}

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card title="Quick Actions" className="lg:col-span-1">
          <div className="space-y-3">
            <Link
              to="/whatsapp"
              className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center">
                <ChatIconWhite />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Process WhatsApp</div>
                <div className="text-xs text-gray-500">
                  {metrics?.whatsapp_queue_count ?? 0} messages pending
                </div>
              </div>
            </Link>

            <Link
              to="/followups"
              className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                <CalendarIconWhite />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">View Follow-ups</div>
                <div className="text-xs text-gray-500">
                  {metrics?.followups_due_today ?? 0} due today
                </div>
              </div>
            </Link>

            <Link
              to="/leads"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center">
                <UsersIconWhite />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Browse Leads</div>
                <div className="text-xs text-gray-500">Search and filter leads</div>
              </div>
            </Link>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card
          title="Recent Activity"
          className="lg:col-span-2"
          actions={
            <Link
              to="/reports"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          }
        >
          <ActivityFeed activities={activities} maxItems={8} />
        </Card>
      </div>
    </div>
  )
}

// Icon components
function EmailIcon() {
  return (
    <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function ReplyIcon() {
  return (
    <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
  )
}

function ChatIconWhite() {
  return (
    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  )
}

function CalendarIconWhite() {
  return (
    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function UsersIconWhite() {
  return (
    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}
