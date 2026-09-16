import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Spinner from '../components/common/Spinner'
import ConfirmationDialog from '../components/common/ConfirmationDialog'
import { dataAdapter } from '../lib/dataAdapter'
import type { Lead } from '../lib/types'

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [whatsappLoading, setWhatsappLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    if (id) fetchLead()
  }, [id])

  const fetchLead = async () => {
    try {
      setLoading(true)
      const data = await dataAdapter.getLead(id!)
      setLead(data)
    } catch (error) {
      console.error('Failed to fetch lead:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenWhatsApp = async () => {
    if (!lead) return
    
    try {
      setWhatsappLoading(true)
      
      // Call API
      await dataAdapter.markWhatsAppOpened(lead.id)
      
      // Open WhatsApp URL
      if (lead.whatsapp_number) {
        const url = `https://wa.me/${lead.whatsapp_number}?text=Hello`
        window.open(url, '_blank')
      }
      
      fetchLead()
    } catch (error) {
      console.error('Failed to open WhatsApp:', error)
    } finally {
      setWhatsappLoading(false)
    }
  }

  const handleMarkSent = async () => {
    if (!lead) return
    
    try {
      setWhatsappLoading(true)
      
      // Call API
      await dataAdapter.markWhatsAppSent(lead.id)
      
      setShowConfirmDialog(false)
      fetchLead()
    } catch (error) {
      console.error('Failed to mark sent:', error)
    } finally {
      setWhatsappLoading(false)
    }
  }
  
  const handleMarkSentClick = () => {
    setShowConfirmDialog(true)
  }
  
  const handleConfirmMarkSent = () => {
    handleMarkSent()
  }

  const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    new: 'info',
    contacted: 'warning',
    responded: 'success',
    qualified: 'success',
    won: 'success',
    lost: 'danger',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!lead) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lead Not Found</h3>
          <Button onClick={() => navigate('/leads')}>Back to Leads</Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/leads')}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{lead.company_name}</h1>
          <Badge variant={statusVariants[lead.status]} size="md">
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </Badge>
        </div>
        <div className="flex gap-2">
          {lead.whatsapp_number && (
            <>
              <Button
                variant="secondary"
                onClick={handleOpenWhatsApp}
                loading={whatsappLoading}
              >
                Open WhatsApp
              </Button>
              {lead.whatsapp_status !== 'sent' && (
                <Button
                  onClick={handleMarkSentClick}
                  loading={whatsappLoading}
                >
                  Mark as Manually Sent
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Company Info */}
        <Card title="Company Information">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Employees</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{lead.employees}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">City</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{lead.city}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Industry</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{lead.industry}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">LinkedIn</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                {lead.linkedin_url ? (
                  <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                    View Profile
                  </a>
                ) : (
                  <span className="text-gray-400">Not provided</span>
                )}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Contact Info */}
        <Card title="Contact Information">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {lead.phone || <span className="text-gray-400">Not provided</span>}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">WhatsApp</dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                <div className="flex items-center gap-2">
                  <span>{lead.whatsapp_number || 'Not provided'}</span>
                  {lead.whatsapp_status && (
                    <Badge variant={lead.whatsapp_status === 'sent' ? 'success' : lead.whatsapp_status === 'opened' ? 'warning' : 'default'}>
                      {lead.whatsapp_status}
                    </Badge>
                  )}
                </div>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {new Date(lead.created_at).toLocaleDateString()}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {new Date(lead.updated_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Notes */}
        {lead.notes && (
          <Card title="Notes" className="lg:col-span-2">
            <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
          </Card>
        )}
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmMarkSent}
        onCancel={() => setShowConfirmDialog(false)}
        title="Confirm Manual Send"
        message="Are you sure you want to mark this WhatsApp message as manually sent? This will update the lead's status and schedule follow-up actions."
        confirmLabel="Yes, Mark as Sent"
        cancelLabel="Cancel"
        variant="primary"
      />
    </div>
  )
}
