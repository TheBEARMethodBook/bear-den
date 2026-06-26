import { useState } from 'react'
import { useAuth } from '../contexts/useAuth'

const MONTHLY_PRICE_ID = 'price_1TmefpRHH5ulKgdgK8jMjoAX'
const ANNUAL_PRICE_ID = 'price_1TmegORHH5ulKgdgP0FE6Goy'

async function createCheckoutSession(priceId, userId) {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ priceId, userId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to start checkout')
  return data.url
}

export default function UpgradeBanner({
  isOpen,
  onClose,
  title = 'This is a BEAR Den Pro feature',
  message = 'Upgrade to keep building without limits.',
}) {
  const { user } = useAuth()
  const [checkoutLoading, setCheckoutLoading] = useState(null)
  const [error, setError] = useState('')

  const handleCheckout = async (priceId, planKey) => {
    if (!user || checkoutLoading) return
    setCheckoutLoading(planKey)
    setError('')
    try {
      const url = await createCheckoutSession(priceId, user.id)
      window.location.href = url
    } catch (err) {
      setError(err.message || 'Could not start checkout. Try again.')
      setCheckoutLoading(null)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ backgroundColor: 'rgba(27, 42, 74, 0.75)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{ backgroundColor: '#1B2A4A' }}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-center text-lg font-bold text-white">{title}</p>
        <p className="mt-1 text-center text-sm" style={{ color: '#9CA8C2' }}>
          {message}
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleCheckout(ANNUAL_PRICE_ID, 'annual')}
            disabled={!!checkoutLoading}
            className="w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-60"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            {checkoutLoading === 'annual' ? 'Opening checkout...' : 'Annual — $79/year (Save 27%)'}
          </button>

          <button
            type="button"
            onClick={() => handleCheckout(MONTHLY_PRICE_ID, 'monthly')}
            disabled={!!checkoutLoading}
            className="w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-60"
            style={{ backgroundColor: 'transparent', color: '#C9A227', border: '1px solid #C9A227' }}
          >
            {checkoutLoading === 'monthly' ? 'Opening checkout...' : 'Monthly — $9/month'}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-center text-xs" style={{ color: '#F2B8B5' }}>
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full text-center text-sm font-medium"
          style={{ color: '#9CA8C2' }}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
