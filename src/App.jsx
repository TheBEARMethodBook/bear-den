import { useEffect, useState } from 'react'
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
import UpgradeBanner from './components/UpgradeBanner'
import { canShowUpgradeBanner, recordUpgradeBannerShown } from './lib/upgradeBannerFrequency'
import { isProUser, isTrialActive, upgradeToPro } from './lib/subscriptionStatus'

// Tabs that require an active Pro subscription once a user's free trial has ended.
const PRO_GATED_TABS = ['wingman']

function App() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('today')
  const [hasOnboarded, setHasOnboarded] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [subscription, setSubscription] = useState({ loaded: false, isPro: false, trialActive: true })
  const [hasSeenUpgradeScreen, setHasSeenUpgradeScreen] = useState(false)
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    Promise.all([isProUser(user.id), isTrialActive(user.id)])
      .then(([isPro, trialActive]) => {
        if (!cancelled) setSubscription({ loaded: true, isPro, trialActive })
      })
      .catch(() => {
        if (!cancelled) setSubscription({ loaded: true, isPro: false, trialActive: true })
      })

    return () => {
      cancelled = true
    }
  }, [user])

  // Dev-only escape hatch so the Pro gate can be tested without waiting out a real 30-day trial.
  // Enable from the browser console: localStorage.setItem('bearden_dev_force_trial_expired', 'true')
  const debugForceExpired = import.meta.env.DEV && localStorage.getItem('bearden_dev_force_trial_expired') === 'true'
  const needsProAccess =
    debugForceExpired || (subscription.loaded && !subscription.isPro && !subscription.trialActive)

  const handleNavigate = (tab, data) => {
    if (data) setSelectedPerson(data)

    if (PRO_GATED_TABS.includes(tab) && needsProAccess) {
      if (canShowUpgradeBanner(user.id)) {
        recordUpgradeBannerShown(user.id)
        setShowUpgradeBanner(true)
      } else {
        setActiveTab(tab)
      }
      return
    }

    setActiveTab(tab)
  }

  const handleBannerUpgrade = async () => {
    try {
      await upgradeToPro(user.id)
      setSubscription((prev) => ({ ...prev, isPro: true }))
    } catch {
      // Keep the banner open on failure so the user can retry.
      return
    }
    setShowUpgradeBanner(false)
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
      return <Profile onBack={() => setActiveTab('today')} />
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
      return <Wingman onNavigate={handleNavigate} />
    }

    return <Today onNavigate={handleNavigate} />
  }

  return (
    <>
      {renderActiveScreen()}
      <UpgradeBanner
        isOpen={showUpgradeBanner}
        onClose={() => setShowUpgradeBanner(false)}
        onUpgrade={handleBannerUpgrade}
      />
    </>
  )
}

export default App
