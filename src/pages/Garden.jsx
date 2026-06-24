import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import BottomNav from '../components/BottomNav'
import PhoneFrame from '../components/PhoneFrame'
import UpgradeBanner from '../components/UpgradeBanner'
import { fetchGardenPeople } from '../lib/people'
import { upgradeToPro, useProAccess } from '../lib/subscriptionStatus'

const THRIVING_MAX_DAYS = 14
const NEEDS_WATER_MAX_DAYS = 30

const HEALTH_TIERS = {
  wilting: { label: 'Wilting', color: '#C75146', rank: 0 },
  needsWater: { label: 'Needs Water', color: '#D98E32', rank: 1 },
  thriving: { label: 'Thriving', color: '#2E7D5B', rank: 2 },
}

function daysSinceContact(value) {
  if (!value) return null
  return Math.floor((Date.now() - new Date(value).getTime()) / 86400000)
}

function getHealthTierKey(days) {
  if (days === null) return 'wilting'
  if (days <= THRIVING_MAX_DAYS) return 'thriving'
  if (days <= NEEDS_WATER_MAX_DAYS) return 'needsWater'
  return 'wilting'
}

function formatDaysSinceContact(days) {
  if (days === null) return 'Never contacted'
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

function FlameIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={color}>
      <path d="M12 2c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.5-2-1-2.5 2 1 3.5 3.5 3.5 6A6.5 6.5 0 0 1 12 19a6.5 6.5 0 0 1-6.5-6.5c0-4 2.5-6 3.5-8.5.5 1.5 1 2 1.5 2C10.5 5 11 3.5 12 2Z" />
    </svg>
  )
}

function FlowerIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
      <circle cx="12" cy="8" r="2.4" fill={color} />
      <circle cx="8" cy="10" r="2.4" fill={color} />
      <circle cx="16" cy="10" r="2.4" fill={color} />
      <circle cx="9.5" cy="14" r="2.4" fill={color} />
      <circle cx="14.5" cy="14" r="2.4" fill={color} />
      <circle cx="12" cy="11.5" r="1.8" fill="#FAF6EE" />
      <path d="M12 16v5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function PlantIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V10" />
      <path d="M12 12c0-4-3-5-6-5 0 4 2 6 6 5Z" fill={color} stroke="none" />
      <path d="M12 9c0-3.5 2.5-4.5 5-4.5 0 3.5-1.5 5.5-5 4.5Z" fill={color} stroke="none" />
    </svg>
  )
}

function SeedlingIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20v-7" />
      <path d="M12 13c0-3 -2-4 -4.5-4 0 3 1.5 4.5 4.5 4Z" fill={color} stroke="none" />
      <path d="M12 13c0-2.5 1.5-3.5 3.5-3.5 0 2.5 -1.2 3.7 -3.5 3.5Z" fill={color} stroke="none" />
    </svg>
  )
}

function HealthIcon({ tierKey, color }) {
  if (tierKey === 'thriving') return <FlowerIcon color={color} />
  if (tierKey === 'needsWater') return <PlantIcon color={color} />
  return <SeedlingIcon color={color} />
}

