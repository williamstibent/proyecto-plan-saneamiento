import type { PoeWizardData, ProgramaMinimo, EppItem, ProductoQuimico, PasoChecklist } from '@/features/procedures/types'
import { EPP_CATALOGO } from '@/features/procedures/types'
import type { OrigenPoe, TipoEstablecimiento } from '@/features/onboarding/types'
import { MOCK_PROCEDIMIENTOS } from './procedures'

/**
 * Repositorio de POEs reutilizables entre clientes (tenants): plantillas
 * mantenidas por la plataforma, plantillas publicadas por un tenant para
 * reutilizar en otros, y POEs ya creados para clientes existentes.
 * Store en memoria — persiste durante la sesión del worker MSW.
 */
export interface PoeRepositorioItem {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  programa: ProgramaMinimo
  areaAplicacion: string
  origen: OrigenPoe
  clienteOrigenNombre?: string
  tipoEstablecimiento?: TipoEstablecimiento[]
  vecesUtilizado: number
  actualizadoEn: string
}

// ─── Helpers para construir el contenido clonable (PoeWizardData) ──────────

function epp(...ids: string[]): EppItem[] {
  return EPP_CATALOGO.filter((e) => ids.includes(e.id))
}

function producto(nombre: string, dilucion: string, tiempoContactoMin?: number): ProductoQuimico {
  return {
    id: `prod-${nombre.toLowerCase().replace(/\s+/g, '-')}`,
    nombre,
    tipo: 'desinfectante',
    dilucion,
    tiempoContactoMin,
    metodoAplicacion: 'paño',
    requiereEnjuague: Boolean(tiempoContactoMin),
  }
}

function pasos(items: { texto: string; fase: PasoChecklist['fase']; foto?: boolean }[]): PasoChecklist[] {
  return items.map((d, i) => ({
    id: `paso-${String(i + 1)}`,
    descripcion: d.texto,
    fase: d.fase,
    requiereFoto: d.foto ?? false,
    ordenEjecucion: i + 1,
  }))
}

interface DetalleInput {
  codigo: string
  nombre: string
  descripcion: string
  areaAplicacion: string
  programa: ProgramaMinimo
  eppIds?: string[]
  implementos?: string[]
  productos?: ProductoQuimico[]
  pasos?: PasoChecklist[]
}

/** Construye el PoeWizardData completo de una entrada del repositorio (con defaults razonables). */
function detalle(input: DetalleInput): PoeWizardData {
  return {
    codigo:         input.codigo,
    nombre:         input.nombre,
    descripcion:    input.descripcion,
    areaAplicacion: input.areaAplicacion,
    programa:       input.programa,
    epp:            epp(...(input.eppIds ?? ['guantes', 'tapabocas'])),
    implementos:    input.implementos ?? ['esponja', 'balde'],
    productos:      input.productos ?? [producto('Detergente industrial', '1:100')],
    pasos:          input.pasos ?? pasos([
      { texto: 'Retirar residuos visibles de la superficie.',                fase: 'preparacion'  },
      { texto: 'Aplicar el producto y dejar actuar el tiempo de contacto.',  fase: 'limpieza'      },
      { texto: 'Enjuagar y dejar secar al aire.',                            fase: 'verificacion', foto: true },
    ]),
    frecuencia:   { frecuencia: 'diaria' },
    dosisChoque:  { activa: false, producto: '', frecuencia: 'mensual' },
  }
}

interface RepoSeed {
  id: string
  origen: OrigenPoe
  clienteOrigenNombre?: string
  tipoEstablecimiento?: TipoEstablecimiento[]
  vecesUtilizado: number
  actualizadoEn: string
  input: DetalleInput
}

// ─── Plantillas de plataforma — mantenidas por SanitIA ─────────────────────

