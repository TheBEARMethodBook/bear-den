import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import BottomNav from '../components/BottomNav'
import PhoneFrame from '../components/PhoneFrame'
import UpgradeBanner from '../components/UpgradeBanner'
import { STAGE_DOT, fetchPeople, getInitials } from '../lib/people'
import { upgradeToPro, useProAccess } from '../lib/subscriptionStatus'

const VAULT_FREE_LIMIT = 15

const FILTERS = ['All', 'Building', 'Engaging', 'Strong', 'Restore']

const INITIAL_BENCH = [
  'Diane Brooks',
  'Tom Alvarez',
  'Priya Desai',
  'Connor Wells',
  'Anita Brooks',
]

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#9CA8C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function BenchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#C9A227" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16h18M5 16v-3h14v3M9 13V8h6v5" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

function SortContact({ name, onBack, onSorted }) {
  const [relationship, setRelationship] = useState('')
  const [stage, setStage] = useState('Building')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSorted({
      name,
      relationship: relationship.trim() || 'Contact',
      lastContacted: 'Just now',
      stage,
      dot: STAGE_DOT[stage],
      history: [],
    })
  }

  return (
    <PhoneFrame>
      <header
        className="flex shrink-0 items-center gap-3 px-4 py-3"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <button type="button" onClick={onBack} aria-label="Back">
          <BackIcon />
        </button>
        <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
          Sort Contact
        </span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <p className="text-base font-semibold" style={{ color: '#1B2A4A' }}>
          {name}
        </p>
        <p className="mt-1 text-sm" style={{ color: '#9CA8C2' }}>
          Imported contact
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              Relationship
            </span>
            <input
              type="text"
              value={relationship}
              onChange={(event) => setRelationship(event.target.value)}
              placeholder="e.g. Coworker, Old friend"
              className="rounded-lg border px-4 py-2 text-base outline-none focus:ring-2"
              style={{ borderColor: '#1B2A4A', color: '#2E2E2E' }}
              autoFocus
            />
          </label>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              Stage
            </span>
            <div className="flex gap-2">
              {FILTERS.filter((f) => f !== 'All').map((option) => {
                const isActive = stage === option
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStage(option)}
                    className="flex-1 rounded-full px-2 py-2 text-xs font-semibold uppercase tracking-wide"
                    style={
                      isActive
                        ? { backgroundColor: '#C9A227', color: '#1B2A4A' }
                        : { backgroundColor: '#FFFFFF', color: '#1B2A4A', border: '1px solid #1B2A4A' }
                    }
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            Add to Vault
          </button>
        </form>
      </main>
    </PhoneFrame>
  )
}

function Bench({ contacts, onBack, onSortContact }) {
  return (
    <PhoneFrame>
      <header
        className="flex shrink-0 items-center gap-3 px-4 py-3"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <button type="button" onClick={onBack} aria-label="Back">
          <BackIcon />
        </button>
        <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
          The Bench
        </span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <p className="text-sm" style={{ color: '#2E2E2E' }}>
          Contacts imported from your phone, waiting to be sorted into your Vault.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {contacts.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onSortContact(name)}
              className="flex items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{ backgroundColor: '#1B2A4A', color: '#C9A227' }}
              >
                {getInitials(name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                  {name}
                </p>
                <p className="text-xs" style={{ color: '#9CA8C2' }}>
                  Tap to sort
                </p>
              </div>
            </button>
          ))}

          {contacts.length === 0 && (
            <p className="py-6 text-center text-sm" style={{ color: '#9CA8C2' }}>
              The Bench is empty. Everyone's sorted.
            </p>
          )}
        </div>
      </main>
    </PhoneFrame>
  )
}

