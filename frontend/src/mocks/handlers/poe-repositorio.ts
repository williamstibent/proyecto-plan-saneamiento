import { http, HttpResponse, delay } from 'msw'
import { MOCK_POE_REPOSITORIO, MOCK_POE_DETALLE } from '../data/poe-repositorio'
import { MOCK_CLIENTES } from '../data/clientes'
import type { PoeWizardData } from '@/features/procedures/types'

interface AdaptarPoeBody {
  origenPoeId: string
  data: PoeWizardData
}

/**
 * Handlers MSW del repositorio de POEs reutilizables (plantillas de
 * plataforma, plantillas de tenant y POEs de otros clientes) y de la
 * adaptación de un POE seleccionado a un cliente concreto.
 */
export const poeRepositorioHandlers = [

  // GET /api/v1/poe-repositorio — búsqueda (texto libre y/o por programa mínimo)
  http.get('/api/v1/poe-repositorio', async ({ request }) => {
    await delay(400)
    const url      = new URL(request.url)
    const q        = url.searchParams.get('q')?.trim().toLowerCase()
    const programa = url.searchParams.get('programa')

    let resultado = MOCK_POE_REPOSITORIO
    if (programa) resultado = resultado.filter((p) => p.programa === programa)
    if (q) {
      resultado = resultado.filter((p) =>
        p.codigo.toLowerCase().includes(q) ||
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q),
      )
    }

    return HttpResponse.json({ data: resultado, total: resultado.length })
  }),

  // GET /api/v1/poe-repositorio/:id — contenido completo para clonar y adaptar
  http.get('/api/v1/poe-repositorio/:id', async ({ params }) => {
    await delay(350)
    const id = params.id as string
    if (!(id in MOCK_POE_DETALLE)) {
      return HttpResponse.json(
        { code: 'POE_NOT_FOUND', message: 'Procedimiento no encontrado en el repositorio', timestamp: new Date().toISOString() },
        { status: 404 },
      )
    }
    return HttpResponse.json(MOCK_POE_DETALLE[id])
  }),

  // POST /api/v1/clientes/:clienteId/poe — guarda la copia adaptada para el cliente
  // (no modifica el POE original del repositorio — solo incrementa su contador de uso)
  http.post('/api/v1/clientes/:clienteId/poe', async ({ params, request }) => {
    await delay(800)
    const clienteId = params.clienteId as string
    const body      = await request.json() as AdaptarPoeBody

    const origen = MOCK_POE_REPOSITORIO.find((p) => p.id === body.origenPoeId)
    if (origen) origen.vecesUtilizado += 1

    const cliente = MOCK_CLIENTES.find((c) => c.id === clienteId)
    if (cliente) cliente.poesAsignados += 1

    return HttpResponse.json(
      {
        id:          `poe-cliente-${String(Date.now())}`,
        codigo:       body.data.codigo,
        nombre:       body.data.nombre,
        clienteId,
        origenPoeId:  body.origenPoeId,
        creadoEn:     new Date().toISOString(),
      },
      { status: 201 },
    )
  }),
]
