import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { isApiMode } from '../../lib/demoAdapter'

interface ApiSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ApiSettingsModal({ isOpen, onClose }: ApiSettingsModalProps) {
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('engine_api_url') || 'http://localhost:8000')
  const [apiToken, setApiToken] = useState(localStorage.getItem('engine_api_token') || '')

  const handleSave = () => {
    localStorage.setItem('engine_api_url', apiUrl)
    localStorage.setItem('engine_api_token', apiToken)
    
    // Set mode to API
    localStorage.setItem('dashboard_mode', 'api')
    
    // Reload to apply new settings
    window.location.reload()
  }

  const handleReset = () => {
    localStorage.removeItem('engine_api_url')
    localStorage.removeItem('engine_api_token')
    localStorage.removeItem('dashboard_mode')
    window.location.reload()
  }
  
  const handleSwitchToDemo = () => {
    localStorage.removeItem('dashboard_mode')
    window.location.reload()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="API Configuration"
      footer={
        <>
          <Button variant="secondary" onClick={handleSwitchToDemo}>
            Switch to Demo
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset All
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save & Reload
          </Button>
        </>
      }
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Engine API URL
          </label>
          <input
            id="apiUrl"
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://your-azure-ip:8000"
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
          <p className="mt-1 text-xs text-gray-500">
            Example: http://20.123.45.67:8000
          </p>
        </div>

        <div>
          <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700 mb-1">
            API Token
          </label>
          <input
            id="apiToken"
            type="password"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            placeholder="your-api-token"
            className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          />
          <p className="mt-1 text-xs text-gray-500">
            Optional - leave empty if no authentication required
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex gap-2">
            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div className="text-xs text-yellow-700">
              <strong>Note:</strong> This dashboard uses a secure server-side proxy. The API token is never exposed to the browser.
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex gap-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <div className="text-xs text-blue-700">
              <strong>Proxy Setup:</strong> The Netlify Function forwards requests to your engine API with server-side authentication.
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <div className="text-xs text-gray-700">
            <strong>Current Mode:</strong> {isApiMode() ? 'API (Live Data)' : 'Demo (Sample Data)'}
          </div>
        </div>
      </div>
    </Modal>
  )
}
