import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { PersonaProvider } from './context/PersonaContext'
import { ConnectivityProvider } from './context/ConnectivityContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersonaProvider>
      <ConnectivityProvider>
        <App />
      </ConnectivityProvider>
    </PersonaProvider>
  </StrictMode>,
)
