import { Outlet } from 'react-router-dom'
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar'

/**
 * Shell compartido de la aplicación.
 * Todas las rutas protegidas renderizan aquí:
 *   [Sidebar fijo] | [Outlet — ocupa el resto]
 */
export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
