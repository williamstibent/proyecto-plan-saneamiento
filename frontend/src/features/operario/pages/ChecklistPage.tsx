import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { useTareaDetalle, useCompletarPaso, useCompletarTarea } from '../hooks/useTareasOperario'
import { CompletarRapidoModal } from '../components/CompletarRapidoModal'
import { FASES_CHECKLIST } from '@/features/procedures/types'
import type { PasoEjecucion } from '../types'

// ─── Colores por fase ─────────────────────────────────────────────────────────

const FASE_STYLE: Record<string, { badge: string; bg: string }> = {
  preparacion:  { badge: 'bg-orange-100 text-orange-700',  bg: 'bg-orange-50'  },
  limpieza:     { badge: 'bg-sky-100 text-sky-700',        bg: 'bg-sky-50'     },
  desinfeccion: { badge: 'bg-violet-100 text-violet-700',  bg: 'bg-violet-50'  },
  verificacion: { badge: 'bg-emerald-100 text-emerald-700',bg: 'bg-emerald-50' },
}

// ─── Paso del checklist ───────────────────────────────────────────────────────

interface PasoItemProps {
  paso: PasoEjecucion
  index: number
  tareaId: string
  isFirst: boolean    // para habilitar/deshabilitar en secuencia
  onCompleted: () => void
}

