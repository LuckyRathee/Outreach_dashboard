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
  LeadStatus,
  WhatsAppStatus,
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
    const response = await this.fetchApi<any>(`/api/v1/leads${queryString ? '?' + queryString : ''}`)
    
    // API returns {items, total, page, page_size} - transform to {data, total, has_more}
    const rawItems = response.items || response.data || []
    const total = response.total || 0
    const pageSize = response.page_size || response.limit || 50
    const currentPage = response.page || filters?.page || 1
    
    // Transform API lead structure to dashboard expected structure
    const items = rawItems.map((item: any) => ({
      id: item.id || item.lead_id || '',
      company_name: item.company_name || item.business_name || 'Unknown',
      status: item.status || 'new', // Default to 'new' if missing
      employees: item.employees || item.employee_count || 0,
      city: item.city || 'Unknown',
      industry: item.industry || item.category || 'Unknown',
      linkedin_url: item.linkedin_url || '',
      phone: item.phone || '',
      whatsapp_number: item.whatsapp_number || '',
      whatsapp_status: item.whatsapp_status || 'pending',
      notes: item.notes || '',
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
    }))
    
    return {
      data: items,
      total,
      page: currentPage,
      limit: pageSize,
      has_more: items.length === pageSize && (currentPage * pageSize) < total
    }
  }

  async getLead(leadId: string): Promise<Lead> {
    const response = await this.fetchApi<any>(`/api/v1/leads/${leadId}`)
    
    console.log('📋 Lead Detail Raw Response:', response)
    
    // Transform API response to match dashboard format
    return {
      id: response.lead_id || response.id || '',
      company_name: response.business_name || response.company_name || 'Unknown',
      status: (response.current_status || response.status || 'new').toLowerCase().replace('qualified', 'qualified') as LeadStatus,
      employees: response.employees || response.employee_count || 0,
      city: response.city || 'Unknown',
      industry: response.industry || response.category || 'Unknown',
      linkedin_url: response.linkedin_url || '',
      phone: response.phone || '',
      whatsapp_number: response.whatsapp_number || response.phone || '',
      whatsapp_status: (response.whatsapp?.status || response.whatsapp_status || 'pending').toLowerCase() as WhatsAppStatus,
      notes: response.notes || response.whatsapp_message || '',
      created_at: response.created_at || new Date().toISOString(),
      updated_at: response.updated_at || new Date().toISOString(),
      // Additional fields from API
      demo_url: response.demo_url,
      website_link: response.website_link,
      whatsapp_url: response.whatsapp?.url || response.whatsapp_url,
      whatsapp_message: response.whatsapp?.message || response.whatsapp_message,
      history: response.history || [],
    }
  }

  // WhatsApp Queue
  async getWhatsAppQueue(): Promise<WhatsAppQueueItem[]> {
    const response = await this.fetchApi<any>('/api/v1/outreach/whatsapp-queue')
    
    console.log('📱 WhatsApp Queue Raw Response:', response)
    
    // API may return array directly, or wrapped in {data, items, total}
    const rawItems = Array.isArray(response) ? response : (response.items || response.data || [])
    
    console.log('📱 WhatsApp Queue Items Count:', rawItems.length)
    if (rawItems.length > 0) {
      console.log('📱 First Item Structure:', rawItems[0])
    }
    
    // Transform API response to match dashboard format
    // API returns both nested (whatsapp.url) and flat (whatsapp_url) structures
    const transformed = rawItems.map((item: any) => {
      const transformed = {
        lead_id: item.lead_id || item.id || '',
        company_name: item.business_name || item.company_name || 'Unknown',
        employees: item.employees || item.employee_count || 0,
        city: item.city || 'Unknown',
        industry: item.category || item.industry || 'Unknown',
        template: item.whatsapp?.message || item.whatsapp_message || item.message || '',
        whatsapp_url: item.whatsapp?.url || item.whatsapp_url || '',
        status: (item.whatsapp?.status || item.whatsapp_status || 'READY').toUpperCase() as 'READY' | 'OPENED' | 'SENT',
        priority_score: item.qualification?.score || item.priority_score || 0,
      }
      console.log('📱 Transformed Item:', transformed)
      return transformed
    })
    
    console.log('📱 Final Transformed Queue:', transformed)
    return transformed
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
    const response = await this.fetchApi<any>(`/api/v1/followups${queryString}`)
    
    // API may return array directly or wrapped
    const rawItems = Array.isArray(response) ? response : (response.items || response.data || [])
    
    // Transform API response to match dashboard format
    const items = rawItems.map((item: any) => ({
      id: item.id || '',
      lead_id: item.lead_id || '',
      company_name: item.company_name || 'Unknown',
      due_date: item.due_at || item.due_date || new Date().toISOString(),
      status: (item.status || 'DUE').toUpperCase() as 'DUE' | 'COMPLETED',
      notes: item.message || item.notes || '',
      created_at: item.created_at || new Date().toISOString(),
    }))
    
    return {
      data: items,
      total: items.length,
    }
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
    const response = await this.fetchApi<any>(`/api/v1/activity?limit=${limit}`)
    
    // API may return array directly or wrapped
    const rawItems = Array.isArray(response) ? response : (response.items || response.data || [])
    
    // Transform API response to match dashboard format
    const items = rawItems.map((item: any) => ({
      id: item.id || '',
      type: item.event_type || item.type || 'lead_created',
      lead_id: item.lead_id || '',
      company_name: item.company_name || item.business_name || 'Unknown',
      timestamp: item.timestamp || item.created_at || new Date().toISOString(),
      details: item.details || item.message || '',
    }))
    
    return {
      data: items,
      total: items.length,
    }
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
