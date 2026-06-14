import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AppLayout } from '@/app/layout'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { PoeListPage } from '@/features/procedures/pages/PoeListPage'
import { PoeWizardPage } from '@/features/procedures/pages/PoeWizardPage'

/**
 * Rutas de la aplicación.
 *
 *   /login          → LoginPage (pública)            ✅ implementado
 *   /               → Redirect a /dashboard
 *   /dashboard      → DashboardPage (protegida)      ✅ implementado
 *   /validar        → ValidarPage (Sprint 2)
 *   /mapa           → MapaPage (Sprint 2)
 *   /programacion   → ProgramacionPage (Sprint 2)
 *   /tasks          → TaskListPage — vista operario (Sprint 3)
 *   /tasks/:taskId  → TaskExecutionPage (Sprint 3)
 *   /poe            → ProceduresPage (Sprint 2)
 *   /reports        → ReportsPage (Sprint 4)
 */
export function AppRouter() {
  // import.meta.env.BASE_URL es seteado automáticamente por Vite
  // según el campo `base` de vite.config.ts (/ en dev, /repo-name/ en GH Pages)
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* POE Wizard — protegida, layout propio (fullscreen) */}
        <Route element={<ProtectedRoute />}>
          <Route path="poe/nuevo" element={<PoeWizardPage />} />
        </Route>

        {/* Rutas protegidas con AppLayout */}
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="poe"       element={<PoeListPage />} />

            {/* TODO Sprint 2: <Route path="validar" element={<ValidarPage />} /> */}
            {/* TODO Sprint 2: <Route path="mapa" element={<MapaPage />} /> */}
            {/* TODO Sprint 2: <Route path="programacion" element={<ProgramacionPage />} /> */}
            {/* TODO Sprint 3: <Route path="tasks" element={<TaskListPage />} /> */}
            {/* TODO Sprint 3: <Route path="tasks/:taskId" element={<TaskExecutionPage />} /> */}
            {/* TODO Sprint 4: <Route path="reports" element={<ReportsPage />} /> */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
