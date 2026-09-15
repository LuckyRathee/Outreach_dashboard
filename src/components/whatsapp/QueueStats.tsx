interface QueueStatsProps {
  total: number
  processed: number
  remaining: number
}

export default function QueueStats({ total, processed, remaining }: QueueStatsProps) {
  const percentage = total > 0 ? Math.round((processed / total) * 100) : 0

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-gray-900">{remaining}</div>
        <div className="text-sm text-gray-500">
          {processed} of {total} processed
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-primary-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-semibold text-gray-900">{total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-success">{processed}</div>
          <div className="text-xs text-gray-500">Processed</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-warning">{remaining}</div>
          <div className="text-xs text-gray-500">Remaining</div>
        </div>
      </div>
    </div>
  )
}
