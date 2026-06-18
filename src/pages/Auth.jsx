import { useState } from 'react'
import { useAuth } from '../contexts/useAuth'

export default function Auth() {
  const { signUp, signIn } = useAuth()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isSignUp = mode === 'signup'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
        setMessage('Check your email to confirm your account.')
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleMode = () => {
    setMode(isSignUp ? 'signin' : 'signup')
    setError('')
    setMessage('')
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: '#1B2A4A' }}
    >
      <div className="mb-10 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#C9A227' }}>
          The BEAR Den
        </h1>
        <p className="mt-2 text-base font-medium" style={{ color: '#FAF6EE' }}>
          Be Impossible to Replace
        </p>
      </div>

      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: '#FAF6EE' }}
      >
        <div
          className="mb-6 flex rounded-full p-1"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <button
            type="button"
            onClick={() => setMode('signin')}
            className="flex-1 rounded-full py-2 text-sm font-semibold uppercase tracking-wide transition-colors"
            style={
              !isSignUp
                ? { backgroundColor: '#C9A227', color: '#1B2A4A' }
                : { color: '#FAF6EE' }
            }
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className="flex-1 rounded-full py-2 text-sm font-semibold uppercase tracking-wide transition-colors"
            style={
              isSignUp
                ? { backgroundColor: '#C9A227', color: '#1B2A4A' }
                : { color: '#FAF6EE' }
            }
          >
            Sign Up
          </button>
        </div>

        <h2 className="mb-1 text-2xl font-bold" style={{ color: '#1B2A4A' }}>
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="mb-6 text-sm" style={{ color: '#2E2E2E' }}>
          {isSignUp
            ? 'Join the Den and start building your edge.'
            : 'Sign in to pick up where you left off.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-lg border px-4 py-2 text-base outline-none focus:ring-2"
              style={{
                borderColor: '#1B2A4A',
                color: '#2E2E2E',
                backgroundColor: '#FFFFFF',
              }}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              Password
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-lg border px-4 py-2 text-base outline-none focus:ring-2"
              style={{
                borderColor: '#1B2A4A',
                color: '#2E2E2E',
                backgroundColor: '#FFFFFF',
              }}
            />
          </label>

          {error && (
            <p className="rounded-lg px-3 py-2 text-sm font-medium" style={{ backgroundColor: '#FBEAEA', color: '#B3261E' }}>
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-lg px-3 py-2 text-sm font-medium" style={{ backgroundColor: '#FCF3D9', color: '#1B2A4A' }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md transition-opacity disabled:opacity-60"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            {submitting ? 'Please wait…' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: '#2E2E2E' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold underline"
            style={{ color: '#1B2A4A' }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
