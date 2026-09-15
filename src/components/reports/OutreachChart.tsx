import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { OutreachMetric } from '../../lib/types'

interface OutreachChartProps {
  data: OutreachMetric[]
}

export default function OutreachChart({ data }: OutreachChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
          }}
        />
        <Legend />
        <Bar dataKey="emails_sent" name="Emails Sent" fill="#3b82f6" />
        <Bar dataKey="whatsapp_sent" name="WhatsApp Sent" fill="#10b981" />
        <Bar dataKey="responses" name="Responses" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  )
}
