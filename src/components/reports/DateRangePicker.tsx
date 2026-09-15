import { useState } from 'react'
import Button from '../common/Button'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onApply: () => void
}

const presets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'This month', days: 0 },
  { label: 'Custom', days: -1 },
]

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = useState(0)

  const handlePresetClick = (days: number, index: number) => {
    setSelectedPreset(index)
    
    if (days > 0) {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - days)
      
      onStartDateChange(start.toISOString().split('T')[0])
      onEndDateChange(end.toISOString().split('T')[0])
    } else if (days === 0) {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      
      onStartDateChange(firstDay.toISOString().split('T')[0])
      onEndDateChange(now.toISOString().split('T')[0])
    }
    
    if (days !== -1) {
      onApply()
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex flex-wrap items-end gap-4">
        {/* Presets */}
        <div className="flex gap-2">
          {presets.map((preset, index) => (
            <Button
              key={preset.label}
              variant={selectedPreset === index ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handlePresetClick(preset.days, index)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Custom dates */}
        {selectedPreset === 3 && (
          <>
            <div>
              <label htmlFor="startDate" className="block text-xs font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="block rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-xs font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="block rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
              />
            </div>
            <Button size="sm" onClick={onApply}>
              Apply
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
