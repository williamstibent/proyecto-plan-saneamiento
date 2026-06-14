// ─── Domain enums ────────────────────────────────────────────────────────────

export type ProgramaMinimo =
  | 'limpieza-desinfeccion'
  | 'agua-potable'
  | 'residuos-solidos'
  | 'control-plagas'

export type FaseChecklist = 'preparacion' | 'limpieza' | 'desinfeccion' | 'verificacion'

export type TipoProducto = 'detergente' | 'desinfectante' | 'desengrasante' | 'otro'

export type TaskFrequency =
  | 'diaria'
  | 'semanal'
  | 'quincenal'
  | 'mensual'
  | 'trimestral'
  | 'semestral'
  | 'anual'

// ─── Entity types ─────────────────────────────────────────────────────────────

export interface EppItem {
  id: string
  emoji: string
  label: string
}

export interface ProductoQuimico {
  id: string
  nombre: string
  tipo: TipoProducto
  dilucion: string
  tiempoContactoMin?: number
  metodoAplicacion: string
  requiereEnjuague: boolean
}

export interface PasoChecklist {
  id: string
  descripcion: string
  fase: FaseChecklist
  requiereFoto: boolean
  ordenEjecucion: number
}

export interface DosisChoque {
  activa: boolean
  producto: string
  concentracion?: string
  frecuencia: TaskFrequency
}

export interface FrecuenciaConfig {
  frecuencia: TaskFrequency
  horaEjecucion?: string
  diaSemana?: number  // 1=lunes … 7=domingo (semanal)
  diaMes?: number     // 1-28 (mensual/quincenal)
}

// ─── Wizard aggregate ────────────────────────────────────────────────────────

export interface PoeWizardData {
  // Paso 1
  codigo: string
  nombre: string
  descripcion: string
  areaAplicacion: string
  programa: ProgramaMinimo

  // Paso 2
  epp: EppItem[]
  implementos: string[]

  // Paso 3
  productos: ProductoQuimico[]

  // Paso 4
  pasos: PasoChecklist[]

  // Paso 5
  frecuencia: FrecuenciaConfig
  dosisChoque: DosisChoque
}

export const POE_WIZARD_DATA_INICIAL: PoeWizardData = {
  codigo: '',
  nombre: '',
  descripcion: '',
  areaAplicacion: '',
  programa: 'limpieza-desinfeccion',
  epp: [],
  implementos: [],
  productos: [],
  pasos: [],
  frecuencia: { frecuencia: 'diaria' },
  dosisChoque: { activa: false, producto: '', frecuencia: 'mensual' },
}

// ─── Catalogues ──────────────────────────────────────────────────────────────

export const EPP_CATALOGO: EppItem[] = [
  { id: 'monogafas', emoji: '🥽', label: 'Monogafas'     },
  { id: 'guantes',   emoji: '🧤', label: 'Guantes'        },
  { id: 'tapabocas', emoji: '😷', label: 'Tapabocas'      },
  { id: 'delantal',  emoji: '👕', label: 'Delantal'       },
  { id: 'botas',     emoji: '🥾', label: 'Botas'          },
  { id: 'careta',    emoji: '🛡',  label: 'Careta facial'  },
  { id: 'overol',    emoji: '🦺', label: 'Overol'         },
  { id: 'capucha',   emoji: '🧢', label: 'Capucha'        },
]

export const PROGRAMAS_LABEL: Record<ProgramaMinimo, string> = {
  'limpieza-desinfeccion': 'Limpieza y Desinfección',
  'agua-potable':          'Agua potable',
  'residuos-solidos':      'Residuos sólidos',
  'control-plagas':        'Control de plagas',
}

export const FRECUENCIA_LABEL: Record<TaskFrequency, string> = {
  diaria:     'Diaria',
  semanal:    'Semanal',
  quincenal:  'Quincenal',
  mensual:    'Mensual',
  trimestral: 'Trimestral',
  semestral:  'Semestral',
  anual:      'Anual',
}

export const METODOS_APLICACION = ['esponja', 'atomizador', 'cepillo', 'paño', 'trapeador', 'aspersión']

export const TIPOS_PRODUCTO: { value: TipoProducto; label: string }[] = [
  { value: 'detergente',    label: 'Detergente'    },
  { value: 'desinfectante', label: 'Desinfectante' },
  { value: 'desengrasante', label: 'Desengrasante' },
  { value: 'otro',          label: 'Otro'          },
]

export const FASES_CHECKLIST: { value: FaseChecklist; label: string }[] = [
  { value: 'preparacion',  label: 'Preparación'  },
  { value: 'limpieza',     label: 'Limpieza'     },
  { value: 'desinfeccion', label: 'Desinfección' },
  { value: 'verificacion', label: 'Verificación' },
]
