import { ReactNode } from 'react'
import clsx from 'clsx'

interface MetricCardProps {
  title: string
  value: number | string
  trend?: string
  icon?: ReactNode
  alert?: boolean
  onClick?: () => void
}

export default function MetricCard({ title, value, trend, icon, alert, onClick }: MetricCardProps) {
  return (
    <div
      className={clsx(
        'bg-white overflow-hidden shadow rounded-lg',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow'
      )}
      onClick={onClick}
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0">
              <div
                className={clsx(
                  'rounded-md p-3',
                  alert ? 'bg-red-100' : 'bg-primary-50'
                )}
              >
                {icon}
              </div>
            </div>
          )}
          <div className={icon ? 'ml-5 w-0 flex-1' : 'w-full'}>
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div
                  className={clsx(
                    'text-2xl font-semibold',
                    alert ? 'text-danger' : 'text-gray-900'
                  )}
                >
                  {value}
                </div>
                {trend && (
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-success">
                    {trend}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
