import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AppLayout }      from '@/app/layout'
import { OperarioLayout } from '@/app/layout/OperarioLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage }         from '@/features/auth/pages/LoginPage'
import { DashboardPage }     from '@/features/dashboard/pages/DashboardPage'
import { PoeListPage }       from '@/features/procedures/pages/PoeListPage'
import { PoeWizardPage }     from '@/features/procedures/pages/PoeWizardPage'
import { TareasHoyPage }     from '@/features/operario/pages/TareasHoyPage'
import { ChecklistPage }     from '@/features/operario/pages/ChecklistPage'
import { HistorialPage }     from '@/features/operario/pages/HistorialPage'
import { PerfilPage }        from '@/features/operario/pages/PerfilPage'
import { MapaPage }          from '@/features/floorplan/pages/MapaPage'
import { ClientesListPage }      from '@/features/onboarding/pages/ClientesListPage'
import { OnboardingClientePage } from '@/features/onboarding/pages/OnboardingClientePage'

/**
 * Árbol de rutas de la aplicación.
 *
 *   /login                  → LoginPage (pública)
 *   /                       → redirect a /dashboard
 *
 *   /dashboard              → DashboardPage          (admin/supervisor)
 *   /poe                    → PoeListPage             (admin/supervisor)
 *   /poe/nuevo              → PoeWizardPage           (admin/supervisor)
 *   /mapa                   → MapaPage                (admin/supervisor)
 *   /clientes               → ClientesListPage        (admin/supervisor)
 *   /clientes/onboarding    → OnboardingClientePage   (admin/supervisor)
 *
 *   /operario               → redirect a /operario/hoy
 *   /operario/hoy           → TareasHoyPage           (operario)
 *   /operario/tareas/:id    → ChecklistPage           (operario)
 *   /operario/historial     → HistorialPage           (operario)
 *   /operario/perfil        → PerfilPage              (operario)
 */
export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* ── Ruta pública ──────────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ── POE Wizard — layout propio (fullscreen) ───────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="poe/nuevo" element={<PoeWizardPage />} />
          <Route path="clientes/onboarding" element={<OnboardingClientePage />} />
        </Route>

        {/* ── Vista operario (OperarioLayout con bottom-nav) ────────── */}
        <Route element={<OperarioLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="operario" element={<Navigate to="/operario/hoy" replace />} />
            <Route path="operario/hoy"         element={<TareasHoyPage />} />
            <Route path="operario/tareas/:id"  element={<ChecklistPage />} />
            <Route path="operario/historial"   element={<HistorialPage />} />
            <Route path="operario/perfil"      element={<PerfilPage />} />
          </Route>
        </Route>

        {/* ── Rutas admin/supervisor (AppLayout con sidebar) ────────── */}
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="poe"       element={<PoeListPage />} />
            <Route path="mapa"      element={<MapaPage />} />
            <Route path="clientes"  element={<ClientesListPage />} />

            {/* TODO Sprint 2: <Route path="validar" element={<ValidarPage />} /> */}
            {/* TODO Sprint 4: <Route path="reports" element={<ReportsPage />} /> */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
