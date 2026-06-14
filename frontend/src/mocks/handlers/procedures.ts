import { http, HttpResponse, delay } from 'msw'
import { MOCK_PROCEDIMIENTOS } from '../data/procedures'
import type { PoeResumen } from '../data/procedures'
import type { PoeWizardData } from '@/features/procedures/types'

/**
 * Handlers MSW para el módulo de procedimientos (POE).
 * Los datos viven en MOCK_PROCEDIMIENTOS (array mutable en memoria del worker).
 */
export const proceduresHandlers = [
  // GET /api/v1/procedimientos — lista paginada
  http.get('/api/v1/procedimientos', async ({ request }) => {
    await delay(400)
    const url     = new URL(request.url)
    const programa = url.searchParams.get('programa')

    const resultado = programa
      ? MOCK_PROCEDIMIENTOS.filter((p) => p.programa === programa)
      : MOCK_PROCEDIMIENTOS

    return HttpResponse.json({ data: resultado, total: resultado.length })
  }),

  // POST /api/v1/procedimientos — crear nuevo POE (desde wizard)
  http.post('/api/v1/procedimientos', async ({ request }) => {
    await delay(800)

    const body = await request.json() as PoeWizardData

    const nuevo: PoeResumen = {
      id:             `poe-${Date.now()}`,
      codigo:         body.codigo,
      nombre:         body.nombre,
      descripcion:    body.descripcion ?? '',
      programa:       body.programa,
      areaAplicacion: body.areaAplicacion,
      frecuencia:     body.frecuencia.frecuencia,
      version:        1,
      estado:         'activo',
      eppCount:       body.epp.length,
      pasosCount:     body.pasos.length,
      productosCount: body.productos.length,
      creadoEn:       new Date().toISOString(),
      actualizadoEn:  new Date().toISOString(),
    }

    // Agregar al inicio para que aparezca primero en la lista
    MOCK_PROCEDIMIENTOS.unshift(nuevo)

    return HttpResponse.json(nuevo, { status: 201 })
  }),
]