const PLANTILLAS_PLATAFORMA: RepoSeed[] = [
  {
    id: 'repo-001', origen: 'plantilla-plataforma', vecesUtilizado: 142, actualizadoEn: '2026-01-10T08:00:00Z',
    tipoEstablecimiento: ['panaderia', 'restaurante', 'cafeteria', 'pasteleria'],
    input: {
      codigo: 'POE-MANOS-01', nombre: 'Lavado de manos', programa: 'limpieza-desinfeccion', areaAplicacion: 'Toda la planta',
      descripcion: 'Procedimiento estándar de higiene de manos para todo el personal antes de manipular alimentos.',
      eppIds: [], implementos: ['jabón antibacterial', 'toalla desechable'],
      pasos: pasos([
        { texto: 'Mojar las manos con agua limpia.', fase: 'preparacion' },
        { texto: 'Aplicar jabón antibacterial y frotar 20 segundos.', fase: 'limpieza' },
        { texto: 'Enjuagar y secar con toalla desechable.', fase: 'verificacion', foto: true },
      ]),
      productos: [producto('Jabón líquido antibacterial', 'uso directo')],
    },
  },
  {
    id: 'repo-002', origen: 'plantilla-plataforma', vecesUtilizado: 98, actualizadoEn: '2025-12-02T08:00:00Z',
    tipoEstablecimiento: ['panaderia', 'restaurante', 'cafeteria', 'pasteleria'],
    input: {
      codigo: 'POE-MESAS-02', nombre: 'Limpieza y desinfección de mesas de trabajo', programa: 'limpieza-desinfeccion', areaAplicacion: 'Cocina',
      descripcion: 'Superficies de contacto directo con alimentos, antes y después de cada turno.',
      eppIds: ['guantes', 'tapabocas'],
      productos: [producto('Hipoclorito de sodio 5,25%', '200 ppm', 10)],
    },
  },
  {
    id: 'repo-003', origen: 'plantilla-plataforma', vecesUtilizado: 76, actualizadoEn: '2025-11-20T08:00:00Z',
    tipoEstablecimiento: ['panaderia', 'restaurante', 'pasteleria'],
    input: {
      codigo: 'POE-UTENSILIOS-03', nombre: 'Lavado y desinfección de utensilios', programa: 'limpieza-desinfeccion', areaAplicacion: 'Lavado de utensilios',
      descripcion: 'Ollas, moldes y herramientas de cocina al finalizar su uso.',
      eppIds: ['guantes', 'delantal'],
      productos: [producto('Amonio cuaternario 5ª gen.', '400 ppm', 5)],
    },
  },
  {
    id: 'repo-004', origen: 'plantilla-plataforma', vecesUtilizado: 54, actualizadoEn: '2025-10-30T08:00:00Z',
    tipoEstablecimiento: ['panaderia', 'pasteleria'],
    input: {
      codigo: 'POE-FRIO-05', nombre: 'Limpieza de cuarto frío y refrigeradores', programa: 'limpieza-desinfeccion', areaAplicacion: 'Cuarto frío',
      descripcion: 'Control de temperatura y limpieza semanal de superficies refrigeradas.',
      eppIds: ['guantes', 'botas'],
    },
  },
  {
    id: 'repo-005', origen: 'plantilla-plataforma', vecesUtilizado: 61, actualizadoEn: '2025-09-18T08:00:00Z',
    tipoEstablecimiento: ['panaderia', 'pasteleria'],
    input: {
      codigo: 'POE-HORNO-07', nombre: 'Limpieza interior y exterior de horno', programa: 'limpieza-desinfeccion', areaAplicacion: 'Horno',
      descripcion: 'Remoción de residuos de cocción y desengrase del equipo de horneado.',
      eppIds: ['guantes', 'monogafas'],
      productos: [producto('Desengrasante alcalino', '1:20', 15)],
    },
  },
  {
    id: 'repo-006', origen: 'plantilla-plataforma', vecesUtilizado: 110, actualizadoEn: '2026-02-01T08:00:00Z',
    tipoEstablecimiento: ['panaderia', 'restaurante', 'cafeteria', 'pasteleria'],
    input: {
      codigo: 'POE-PISOS-14', nombre: 'Sanitización de pisos', programa: 'limpieza-desinfeccion', areaAplicacion: 'Toda la planta',
      descripcion: 'Barrido, trapeado y desinfección de pisos en áreas de producción.',
      eppIds: ['guantes', 'botas'],
      implementos: ['escoba', 'trapeador', 'balde'],
    },
  },
  {
    id: 'repo-007', origen: 'plantilla-plataforma', vecesUtilizado: 88, actualizadoEn: '2025-12-15T08:00:00Z',
    tipoEstablecimiento: ['panaderia', 'restaurante', 'cafeteria', 'pasteleria'],
    input: {
      codigo: 'POE-BAÑOS-15', nombre: 'Limpieza y desinfección de baños', programa: 'limpieza-desinfeccion', areaAplicacion: 'Baños',
      descripcion: 'Limpieza de sanitarios, lavamanos y reposición de insumos.',
      eppIds: ['guantes', 'tapabocas'],
    },
  },
  {
    id: 'repo-008', origen: 'plantilla-plataforma', vecesUtilizado: 67, actualizadoEn: '2026-02-20T08:00:00Z',
    tipoEstablecimiento: ['panaderia', 'restaurante', 'cafeteria', 'pasteleria'],
    input: {
      codigo: 'POE-AGUA-01', nombre: 'Verificación de cloro residual', programa: 'agua-potable', areaAplicacion: 'Cocina',
      descripcion: 'Toma de muestra y registro diario de cloro residual del agua de uso.',
      eppIds: [], implementos: ['kit de medición de cloro'],
      productos: [],
      pasos: pasos([
        { texto: 'Tomar muestra de agua del punto designado.', fase: 'preparacion' },
        { texto: 'Medir cloro residual con el kit de prueba.', fase: 'verificacion', foto: true },
        { texto: 'Registrar el resultado en el formato de control.', fase: 'verificacion' },
      ]),
    },
  },
  {
    id: 'repo-009', origen: 'plantilla-plataforma', vecesUtilizado: 39, actualizadoEn: '2025-08-05T08:00:00Z',
    tipoEstablecimiento: ['panaderia', 'restaurante', 'cafeteria', 'pasteleria'],
    input: {
      codigo: 'POE-RESI-01', nombre: 'Separación de residuos en la fuente', programa: 'residuos-solidos', areaAplicacion: 'Toda la planta',
      descripcion: 'Clasificación de residuos orgánicos, reciclables y ordinarios en el punto de generación.',
      eppIds: ['guantes'],
    },
  },
  {
    id: 'repo-010', origen: 'plantilla-plataforma', vecesUtilizado: 45, actualizadoEn: '2025-07-22T08:00:00Z',
    tipoEstablecimiento: ['panaderia', 'restaurante', 'cafeteria', 'pasteleria'],
    input: {
      codigo: 'POE-PLAGAS-01', nombre: 'Inspección de cebaderos y trampas', programa: 'control-plagas', areaAplicacion: 'Toda la planta',
      descripcion: 'Revisión periódica de puntos de control de plagas y registro de hallazgos.',
      eppIds: ['guantes'],
      productos: [],
      pasos: pasos([
        { texto: 'Recorrer los puntos de control marcados en el plano.', fase: 'preparacion' },
        { texto: 'Verificar estado de cebos y trampas.', fase: 'verificacion', foto: true },
        { texto: 'Registrar hallazgos y reponer cebo si es necesario.', fase: 'verificacion' },
      ]),
    },
  },
]

