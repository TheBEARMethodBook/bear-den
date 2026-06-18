import BottomNav from '../components/BottomNav'
import PhoneFrame from '../components/PhoneFrame'

const STATUS_STYLES = {
  thriving: { color: '#3F8F5C', label: 'Thriving' },
  needs_water: { color: '#D9912E', label: 'Needs water' },
  wilting: { color: '#B3261E', label: 'Wilting' },
}

const RELATIONSHIPS = [
  {
    name: 'Sarah',
    tag: 'Sister',
    lastContact: '3 days since last check-in',
    status: 'thriving',
  },
  {
    name: 'Mike',
    tag: 'Old friend',
    lastContact: '12 days since last check-in',
    status: 'needs_water',
  },
  {
    name: 'Dad',
    tag: 'Family',
    lastContact: '21 days since last check-in',
    status: 'wilting',
  },
  {
    name: 'Jordan',
    tag: 'Business partner',
    lastContact: '6 days since last check-in',
    status: 'needs_water',
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

export default function Garden({ onNavigate }) {
  const needsAttention = RELATIONSHIPS.filter((r) => r.status !== 'thriving').length

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
          {RELATIONSHIPS.length} relationships
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
          {RELATIONSHIPS.map((person) => (
            <div
              key={person.name}
              className="rounded-xl bg-white p-4 shadow-sm"
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
            </div>
          ))}
        </div>
      </main>

      <BottomNav activeTab="garden" onChange={onNavigate} />
    </PhoneFrame>
  )
}
