import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { useTareasHoyOperario } from '../hooks/useTareasOperario'
import { CompletarRapidoModal } from '../components/CompletarRapidoModal'
import { FRECUENCIA_LABEL } from '@/features/procedures/types'
import type { TareaResumen } from '../types'
import type { TaskStatus } from '@/shared/types'

// ─── Estilos por estado ───────────────────────────────────────────────────────

const ESTADO_CONFIG: Record<TaskStatus, {
  label: string
  dot: string
  badge: string
  card: string
  border: string
}> = {
  IN_PROGRESS: {
    label: 'En ejecución',
    dot:   'bg-violet-500',
    badge: 'bg-violet-100 text-violet-700',
    card:  'bg-white',
    border:'border-violet-200',
  },
  PENDING: {
    label: 'Pendiente',
    dot:   'bg-orange-400',
    badge: 'bg-orange-100 text-orange-700',
    card:  'bg-white',
    border:'border-violet-100',
  },
  COMPLETED: {
    label: 'Completada',
    dot:   'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
    card:  'bg-emerald-50/50',
    border:'border-emerald-100',
  },
  EXPIRED: {
    label: 'Vencida',
    dot:   'bg-rose-500',
    badge: 'bg-rose-100 text-rose-700',
    card:  'bg-rose-50/50',
    border:'border-rose-100',
  },
}

// ─── Progreso visual ──────────────────────────────────────────────────────────

function ProgressBar({ total, done, estado }: { total: number; done: number; estado: TaskStatus }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const barColor = estado === 'COMPLETED' ? 'bg-emerald-500' : 'bg-violet-500'
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[10px] text-[#5e577a]">
        <span>{done} / {total} pasos</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-violet-100">
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Card de tarea ────────────────────────────────────────────────────────────

interface TareaCardProps {
  tarea: TareaResumen
  onQuickComplete: (tarea: TareaResumen) => void
}

function TareaCard({ tarea, onQuickComplete }: TareaCardProps) {
  const cfg = ESTADO_CONFIG[tarea.estado]
  const isCompleted = tarea.estado === 'COMPLETED'
  const canQuickComplete = tarea.estado === 'PENDING' || tarea.estado === 'IN_PROGRESS'

  return (
    <Link
      to={`/operario/tareas/${tarea.id}`}
      className={cn(
        'block rounded-2xl border p-4 shadow-sm transition hover:shadow-md active:scale-[0.98]',
        cfg.card, cfg.border,
      )}
    >
      <div className="flex items-start gap-3">
        {/* Dot indicador de estado */}
        <div className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', cfg.dot, tarea.estado === 'IN_PROGRESS' && 'animate-pulse')} />

        <div className="flex-1 min-w-0">
          {/* Código + hora */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] font-bold text-violet-600">{tarea.poeCode}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              {tarea.urgente && !isCompleted && (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">⚡ urgente</span>
              )}
              {tarea.horaEstimada && (
                <span className="text-[10px] text-[#5e577a]">⏰ {tarea.horaEstimada}</span>
              )}
            </div>
          </div>

          {/* Nombre */}
          <div className={cn('mt-0.5 text-sm font-extrabold leading-snug', isCompleted && 'line-through opacity-60')}>
            {tarea.nombre}
          </div>

          {/* Área + frecuencia */}
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-[#f3f0f9] px-2 py-0.5 text-[10px] font-semibold text-[#5e577a]">
              📍 {tarea.area}
            </span>
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
              🔁 {FRECUENCIA_LABEL[tarea.frecuencia]}
            </span>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', cfg.badge)}>
              {cfg.label}
            </span>
          </div>

          {/* Barra de progreso */}
          {!isCompleted && tarea.totalPasos > 0 && (
            <ProgressBar total={tarea.totalPasos} done={tarea.pasosCompletados} estado={tarea.estado} />
          )}

          {isCompleted && tarea.completadoEn && (
            <div className="mt-2 text-[10px] text-emerald-600">
              ✅ Completada a las {new Date(tarea.completadoEn).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        {/* Acciones derechas */}
        <div className="flex shrink-0 flex-col items-center gap-2 ml-1">
          {/* Botón completar rápido */}
          {canQuickComplete && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onQuickComplete(tarea) }}
              title="Completar sin pasos"
              className="grid h-8 w-8 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100 active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </button>
          )}
          {/* Arrow de navegación */}
          {!isCompleted && (
            <svg className="text-violet-200" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-violet-100 bg-white p-4">
      <div className="flex gap-3">
        <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-violet-200" />
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-24 rounded bg-violet-100" />
          <div className="h-4 w-3/4 rounded bg-violet-100" />
          <div className="h-2.5 w-32 rounded bg-violet-50" />
          <div className="mt-2 h-1.5 rounded-full bg-violet-50" />
        </div>
      </div>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

const ORDER: TaskStatus[] = ['IN_PROGRESS', 'PENDING', 'EXPIRED', 'COMPLETED']

export function TareasHoyPage() {
  const { data: tareas = [], isLoading, isError, refetch } = useTareasHoyOperario()
  const [quickTarget, setQuickTarget] = useState<TareaResumen | null>(null)

  const pendientes   = tareas.filter((t) => t.estado === 'PENDING').length
  const enEjecucion  = tareas.filter((t) => t.estado === 'IN_PROGRESS').length
  const completadas  = tareas.filter((t) => t.estado === 'COMPLETED').length

  const tareasOrdenadas = [...tareas].sort(
    (a, b) => ORDER.indexOf(a.estado) - ORDER.indexOf(b.estado),
  )

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Cabecera ─────────────────────────────────────────── */}
      <div className="shrink-0 bg-white px-4 pb-4 pt-5">
        <h1 className="text-xl font-extrabold tracking-tight">Mis tareas de hoy</h1>

        {/* Resumen en chips */}
        {!isLoading && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {enEjecucion > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
                {enEjecucion} en ejecución
              </span>
            )}
            {pendientes > 0 && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                {pendientes} pendiente{pendientes > 1 ? 's' : ''}
              </span>
            )}
            {completadas > 0 && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {completadas} completada{completadas > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Lista ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto px-4 pb-4 pt-3">
        {isError && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-center text-sm text-rose-700">
            Error al cargar las tareas.{' '}
            <button className="font-bold underline" onClick={() => refetch()}>
              Reintentar
            </button>
          </div>
        )}

        <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {isLoading
            ? [0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)
            : tareasOrdenadas.map((t) => (
                <TareaCard key={t.id} tarea={t} onQuickComplete={setQuickTarget} />
              ))}
        </div>

        {!isLoading && tareas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 text-5xl">🎉</div>
            <h3 className="text-base font-extrabold">Sin tareas pendientes</h3>
            <p className="mt-1 text-sm text-[#5e577a]">Todas las tareas del día están al día.</p>
          </div>
        )}
      </div>

      {/* Modal de completado rápido */}
      {quickTarget && (
        <CompletarRapidoModal
          tareaId={quickTarget.id}
          tareaNombre={quickTarget.nombre}
          pasosPendientes={quickTarget.totalPasos - quickTarget.pasosCompletados}
          onClose={() => setQuickTarget(null)}
          onSuccess={() => setQuickTarget(null)}
        />
      )}
    </div>
  )
}
