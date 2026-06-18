import { useAuth } from './contexts/useAuth'
import Auth from './pages/Auth'
import Today from './pages/Today'

function App() {
  const { user, loading } = useAuth()

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

  return <Today />
}

export default App
