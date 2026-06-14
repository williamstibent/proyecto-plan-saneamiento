import '@testing-library/jest-dom'
import { server } from '@/mocks/server'

// Intercepta requests en todos los tests usando los handlers definidos en mocks/handlers/
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers()) // limpia overrides por test
afterAll(() => server.close())
