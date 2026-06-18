export default function PhoneFrame({ children }) {
  return (
    <div className="flex min-h-screen w-full justify-center" style={{ backgroundColor: '#1B2A4A' }}>
      <div
        className="relative flex h-screen w-full max-w-[430px] flex-col shadow-2xl"
        style={{ backgroundColor: '#FAF6EE' }}
      >
        {children}
      </div>
    </div>
  )
}