// ─── Plantillas de tenant — publicadas por un consultor para reutilizar ────

const PLANTILLAS_TENANT: RepoSeed[] = [
  {
    id: 'repo-011', origen: 'plantilla-tenant', clienteOrigenNombre: 'Panadería San José', vecesUtilizado: 6, actualizadoEn: '2026-03-12T08:00:00Z',
    input: {
      codigo: 'POE-LYD-09', nombre: 'Desinfección de vitrinas de exhibición', programa: 'limpieza-desinfeccion', areaAplicacion: 'Área de ventas',
      descripcion: 'Limpieza de vidrios y superficies de exhibición de producto terminado, publicada como plantilla por su consultor sanitario.',
      eppIds: ['guantes', 'tapabocas'],
      productos: [producto('Amonio cuaternario 5ª gen.', '400 ppm', 5)],
    },
  },
  {
    id: 'repo-012', origen: 'plantilla-tenant', clienteOrigenNombre: 'Panadería San José', vecesUtilizado: 3, actualizadoEn: '2026-04-02T08:00:00Z',
    input: {
      codigo: 'POE-CP-02', nombre: 'Registro fotográfico de trampas para roedores', programa: 'control-plagas', areaAplicacion: 'Toda la planta',
      descripcion: 'Variante con evidencia fotográfica obligatoria en cada punto de control.',
      eppIds: ['guantes'],
      productos: [],
      pasos: pasos([
        { texto: 'Ubicar cada trampa según el plano de puntos de control.', fase: 'preparacion' },
        { texto: 'Fotografiar el estado de la trampa.', fase: 'verificacion', foto: true },
        { texto: 'Registrar observaciones y reponer cebo si aplica.', fase: 'verificacion' },
      ]),
    },
  },
]

// ─── POEs de otros clientes — derivados de los procedimientos ya creados ───

const PLANTILLAS_CLIENTE: RepoSeed[] = MOCK_PROCEDIMIENTOS.map((p, i) => ({
  id: `repo-cli-${p.id}`,
  origen: 'cliente' as const,
  clienteOrigenNombre: 'ArtesaPan',
  vecesUtilizado: i + 1,
  actualizadoEn: p.actualizadoEn,
  input: {
    codigo:         p.codigo,
    nombre:         p.nombre,
    descripcion:    p.descripcion,
    programa:       p.programa,
    areaAplicacion: p.areaAplicacion,
  },
}))

const TODOS_LOS_SEEDS: RepoSeed[] = [...PLANTILLAS_PLATAFORMA, ...PLANTILLAS_TENANT, ...PLANTILLAS_CLIENTE]

export const MOCK_POE_REPOSITORIO: PoeRepositorioItem[] = TODOS_LOS_SEEDS.map((seed) => ({
  id:                  seed.id,
  codigo:               seed.input.codigo,
  nombre:               seed.input.nombre,
  descripcion:          seed.input.descripcion,
  programa:             seed.input.programa,
  areaAplicacion:       seed.input.areaAplicacion,
  origen:               seed.origen,
  clienteOrigenNombre:  seed.clienteOrigenNombre,
  tipoEstablecimiento:  seed.tipoEstablecimiento,
  vecesUtilizado:       seed.vecesUtilizado,
  actualizadoEn:        seed.actualizadoEn,
}))

export const MOCK_POE_DETALLE: Record<string, PoeWizardData> = Object.fromEntries(
  TODOS_LOS_SEEDS.map((seed) => [seed.id, detalle(seed.input)]),
)
