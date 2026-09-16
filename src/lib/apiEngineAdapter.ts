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

    // IMPORTANT: Send the actual token in the Authorization header
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`
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
    const data = await this.fetchApi<any>('/api/v1/dashboard/metrics')
    
    // Transform API response to match dashboard format
    // API returns flat metrics, dashboard expects pipeline breakdown
    return {
      emails_sent_today: data.real_messages_sent || 0,
      whatsapp_queue_count: data.whatsapp_links_ready || 0,
      followups_due_today: 0, // Not provided by API yet
      replies_today: 0, // Not provided by API yet
      pipeline: {
        new: data.ready_to_approach || 0,
        contacted: data.contacted || 0,
        responded: 0, // Not provided by API yet
        qualified: data.qualified || 0,
        won: 0, // Not provided by API yet
      },
      last_sync: data.last_sync_at || new Date().toISOString(),
      // Also include the raw metrics
      total_leads: data.total_leads || 0,
      qualified: data.qualified || 0,
      contacted: data.contacted || 0,
      ready_to_approach: data.ready_to_approach || 0,
      whatsapp_links_ready: data.whatsapp_links_ready || 0,
      real_messages_sent: data.real_messages_sent || 0,
      suppressed: data.suppressed || 0,
    }
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
  async getWhatsAppQueue(): Promise<WhatsAppQueueItem[]> {
    const response = await this.fetchApi<any>('/api/v1/outreach/whatsapp-queue')
    
    // API may return array directly, or wrapped in {data, items, total}
    const rawItems = Array.isArray(response) ? response : (response.items || response.data || [])
    
    // Transform API response to match dashboard format
    // API returns nested structure, dashboard expects flat fields
    return rawItems.map((item: any) => ({
      lead_id: item.lead_id,
      company_name: item.business_name || item.company_name || 'Unknown',
      employees: item.employees || 0,
      city: item.city || 'Unknown',
      industry: item.category || item.industry || 'Unknown',
      template: item.whatsapp?.message || '',
      whatsapp_url: item.whatsapp?.url || '',
      status: item.whatsapp?.status || 'READY',
      priority_score: item.qualification?.score || 0,
    }))
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
  async getOutreachMetrics(_startDate: string, _endDate: string): Promise<OutreachMetric[]> {
    // Engine doesn't have this endpoint yet - return empty data
    // TODO: Implement on engine side when needed
    return []
  }

  async getTemplatePerformance(): Promise<TemplatePerformance[]> {
    // Engine doesn't have this endpoint yet - return empty data
    // TODO: Implement on engine side when needed
    return []
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
