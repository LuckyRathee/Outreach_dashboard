import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { PipelineBreakdown } from '../../lib/types'

interface StatusPieChartProps {
  pipeline: PipelineBreakdown
}

const COLORS = {
  new: '#9ca3af',
  contacted: '#3b82f6',
  responded: '#f59e0b',
  qualified: '#8b5cf6',
  won: '#10b981',
}

export default function StatusPieChart({ pipeline }: StatusPieChartProps) {
  const data = [
    { name: 'New', value: pipeline.new, color: COLORS.new },
    { name: 'Contacted', value: pipeline.contacted, color: COLORS.contacted },
    { name: 'Responded', value: pipeline.responded, color: COLORS.responded },
    { name: 'Qualified', value: pipeline.qualified, color: COLORS.qualified },
    { name: 'Won', value: pipeline.won, color: COLORS.won },
  ].filter((item) => item.value > 0)

  const total = data.reduce((sum, item) => sum + item.value, 0)

  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
          }}
          formatter={(value: number, name: string) => {
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0
            return [`${value} (${percentage}%)`, name]
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