export default function Garden({ onNavigate }) {
  const { user } = useAuth()
  const [people, setPeople] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false)
  const proAccess = useProAccess(user)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    fetchGardenPeople(user.id)
      .then((rows) => {
        if (!cancelled) {
          setPeople(rows)
          setLoadError('')
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Could not load your garden.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const gardenEntries = people
    .map((person) => {
      const days = daysSinceContact(person.lastContactedAt)
      return { person, days, tierKey: getHealthTierKey(days) }
    })
    .sort((a, b) => {
      const rankDiff = HEALTH_TIERS[a.tierKey].rank - HEALTH_TIERS[b.tierKey].rank
      if (rankDiff !== 0) return rankDiff
      const aDays = a.days === null ? Infinity : a.days
      const bDays = b.days === null ? Infinity : b.days
      return bDays - aDays
    })

  const tierCounts = gardenEntries.reduce(
    (counts, entry) => ({ ...counts, [entry.tierKey]: counts[entry.tierKey] + 1 }),
    { thriving: 0, needsWater: 0, wilting: 0 }
  )

  const mostWiltingEntry = gardenEntries[0]

  const handleWaterTap = () => {
    if (proAccess.needsProAccess) {
      setShowUpgradeBanner(true)
      return
    }
    if (mostWiltingEntry) {
      onNavigate('logInteraction', mostWiltingEntry.person)
    }
  }

  const handleUpgrade = async () => {
    try {
      await upgradeToPro(user.id)
      proAccess.markAsPro()
    } catch {
      return
    }
    setShowUpgradeBanner(false)
  }

  return (
    <PhoneFrame>
      <header
        className="flex shrink-0 items-center justify-between px-4 py-3"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
          Your Garden
        </span>
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{ backgroundColor: '#C9A227' }}
        >
          <FlameIcon color="#1B2A4A" />
          <span className="text-xs font-bold" style={{ color: '#1B2A4A' }}>
            12 days
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        {isLoading && (
          <p className="py-6 text-center text-sm" style={{ color: '#9CA8C2' }}>
            Loading your garden…
          </p>
        )}

        {!isLoading && loadError && (
          <p className="py-6 text-center text-sm" style={{ color: '#B3261E' }}>
            {loadError}
          </p>
        )}

        {!isLoading && !loadError && gardenEntries.length === 0 && (
          <p className="py-6 text-center text-sm leading-relaxed" style={{ color: '#9CA8C2' }}>
            Add people to your Vault and watch your garden grow.
          </p>
        )}

        {!isLoading && !loadError && gardenEntries.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center rounded-xl bg-white px-2 py-4 shadow-sm">
                <span className="text-xl font-bold" style={{ color: HEALTH_TIERS.thriving.color }}>
                  {tierCounts.thriving}
                </span>
                <span className="mt-1 text-center text-xs font-medium" style={{ color: '#2E2E2E' }}>
                  Thriving
                </span>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-white px-2 py-4 shadow-sm">
                <span className="text-xl font-bold" style={{ color: HEALTH_TIERS.needsWater.color }}>
                  {tierCounts.needsWater}
                </span>
                <span className="mt-1 text-center text-xs font-medium" style={{ color: '#2E2E2E' }}>
                  Needs Water
                </span>
              </div>
              <div className="flex flex-col items-center rounded-xl bg-white px-2 py-4 shadow-sm">
                <span className="text-xl font-bold" style={{ color: HEALTH_TIERS.wilting.color }}>
                  {tierCounts.wilting}
                </span>
                <span className="mt-1 text-center text-xs font-medium" style={{ color: '#2E2E2E' }}>
                  Wilting
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {gardenEntries.map(({ person, days, tierKey }) => {
                const tier = HEALTH_TIERS[tierKey]
                return (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => onNavigate('personProfile', person)}
                    className="flex items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm"
                  >
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: '#FAF6EE' }}
                    >
                      <HealthIcon tierKey={tierKey} color={tier.color} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                        {person.name}
                      </p>
                      <p className="text-xs" style={{ color: '#9CA8C2' }}>
                        {person.relationship}
                      </p>
                      <p className="mt-1 text-xs" style={{ color: '#2E2E2E' }}>
                        {formatDaysSinceContact(days)}
                      </p>
                    </div>

                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide"
                      style={{ backgroundColor: `${tier.color}1A`, color: tier.color }}
                    >
                      {tier.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div
              className="mt-6 rounded-2xl p-5 shadow-lg"
              style={{ backgroundColor: '#1B2A4A' }}
            >
              <p className="text-sm font-medium leading-snug text-white">
                One text changes a plant's color today.
              </p>
              <div className="relative mt-4">
                <span
                  className="absolute -top-2.5 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: '#1B2A4A', color: '#C9A227', border: '1px solid #C9A227' }}
                >
                  Pro
                </span>
                <button
                  type="button"
                  onClick={handleWaterTap}
                  className="w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
                  style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
                >
                  Water it
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <BottomNav activeTab="garden" onChange={onNavigate} />

      <UpgradeBanner
        isOpen={showUpgradeBanner}
        onClose={() => setShowUpgradeBanner(false)}
        onUpgrade={handleUpgrade}
        message="Taking action from your Garden is a Pro feature. Upgrade to tend every relationship directly from here."
      />
    </PhoneFrame>
  )
}
