import { useState } from 'react'
import { useAuth } from './contexts/useAuth'
import Auth from './pages/Auth'
import Today from './pages/Today'
import Vault from './pages/Vault'
import ComingSoon from './pages/ComingSoon'

function App() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('today')

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <p className="text-lg font-medium" style={{ color: '#FAF6EE' }}>
          Loading…
        </p>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  if (activeTab === 'vault') {
    return <Vault onNavigate={setActiveTab} />
  }

  if (activeTab === 'garden') {
    return <ComingSoon tab="garden" label="Garden" onNavigate={setActiveTab} />
  }

  if (activeTab === 'wingman') {
    return <ComingSoon tab="wingman" label="Wingman" onNavigate={setActiveTab} />
  }

  return <Today onNavigate={setActiveTab} />
}

export default App
