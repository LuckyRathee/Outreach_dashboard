import { useState, useEffect } from 'react'
import Card from '../components/common/Card'
import Spinner from '../components/common/Spinner'
import ExportButton from '../components/common/ExportButton'
import DateRangePicker from '../components/reports/DateRangePicker'
import OutreachChart from '../components/reports/OutreachChart'
import ResponseChart from '../components/reports/ResponseChart'
import StatusPieChart from '../components/reports/StatusPieChart'
import TemplateTable from '../components/reports/TemplateTable'
import { demoAdapter } from '../lib/demoAdapter'
import { exportDataToExcel } from '../lib/export'
import { useRefresh } from '../hooks/useRefresh'
import type { DashboardMetrics, OutreachMetric, TemplatePerformance } from '../lib/types'

export default function Reports() {
  const { refreshKey } = useRefresh()
  
  // Date range
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })
  
  // Data
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [outreachData, setOutreachData] = useState<OutreachMetric[]>([])
  const [templateData, setTemplateData] = useState<TemplatePerformance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [refreshKey])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      const [metricsData, outreach, templates] = await Promise.all([
        demoAdapter.getDashboardMetrics(),
        demoAdapter.getOutreachMetrics(startDate, endDate),
        demoAdapter.getTemplatePerformance(),
      ])
      
      setMetrics(metricsData)
      setOutreachData(outreach)
      setTemplateData(templates)
    } catch (error) {
      console.error('Failed to fetch report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyDateRange = () => {
    fetchAllData()
  }

  const handleExport = () => {
    const exportData = outreachData.map((item) => ({
      Date: item.date,
      'Emails Sent': item.emails_sent,
      'WhatsApp Sent': item.whatsapp_sent,
      Responses: item.responses,
    }))
    
    exportDataToExcel(exportData, 'outreach_report', 'Outreach Data')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  // Calculate summary stats
  const totalEmails = outreachData.reduce((sum, item) => sum + item.emails_sent, 0)
  const totalWhatsApp = outreachData.reduce((sum, item) => sum + item.whatsapp_sent, 0)
  const totalResponses = outreachData.reduce((sum, item) => sum + item.responses, 0)
  const avgResponseRate = totalEmails + totalWhatsApp > 0
    ? Math.round((totalResponses / (totalEmails + totalWhatsApp)) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onApply={handleApplyDateRange}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Emails Sent</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalEmails}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total WhatsApp Sent</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalWhatsApp}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Responses</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalResponses}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Avg Response Rate</dt>
            <dd className="mt-1 text-3xl font-semibold text-primary-600">{avgResponseRate}%</dd>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Outreach Volume */}
        <Card
          title="Outreach Volume"
          actions={
            <ExportButton
              onExportCSV={() => handleExport()}
              onExportExcel={() => handleExport()}
            />
          }
        >
          <OutreachChart data={outreachData} />
        </Card>

        {/* Response Rate Trend */}
        <Card title="Response Rate Trend">
          <ResponseChart data={outreachData} />
        </Card>
      </div>

      {/* Lead Status & Templates */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Lead Status Distribution */}
        <Card title="Lead Status Distribution">
          {metrics && <StatusPieChart pipeline={metrics.pipeline} />}
        </Card>

        {/* Template Performance */}
        <Card title="Template Performance">
          <TemplateTable data={templateData} />
        </Card>
      </div>
    </div>
  )
}
