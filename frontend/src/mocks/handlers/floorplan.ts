import { http, HttpResponse, delay } from 'msw'
import { MOCK_PISOS, MOCK_TAREAS_POR_AREA } from '../data/floorplan'

/**
 * Handlers MSW para el mapa interactivo del establecimiento.
 * Solo lectura: no hay endpoints de reasignación de tareas ni de no conformidades
 * (las tareas se asignan al área del día, no a un operario específico).
 */
export const floorplanHandlers = [

  // GET /api/v1/pisos — pisos del establecimiento con sus áreas y cumplimiento del día
  http.get('/api/v1/pisos', async () => {
    await delay(400)
    return HttpResponse.json(MOCK_PISOS)
  }),

  // GET /api/v1/areas/:id/tareas-hoy — tareas del día para un área (solo lectura)
  http.get('/api/v1/areas/:id/tareas-hoy', async ({ params }) => {
    await delay(300)
    const areaId = params.id as string
    if (!(areaId in MOCK_TAREAS_POR_AREA)) {
      return HttpResponse.json(
        { code: 'AREA_NOT_FOUND', message: 'Área no encontrada', timestamp: new Date().toISOString() },
        { status: 404 },
      )
    }
    return HttpResponse.json(MOCK_TAREAS_POR_AREA[areaId])
  }),
]
