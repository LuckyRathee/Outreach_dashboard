import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import ExportButton from '../components/common/ExportButton'
import LeadFilters from '../components/leads/LeadFilters'
import LeadTable from '../components/leads/LeadTable'
import BulkActions from '../components/leads/BulkActions'
import { dataAdapter } from '../lib/dataAdapter'
import { bulkMarkSent, bulkMarkUnsent, bulkArchive } from '../lib/api'
import { exportToCSV, exportToExcel } from '../lib/export'
import { useRefresh } from '../hooks/useRefresh'
import type { Lead } from '../lib/types'

export default function Leads() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshKey } = useRefresh()
  
  // Filters from URL
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [industry, setIndustry] = useState(searchParams.get('industry') || '')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  
  // Data
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const limit = 50

  useEffect(() => {
    fetchLeads()
  }, [refreshKey, page])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await dataAdapter.getLeads({ status, city, industry, search, page, limit })
      setLeads(response.data || [])
      setTotal(response.total || 0)
      setHasMore(response.has_more || false)
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (city) params.set('city', city)
    if (industry) params.set('industry', industry)
    if (search) params.set('search', search)
    setSearchParams(params)
    setPage(1)
    fetchLeads()
  }

  const handleResetFilters = () => {
    setStatus('')
    setCity('')
    setIndustry('')
    setSearch('')
    setSearchParams(new URLSearchParams())
    setPage(1)
    fetchLeads()
  }

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(leads.map((l) => l.id))
    }
  }

  const handleRowClick = (id: string) => {
    navigate(`/leads/${id}`)
  }

  const handleBulkMarkSent = async () => {
    try {
      setBulkLoading(true)
      await bulkMarkSent(selectedIds)
      setSelectedIds([])
      fetchLeads()
    } catch (error) {
      console.error('Bulk mark sent failed:', error)
    } finally {
      setBulkLoading(false)
    }
  }

  const handleBulkMarkUnsent = async () => {
    try {
      setBulkLoading(true)
      await bulkMarkUnsent(selectedIds)
      setSelectedIds([])
      fetchLeads()
    } catch (error) {
      console.error('Bulk mark unsent failed:', error)
    } finally {
      setBulkLoading(false)
    }
  }

  const handleBulkArchive = async () => {
    if (!confirm(`Archive ${selectedIds.length} leads?`)) return
    
    try {
      setBulkLoading(true)
      await bulkArchive(selectedIds)
      setSelectedIds([])
      fetchLeads()
    } catch (error) {
      console.error('Bulk archive failed:', error)
    } finally {
      setBulkLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <LeadFilters
        status={status}
        city={city}
        industry={industry}
        search={search}
        onStatusChange={setStatus}
        onCityChange={setCity}
        onIndustryChange={setIndustry}
        onSearchChange={setSearch}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {total} Leads
          </h2>
          <p className="text-sm text-gray-500">
            Showing {leads.length} of {total}
          </p>
        </div>
        <ExportButton
          onExportCSV={() => exportToCSV(leads)}
          onExportExcel={() => exportToExcel(leads)}
          disabled={leads.length === 0}
        />
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedIds.length}
        onMarkSent={handleBulkMarkSent}
        onMarkUnsent={handleBulkMarkUnsent}
        onArchive={handleBulkArchive}
        onClear={() => setSelectedIds([])}
        loading={bulkLoading}
      />

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <LeadTable
          leads={leads}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onRowClick={handleRowClick}
        />
      )}

      {/* Pagination */}
      {!loading && hasMore && (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => p + 1)}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
