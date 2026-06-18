import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import PhoneFrame from '../components/PhoneFrame'

const FILTERS = ['All', 'Building', 'Engaging', 'Strong', 'Restore']

const STAGE_DOT = {
  Building: '#D9912E',
  Engaging: '#3F8F5C',
  Strong: '#3F8F5C',
  Restore: '#B3261E',
}

const STAGE_NEXT = {
  Restore: 'Building',
  Building: 'Engaging',
  Engaging: 'Strong',
  Strong: 'Strong',
}

const INITIAL_PEOPLE = [
  {
    name: 'Sarah Chen',
    relationship: 'Sister',
    lastContacted: '2 days ago',
    stage: 'Strong',
    dot: '#3F8F5C',
    history: [
      { date: 'Jun 16', note: 'Grabbed coffee and talked for an hour.' },
      { date: 'May 30', note: 'Called on her birthday.' },
    ],
  },
  {
    name: 'Marcus Webb',
    relationship: 'College friend',
    lastContacted: '3 weeks ago',
    stage: 'Building',
    dot: '#D9912E',
    history: [
      { date: 'May 28', note: 'Texted to see how the new job was going.' },
    ],
  },
  {
    name: 'James Patel',
    relationship: 'Mentor',
    lastContacted: '2 months ago',
    stage: 'Restore',
    dot: '#B3261E',
    history: [
      { date: 'Apr 14', note: 'Sent a thank-you note after his advice helped a lot.' },
    ],
  },
]

const INITIAL_BENCH = [
  'Diane Brooks',
  'Tom Alvarez',
  'Priya Desai',
  'Connor Wells',
  'Anita Brooks',
]

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

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

function AddPerson({ onBack, onSave }) {
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [stage, setStage] = useState('Building')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    onSave({
      name: trimmedName,
      relationship: relationship.trim() || 'Contact',
      lastContacted: 'Just now',
      stage,
      dot: STAGE_DOT[stage],
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
          Add Person
        </span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Their name"
              className="rounded-lg border px-4 py-2 text-base outline-none focus:ring-2"
              style={{ borderColor: '#1B2A4A', color: '#2E2E2E' }}
              autoFocus
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              Relationship
            </span>
            <input
              type="text"
              value={relationship}
              onChange={(event) => setRelationship(event.target.value)}
              placeholder="e.g. Sister, Mentor, Old friend"
              className="rounded-lg border px-4 py-2 text-base outline-none focus:ring-2"
              style={{ borderColor: '#1B2A4A', color: '#2E2E2E' }}
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
            disabled={!name.trim()}
            className="mt-2 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-60"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            Add to Vault
          </button>
        </form>
      </main>
    </PhoneFrame>
  )
}

function PersonDetail({ person, onBack, onLogInteraction }) {
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
          {person.name}
        </span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              {person.relationship}
            </p>
            <p className="mt-1 text-sm" style={{ color: '#2E2E2E' }}>
              {person.lastContacted}
            </p>
          </div>
          <span
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${person.dot}1A`, color: person.dot }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: person.dot }} />
            {person.stage}
          </span>
        </div>

        <button
          type="button"
          onClick={onLogInteraction}
          className="mt-4 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
          style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
        >
          Log Interaction
        </button>

        <h2 className="mt-7 text-base font-bold" style={{ color: '#1B2A4A' }}>
          History
        </h2>

        <div className="mt-3 flex flex-col gap-3">
          {person.history.length === 0 && (
            <p className="text-sm" style={{ color: '#9CA8C2' }}>
              No history yet.
            </p>
          )}
          {person.history.map((entry, index) => (
            <div
              key={`${entry.date}-${index}`}
              className="rounded-xl border-l-4 bg-white p-4 shadow-sm"
              style={{ borderColor: '#C9A227' }}
            >
              <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                {entry.date}
              </span>
              <p className="mt-1 text-sm leading-snug" style={{ color: '#2E2E2E' }}>
                {entry.note}
              </p>
            </div>
          ))}
        </div>
      </main>
    </PhoneFrame>
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
  const [people, setPeople] = useState(INITIAL_PEOPLE)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [isAdding, setIsAdding] = useState(false)
  const [selectedName, setSelectedName] = useState(null)
  const [bench, setBench] = useState(INITIAL_BENCH)
  const [isBenchOpen, setIsBenchOpen] = useState(false)
  const [sortingName, setSortingName] = useState(null)

  const filteredPeople = people.filter((person) => {
    const matchesFilter = activeFilter === 'All' || person.stage === activeFilter
    const matchesQuery = person.name.toLowerCase().includes(query.trim().toLowerCase())
    return matchesFilter && matchesQuery
  })

  const selectedPerson = people.find((person) => person.name === selectedName)

  if (isAdding) {
    return (
      <AddPerson
        onBack={() => setIsAdding(false)}
        onSave={(person) => {
          setPeople((prev) => [{ ...person, history: [] }, ...prev])
          setIsAdding(false)
        }}
      />
    )
  }

  if (selectedPerson) {
    return (
      <PersonDetail
        person={selectedPerson}
        onBack={() => setSelectedName(null)}
        onLogInteraction={() => {
          setPeople((prev) =>
            prev.map((person) => {
              if (person.name !== selectedName) return person
              const nextStage = STAGE_NEXT[person.stage]
              return {
                ...person,
                stage: nextStage,
                dot: STAGE_DOT[nextStage],
                lastContacted: 'Just now',
                history: [{ date: 'Today', note: 'Logged an interaction.' }, ...person.history],
              }
            })
          )
        }}
      />
    )
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
          onClick={() => setIsAdding(true)}
          className="rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-md"
          style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
        >
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
          {filteredPeople.map((person) => (
            <button
              key={person.name}
              type="button"
              onClick={() => setSelectedName(person.name)}
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

          {filteredPeople.length === 0 && (
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
    </PhoneFrame>
  )
}
