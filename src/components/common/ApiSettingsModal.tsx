import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'

interface ApiSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ApiSettingsModal({ isOpen, onClose }: ApiSettingsModalProps) {
  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem('engine_api_url') || 'https://hermes-vm.tail5e4a2f.ts.net'
  )
  const [apiToken, setApiToken] = useState(
    localStorage.getItem('engine_api_token') || ''
  )

  const handleSave = () => {
    localStorage.setItem('engine_api_url', apiUrl)
    localStorage.setItem('engine_api_token', apiToken)
    
    // Reload to apply new settings
    window.location.reload()
  }

  const handleReset = () => {
    localStorage.removeItem('engine_api_url')
    localStorage.removeItem('engine_api_token')
    window.location.reload()
  }

  const handleTestConnection = async () => {
    try {
      const response = await fetch(`${apiUrl}/health`)
      const data = await response.json()
      
      if (data.status === 'ok') {
        alert('✅ Connection successful! API is reachable.')
      } else {
        alert('⚠️ API responded but health check failed.')
      }
    } catch (error) {
      alert('❌ Connection failed. Please check the URL.')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="API Configuration"
      footer={
        <>
          <Button variant="secondary" onClick={handleTestConnection}>
            Test Connection
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save & Reload
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Engine API URL
          </label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://hermes-vm.tail5e4a2f.ts.net"
          />
          <p className="mt-1 text-xs text-gray-500">
            Your Engine API base URL (Tailscale Funnel or public URL)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Token
          </label>
          <input
            type="password"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your-api-token"
          />
          <p className="mt-1 text-xs text-gray-500">
            Bearer token for API authentication
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="text-xs text-blue-700">
            <strong>Current Configuration:</strong>
            <div className="mt-1">
              URL: {apiUrl || 'Not set'}
            </div>
            <div>
              Token: {apiToken ? '••••••••' + apiToken.slice(-4) : 'Not set'}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex gap-2">
            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div className="text-xs text-yellow-700">
              <strong>Note:</strong> The API token is stored in localStorage for local development. In production, use the Netlify proxy for secure server-side authentication.
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
