import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import PhoneFrame from '../components/PhoneFrame'
import { getReflectionCount } from '../lib/reflections'

const STATS = [
  { label: 'Day streak', value: '12' },
  { label: 'Reflections', value: '4' },
  { label: 'Relationships', value: '4' },
]

const SETTINGS = [
  { key: 'editProfile', label: 'Edit Profile', description: 'Update your name and details' },
  { key: 'notifications', label: 'Notifications', description: 'Choose what The BEAR Den tells you' },
  { key: 'privacySecurity', label: 'Privacy & Security', description: 'Password and account info' },
  { key: 'helpSupport', label: 'Help & Support', description: 'FAQs and answers' },
]

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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C9A227" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
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

function formatJoinDate(isoString) {
  if (!isoString) return 'Unknown'
  return new Date(isoString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function PrivacySecurity({ onBack }) {
  const { user, updateProfile } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaved(false)

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSaving(true)
    try {
      await updateProfile({ password: newPassword })
      setSaved(true)
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message || 'Could not update your password. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PhoneFrame>
      <SettingsHeader title="Privacy & Security" onBack={onBack} />

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
            Signed in as
          </p>
          <p className="mt-1 text-sm" style={{ color: '#2E2E2E' }}>
            {user?.email}
          </p>
          <p className="mt-2 text-xs" style={{ color: '#9CA8C2' }}>
            Member since {formatJoinDate(user?.created_at)}
          </p>
        </div>

        <h2 className="mt-6 text-base font-bold" style={{ color: '#1B2A4A' }}>
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              New password
            </span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="••••••••"
              className="rounded-lg border px-4 py-2 text-base outline-none focus:ring-2"
              style={{ borderColor: '#1B2A4A', color: '#2E2E2E' }}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              Confirm new password
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              className="rounded-lg border px-4 py-2 text-base outline-none focus:ring-2"
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
              Password updated.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-60"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            {saving ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </main>
    </PhoneFrame>
  )
}

const FAQ_ITEMS = [
  {
    question: 'How does the streak work?',
    answer: 'Your streak counts consecutive days you mark the daily BEAR action done. Miss a day and it resets to zero.',
  },
  {
    question: 'What happens to my Vault entries?',
    answer: "They're yours, kept in order from newest to oldest. There's no limit to how many you can write.",
  },
  {
    question: 'Can I remove someone from my Garden?',
    answer: "Not yet from the app directly — reach out and we'll take care of it while that feature is being built.",
  },
  {
    question: 'Is Wingman a real person?',
    answer: "No, Wingman is an AI coach built into the Den. It's there any time you need to think something through.",
  },
  {
    question: 'How do I change my email address?',
    answer: "Email changes aren't supported yet from the app. For now, your email stays tied to the account you signed up with.",
  },
]

function ChevronDownIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="#9CA8C2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function HelpSupport({ onBack }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <PhoneFrame>
      <SettingsHeader title="Help & Support" onBack={onBack} />

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <p className="text-sm" style={{ color: '#2E2E2E' }}>
          Answers to the questions we hear most.
        </p>

        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div key={item.question} style={{ borderTop: index === 0 ? 'none' : '1px solid #F0EBE0' }}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                >
                  <span className="text-sm font-medium" style={{ color: '#1B2A4A' }}>
                    {item.question}
                  </span>
                  <ChevronDownIcon open={isOpen} />
                </button>
                {isOpen && (
                  <p className="px-4 pb-4 text-sm leading-snug" style={{ color: '#2E2E2E' }}>
                    {item.answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </PhoneFrame>
  )
}

export default function Profile({ onBack }) {
  const { user, signOut } = useAuth()
  const [screen, setScreen] = useState('list')
  const [reflectionCount, setReflectionCount] = useState(0)

  useEffect(() => {
    if (!user) return
    getReflectionCount(user.id).then(setReflectionCount).catch(() => {})
  }, [user])

  if (screen === 'editProfile') {
    return <EditProfile onBack={() => setScreen('list')} />
  }

  if (screen === 'notifications') {
    return <Notifications onBack={() => setScreen('list')} />
  }

  if (screen === 'privacySecurity') {
    return <PrivacySecurity onBack={() => setScreen('list')} />
  }

  if (screen === 'helpSupport') {
    return <HelpSupport onBack={() => setScreen('list')} />
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
                {stat.label === 'Reflections' ? reflectionCount : stat.value}
              </span>
              <span className="mt-1 text-center text-xs font-medium" style={{ color: '#2E2E2E' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {SETTINGS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setScreen(item.key)}
              className="flex items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs leading-snug" style={{ color: '#9CA8C2' }}>
                  {item.description}
                </p>
              </div>
              <ArrowIcon />
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

        <div className="border-t border-gray-200 mt-6 mb-6" />

        <div className="text-center px-4 pb-4">
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#C9A227' }}>
            ABOUT THIS APP
          </p>
          <p className="text-base font-bold mt-1" style={{ color: '#1B2A4A' }}>
            The BEAR Method
          </p>
          <p className="text-sm mt-1" style={{ color: '#9CA8C2' }}>
            Be IMPOSSIBLE to Replace
          </p>
          <p className="text-xs mt-2 leading-relaxed" style={{ color: '#9CA8C2' }}>
            This app is the accountability companion to the book by Michael Knight. If someone shared this app with you, the book is where it all began.
          </p>
          <a
            href="https://www.thebearmethod.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full px-4 py-2 text-sm font-bold"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            Get The Book
          </a>
        </div>

      </main>
    </PhoneFrame>
  )
}
