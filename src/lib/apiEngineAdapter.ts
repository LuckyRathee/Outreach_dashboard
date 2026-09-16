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

// Get API configuration
const getApiConfig = () => {
  const apiUrl = localStorage.getItem('engine_api_url') || 'https://hermes-vm.tail5e4a2f.ts.net'
  const apiToken = localStorage.getItem('engine_api_token') || ''
  return { apiUrl, apiToken }
}

// API Engine Adapter
export class ApiEngineAdapter {
  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const { apiUrl, apiToken } = getApiConfig()
    const url = `${apiUrl}${endpoint}`

    console.log(`🌐 API Call: ${endpoint}`)
    console.log(`📍 URL: ${url}`)
    console.log(`🔑 Token: ${apiToken ? 'Present (' + apiToken.slice(-4) + ')' : 'MISSING!'}`)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (apiToken) {
      headers['Authorization'] = `***`
    }

    // Merge with any existing headers
    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      console.log(`📊 Response Status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ Error Response:`, errorText)
        
        let errorMessage = `API Error: ${response.status}`
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.message || errorJson.error || errorMessage
        } catch (e) {
          // Use status text if JSON parsing fails
          errorMessage = response.statusText || errorMessage
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log(`✅ Success:`, data)
      return data
    } catch (error: any) {
      console.error(`💥 API Error [${endpoint}]:`, error.message)
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
    await this.fetchApi('/api/v1/sync', { method: 'POST' })
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
