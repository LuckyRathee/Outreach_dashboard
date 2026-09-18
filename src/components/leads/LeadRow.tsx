import clsx from 'clsx'
import type { Lead } from '../../lib/types'
import Badge from '../common/Badge'

interface LeadRowProps {
  lead: Lead
  isSelected: boolean
  onSelect: (id: string) => void
  onClick: (id: string) => void
}

const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  new: 'info',
  contacted: 'warning',
  responded: 'success',
  qualified: 'success',
  won: 'success',
  lost: 'danger',
}

export default function LeadRow({ lead, isSelected, onSelect, onClick }: LeadRowProps) {
  return (
    <tr
      className="hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onClick(lead.id)}
    >
      <td className="relative px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(lead.id)}
          className="table-checkbox"
        />
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center">
          <div className="font-medium text-gray-900">{lead.company_name}</div>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <Badge variant={statusVariants[lead.status] || 'default'}>
          {lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : 'Unknown'}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
        {lead.employees}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
        {lead.city}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
        {lead.industry}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <span
          className={clsx(
            'inline-flex items-center gap-1',
            lead.whatsapp_status === 'sent' && 'text-success',
            lead.whatsapp_status === 'opened' && 'text-warning',
            lead.whatsapp_status === 'pending' && 'text-gray-400'
          )}
        >
          {lead.whatsapp_status === 'sent' && (
            <>
              <CheckIcon />
              <span className="text-sm">Sent</span>
            </>
          )}
          {lead.whatsapp_status === 'opened' && (
            <>
              <OpenIcon />
              <span className="text-sm">Opened</span>
            </>
          )}
          {lead.whatsapp_status === 'pending' && (
            <>
              <PendingIcon />
              <span className="text-sm">Pending</span>
            </>
          )}
        </span>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-gray-400 text-sm">
        {new Date(lead.created_at).toLocaleDateString()}
      </td>
    </tr>
  )
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function OpenIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  )
}

function PendingIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
