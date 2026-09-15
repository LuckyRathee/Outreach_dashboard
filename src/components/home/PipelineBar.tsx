import clsx from 'clsx'
import type { PipelineBreakdown } from '../../lib/types'

interface PipelineBarProps {
  pipeline: PipelineBreakdown
  onStageClick?: (stage: string) => void
}

interface Stage {
  key: keyof PipelineBreakdown
  label: string
  color: string
}

const stages: Stage[] = [
  { key: 'new', label: 'New', color: 'bg-gray-400' },
  { key: 'contacted', label: 'Contacted', color: 'bg-blue-500' },
  { key: 'responded', label: 'Responded', color: 'bg-yellow-500' },
  { key: 'qualified', label: 'Qualified', color: 'bg-purple-500' },
  { key: 'won', label: 'Won', color: 'bg-green-500' },
]

export default function PipelineBar({ pipeline, onStageClick }: PipelineBarProps) {
  const total = stages.reduce((sum, stage) => sum + pipeline[stage.key], 0)

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Pipeline Overview</h3>
      
      {/* Bar */}
      <div className="h-8 w-full rounded-full overflow-hidden flex">
        {stages.map((stage) => {
          const count = pipeline[stage.key]
          const percentage = total > 0 ? (count / total) * 100 : 0

          if (percentage === 0) return null

          return (
            <div
              key={stage.key}
              className={clsx(stage.color, 'transition-all hover:opacity-80')}
              style={{ width: `${percentage}%` }}
              title={`${stage.label}: ${count}`}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {stages.map((stage) => {
          const count = pipeline[stage.key]
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0

          return (
            <button
              key={stage.key}
              onClick={() => onStageClick?.(stage.key)}
              className="flex items-center gap-2 text-sm hover:opacity-75 transition-opacity"
            >
              <span className={clsx('w-3 h-3 rounded-full', stage.color)} />
              <span className="text-gray-600">{stage.label}</span>
              <span className="font-semibold text-gray-900">{count}</span>
              <span className="text-gray-400">({percentage}%)</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
