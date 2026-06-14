import { http, HttpResponse, delay } from 'msw'
import { MOCK_DASHBOARD_RESUMEN, MOCK_PROGRAMAS, MOCK_TAREAS_HOY } from '../data/dashboard'

/**
 * Latencia simulada en ms. Imita el tiempo real de red para detectar
 * estados de carga en el desarrollo. Cambiar a 0 para tests.
 */
const LATENCIA_MS = 600

export const dashboardHandlers = [
  // Resumen general del dashboard (saludo, conteos, actividad, INVIMA)
  http.get('/api/v1/dashboard/resumen', async () => {
    await delay(LATENCIA_MS)
    return HttpResponse.json(MOCK_DASHBOARD_RESUMEN)
  }),

  // Cumplimiento de los 4 programas mínimos (Resolución 2674)
  http.get('/api/v1/programas/cumplimiento', async ({ request }) => {
    await delay(LATENCIA_MS)
    const url = new URL(request.url)
    const periodo = url.searchParams.get('periodo') ?? 'mes'
    // En el mock devolvemos siempre los mismos datos sin importar el periodo.
    // El backend real filtrará por periodo.
    console.info(`[MSW] programas/cumplimiento periodo=${periodo}`)
    return HttpResponse.json(MOCK_PROGRAMAS)
  }),

  // Instancias de tareas del día actual
  http.get('/api/v1/task-instances/hoy', async ({ request }) => {
    await delay(LATENCIA_MS)
    const url = new URL(request.url)
    const estado = url.searchParams.get('estado') // EXPIRED | PENDING | IN_PROGRESS | COMPLETED | null (todos)
    const tareas = estado
      ? MOCK_TAREAS_HOY.filter((t) => t.estado === estado)
      : MOCK_TAREAS_HOY
    return HttpResponse.json(tareas)
  }),
]
