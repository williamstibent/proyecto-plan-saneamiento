import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * Servidor MSW para tests con Vitest (entorno Node/jsdom).
 * Activar en test/setup.ts cuando se quiera interceptar requests en tests.
 */
export const server = setupServer(...handlers)
