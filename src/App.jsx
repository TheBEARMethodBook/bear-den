import { useState } from 'react'
import { useAuth } from './contexts/useAuth'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Upgrade from './pages/Upgrade'
import Today from './pages/Today'
import Vault from './pages/Vault'
import AddPerson from './pages/AddPerson'
import PersonProfile from './pages/PersonProfile'
import LogInteraction from './pages/LogInteraction'
import Garden from './pages/Garden'
import Wingman from './pages/Wingman'
import Profile from './pages/Profile'
import TheWork from './pages/TheWork'
import HowToUse from './pages/HowToUse'
import { useProAccess } from './lib/subscriptionStatus'

function App() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('today')
  const [hasOnboarded, setHasOnboarded] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [hasSeenUpgradeScreen, setHasSeenUpgradeScreen] = useState(false)
  const proAccess = useProAccess(user)
  const needsProAccess = proAccess.needsProAccess

  const handleNavigate = (tab, data) => {
    setSelectedPerson(data || null)
    setActiveTab(tab)
  }

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
    const completeOnboarding = () => {
      localStorage.setItem(onboardingKey, 'true')
      setHasOnboarded(true)
    }

    return (
      <Onboarding
        onComplete={completeOnboarding}
        onAddPerson={() => {
          completeOnboarding()
          setActiveTab('addPerson')
        }}
      />
    )
  }

  const upgradeScreenKey = `bearden_upgrade_seen_${user.id}`

  if (!hasSeenUpgradeScreen && needsProAccess && localStorage.getItem(upgradeScreenKey) !== 'true') {
    const dismissUpgradeScreen = () => {
      localStorage.setItem(upgradeScreenKey, 'true')
      setHasSeenUpgradeScreen(true)
    }

    return (
      <Upgrade
        user={user}
        onContinue={() => {
          dismissUpgradeScreen()
        }}
      />
    )
  }

  const renderActiveScreen = () => {
    if (activeTab === 'profile') {
      return <Profile onBack={() => setActiveTab('today')} onNavigate={handleNavigate} />
    }

    if (activeTab === 'theWork') {
      return <TheWork onNavigate={handleNavigate} user={user} />
    }

    if (activeTab === 'howToUse') {
      return <HowToUse onNavigate={handleNavigate} />
    }

    if (activeTab === 'vault') {
      return <Vault onNavigate={handleNavigate} />
    }

    if (activeTab === 'personProfile' && selectedPerson) {
      return <PersonProfile person={selectedPerson} onNavigate={handleNavigate} />
    }

    if (activeTab === 'logInteraction' && selectedPerson) {
      return <LogInteraction person={selectedPerson} onNavigate={handleNavigate} />
    }

    if (activeTab === 'addPerson') {
      return <AddPerson onNavigate={handleNavigate} />
    }

    if (activeTab === 'garden') {
      return <Garden onNavigate={handleNavigate} />
    }

    if (activeTab === 'wingman') {
      return <Wingman onNavigate={handleNavigate} preloadedPerson={selectedPerson} />
    }

    return <Today onNavigate={handleNavigate} />
  }

  return renderActiveScreen()
}

export default App
