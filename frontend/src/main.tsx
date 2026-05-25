import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppProviders } from './app/providers'
import { AppRouter } from './app/routes'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('No se encontró el elemento root en el DOM.')
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </StrictMode>,
)
