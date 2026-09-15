import clsx from 'clsx'

interface FollowUpTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  counts: {
    today: number
    overdue: number
    upcoming: number
    all: number
  }
}

const tabs = [
  { key: 'today', label: 'Today' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'all', label: 'All' },
]

export default function FollowUpTabs({ activeTab, onTabChange, counts }: FollowUpTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const count = counts[tab.key as keyof typeof counts]
          const isActive = activeTab === tab.key

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={clsx(
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
                isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.label}
              <span
                className={clsx(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  tab.key === 'overdue' && count > 0
                    ? 'bg-danger text-white'
                    : isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-900'
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
