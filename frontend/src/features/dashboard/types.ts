import type { TaskStatus } from '@/shared/types'

export interface ProgramaMinimo {
  id: string
  nombre: string
  emoji: string
  descripcion: string
  cumplimiento: number // 0-100
  colorClass: {
    bg: string
    border: string
    text: string
    bar: string
  }
}

export interface TareaResumen {
  id: string
  poeCode: string
  titulo: string
  area: string
  responsable: string
  estado: TaskStatus
  hora?: string
  progreso?: number // 0-100, solo si IN_PROGRESS
}

export interface ActividadReciente {
  id: string
  usuario: string
  accion: string
  objetivo: string
  hora: string
  tipo: 'completado' | 'enviado' | 'evidencia' | 'alerta'
}

export interface DashboardData {
  saludo: string
  fecha: string
  totalTareasDia: number
  areasActivas: number
  tareasProximasAVencer: number
  programas: ProgramaMinimo[]
  tareas: TareaResumen[]
  actividad: ActividadReciente[]
  diasParaInvima: number
  paqueteEvidenciaPct: number
}
