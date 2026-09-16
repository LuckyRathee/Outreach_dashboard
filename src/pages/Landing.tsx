import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

export default function Landing() {
  const navigate = useNavigate()
  const [apiUrl, setApiUrl] = useState('http://localhost:8000')
  const [apiToken, setApiToken] = useState('')

  const handleConnect = () => {
    localStorage.setItem('engine_api_url', apiUrl)
    localStorage.setItem('engine_api_token', apiToken)
    localStorage.setItem('dashboard_mode', 'api')
    
    navigate('/')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <img 
            src="/digital-patron-logo.png" 
            alt="Digital Patron" 
            className="h-16 w-16 mx-auto mb-4 rounded-lg"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Digital Patron</h1>
          <p className="text-gray-600">B2B Lead Outreach Dashboard</p>
        </div>

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
              placeholder="http://localhost:8000"
            />
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
          </div>

          <Button
            onClick={handleConnect}
            className="w-full"
            disabled={!apiUrl}
          >
            Connect to API
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">Architecture:</p>
            <div className="text-xs space-y-1">
              <p>Dashboard → Netlify Proxy → Engine API</p>
              <p className="text-gray-400">Token never exposed to browser</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
