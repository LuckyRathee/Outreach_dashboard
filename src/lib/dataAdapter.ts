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
import { apiAdapter } from './apiEngineAdapter'

// Unified adapter that only uses API
class DataAdapter {
  // Dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return await apiAdapter.getDashboardMetrics()
  }

  // Leads
  async getLeads(filters?: LeadFilters): Promise<ApiResponse<Lead[]>> {
    return await apiAdapter.getLeads(filters)
  }

  async getLead(leadId: string): Promise<Lead> {
    return await apiAdapter.getLead(leadId)
  }

  // WhatsApp Queue
  async getWhatsAppQueue(): Promise<ApiResponse<WhatsAppQueueItem[]>> {
    return await apiAdapter.getWhatsAppQueue()
  }

  async markWhatsAppOpened(leadId: string): Promise<void> {
    return await apiAdapter.markWhatsAppOpened(leadId)
  }

  async markWhatsAppSent(leadId: string): Promise<void> {
    return await apiAdapter.markWhatsAppSent(leadId)
  }

  // Follow-ups
  async getFollowUps(status?: string): Promise<ApiResponse<FollowUp[]>> {
    return await apiAdapter.getFollowUps(status)
  }

  async completeFollowUp(followUpId: string): Promise<void> {
    return await apiAdapter.completeFollowUp(followUpId)
  }

  async snoozeFollowUp(followUpId: string, newDate: string): Promise<void> {
    return await apiAdapter.snoozeFollowUp(followUpId, newDate)
  }

  // Activities
  async getActivities(limit = 20): Promise<ApiResponse<Activity[]>> {
    return await apiAdapter.getActivities(limit)
  }

  // Reports
  async getOutreachMetrics(startDate: string, endDate: string): Promise<OutreachMetric[]> {
    return await apiAdapter.getOutreachMetrics(startDate, endDate)
  }

  async getTemplatePerformance(): Promise<TemplatePerformance[]> {
    return await apiAdapter.getTemplatePerformance()
  }
}

export const dataAdapter = new DataAdapter()
