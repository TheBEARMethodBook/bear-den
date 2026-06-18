import { useState } from 'react'
import { useAuth } from '../contexts/useAuth'

function getGreetingName(user) {
  const fullName = user?.user_metadata?.full_name
  if (fullName) return fullName.split(' ')[0]
  if (user?.email) return user.email.split('@')[0]
  return 'there'
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function FlameIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={color}>
      <path d="M12 2c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.5-2-1-2.5 2 1 3.5 3.5 3.5 6A6.5 6.5 0 0 1 12 19a6.5 6.5 0 0 1-6.5-6.5c0-4 2.5-6 3.5-8.5.5 1.5 1 2 1.5 2C10.5 5 11 3.5 12 2Z" />
    </svg>
  )
}

function NavIcon({ name, color }) {
  const icons = {
    today: (
      <path d="M7 2v3M17 2v3M3.5 9h17M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    ),
    vault: (
      <path d="M4 7l8-4 8 4v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7Z" />
    ),
    garden: (
      <path d="M12 21c0-5 0-9 0-9m0 0c-3 0-5.5-2-5.5-5.5C9 6 12 7 12 12Zm0 0c3 0 5.5-2 5.5-5.5C15 6 12 7 12 12Zm-5 9h10" />
    ),
    wingman: (
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9c0-3.5 3-6 7-6s7 2.5 7 6" />
    ),
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  )
}

const NAV_TABS = [
  { key: 'today', label: 'Today' },
  { key: 'vault', label: 'Vault' },
  { key: 'garden', label: 'Garden' },
  { key: 'wingman', label: 'Wingman' },
]

export default function Today() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('today')
  const [actionDone, setActionDone] = useState(false)

  const name = getGreetingName(user)

  return (
    <div className="flex min-h-screen w-full justify-center" style={{ backgroundColor: '#FAF6EE' }}>
      <div className="relative flex h-screen w-full max-w-[430px] flex-col">
        <header
          className="flex shrink-0 items-center justify-between px-4 py-3"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
            The BEAR Den
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
          <h1 className="text-xl font-bold" style={{ color: '#1B2A4A' }}>
            {getGreeting()}, {name}
          </h1>

          <div
            className="mt-5 rounded-2xl p-5 shadow-lg"
            style={{ backgroundColor: '#1B2A4A' }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: '#C9A227' }}
            >
              Today's Bear Action
            </span>
            <p className="mt-3 text-base font-medium leading-snug text-white">
              Call someone you thought of recently. No agenda. Just say hello.
            </p>
            <p className="mt-2 text-sm" style={{ color: '#9CA8C2' }}>
              From Chapter 8
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setActionDone(true)}
                disabled={actionDone}
                className="rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md transition-opacity disabled:opacity-60"
                style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
              >
                {actionDone ? 'Done for today' : 'Mark done'}
              </button>
              <button
                type="button"
                className="rounded-full border py-3 text-sm font-semibold uppercase tracking-wide"
                style={{ borderColor: '#C9A227', color: '#C9A227' }}
              >
                Why this works
              </button>
            </div>
          </div>

          <section className="mt-7">
            <h2 className="text-base font-bold" style={{ color: '#1B2A4A' }}>
              Your den is nudging you
            </h2>

            <div className="mt-3 flex flex-col gap-3">
              <div
                className="rounded-xl border-l-4 bg-white p-4 shadow-sm"
                style={{ borderColor: '#D9912E' }}
              >
                <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                  Three days since your last Vault entry
                </p>
                <p className="mt-1 text-sm" style={{ color: '#2E2E2E' }}>
                  A quick reflection keeps your momentum visible.
                </p>
              </div>

              <div
                className="rounded-xl border-l-4 bg-white p-4 shadow-sm"
                style={{ borderColor: '#3F8F5C' }}
              >
                <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                  Your Garden is ready to check in
                </p>
                <p className="mt-1 text-sm" style={{ color: '#2E2E2E' }}>
                  Two relationships are due for a small act of care.
                </p>
              </div>
            </div>
          </section>
        </main>

        <nav
          className="fixed bottom-0 left-1/2 flex w-full max-w-[430px] -translate-x-1/2 border-t"
          style={{ backgroundColor: '#1B2A4A', borderColor: '#2E3F63' }}
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.key
            const color = isActive ? '#C9A227' : '#9CA8C2'
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className="flex flex-1 flex-col items-center gap-1 py-2.5"
              >
                <NavIcon name={tab.key} color={color} />
                <span className="text-xs font-semibold" style={{ color }}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
