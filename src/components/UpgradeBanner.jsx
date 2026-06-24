import { PRICING_PLANS } from '../lib/pricingPlans'

export default function UpgradeBanner({ isOpen, onClose, onUpgrade }) {
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
        <p className="text-center text-lg font-bold text-white">This is a BEAR Den Pro feature</p>
        <p className="mt-1 text-center text-sm" style={{ color: '#9CA8C2' }}>
          Upgrade to keep building without limits.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="relative w-full rounded-xl p-3"
              style={{
                backgroundColor: '#FFFFFF',
                border: plan.highlighted ? '2px solid #C9A227' : '2px solid transparent',
              }}
            >
              {plan.badge && (
                <span
                  className="absolute -top-2.5 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
                >
                  {plan.badge}
                </span>
              )}
              <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                {plan.name}
              </p>
              <p className="text-lg font-bold" style={{ color: '#1B2A4A' }}>
                {plan.price}
                <span className="text-xs font-medium" style={{ color: '#9CA8C2' }}>
                  {plan.period}
                </span>
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onUpgrade}
          className="mt-5 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
          style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
        >
          Get the Full Den
        </button>

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
