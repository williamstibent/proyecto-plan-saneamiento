import { Outlet } from 'react-router-dom'

/**
 * Layout raíz de la aplicación.
 * En Fase 1 se agrega: sidebar de navegación, header con toggle admin/operario,
 * y el sistema de notificaciones (toast).
 */
export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* TODO Sprint 1: Agregar Header con toggle modo operario ↔ admin */}
      {/* TODO Sprint 1: Agregar Sidebar de navegación */}
      <main className="container mx-auto py-4">
        <Outlet />
      </main>
    </div>
  )
}
