import { useAuth } from './contexts/useAuth'
import Auth from './pages/Auth'

function App() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <p className="text-lg font-medium" style={{ color: '#FAF6EE' }}>
          Loading…
        </p>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ backgroundColor: '#1B2A4A' }}
    >
      <h1 className="text-5xl font-bold tracking-tight" style={{ color: '#C9A227' }}>
        The BEAR Den
      </h1>
      <p className="text-lg text-white">Be Impossible to Replace</p>
      <p className="mt-2 text-base" style={{ color: '#FAF6EE' }}>
        Welcome, {user.email}
      </p>
      <button
        type="button"
        onClick={signOut}
        className="mt-4 rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
      >
        Sign Out
      </button>
    </div>
  )
}

export default App
