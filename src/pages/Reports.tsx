import { useState, useEffect } from 'react'
import Card from '../components/common/Card'
import Spinner from '../components/common/Spinner'
import ExportButton from '../components/common/ExportButton'
import DateRangePicker from '../components/reports/DateRangePicker'
import OutreachChart from '../components/reports/OutreachChart'
import ResponseChart from '../components/reports/ResponseChart'
import StatusPieChart from '../components/reports/StatusPieChart'
import TemplateTable from '../components/reports/TemplateTable'
import { dataAdapter } from '../lib/dataAdapter'
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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [refreshKey])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [metricsData, outreach, templates] = await Promise.all([
        dataAdapter.getDashboardMetrics(),
        dataAdapter.getOutreachMetrics(startDate, endDate),
        dataAdapter.getTemplatePerformance(),
      ])
      
      setMetrics(metricsData)
      setOutreachData(outreach || [])
      setTemplateData(templates || [])
    } catch (error) {
      console.error('Failed to fetch report data:', error)
      setError('Failed to load report data. Please check your API connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyDateRange = () => {
    fetchAllData()
  }

  const handleExport = () => {
    if (!outreachData || outreachData.length === 0) {
      alert('No data to export')
      return
    }
    
    const exportData = outreachData.map((item) => ({
      Date: item.date,
      'Emails Sent': item.emails_sent || 0,
      'WhatsApp Sent': item.whatsapp_sent || 0,
      Responses: item.responses || 0,
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium mb-2">Error Loading Reports</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchAllData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  // Calculate summary stats with safe defaults
  const totalEmails = outreachData?.reduce((sum, item) => sum + (item.emails_sent || 0), 0) || 0
  const totalWhatsApp = outreachData?.reduce((sum, item) => sum + (item.whatsapp_sent || 0), 0) || 0
  const totalResponses = outreachData?.reduce((sum, item) => sum + (item.responses || 0), 0) || 0
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

      {/* No Data Banner */}
      {outreachData.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            <strong>Note:</strong> Reports endpoints are not yet implemented on the engine. 
            Data will appear here once the engine provides these analytics.
          </p>
        </div>
      )}

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
