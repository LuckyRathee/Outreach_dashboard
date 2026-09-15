import axios, { AxiosInstance, AxiosError } from 'axios'
import type {
  Lead,
  LeadFilters,
  ApiResponse,
  DashboardMetrics,
  WhatsAppQueueItem,
  FollowUp,
  Activity,
  BulkActionRequest,
  RescheduleRequest,
  OutreachMetric,
  TemplatePerformance,
} from './types'

// Environment variables
const API_URL = (import.meta as any).env?.VITE_ENGINE_API_URL || 'http://localhost:8000'
const API_TOKEN = (import.meta as any).env?.VITE_ENGINE_API_TOKEN || ''

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`,
  },
})

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized: Invalid API token')
    } else if (error.response?.status === 403) {
      console.error('Forbidden: Access denied')
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Network error: Cannot connect to engine API')
    }
    return Promise.reject(error)
  }
)

// ============================================
// Dashboard API
// ============================================

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await api.get<DashboardMetrics>('/api/v1/dashboard/metrics')
  return response.data
}

// ============================================
// Leads API
// ============================================

export const getLeads = async (filters?: LeadFilters): Promise<ApiResponse<Lead[]>> => {
  const params = new URLSearchParams()
  
  if (filters?.status) params.append('status', filters.status)
  if (filters?.city) params.append('city', filters.city)
  if (filters?.industry) params.append('industry', filters.industry)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())

  const response = await api.get<ApiResponse<Lead[]>>(`/api/v1/leads?${params.toString()}`)
  return response.data
}

export const getLead = async (leadId: string): Promise<Lead> => {
  const response = await api.get<Lead>(`/api/v1/leads/${leadId}`)
  return response.data
}

export const updateLead = async (leadId: string, data: Partial<Lead>): Promise<Lead> => {
  const response = await api.patch<Lead>(`/api/v1/leads/${leadId}`, data)
  return response.data
}

// ============================================
// WhatsApp API
// ============================================

export const getWhatsAppQueue = async (): Promise<ApiResponse<WhatsAppQueueItem[]>> => {
  const response = await api.get<ApiResponse<WhatsAppQueueItem[]>>('/api/v1/outreach/whatsapp-queue')
  return response.data
}

export const markWhatsAppOpened = async (leadId: string): Promise<void> => {
  await api.post(`/api/v1/leads/${leadId}/whatsapp/opened`)
}

export const markWhatsAppSent = async (leadId: string): Promise<void> => {
  await api.post(`/api/v1/leads/${leadId}/whatsapp/mark-sent`)
}

// ============================================
// Bulk Operations API
// ============================================

export const bulkMarkSent = async (leadIds: string[]): Promise<void> => {
  const body: BulkActionRequest = { lead_ids: leadIds }
  await api.post('/api/v1/leads/bulk/mark-sent', body)
}

export const bulkMarkUnsent = async (leadIds: string[]): Promise<void> => {
  const body: BulkActionRequest = { lead_ids: leadIds }
  await api.post('/api/v1/leads/bulk/mark-unsent', body)
}

export const bulkArchive = async (leadIds: string[]): Promise<void> => {
  const body: BulkActionRequest = { lead_ids: leadIds }
  await api.post('/api/v1/leads/bulk/archive', body)
}

// ============================================
// Follow-ups API
// ============================================

export const getFollowUps = async (status?: string): Promise<ApiResponse<FollowUp[]>> => {
  const params = status ? `?status=${status}` : ''
  const response = await api.get<ApiResponse<FollowUp[]>>(`/api/v1/followups${params}`)
  return response.data
}

export const completeFollowUp = async (followUpId: string): Promise<void> => {
  await api.post(`/api/v1/followups/${followUpId}/complete`)
}

export const rescheduleFollowUp = async (
  followUpId: string, 
  newDate: string, 
  reason?: string
): Promise<void> => {
  const body: RescheduleRequest = { new_date: newDate, reason }
  await api.post(`/api/v1/followups/${followUpId}/reschedule`, body)
}

// ============================================
// Reports API
// ============================================

export const getOutreachMetrics = async (
  startDate: string, 
  endDate: string
): Promise<OutreachMetric[]> => {
  const response = await api.get<OutreachMetric[]>(
    `/api/v1/reports/outreach?start_date=${startDate}&end_date=${endDate}`
  )
  return response.data
}

export const getTemplatePerformance = async (): Promise<TemplatePerformance[]> => {
  const response = await api.get<TemplatePerformance[]>('/api/v1/reports/templates')
  return response.data
}

// ============================================
// Activity API
// ============================================

export const getActivities = async (limit = 50): Promise<ApiResponse<Activity[]>> => {
  const response = await api.get<ApiResponse<Activity[]>>(`/api/v1/activity?limit=${limit}`)
  return response.data
}

// ============================================
// Sync API
// ============================================

export const triggerSync = async (): Promise<void> => {
  await api.post('/api/v1/sync')
}

// Export the api instance for custom requests
export default api
