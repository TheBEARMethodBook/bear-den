import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import PhoneFrame from '../components/PhoneFrame'

const STATUS_STYLES = {
  thriving: { color: '#3F8F5C', label: 'Thriving' },
  needs_water: { color: '#D9912E', label: 'Needs water' },
  wilting: { color: '#B3261E', label: 'Wilting' },
}

const INITIAL_RELATIONSHIPS = [
  {
    name: 'Sarah',
    tag: 'Sister',
    lastContact: '3 days since last check-in',
    status: 'thriving',
    history: [
      { date: 'Jun 15', note: 'Called to catch up. Talked for almost an hour.' },
      { date: 'Jun 2', note: 'Sent a text just to say I was thinking of her.' },
    ],
  },
  {
    name: 'Mike',
    tag: 'Old friend',
    lastContact: '12 days since last check-in',
    status: 'needs_water',
    history: [
      { date: 'Jun 6', note: 'Liked his post and left a real comment instead of an emoji.' },
    ],
  },
  {
    name: 'Dad',
    tag: 'Family',
    lastContact: '21 days since last check-in',
    status: 'wilting',
    history: [
      { date: 'May 28', note: 'Quick call on his birthday.' },
    ],
  },
  {
    name: 'Jordan',
    tag: 'Business partner',
    lastContact: '6 days since last check-in',
    status: 'needs_water',
    history: [
      { date: 'Jun 12', note: 'Grabbed coffee to talk through the project, no agenda.' },
    ],
  },
]

function StatusBadge({ status }) {
  const { color, label } = STATUS_STYLES[status]
  return (
    <span
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export default function Garden({ onNavigate }) {
  const [relationships, setRelationships] = useState(INITIAL_RELATIONSHIPS)
  const [selectedName, setSelectedName] = useState(null)

  const needsAttention = relationships.filter((r) => r.status !== 'thriving').length
  const selected = relationships.find((r) => r.name === selectedName)

  const logCheckIn = () => {
    setRelationships((prev) =>
      prev.map((person) =>
        person.name === selectedName
          ? {
              ...person,
              status: 'thriving',
              lastContact: '0 days since last check-in',
              history: [{ date: 'Today', note: 'Logged a check-in.' }, ...person.history],
            }
          : person
      )
    )
  }

  if (selected) {
    return (
      <PhoneFrame>
        <header
          className="flex shrink-0 items-center gap-3 px-4 py-3"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <button type="button" onClick={() => setSelectedName(null)} aria-label="Back">
            <BackIcon />
          </button>
          <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
            {selected.name}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                {selected.tag}
              </p>
              <p className="mt-1 text-sm" style={{ color: '#2E2E2E' }}>
                {selected.lastContact}
              </p>
            </div>
            <StatusBadge status={selected.status} />
          </div>

          <button
            type="button"
            onClick={logCheckIn}
            className="mt-4 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            Log a Check-In
          </button>

          <h2 className="mt-7 text-base font-bold" style={{ color: '#1B2A4A' }}>
            History
          </h2>

          <div className="mt-3 flex flex-col gap-3">
            {selected.history.map((entry, index) => (
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

        <BottomNav activeTab="garden" onChange={onNavigate} />
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <header
        className="flex shrink-0 items-center justify-between px-4 py-3"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
          Garden
        </span>
        <span className="text-xs font-semibold" style={{ color: '#9CA8C2' }}>
          {relationships.length} relationships
        </span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        <p className="text-sm" style={{ color: '#2E2E2E' }}>
          Relationships are like plants. A little attention, often, keeps them alive.
        </p>

        {needsAttention > 0 && (
          <div
            className="mt-4 rounded-xl p-4"
            style={{ backgroundColor: '#1B2A4A' }}
          >
            <p className="text-sm font-medium text-white">
              {needsAttention} relationship{needsAttention === 1 ? '' : 's'} could use a small act of care today.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {relationships.map((person) => (
            <button
              key={person.name}
              type="button"
              onClick={() => setSelectedName(person.name)}
              className="rounded-xl bg-white p-4 text-left shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold" style={{ color: '#1B2A4A' }}>
                    {person.name}
                  </p>
                  <p className="text-xs" style={{ color: '#9CA8C2' }}>
                    {person.tag}
                  </p>
                </div>
                <StatusBadge status={person.status} />
              </div>
              <p className="mt-3 text-sm" style={{ color: '#2E2E2E' }}>
                {person.lastContact}
              </p>
            </button>
          ))}
        </div>
      </main>

      <BottomNav activeTab="garden" onChange={onNavigate} />
    </PhoneFrame>
  )
}
