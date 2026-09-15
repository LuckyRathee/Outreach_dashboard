import type {
  Lead,
  LeadFilters,
  ApiResponse,
  DashboardMetrics,
  WhatsAppQueueItem,
  FollowUp,
  Activity,
  OutreachMetric,
  TemplatePerformance,
} from './types'
import {
  mockLeads,
  mockMetrics,
  mockWhatsAppQueue,
  mockFollowUps,
  mockActivities,
  mockOutreachMetrics,
  mockTemplatePerformance,
} from './mockData'

// Check if using demo mode
export const isDemoMode = (): boolean => {
  const url = localStorage.getItem('engine_api_url')
  return !url || url === 'http://localhost:8000'
}

// Demo data adapter with API fallback
class DemoDataAdapter {
  private apiBaseUrl: string
  private apiToken: string

  constructor() {
    this.apiBaseUrl = localStorage.getItem('engine_api_url') || 'http://localhost:8000'
    this.apiToken = localStorage.getItem('engine_api_token') || ''
  }

  // Try API first, fall back to demo data
  private async fetchWithFallback<T>(
    endpoint: string,
    mockData: T
  ): Promise<T> {
    // If in demo mode, return mock data immediately
    if (isDemoMode()) {
      return mockData
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiToken ? `Bearer ${this.apiToken}` : '',
        },
      })

      if (!response.ok) {
        console.warn(`API error (${response.status}), using demo data`)
        return mockData
      }

      return await response.json()
    } catch (error) {
      console.warn('API unavailable, using demo data:', error)
      return mockData
    }
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.fetchWithFallback('/api/v1/dashboard/metrics', mockMetrics)
  }

  // Leads
  async getLeads(filters?: LeadFilters): Promise<ApiResponse<Lead[]>> {
    let filteredLeads = [...mockLeads]

    if (filters) {
      if (filters.status) {
        filteredLeads = filteredLeads.filter((lead) => lead.status === filters.status)
      }
      if (filters.city) {
        filteredLeads = filteredLeads.filter((lead) => lead.city === filters.city)
      }
      if (filters.industry) {
        filteredLeads = filteredLeads.filter((lead) => lead.industry === filters.industry)
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredLeads = filteredLeads.filter((lead) =>
          lead.company_name.toLowerCase().includes(searchLower)
        )
      }
    }

    return this.fetchWithFallback('/api/v1/leads', {
      data: filteredLeads,
      total: filteredLeads.length,
      page: 1,
      has_more: false,
    })
  }

  async getLead(leadId: string): Promise<Lead> {
    const lead = mockLeads.find((l) => l.id === leadId)
    return this.fetchWithFallback(`/api/v1/leads/${leadId}`, lead || mockLeads[0])
  }

  // WhatsApp Queue
  async getWhatsAppQueue(): Promise<ApiResponse<WhatsAppQueueItem[]>> {
    return this.fetchWithFallback('/api/v1/outreach/whatsapp-queue', {
      data: mockWhatsAppQueue,
      total: mockWhatsAppQueue.length,
    })
  }

  // Follow-ups
  async getFollowUps(status?: string): Promise<ApiResponse<FollowUp[]>> {
    let filtered = [...mockFollowUps]
    
    if (status === 'today') {
      const today = new Date().toDateString()
      filtered = filtered.filter((f) => new Date(f.due_date).toDateString() === today)
    } else if (status === 'overdue') {
      const now = new Date()
      filtered = filtered.filter((f) => new Date(f.due_date) < now && f.status !== 'completed')
    } else if (status === 'upcoming') {
      const now = new Date()
      filtered = filtered.filter((f) => new Date(f.due_date) > now)
    }

    return this.fetchWithFallback(`/api/v1/followups${status ? `?status=${status}` : ''}`, {
      data: filtered,
      total: filtered.length,
    })
  }

  // Activities
  async getActivities(limit = 20): Promise<ApiResponse<Activity[]>> {
    return this.fetchWithFallback(`/api/v1/activity?limit=${limit}`, {
      data: mockActivities.slice(0, limit),
      total: mockActivities.length,
    })
  }

  // Reports
  async getOutreachMetrics(startDate: string, endDate: string): Promise<OutreachMetric[]> {
    return this.fetchWithFallback(
      `/api/v1/reports/outreach?start_date=${startDate}&end_date=${endDate}`,
      mockOutreachMetrics
    )
  }

  async getTemplatePerformance(): Promise<TemplatePerformance[]> {
    return this.fetchWithFallback('/api/v1/reports/templates', mockTemplatePerformance)
  }
}

export const demoAdapter = new DemoDataAdapter()
