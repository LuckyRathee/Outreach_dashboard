import Button from '../common/Button'
import Badge from '../common/Badge'

interface BulkActionsProps {
  selectedCount: number
  onMarkSent: () => void
  onMarkUnsent: () => void
  onArchive: () => void
  onClear: () => void
  loading?: boolean
}

export default function BulkActions({
  selectedCount,
  onMarkSent,
  onMarkUnsent,
  onArchive,
  onClear,
  loading,
}: BulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Badge variant="info" size="md">
          {selectedCount} selected
        </Badge>
        <span className="text-sm text-gray-600">Bulk Actions:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onMarkSent}
          disabled={loading}
        >
          Mark Sent
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onMarkUnsent}
          disabled={loading}
        >
          Mark Unsent
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={onArchive}
          disabled={loading}
        >
          Archive
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
