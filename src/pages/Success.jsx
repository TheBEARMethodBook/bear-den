function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="52" height="52" fill="#C9A227">
      <path d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9Z" />
      <path d="M19 14l.9 2.8L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-1.2Z" />
    </svg>
  )
}

export default function Success() {
  return (
    <div className="flex min-h-screen w-full justify-center" style={{ backgroundColor: '#1B2A4A' }}>
      <div className="flex h-screen w-full max-w-[430px] flex-col items-center justify-center px-8 text-center">
        <SparkleIcon />

        <h1 className="mt-6 text-3xl font-bold leading-tight text-white">
          You're in. Welcome to BEAR Den Pro.
        </h1>

        <p className="mt-5 text-lg font-semibold leading-snug" style={{ color: '#C9A227' }}>
          You're becoming <span className="font-extrabold">IMPOSSIBLE</span> to replace.
        </p>

        <p className="mt-4 text-sm leading-relaxed" style={{ color: '#9CA8C2' }}>
          Your Vault is now unlimited. Your relationships are your greatest asset. Go build.
        </p>

        <button
          type="button"
          onClick={() => { window.location.href = '/' }}
          className="mt-10 w-full rounded-full py-4 text-sm font-bold uppercase tracking-wide shadow-md"
          style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
        >
          Go to Your Den
        </button>
      </div>
    </div>
  )
}