function PasoItem({ paso, index, tareaId, isFirst, onCompleted }: PasoItemProps) {
  const [observacion, setObservacion] = useState('')
  const [expanded, setExpanded]       = useState(false)
  const completarPasoMutation         = useCompletarPaso(tareaId)

  const faseLabel = FASES_CHECKLIST.find((f) => f.value === paso.fase)?.label ?? paso.fase
  const style     = FASE_STYLE[paso.fase] ?? FASE_STYLE['limpieza']
  const isDone    = paso.estado === 'completado'

  const handleCompletar = () => {
    completarPasoMutation.mutate(
      { pasoId: paso.id, body: { observacion: observacion.trim() || undefined } },
      { onSuccess: onCompleted },
    )
  }

  return (
    <div
      className={cn(
        'rounded-2xl border transition-all',
        isDone ? 'border-emerald-100 bg-emerald-50/50' : 'border-violet-100 bg-white',
        !isDone && !isFirst && 'opacity-50',
      )}
    >
      {/* Header del paso */}
      <button
        type="button"
        disabled={isDone || (!isDone && !isFirst)}
        onClick={() => !isDone && isFirst && setExpanded((e) => !e)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        {/* Número / check */}
        <div
          className={cn(
            'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs font-extrabold transition-colors',
            isDone
              ? 'border-emerald-400 bg-emerald-400 text-white'
              : isFirst
              ? 'border-violet-400 text-violet-600'
              : 'border-violet-200 text-violet-300',
          )}
        >
          {isDone ? '✓' : index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold leading-snug">{paso.descripcion}</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', style.badge)}>
              {faseLabel}
            </span>
            {paso.requiereFoto && (
              <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-semibold text-fuchsia-700">
                📸 requiere foto
              </span>
            )}
          </div>

          {/* Observación completada */}
          {isDone && paso.observacion && (
            <div className="mt-2 text-[11px] italic text-emerald-700">
              "{paso.observacion}"
            </div>
          )}
          {isDone && paso.evidenciaUrl && (
            <div className="mt-2 text-[11px] text-emerald-600 font-semibold">📸 Evidencia registrada</div>
          )}
          {isDone && paso.completadoEn && (
            <div className="text-[10px] text-emerald-600 mt-0.5">
              ✓ {new Date(paso.completadoEn).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        {/* Flecha expand — solo si es el paso activo */}
        {!isDone && isFirst && (
          <svg
            className={cn('mt-1 shrink-0 text-violet-400 transition-transform', expanded && 'rotate-90')}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        )}
      </button>

      {/* Panel expandido */}
      {expanded && !isDone && isFirst && (
        <div className={cn('border-t border-violet-100 px-4 pb-4 pt-3', style.bg)}>
          {/* Simulación de foto */}
          {paso.requiereFoto && (
            <div className="mb-3 flex items-center gap-3 rounded-xl border border-fuchsia-100 bg-white p-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-fuchsia-50 text-2xl">
                📸
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-fuchsia-700">Evidencia fotográfica</div>
                <div className="text-[11px] text-[#5e577a]">Toma o adjunta una foto antes de continuar</div>
              </div>
              <button className="rounded-xl bg-fuchsia-600 px-3 py-1.5 text-[11px] font-bold text-white">
                Capturar
              </button>
            </div>
          )}

          {/* Observación */}
          <div>
            <label className="text-[11px] font-bold text-violet-700">Observación (opcional)</label>
            <textarea
              rows={2}
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Añadir comentario o novedad..."
              className="mt-1.5 w-full resize-none rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
            />
          </div>

          <button
            onClick={handleCompletar}
            disabled={completarPasoMutation.isPending}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 py-3 text-sm font-extrabold text-white shadow-md shadow-violet-200 disabled:opacity-60"
          >
            {completarPasoMutation.isPending ? 'Guardando…' : '✓ Marcar como completado'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ChecklistSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-violet-100 bg-white p-4">
          <div className="flex gap-3">
            <div className="h-7 w-7 rounded-full bg-violet-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-violet-100" />
              <div className="h-2.5 w-20 rounded bg-violet-50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Modal de cierre de tarea ─────────────────────────────────────────────────

interface CompletarModalProps {
  tareaId: string
  onClose: () => void
  onSuccess: () => void
}

function CompletarModal({ tareaId, onClose, onSuccess }: CompletarModalProps) {
  const [observacion, setObservacion] = useState('')
  const completarMutation = useCompletarTarea(tareaId)

  const handleSubmit = () => {
    completarMutation.mutate(
      { observacionGeneral: observacion.trim() || undefined },
      { onSuccess },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 text-center">
          <div className="mb-2 text-4xl">🎉</div>
          <h3 className="text-lg font-extrabold">¡Todos los pasos completados!</h3>
          <p className="mt-1 text-sm text-[#5e577a]">Puedes añadir una observación general antes de finalizar.</p>
        </div>

        <textarea
          rows={3}
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          placeholder="Observación general de la tarea (opcional)..."
          className="w-full resize-none rounded-xl border border-violet-100 bg-[#faf9fc] px-3 py-2.5 text-sm outline-none focus:border-violet-400"
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-violet-100 py-3 text-sm font-semibold hover:bg-[#faf9fc]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={completarMutation.isPending}
            className="flex-1 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 py-3 text-sm font-extrabold text-white shadow-lg shadow-violet-200 disabled:opacity-60"
          >
            {completarMutation.isPending ? 'Finalizando…' : '🚀 Finalizar tarea'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export function ChecklistPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate     = useNavigate()
  const { data: tarea, isLoading, isError } = useTareaDetalle(id)

  const [showModal, setShowModal]       = useState(false)
  const [showQuickModal, setShowQuickModal] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center gap-3 border-b border-violet-100 bg-white px-4">
          <div className="h-4 w-24 animate-pulse rounded bg-violet-100" />
        </div>
        <ChecklistSkeleton />
      </div>
    )
  }

  if (isError || !tarea) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-4xl">⚠️</div>
        <p className="text-sm text-rose-600">No se pudo cargar la tarea.</p>
        <Link to="/operario/hoy" className="text-sm font-semibold text-violet-600">← Volver</Link>
      </div>
    )
  }

  const pasosCompletados = tarea.pasos.filter((p) => p.estado === 'completado').length
  const totalPasos       = tarea.pasos.length
  const progresoPct      = totalPasos > 0 ? Math.round((pasosCompletados / totalPasos) * 100) : 0
  const todoListo        = pasosCompletados === totalPasos && totalPasos > 0
  const isCompleted      = tarea.estado === 'COMPLETED'

  // Índice del primer paso pendiente
  const firstPendingIdx = tarea.pasos.findIndex((p) => p.estado === 'pendiente')

  const handlePasoCompleted = () => {
    const remaining = tarea.pasos.filter((p) => p.estado === 'pendiente').length
    if (remaining === 1) {
      // Último paso — mostrar modal de completar tarea
      setTimeout(() => setShowModal(true), 600)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-violet-100 bg-white">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button
            onClick={() => navigate('/operario/hoy')}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-violet-100 text-violet-600"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>

          <div className="flex-1 min-w-0">
            <div className="font-mono text-[10px] font-bold text-violet-600">{tarea.poeCode}</div>
            <div className="text-sm font-extrabold leading-tight truncate">{tarea.nombre}</div>
          </div>

          {/* Botón completar rápido — solo si la tarea no está finalizada */}
          {!isCompleted && (
            <button
              onClick={() => setShowQuickModal(true)}
              title="Completar sin pasos"
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Rápido
            </button>
          )}
        </div>

        {/* Barra de progreso */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-[11px] text-[#5e577a] mb-1.5">
            <span>{pasosCompletados} de {totalPasos} pasos</span>
            <span className="font-bold text-violet-700">{progresoPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-violet-100">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700',
                isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500',
              )}
              style={{ width: `${progresoPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Lista de pasos ───────────────────────────────────── */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {isCompleted && (
          <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="font-extrabold text-emerald-800">Tarea finalizada</div>
            {tarea.completadoEn && (
              <div className="text-xs text-emerald-600 mt-0.5">
                Completada a las {new Date(tarea.completadoEn).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            {tarea.observacionGeneral && (
              <div className="mt-2 text-xs italic text-emerald-700">"{tarea.observacionGeneral}"</div>
            )}
          </div>
        )}

        <div className="space-y-3 lg:max-w-2xl lg:mx-auto">
          {tarea.pasos.map((paso, i) => (
            <PasoItem
              key={paso.id}
              paso={paso}
              index={i}
              tareaId={tarea.id}
              isFirst={i === firstPendingIdx && !isCompleted}
              onCompleted={handlePasoCompleted}
            />
          ))}
        </div>

        {/* Botón finalizar — visible cuando todos los pasos están hechos pero la tarea no */}
        {todoListo && !isCompleted && (
          <div className="mt-6 lg:max-w-2xl lg:mx-auto">
            <button
              onClick={() => setShowModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 py-4 text-base font-extrabold text-white shadow-lg shadow-violet-200"
            >
              🚀 Finalizar tarea
            </button>
          </div>
        )}
      </div>

      {/* ── Modal de confirmación (completado normal) ────────── */}
      {showModal && (
        <CompletarModal
          tareaId={tarea.id}
          onClose={() => setShowModal(false)}
          onSuccess={() => navigate('/operario/hoy', { replace: true })}
        />
      )}

      {/* ── Modal de completado rápido ────────────────────────── */}
      {showQuickModal && (
        <CompletarRapidoModal
          tareaId={tarea.id}
          tareaNombre={tarea.nombre}
          pasosPendientes={tarea.pasos.filter((p) => p.estado === 'pendiente').length}
          onClose={() => setShowQuickModal(false)}
          onSuccess={() => navigate('/operario/hoy', { replace: true })}
        />
      )}
    </div>
  )
}
