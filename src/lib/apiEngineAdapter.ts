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

// API Engine Adapter - Calls the Netlify proxy
export class ApiEngineAdapter {
  private baseUrl: string

  constructor() {
    // Use relative URL - Netlify proxy handles the routing
    this.baseUrl = '/api'
  }

  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(error.message || `API Error: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error(`API Error [${endpoint}]:`, error.message)
      throw error
    }
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.fetchApi<DashboardMetrics>('/v1/dashboard/metrics')
  }

  // Leads
  async getLeads(filters?: LeadFilters): Promise<ApiResponse<Lead[]>> {
    const params = new URLSearchParams()
    
    if (filters?.status) params.append('status', filters.status)
    if (filters?.city) params.append('city', filters.city)
    if (filters?.industry) params.append('industry', filters.industry)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    return this.fetchApi<ApiResponse<Lead[]>>(`/v1/leads${queryString ? '?' + queryString : ''}`)
  }

  async getLead(leadId: string): Promise<Lead> {
    return this.fetchApi<Lead>(`/v1/leads/${leadId}`)
  }

  // WhatsApp Queue
  async getWhatsAppQueue(): Promise<ApiResponse<WhatsAppQueueItem[]>> {
    return this.fetchApi<ApiResponse<WhatsAppQueueItem[]>>('/v1/outreach/whatsapp-queue')
  }

  async markWhatsAppOpened(leadId: string): Promise<void> {
    await this.fetchApi(`/v1/leads/${leadId}/whatsapp/opened`, { method: 'POST' })
  }

  async markWhatsAppSent(leadId: string): Promise<void> {
    await this.fetchApi(`/v1/leads/${leadId}/whatsapp/mark-sent`, { method: 'POST' })
  }

  // Follow-ups
  async getFollowUps(status?: string): Promise<ApiResponse<FollowUp[]>> {
    const queryString = status ? `?status=${status}` : ''
    return this.fetchApi<ApiResponse<FollowUp[]>>(`/v1/followups${queryString}`)
  }

  async completeFollowUp(followUpId: string): Promise<void> {
    await this.fetchApi(`/v1/followups/${followUpId}/complete`, { method: 'POST' })
  }

  async snoozeFollowUp(followUpId: string, newDate: string): Promise<void> {
    await this.fetchApi(`/v1/followups/${followUpId}/snooze`, {
      method: 'POST',
      body: JSON.stringify({ new_date: newDate }),
    })
  }

  // Activities
  async getActivities(limit = 50): Promise<ApiResponse<Activity[]>> {
    return this.fetchApi<ApiResponse<Activity[]>>(`/v1/activity?limit=${limit}`)
  }

  // Sync
  async triggerSync(): Promise<void> {
    await this.fetchApi('/v1/sync', { method: 'POST' })
  }

  // Reports
  async getOutreachMetrics(startDate: string, endDate: string): Promise<OutreachMetric[]> {
    return this.fetchApi<OutreachMetric[]>(
      `/v1/reports/outreach?start_date=${startDate}&end_date=${endDate}`
    )
  }

  async getTemplatePerformance(): Promise<TemplatePerformance[]> {
    return this.fetchApi<TemplatePerformance[]>('/v1/reports/templates')
  }

  // Health check
  async checkHealth(): Promise<{ status: string }> {
    return this.fetchApi<{ status: string }>('/health')
  }
}

// Export singleton instance
export const apiAdapter = new ApiEngineAdapter()
