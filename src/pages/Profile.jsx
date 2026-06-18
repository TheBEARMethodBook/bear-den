import { useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import PhoneFrame from '../components/PhoneFrame'

const STATS = [
  { label: 'Day streak', value: '12' },
  { label: 'Reflections', value: '4' },
  { label: 'Relationships', value: '4' },
]

const SETTINGS = ['Edit Profile', 'Notifications', 'Privacy & Security', 'Help & Support']

const NOTIFICATION_TYPES = [
  {
    key: 'dailyAction',
    label: 'Daily BEAR action',
    description: "A reminder when today's action hasn't been marked done yet.",
    default: true,
  },
  {
    key: 'gardenNudges',
    label: 'Garden check-ins',
    description: 'Nudges when a relationship needs a little water.',
    default: true,
  },
  {
    key: 'vaultReminders',
    label: 'Vault streak reminders',
    description: "A heads up before today's reflection streak resets.",
    default: false,
  },
  {
    key: 'wingmanReplies',
    label: 'Wingman replies',
    description: 'Let your Wingman know to follow up on open conversations.',
    default: true,
  },
]

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

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={on}
      className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
      style={{ backgroundColor: on ? '#C9A227' : '#D9D2C2' }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
        style={{ transform: on ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

function SettingsHeader({ title, onBack }) {
  return (
    <header
      className="flex shrink-0 items-center gap-3 px-4 py-3"
      style={{ backgroundColor: '#1B2A4A' }}
    >
      <button type="button" onClick={onBack} aria-label="Back">
        <BackIcon />
      </button>
      <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
        {title}
      </span>
    </header>
  )
}

function EditProfile({ onBack }) {
  const { user, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await updateProfile({ data: { full_name: fullName.trim() } })
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Could not save your changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PhoneFrame>
      <SettingsHeader title="Edit Profile" onBack={onBack} />

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              Full name
            </span>
            <input
              type="text"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value)
                setSaved(false)
              }}
              placeholder="Your name"
              className="rounded-lg border px-4 py-2 text-base outline-none focus:ring-2"
              style={{ borderColor: '#1B2A4A', color: '#2E2E2E' }}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              Email
            </span>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="rounded-lg border px-4 py-2 text-base opacity-60"
              style={{ borderColor: '#1B2A4A', color: '#2E2E2E' }}
            />
          </label>

          {error && (
            <p className="rounded-lg px-3 py-2 text-sm font-medium" style={{ backgroundColor: '#FBEAEA', color: '#B3261E' }}>
              {error}
            </p>
          )}

          {saved && (
            <p className="rounded-lg px-3 py-2 text-sm font-medium" style={{ backgroundColor: '#FCF3D9', color: '#1B2A4A' }}>
              Saved.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-60"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </main>
    </PhoneFrame>
  )
}

function Notifications({ onBack }) {
  const [prefs, setPrefs] = useState(
    Object.fromEntries(NOTIFICATION_TYPES.map((type) => [type.key, type.default]))
  )

  const toggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <PhoneFrame>
      <SettingsHeader title="Notifications" onBack={onBack} />

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <p className="text-sm" style={{ color: '#2E2E2E' }}>
          Choose what The BEAR Den should check in with you about.
        </p>

        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
          {NOTIFICATION_TYPES.map((type, index) => (
            <div
              key={type.key}
              className="flex items-start gap-3 px-4 py-3.5"
              style={{ borderTop: index === 0 ? 'none' : '1px solid #F0EBE0' }}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                  {type.label}
                </p>
                <p className="mt-0.5 text-xs leading-snug" style={{ color: '#9CA8C2' }}>
                  {type.description}
                </p>
              </div>
              <Toggle on={prefs[type.key]} onChange={() => toggle(type.key)} />
            </div>
          ))}
        </div>
      </main>
    </PhoneFrame>
  )
}

export default function Profile({ onBack }) {
  const { user, signOut } = useAuth()
  const [screen, setScreen] = useState('list')

  if (screen === 'editProfile') {
    return <EditProfile onBack={() => setScreen('list')} />
  }

  if (screen === 'notifications') {
    return <Notifications onBack={() => setScreen('list')} />
  }

  return (
    <PhoneFrame>
      <SettingsHeader title="Profile" onBack={onBack} />

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
              onClick={() => {
                if (item === 'Edit Profile') setScreen('editProfile')
                if (item === 'Notifications') setScreen('notifications')
              }}
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
    </PhoneFrame>
  )
}
