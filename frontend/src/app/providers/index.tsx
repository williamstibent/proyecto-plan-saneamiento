import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'

/**
 * QueryClient global con configuración centralizada de errores y caché.
 * Para agregar más providers (theme, toast, etc.) encapsularlos aquí.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reintentar 1 vez antes de mostrar error (no 3 como el default)
      retry: 1,
      // Datos se consideran "frescos" durante 30 segundos
      staleTime: 1000 * 30,
    },
    mutations: {
      onError: (error: unknown) => {
        // TODO: Conectar con el sistema de notificaciones (toast)
        console.error('[Mutation error]', error)
      },
    },
  },
})

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
