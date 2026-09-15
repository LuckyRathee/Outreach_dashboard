import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Leads from './pages/Leads'
import LeadDetail from './pages/LeadDetail'
import WhatsAppQueue from './pages/WhatsAppQueue'
import FollowUps from './pages/FollowUps'
import Reports from './pages/Reports'

function App() {
  const apiUrl = localStorage.getItem('engine_api_url')
  
  // If no API URL configured, show landing page
  if (!apiUrl) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/:id" element={<LeadDetail />} />
        <Route path="/whatsapp" element={<WhatsAppQueue />} />
        <Route path="/followups" element={<FollowUps />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
