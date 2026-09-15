import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type { Lead, LeadExportData } from './types'

/**
 * Download a file to the user's computer
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Convert Lead objects to export format
 */
function prepareLeadData(leads: Lead[]): LeadExportData[] {
  return leads.map((lead) => ({
    Company: lead.company_name,
    Status: lead.status.charAt(0).toUpperCase() + lead.status.slice(1),
    Employees: lead.employees,
    City: lead.city,
    Industry: lead.industry,
    'WhatsApp Status': lead.whatsapp_status.charAt(0).toUpperCase() + lead.whatsapp_status.slice(1),
    Phone: lead.phone || '',
    'LinkedIn URL': lead.linkedin_url || '',
    'Created At': new Date(lead.created_at).toLocaleDateString(),
  }))
}

/**
 * Export leads to CSV format
 */
export function exportToCSV(leads: Lead[], filename = 'leads_export') {
  const data = prepareLeadData(leads)
  const csv = Papa.unparse(data)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(csv, `${filename}_${timestamp}.csv`, 'text/csv')
}

/**
 * Export leads to Excel format
 */
export function exportToExcel(leads: Lead[], filename = 'leads_export') {
  const data = prepareLeadData(leads)
  const ws = XLSX.utils.json_to_sheet(data)
  
  // Set column widths
  ws['!cols'] = [
    { wch: 25 }, // Company
    { wch: 12 }, // Status
    { wch: 12 }, // Employees
    { wch: 15 }, // City
    { wch: 20 }, // Industry
    { wch: 15 }, // WhatsApp Status
    { wch: 18 }, // Phone
    { wch: 40 }, // LinkedIn URL
    { wch: 12 }, // Created At
  ]
  
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Leads')
  
  const timestamp = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`)
}

/**
 * Export generic data to CSV
 */
export function exportDataToCSV<T extends Record<string, unknown>>(
  data: T[], 
  filename = 'export'
) {
  const csv = Papa.unparse(data)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(csv, `${filename}_${timestamp}.csv`, 'text/csv')
}

/**
 * Export generic data to Excel
 */
export function exportDataToExcel<T extends Record<string, unknown>>(
  data: T[], 
  filename = 'export',
  sheetName = 'Data'
) {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  
  const timestamp = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`)
}
