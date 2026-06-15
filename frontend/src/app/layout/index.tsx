import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar'

/**
 * Shell compartido de la aplicación.
 * - Desktop (lg+): sidebar fijo a la izquierda, siempre visible.
 * - Móvil: sidebar oculto como drawer; se abre con el botón hamburguesa
 *   del top bar y se cierra al navegar o pulsar el backdrop.
 */
export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Cierra el drawer automáticamente al cambiar de ruta
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Backdrop — solo visible en móvil cuando el drawer está abierto */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — desktop: estático; móvil: drawer con translate */}
      <div
        className={[
          'fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out',
          'lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <DashboardSidebar onClose={closeSidebar} />
      </div>

      {/* Área de contenido */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar — solo en móvil */}
        <div className="flex h-12 shrink-0 items-center gap-3 border-b border-violet-100 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
            className="grid h-9 w-9 place-items-center rounded-xl border border-violet-100 text-violet-700 hover:bg-[#faf9fc]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-br from-violet-400 via-fuchsia-400 to-orange-300 text-xs font-extrabold text-white shadow-sm">
              S
            </div>
            <span className="text-sm font-extrabold">SanitIA</span>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  )
}
