import { http, HttpResponse, delay } from 'msw'
import { MOCK_CLIENTES, MOCK_PISOS_POR_CLIENTE } from '../data/clientes'
import type { Cliente, PisoCliente, TipoEstablecimiento } from '@/features/onboarding/types'

interface CrearClienteBody {
  nombre: string
  nit?: string
  tipoEstablecimiento: TipoEstablecimiento
}

interface CrearPisosBody {
  pisos: { nombre: string; areas: string[] }[]
}

/**
 * Handlers MSW para clientes (tenants) y su estructura de pisos/áreas,
 * usados en el flujo de onboarding y reutilización de POEs entre clientes.
 */
export const clientesHandlers = [

  // GET /api/v1/clientes — lista de clientes existentes
  http.get('/api/v1/clientes', async () => {
    await delay(350)
    return HttpResponse.json({
      data: MOCK_CLIENTES,
      pagination: { page: 0, size: MOCK_CLIENTES.length, totalElements: MOCK_CLIENTES.length, totalPages: 1 },
    })
  }),

  // POST /api/v1/clientes — crear un nuevo cliente
  http.post('/api/v1/clientes', async ({ request }) => {
    await delay(600)
    const body = await request.json() as CrearClienteBody

    const nuevo: Cliente = {
      id:                   `cliente-${String(Date.now())}`,
      nombre:                body.nombre,
      nit:                   body.nit,
      tipoEstablecimiento:   body.tipoEstablecimiento,
      pisosCount:            0,
      areasCount:            0,
      poesAsignados:         0,
      creadoEn:              new Date().toISOString(),
    }

    MOCK_CLIENTES.unshift(nuevo)
    MOCK_PISOS_POR_CLIENTE[nuevo.id] = []

    return HttpResponse.json(nuevo, { status: 201 })
  }),

  // GET /api/v1/clientes/:id/pisos — pisos y áreas del cliente
  http.get('/api/v1/clientes/:id/pisos', async ({ params }) => {
    await delay(350)
    const clienteId = params.id as string
    if (!(clienteId in MOCK_PISOS_POR_CLIENTE)) {
      return HttpResponse.json(
        { code: 'CLIENTE_NOT_FOUND', message: 'Cliente no encontrado', timestamp: new Date().toISOString() },
        { status: 404 },
      )
    }
    return HttpResponse.json(MOCK_PISOS_POR_CLIENTE[clienteId])
  }),

  // POST /api/v1/clientes/:id/pisos — crear pisos y áreas (se agregan a los existentes)
  http.post('/api/v1/clientes/:id/pisos', async ({ params, request }) => {
    await delay(700)
    const clienteId = params.id as string
    const body = await request.json() as CrearPisosBody

    if (!(clienteId in MOCK_PISOS_POR_CLIENTE)) {
      return HttpResponse.json(
        { code: 'CLIENTE_NOT_FOUND', message: 'Cliente no encontrado', timestamp: new Date().toISOString() },
        { status: 404 },
      )
    }

    const existentes  = MOCK_PISOS_POR_CLIENTE[clienteId]
    const ordenInicial = existentes.length

    const nuevosPisos: PisoCliente[] = body.pisos.map((piso, i) => {
      const pisoId = `piso-${clienteId}-${String(Date.now())}-${String(i)}`
      return {
        id:        pisoId,
        clienteId,
        nombre:    piso.nombre,
        orden:     ordenInicial + i + 1,
        areas:     piso.areas.map((nombreArea, j) => ({
          id:     `area-${pisoId}-${String(j)}`,
          pisoId,
          nombre: nombreArea,
        })),
      }
    })

    existentes.push(...nuevosPisos)

    const cliente = MOCK_CLIENTES.find((c) => c.id === clienteId)
    if (cliente) {
      cliente.pisosCount = existentes.length
      cliente.areasCount = existentes.reduce((sum, p) => sum + p.areas.length, 0)
    }

    return HttpResponse.json(existentes, { status: 201 })
  }),
]
