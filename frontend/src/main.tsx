import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppProviders } from './app/providers'
import { AppRouter } from './app/routes'
import { setTokenGetter } from './shared/lib/api'
import { useAuthStore } from './shared/stores/authStore'

// Conecta el store de auth con el interceptor de Axios
setTokenGetter(() => useAuthStore.getState().token)

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('No se encontró el elemento root en el DOM.')
}

function render() {
  createRoot(rootElement!).render(
    <StrictMode>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </StrictMode>,
  )
}

/**
 * Activar el mock backend (MSW) cuando la variable de entorno VITE_MOCK=true.
 * En producción y en CI VITE_MOCK no se define, por lo que el worker nunca arranca.
 *
 * Para activar mocks en desarrollo:
 *   VITE_MOCK=true npm run dev
 *   — o —
 *   Crear un archivo .env.local con: VITE_MOCK=true
 */
async function bootstrap() {
  if (import.meta.env.VITE_MOCK === 'true') {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass', // las requests sin handler pasan al servidor real
      serviceWorker: {
        // BASE_URL es '/' en dev local y '/nombre-repo/' en GitHub Pages.
        // MSW necesita la ruta exacta donde está mockServiceWorker.js.
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    })
    console.info('[MSW] Mock backend activo')
  }
  render()
}

bootstrap()
