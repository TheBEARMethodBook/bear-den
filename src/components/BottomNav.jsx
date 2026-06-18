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

export default function BottomNav({ activeTab, onChange }) {
  return (
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
            onClick={() => onChange(tab.key)}
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
  )
}
