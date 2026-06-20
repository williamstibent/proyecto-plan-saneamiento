import { http, HttpResponse, delay } from 'msw'
import { MOCK_TAREAS_HOY, MOCK_HISTORIAL, toResumen } from '../data/tareas-operario'
import type { CompletarPasoRequest, CompletarTareaRequest } from '@/features/operario/types'

/**
 * Handlers MSW para la vista del operario.
 * El estado de las tareas y pasos es mutable en memoria —
 * las acciones del usuario se reflejan inmediatamente en la sesión.
 */
export const operarioHandlers = [

  // GET /api/v1/operario/tareas-hoy — lista resumen del día
  http.get('/api/v1/operario/tareas-hoy', async () => {
    await delay(400)
    return HttpResponse.json(MOCK_TAREAS_HOY.map(toResumen))
  }),

  // GET /api/v1/operario/tareas/:id — detalle completo con pasos
  http.get('/api/v1/operario/tareas/:id', async ({ params }) => {
    await delay(300)
    const tarea = MOCK_TAREAS_HOY.find((t) => t.id === params.id)
    if (!tarea) {
      return HttpResponse.json(
        { code: 'TASK_NOT_FOUND', message: 'Tarea no encontrada', timestamp: new Date().toISOString() },
        { status: 404 },
      )
    }
    return HttpResponse.json(tarea)
  }),

  // PATCH /api/v1/operario/tareas/:id/pasos/:pasoId — completar un paso
  http.patch('/api/v1/operario/tareas/:id/pasos/:pasoId', async ({ request, params }) => {
    await delay(300)

    const tarea = MOCK_TAREAS_HOY.find((t) => t.id === params.id)
    if (!tarea) {
      return HttpResponse.json({ code: 'TASK_NOT_FOUND', message: 'Tarea no encontrada', timestamp: new Date().toISOString() }, { status: 404 })
    }

    const paso = tarea.pasos.find((p) => p.id === params.pasoId)
    if (!paso) {
      return HttpResponse.json({ code: 'STEP_NOT_FOUND', message: 'Paso no encontrado', timestamp: new Date().toISOString() }, { status: 404 })
    }

    const body = await request.json() as CompletarPasoRequest

    // Mutar el paso en memoria
    paso.estado = 'completado'
    paso.observacion = body.observacion
    paso.completadoEn = new Date().toISOString()

    // Si tiene foto, simular URL de evidencia
    if (paso.requiereFoto) {
      paso.evidenciaUrl = `https://placehold.co/400x300?text=Evidencia+${paso.id}`
    }

    // Si todos los pasos están completados, poner tarea IN_PROGRESS (o mantener)
    const todosCompletos = tarea.pasos.every((p) => p.estado === 'completado')
    if (tarea.estado === 'PENDING') tarea.estado = 'IN_PROGRESS'
    if (todosCompletos && tarea.estado !== 'COMPLETED') {
      // La tarea se completa solo con el PATCH a /operario/tareas/:id
    }

    return HttpResponse.json(paso)
  }),

  // PATCH /api/v1/operario/tareas/:id — marcar tarea como terminada (transición de estado)
  http.patch('/api/v1/operario/tareas/:id', async ({ request, params }) => {
    await delay(500)

    const tarea = MOCK_TAREAS_HOY.find((t) => t.id === params.id)
    if (!tarea) {
      return HttpResponse.json({ code: 'TASK_NOT_FOUND', message: 'Tarea no encontrada', timestamp: new Date().toISOString() }, { status: 404 })
    }

    const body = await request.json() as CompletarTareaRequest

    tarea.estado = 'COMPLETED'
    tarea.completadoEn = new Date().toISOString()
    tarea.observacionGeneral = body.observacionGeneral

    // Marcar todos los pasos pendientes como completados (completado rápido)
    const now = new Date().toISOString()
    for (const paso of tarea.pasos) {
      if (paso.estado === 'pendiente') {
        paso.estado = 'completado'
        paso.completadoEn = now
      }
    }

    // Agregar al historial (inicio)
    const resumen = toResumen(tarea)
    MOCK_HISTORIAL.unshift(resumen)

    return HttpResponse.json(tarea)
  }),

  // GET /api/v1/operario/historial — tareas completadas (últimos 30 días)
  http.get('/api/v1/operario/historial', async () => {
    await delay(400)
    // Incluye las del historial fijo + las que el operario complete en la sesión
    const completadasHoy = MOCK_TAREAS_HOY
      .filter((t) => t.estado === 'COMPLETED')
      .map(toResumen)
      .filter((r) => !MOCK_HISTORIAL.some((h) => h.id === r.id)) // no duplicar

    return HttpResponse.json([...completadasHoy, ...MOCK_HISTORIAL])
  }),
]
