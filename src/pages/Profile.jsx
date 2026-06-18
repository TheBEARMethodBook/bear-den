import { useAuth } from '../contexts/useAuth'

const STATS = [
  { label: 'Day streak', value: '12' },
  { label: 'Reflections', value: '4' },
  { label: 'Relationships', value: '4' },
]

const SETTINGS = ['Edit Profile', 'Notifications', 'Privacy & Security', 'Help & Support']

function getInitials(user) {
  const fullName = user?.user_metadata?.full_name
  if (fullName) {
    return fullName
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }
  if (user?.email) return user.email[0].toUpperCase()
  return '?'
}

function getDisplayName(user) {
  const fullName = user?.user_metadata?.full_name
  if (fullName) return fullName
  if (user?.email) return user.email.split('@')[0]
  return 'Den Member'
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#9CA8C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export default function Profile({ onBack }) {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen w-full justify-center" style={{ backgroundColor: '#FAF6EE' }}>
      <div className="relative flex h-screen w-full max-w-[430px] flex-col">
        <header
          className="flex shrink-0 items-center gap-3 px-4 py-3"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <button type="button" onClick={onBack} aria-label="Back">
            <BackIcon />
          </button>
          <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
            Profile
          </span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6">
          <div className="flex flex-col items-center text-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold"
              style={{ backgroundColor: '#1B2A4A', color: '#C9A227' }}
            >
              {getInitials(user)}
            </div>
            <p className="mt-3 text-lg font-bold" style={{ color: '#1B2A4A' }}>
              {getDisplayName(user)}
            </p>
            <p className="text-sm" style={{ color: '#9CA8C2' }}>
              {user?.email}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-xl bg-white px-2 py-4 shadow-sm"
              >
                <span className="text-xl font-bold" style={{ color: '#C9A227' }}>
                  {stat.value}
                </span>
                <span className="mt-1 text-center text-xs font-medium" style={{ color: '#2E2E2E' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
            {SETTINGS.map((item, index) => (
              <button
                key={item}
                type="button"
                className="flex w-full items-center justify-between px-4 py-3.5 text-left"
                style={{
                  borderTop: index === 0 ? 'none' : '1px solid #F0EBE0',
                }}
              >
                <span className="text-sm font-medium" style={{ color: '#1B2A4A' }}>
                  {item}
                </span>
                <ChevronIcon />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={signOut}
            className="mt-6 w-full rounded-full border py-3 text-sm font-bold uppercase tracking-wide"
            style={{ borderColor: '#B3261E', color: '#B3261E' }}
          >
            Sign Out
          </button>
        </main>
      </div>
    </div>
  )
}
