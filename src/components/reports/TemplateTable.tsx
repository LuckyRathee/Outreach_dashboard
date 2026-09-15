import clsx from 'clsx'
import type { TemplatePerformance } from '../../lib/types'

interface TemplateTableProps {
  data: TemplatePerformance[]
}

export default function TemplateTable({ data }: TemplateTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No template data available
      </div>
    )
  }

  // Sort by response rate (highest first)
  const sortedData = [...data].sort((a, b) => b.response_rate - a.response_rate)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Template Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Responses
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Response Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((template, index) => (
            <tr key={template.template_name} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div
                  className={clsx(
                    'h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold',
                    index === 0 && 'bg-yellow-100 text-yellow-800',
                    index === 1 && 'bg-gray-100 text-gray-800',
                    index === 2 && 'bg-orange-100 text-orange-800',
                    index > 2 && 'bg-gray-50 text-gray-600'
                  )}
                >
                  {index + 1}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {template.template_name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {template.sent_count}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {template.response_count}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600"
                      style={{ width: `${Math.min(template.response_rate, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {template.response_rate}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
