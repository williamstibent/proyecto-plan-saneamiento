import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * Service Worker MSW para desarrollo en el navegador.
 * Se arranca condicionalmente en main.tsx solo cuando VITE_MOCK=true.
 */
export const worker = setupWorker(...handlers)
