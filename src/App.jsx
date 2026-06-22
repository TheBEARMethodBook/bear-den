import { useState } from 'react'
import { useAuth } from './contexts/useAuth'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Today from './pages/Today'
import Vault from './pages/Vault'
import AddPerson from './pages/AddPerson'
import Garden from './pages/Garden'
import Wingman from './pages/Wingman'
import Profile from './pages/Profile'

function App() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('today')
  const [hasOnboarded, setHasOnboarded] = useState(false)

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

  const onboardingKey = `bearden_onboarded_${user.id}`

  if (!hasOnboarded && localStorage.getItem(onboardingKey) !== 'true') {
    return (
      <Onboarding
        onComplete={() => {
          localStorage.setItem(onboardingKey, 'true')
          setHasOnboarded(true)
        }}
      />
    )
  }

  if (activeTab === 'profile') {
    return <Profile onBack={() => setActiveTab('today')} />
  }

  if (activeTab === 'vault') {
    return <Vault onNavigate={setActiveTab} />
  }

  if (activeTab === 'addPerson') {
    return <AddPerson onNavigate={setActiveTab} />
  }

  if (activeTab === 'garden') {
    return <Garden onNavigate={setActiveTab} />
  }

  if (activeTab === 'wingman') {
    return <Wingman onNavigate={setActiveTab} />
  }

  return <Today onNavigate={setActiveTab} />
}

export default App
