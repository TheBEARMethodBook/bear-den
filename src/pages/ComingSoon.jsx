import BottomNav from '../components/BottomNav'

export default function ComingSoon({ tab, label, onNavigate }) {
  return (
    <div className="flex min-h-screen w-full justify-center" style={{ backgroundColor: '#FAF6EE' }}>
      <div className="relative flex h-screen w-full max-w-[430px] flex-col">
        <header className="flex shrink-0 items-center px-4 py-3" style={{ backgroundColor: '#1B2A4A' }}>
          <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
            {label}
          </span>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-24 text-center">
          <span
            className="rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wide"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            Coming Soon
          </span>
          <p className="text-sm" style={{ color: '#2E2E2E' }}>
            {label} is still being built in the Den.
          </p>
        </main>

        <BottomNav activeTab={tab} onChange={onNavigate} />
      </div>
    </div>
  )
}