export default function Vault({ onNavigate }) {
  const { user } = useAuth()
  const [people, setPeople] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [bench, setBench] = useState(INITIAL_BENCH)
  const [isBenchOpen, setIsBenchOpen] = useState(false)
  const [sortingName, setSortingName] = useState(null)
  const [showVaultCapBanner, setShowVaultCapBanner] = useState(false)
  const proAccess = useProAccess(user)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    fetchPeople(user.id)
      .then((rows) => {
        if (!cancelled) setPeople(rows)
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Could not load your Vault.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const filteredPeople = people.filter((person) => {
    const matchesFilter = activeFilter === 'All' || person.stage === activeFilter
    const matchesQuery = person.name.toLowerCase().includes(query.trim().toLowerCase())
    return matchesFilter && matchesQuery
  })

  const isAddPersonLocked = people.length >= VAULT_FREE_LIMIT && proAccess.needsProAccess

  const handleAddPersonTap = () => {
    if (isAddPersonLocked) {
      setShowVaultCapBanner(true)
    } else {
      onNavigate('addPerson')
    }
  }

  const handleVaultCapUpgrade = async () => {
    try {
      await upgradeToPro(user.id)
      proAccess.markAsPro()
    } catch {
      return
    }
    setShowVaultCapBanner(false)
  }

  if (sortingName) {
    return (
      <SortContact
        name={sortingName}
        onBack={() => setSortingName(null)}
        onSorted={(person) => {
          setPeople((prev) => [person, ...prev])
          setBench((prev) => prev.filter((name) => name !== sortingName))
          setSortingName(null)
        }}
      />
    )
  }

  if (isBenchOpen) {
    return (
      <Bench
        contacts={bench}
        onBack={() => setIsBenchOpen(false)}
        onSortContact={(name) => setSortingName(name)}
      />
    )
  }

  return (
    <PhoneFrame>
      <header
        className="flex shrink-0 items-center justify-between px-4 py-3"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
          Your Vault
        </span>
        <button
          type="button"
          onClick={handleAddPersonTap}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-md"
          style={
            isAddPersonLocked
              ? { backgroundColor: '#FFFFFF', color: '#1B2A4A', border: '1px solid #1B2A4A' }
              : { backgroundColor: '#C9A227', color: '#1B2A4A' }
          }
        >
          {isAddPersonLocked && <LockIcon />}
          Add Person
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        <div
          className="flex items-center gap-2 rounded-full border px-4 py-2"
          style={{ borderColor: '#1B2A4A', backgroundColor: '#FFFFFF' }}
        >
          <SearchIcon />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your people…"
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: '#2E2E2E' }}
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide"
                style={
                  isActive
                    ? { backgroundColor: '#C9A227', color: '#1B2A4A' }
                    : { backgroundColor: '#FFFFFF', color: '#1B2A4A', border: '1px solid #1B2A4A' }
                }
              >
                {filter}
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {isLoading && (
            <p className="py-6 text-center text-sm" style={{ color: '#9CA8C2' }}>
              Loading your Vault…
            </p>
          )}

          {!isLoading && loadError && (
            <p className="py-6 text-center text-sm" style={{ color: '#B3261E' }}>
              {loadError}
            </p>
          )}

          {!isLoading &&
            !loadError &&
            filteredPeople.map((person) => (
              <button
                key={person.id ?? person.name}
                type="button"
                onClick={() => onNavigate('personProfile', person)}
                className="flex items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: '#1B2A4A', color: '#C9A227' }}
                >
                  {getInitials(person.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                    {person.name}
                  </p>
                  <p className="text-xs" style={{ color: '#9CA8C2' }}>
                    {person.relationship} · {person.lastContacted}
                  </p>
                </div>

                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: person.dot }}
                  title={person.stage}
                />
              </button>
            ))}

          {!isLoading && !loadError && filteredPeople.length === 0 && (
            <p className="py-6 text-center text-sm" style={{ color: '#9CA8C2' }}>
              No one matches that search yet.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsBenchOpen(true)}
          className="mt-6 flex w-full items-center gap-3 rounded-xl border-2 border-dashed p-4 text-left"
          style={{ borderColor: '#C9A227', backgroundColor: '#1B2A4A' }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: '#2E3F63' }}
          >
            <BenchIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">The Bench</p>
            <p className="mt-0.5 text-xs" style={{ color: '#9CA8C2' }}>
              {bench.length} imported contacts waiting to be sorted
            </p>
          </div>
        </button>
      </main>

      <BottomNav activeTab="vault" onChange={onNavigate} />

      <UpgradeBanner
        isOpen={showVaultCapBanner}
        onClose={() => setShowVaultCapBanner(false)}
        onUpgrade={handleVaultCapUpgrade}
        message="Your Vital 15 are in your Den. Ready to go deeper? Add everyone who matters with BEAR Den Pro."
      />
    </PhoneFrame>
  )
}
