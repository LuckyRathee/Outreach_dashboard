import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'

export default function Landing() {
  const navigate = useNavigate()
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('engine_api_url') || '')
  const [apiToken, setApiToken] = useState(localStorage.getItem('engine_api_token') || '')

  const handleConnect = () => {
    // Save to localStorage
    localStorage.setItem('engine_api_url', apiUrl)
    localStorage.setItem('engine_api_token', apiToken)
    
    // Update environment for this session
    if (apiUrl) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
        {/* Logo */}
        <div className="text-center">
          <img 
            src="/digital-patron-logo.png" 
            alt="Digital Patron" 
            className="h-24 w-auto mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-gray-900">Welcome to Digital Patron</h2>
          <p className="mt-2 text-sm text-gray-600">
            B2B Tech Lead Outreach Dashboard
          </p>
        </div>

        {/* Connection Form */}
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
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700 mb-1">
              API Token (Optional)
            </label>
            <input
              id="apiToken"
              type="password"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="your-api-token"
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <Button onClick={handleConnect} className="w-full py-3">
            Connect to Engine
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>Digital Patron - Chandigarh Tri-City</p>
          <p className="mt-1">B2B Tech Leads (30-140 employees)</p>
        </div>
      </div>
    </div>
  )
}
