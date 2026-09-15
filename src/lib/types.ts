// Lead Types
export type LeadStatus = 'new' | 'contacted' | 'responded' | 'qualified' | 'won' | 'lost'
export type WhatsAppStatus = 'pending' | 'opened' | 'sent'

export interface Lead {
  id: string
  company_name: string
  status: LeadStatus
  employees: number
  city: string
  industry: string
  linkedin_url?: string
  phone?: string
  whatsapp_number?: string
  whatsapp_status: WhatsAppStatus
  notes?: string
  created_at: string
  updated_at: string
}

// Follow-up Types
export type FollowUpStatus = 'pending' | 'completed' | 'overdue'

export interface FollowUp {
  id: string
  lead_id: string
  company_name: string
  due_date: string
  status: FollowUpStatus
  notes?: string
  created_at: string
}

// WhatsApp Queue Types
export type QueueItemStatus = 'READY' | 'OPENED' | 'SENT'

export interface WhatsAppQueueItem {
  lead_id: string
  company_name: string
  employees: number
  city: string
  industry: string
  template: string
  whatsapp_url: string
  status: QueueItemStatus
  priority_score?: number
}

// Dashboard Metrics
export interface PipelineBreakdown {
  new: number
  contacted: number
  responded: number
  qualified: number
  won: number
}

export interface DashboardMetrics {
  emails_sent_today: number
  whatsapp_queue_count: number
  followups_due_today: number
  replies_today: number
  pipeline: PipelineBreakdown
  last_sync: string
}

// Activity Types
export type ActivityType = 
  | 'email_sent' 
  | 'whatsapp_opened' 
  | 'whatsapp_sent' 
  | 'follow_up_created' 
  | 'lead_created'
  | 'lead_updated'

export interface Activity {
  id: string
  type: ActivityType
  lead_id?: string
  company_name?: string
  timestamp: string
  details?: string
}

// API Request/Response Types
export interface LeadFilters {
  status?: string
  city?: string
  industry?: string
  search?: string
  page?: number
  limit?: number
}

export interface ApiResponse<T> {
  data: T
  total?: number
  page?: number
  limit?: number
  has_more?: boolean
}

export interface BulkActionRequest {
  lead_ids: string[]
}

export interface RescheduleRequest {
  new_date: string
  reason?: string
}

// Report Types
export interface OutreachMetric {
  date: string
  emails_sent: number
  whatsapp_sent: number
  responses: number
}

export interface TemplatePerformance {
  template_name: string
  sent_count: number
  response_count: number
  response_rate: number
}

// Export Types
export interface LeadExportData {
  Company: string
  Status: string
  Employees: number
  City: string
  Industry: string
  'WhatsApp Status': string
  Phone: string
  'LinkedIn URL': string
  'Created At': string
}
