import { cn } from '@/shared/lib/utils'
import { useTareasArea } from '../hooks/useFloorPlan'
import { ESTADO_CUMPLIMIENTO_LABEL } from '../types'
import type { AreaPlano, TareaAreaResumen } from '../types'
import type { TaskStatus } from '@/shared/types'

const CUMPLIMIENTO_BADGE: Record<AreaPlano['estadoCumplimiento'], string> = {
  AL_DIA:  'bg-emerald-100 text-emerald-700',
  PROXIMO: 'bg-orange-100 text-orange-700',
  VENCIDO: 'bg-rose-100 text-rose-700',
}

const TAREA_ESTADO: Record<TaskStatus, { label: string; badge: string; dot: string }> = {
  IN_PROGRESS: { label: 'En ejecución', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  PENDING:     { label: 'Pendiente',    badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400' },
  COMPLETED:   { label: 'Completada',   badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  EXPIRED:     { label: 'Vencida',      badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
}

function TareaRow({ tarea }: { tarea: TareaAreaResumen }) {
  const cfg = TAREA_ESTADO[tarea.estado]
  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="font-mono text-[10px] font-bold text-violet-600">{tarea.poeCode}</span>
          <div className="mt-0.5 text-sm font-bold leading-snug">{tarea.nombre}</div>
        </div>
        <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', cfg.badge)}>
          {cfg.label}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#5e577a]">
        {tarea.horaEstimada && <span>⏰ {tarea.horaEstimada}</span>}
        {tarea.urgente && tarea.estado !== 'COMPLETED' && (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 font-bold text-rose-700">⚡ urgente</span>
        )}
        {tarea.operarioEjecutando && (
          <span>
            {tarea.estado === 'COMPLETED' ? '✓ completada por' : '👤 ejecutando:'}{' '}
            <b className="text-[#1b1530]">{tarea.operarioEjecutando}</b>
          </span>
        )}
        {typeof tarea.progreso === 'number' && tarea.estado === 'IN_PROGRESS' && (
          <span>{tarea.progreso}% avance</span>
        )}
      </div>
    </div>
  )
}

function TareaRowSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-violet-100 bg-white p-3">
      <div className="h-2.5 w-16 rounded bg-violet-100" />
      <div className="mt-1.5 h-3.5 w-3/4 rounded bg-violet-100" />
      <div className="mt-2 h-2.5 w-24 rounded bg-violet-50" />
    </div>
  )
}

interface AreaTasksPanelProps {
  area: AreaPlano | null
}

/**
 * Detalle de un área seleccionada en el plano: solo lectura.
 * Sin acciones de reasignar tarea ni abrir no conformidad — las tareas
 * se asignan al área del día completo, no a un operario en particular.
 */
export function AreaTasksPanel({ area }: AreaTasksPanelProps) {
  const { data: tareas = [], isLoading } = useTareasArea(area?.id ?? null)

  if (!area) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <div className="text-3xl">🗺️</div>
        <p className="text-sm text-[#5e577a]">Toca un área del plano para ver sus tareas del día.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Cabecera del área */}
      <div className="shrink-0 border-b border-violet-100 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-extrabold leading-snug">{area.nombre}</h2>
          <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold', CUMPLIMIENTO_BADGE[area.estadoCumplimiento])}>
            {ESTADO_CUMPLIMIENTO_LABEL[area.estadoCumplimiento]}
          </span>
        </div>
        <p className="mt-1 text-xs text-[#5e577a]">
          {area.totalTareas === 0 ? (
            'Sin tareas programadas hoy.'
          ) : (
            <>
              {area.tareasCompletadas}/{area.totalTareas} tareas completadas
            </>
          )}
          {area.tareasVencidas > 0 && <> · <b className="text-rose-600">{area.tareasVencidas} vencida{area.tareasVencidas > 1 ? 's' : ''}</b></>}
        </p>
      </div>

      {/* Lista de tareas */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          {isLoading
            ? [0, 1, 2].map((i) => <TareaRowSkeleton key={i} />)
            : tareas.map((t) => <TareaRow key={t.id} tarea={t} />)}
        </div>

        {!isLoading && tareas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-2 text-3xl">🎉</div>
            <p className="text-sm text-[#5e577a]">No hay tareas programadas para esta área hoy.</p>
          </div>
        )}
      </div>
    </div>
  )
}
