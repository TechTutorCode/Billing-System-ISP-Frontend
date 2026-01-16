import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.tsx'
import { setupErrorHandling } from './utils/errorHandler'

// Setup error handling to suppress external errors (browser extensions, etc.)
setupErrorHandling()

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
