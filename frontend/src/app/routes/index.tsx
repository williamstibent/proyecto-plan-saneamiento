import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AppLayout } from '@/app/layout'

/**
 * Rutas de la aplicación.
 * Las rutas de cada feature se agregan aquí a medida que se desarrollan.
 *
 * Estructura prevista:
 *   /login                       → AuthPage (pública)
 *   /                            → Redirect a /dashboard
 *   /dashboard                   → DashboardPage (admin-cliente)
 *   /tasks                       → TaskListPage (operario)
 *   /tasks/:taskId               → TaskExecutionPage (operario)
 *   /procedures                  → ProceduresPage (consultor / admin)
 *   /reports                     → ReportsPage (admin-cliente)
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de bienvenida temporal — reemplazar con auth en Sprint 1 */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-blue-600">SanitIA</h1>
                <p className="mt-2 text-gray-500">
                  Frontend levantado correctamente. Las rutas se implementan en Sprint 1.
                </p>
              </div>
            }
          />
          {/* TODO Sprint 1: <Route path="login" element={<AuthPage />} /> */}
          {/* TODO Sprint 3: <Route path="tasks" element={<TaskListPage />} /> */}
          {/* TODO Sprint 4: <Route path="reports" element={<ReportsPage />} /> */}
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
