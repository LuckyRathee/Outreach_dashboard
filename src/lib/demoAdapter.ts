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
import { apiAdapter } from './apiEngineAdapter'

// Check if using API mode (not demo)
export const isApiMode = (): boolean => {
  const mode = localStorage.getItem('dashboard_mode')
  return mode === 'api'
}

// Determine which adapter to use
const getAdapter = () => {
  return isApiMode() ? apiAdapter : null
}

// Demo data adapter with API fallback
class DemoDataAdapter {
  // Dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const adapter = getAdapter()
    if (adapter) {
      try {
        return await adapter.getDashboardMetrics()
      } catch (error) {
        console.warn('API call failed, falling back to demo data:', error)
      }
    }
    return mockMetrics
  }

  // Leads
  async getLeads(filters?: LeadFilters): Promise<ApiResponse<Lead[]>> {
    const adapter = getAdapter()
    if (adapter) {
      try {
        return await adapter.getLeads(filters)
      } catch (error) {
        console.warn('API call failed, falling back to demo data:', error)
      }
    }
    
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

    return {
      data: filteredLeads,
      total: filteredLeads.length,
      page: 1,
      has_more: false,
    }
  }

  async getLead(leadId: string): Promise<Lead> {
    const adapter = getAdapter()
    if (adapter) {
      try {
        return await adapter.getLead(leadId)
      } catch (error) {
        console.warn('API call failed, falling back to demo data:', error)
      }
    }
    const lead = mockLeads.find((l) => l.id === leadId)
    return lead || mockLeads[0]
  }

  // WhatsApp Queue
  async getWhatsAppQueue(): Promise<ApiResponse<WhatsAppQueueItem[]>> {
    const adapter = getAdapter()
    if (adapter) {
      try {
        return await adapter.getWhatsAppQueue()
      } catch (error) {
        console.warn('API call failed, falling back to demo data:', error)
      }
    }
    return {
      data: mockWhatsAppQueue,
      total: mockWhatsAppQueue.length,
    }
  }

  // Follow-ups
  async getFollowUps(status?: string): Promise<ApiResponse<FollowUp[]>> {
    const adapter = getAdapter()
    if (adapter) {
      try {
        return await adapter.getFollowUps(status)
      } catch (error) {
        console.warn('API call failed, falling back to demo data:', error)
      }
    }
    
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

    return {
      data: filtered,
      total: filtered.length,
    }
  }

  // Activities
  async getActivities(limit = 20): Promise<ApiResponse<Activity[]>> {
    const adapter = getAdapter()
    if (adapter) {
      try {
        return await adapter.getActivities(limit)
      } catch (error) {
        console.warn('API call failed, falling back to demo data:', error)
      }
    }
    return {
      data: mockActivities.slice(0, limit),
      total: mockActivities.length,
    }
  }

  // Reports
  async getOutreachMetrics(startDate: string, endDate: string): Promise<OutreachMetric[]> {
    const adapter = getAdapter()
    if (adapter) {
      try {
        return await adapter.getOutreachMetrics(startDate, endDate)
      } catch (error) {
        console.warn('API call failed, falling back to demo data:', error)
      }
    }
    return mockOutreachMetrics
  }

  async getTemplatePerformance(): Promise<TemplatePerformance[]> {
    const adapter = getAdapter()
    if (adapter) {
      try {
        return await adapter.getTemplatePerformance()
      } catch (error) {
        console.warn('API call failed, falling back to demo data:', error)
      }
    }
    return mockTemplatePerformance
  }
}

export const demoAdapter = new DemoDataAdapter()

// Export utility to check demo mode
export const isDemoMode = (): boolean => {
  return !isApiMode()
}
