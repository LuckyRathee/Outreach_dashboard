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

// Check if running locally (development) or on Netlify (production)
const isLocalDevelopment = () => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

// Get API configuration
const getApiConfig = () => {
  const apiUrl = localStorage.getItem('engine_api_url') || 'https://hermes-vm.tail5e4a2f.ts.net'
  const apiToken = localStorage.getItem('engine_api_token') || ''
  return { apiUrl, apiToken }
}

// API Engine Adapter - Works both locally and in production
export class ApiEngineAdapter {
  private getBaseUrl(): string {
    if (isLocalDevelopment()) {
      // Local dev: Call API directly
      const { apiUrl } = getApiConfig()
      return apiUrl
    } else {
      // Production: Use Netlify proxy
      return '/api'
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Always add auth header (both local and production)
    const { apiToken } = getApiConfig()
    if (apiToken) {
      headers['Authorization'] = `***`
    }

    return headers
  }

  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const baseUrl = this.getBaseUrl()
    const url = `${baseUrl}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }))
        
        // Handle specific error codes
        if (response.status === 401) {
          throw new Error('Invalid API token. Please check your token in Settings.')
        } else if (response.status === 403) {
          throw new Error('Access denied. Check API permissions.')
        } else if (response.status === 404) {
          throw new Error('Endpoint not found.')
        }
        
        throw new Error(error.message || error.error || `API Error: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error(`API Error [${endpoint}]:`, error.message)
      throw error
    }
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.fetchApi<DashboardMetrics>('/api/v1/dashboard/metrics')
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
    return this.fetchApi<ApiResponse<Lead[]>>(`/api/v1/leads${queryString ? '?' + queryString : ''}`)
  }

  async getLead(leadId: string): Promise<Lead> {
    return this.fetchApi<Lead>(`/api/v1/leads/${leadId}`)
  }

  // WhatsApp Queue
  async getWhatsAppQueue(): Promise<ApiResponse<WhatsAppQueueItem[]>> {
    return this.fetchApi<ApiResponse<WhatsAppQueueItem[]>>('/api/v1/outreach/whatsapp-queue')
  }

  async markWhatsAppOpened(leadId: string, actor: string = 'dashboard-user'): Promise<void> {
    await this.fetchApi(`/api/v1/leads/${leadId}/whatsapp/opened`, {
      method: 'POST',
      body: JSON.stringify({ actor })
    })
  }

  async markWhatsAppSent(leadId: string, actor: string = 'dashboard-user'): Promise<void> {
    await this.fetchApi(`/api/v1/leads/${leadId}/whatsapp/mark-sent`, {
      method: 'POST',
      body: JSON.stringify({ confirmation: true, actor })
    })
  }

  // Follow-ups
  async getFollowUps(status?: string): Promise<ApiResponse<FollowUp[]>> {
    const queryString = status ? `?status=${status}` : ''
    return this.fetchApi<ApiResponse<FollowUp[]>>(`/api/v1/followups${queryString}`)
  }

  async completeFollowUp(followUpId: string, actor: string = 'dashboard-user'): Promise<void> {
    await this.fetchApi(`/api/v1/followups/${followUpId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ actor })
    })
  }

  async snoozeFollowUp(followUpId: string, newDate: string, actor: string = 'dashboard-user'): Promise<void> {
    await this.fetchApi(`/api/v1/followups/${followUpId}/snooze`, {
      method: 'POST',
      body: JSON.stringify({ new_due_at: newDate, actor })
    })
  }

  // Activities
  async getActivities(limit = 50): Promise<ApiResponse<Activity[]>> {
    return this.fetchApi<ApiResponse<Activity[]>>(`/api/v1/activity?limit=${limit}`)
  }

  // Sync
  async triggerSync(): Promise<void> {
    await this.fetchApi('/v1/sync', { method: 'POST' })
  }

  // Reports
  async getOutreachMetrics(startDate: string, endDate: string): Promise<OutreachMetric[]> {
    return this.fetchApi<OutreachMetric[]>(
      `/api/v1/reports/outreach?start_date=${startDate}&end_date=${endDate}`
    )
  }

  async getTemplatePerformance(): Promise<TemplatePerformance[]> {
    return this.fetchApi<TemplatePerformance[]>('/api/v1/reports/templates')
  }

  // Health check
  async checkHealth(): Promise<{ status: string }> {
    return this.fetchApi<{ status: string }>('/health')
  }

  // Outreach Draft
  async getOutreachDraft(leadId: string): Promise<any> {
    return this.fetchApi(`/api/v1/leads/${leadId}/outreach-draft`)
  }

  // Approve Outreach
  async approveOutreach(leadId: string, actor: string = 'dashboard-user'): Promise<void> {
    await this.fetchApi(`/api/v1/leads/${leadId}/outreach/approve`, {
      method: 'POST',
      body: JSON.stringify({ actor })
    })
  }

  // Send Email
  async sendEmail(leadId: string, recipientEmail: string, actor: string = 'dashboard-user'): Promise<void> {
    await this.fetchApi(`/api/v1/leads/${leadId}/email/send`, {
      method: 'POST',
      body: JSON.stringify({ recipient_email: recipientEmail, confirmation: true, actor })
    })
  }
}

// Export singleton instance
export const apiAdapter = new ApiEngineAdapter()
