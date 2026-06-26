import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Success from './pages/Success.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

const root = document.getElementById('root')

if (window.location.pathname === '/success') {
  createRoot(root).render(
    <StrictMode>
      <Success />
    </StrictMode>,
  )
} else {
  createRoot(root).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
  )
}
