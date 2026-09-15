import { useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'

interface RescheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (newDate: string, reason: string) => void
  companyName: string
  loading?: boolean
}

export default function RescheduleModal({
  isOpen,
  onClose,
  onSubmit,
  companyName,
  loading,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    if (newDate) {
      onSubmit(newDate, reason)
      setNewDate('')
      setReason('')
      onClose()
    }
  }

  const handleClose = () => {
    setNewDate('')
    setReason('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reschedule Follow-up"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading} disabled={!newDate}>
            Save
          </Button>
        </>
      }
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Rescheduling follow-up for <strong>{companyName}</strong>
          </p>
        </div>

        <div>
          <label htmlFor="newDate" className="block text-sm font-medium text-gray-700 mb-1">
            New Date & Time
          </label>
          <input
            type="datetime-local"
            id="newDate"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason (optional)
          </label>
          <textarea
            id="reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you rescheduling?"
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </Modal>
  )
}
