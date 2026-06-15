import { useHistorial } from '../hooks/useTareasOperario'
import { FRECUENCIA_LABEL } from '@/features/procedures/types'
import type { TareaResumen } from '../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFechaRelativa(iso: string): string {
  const hoy      = new Date()
  const fecha    = new Date(iso)
  const diffMs   = hoy.getTime() - fecha.getTime()
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDias === 0) return 'Hoy'
  if (diffDias === 1) return 'Ayer'
  if (diffDias < 7)  return `Hace ${diffDias} días`
  return fecha.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}

function formatHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

// ─── Agrupación por fecha ─────────────────────────────────────────────────────

function agruparPorFecha(tareas: TareaResumen[]): Map<string, TareaResumen[]> {
  const map = new Map<string, TareaResumen[]>()
  for (const t of tareas) {
    if (!t.completadoEn) continue
    const key = formatFechaRelativa(t.completadoEn)
    const arr = map.get(key) ?? []
    arr.push(t)
    map.set(key, arr)
  }
  return map
}

// ─── Card de historial ────────────────────────────────────────────────────────

function HistorialCard({ tarea }: { tarea: TareaResumen }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Check */}
        <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm">
          ✅
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-[10px] font-bold text-violet-600">{tarea.poeCode}</span>
            {tarea.completadoEn && (
              <span className="shrink-0 text-[10px] text-[#5e577a]">{formatHora(tarea.completadoEn)}</span>
            )}
          </div>

          <div className="mt-0.5 text-sm font-extrabold leading-snug">{tarea.nombre}</div>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[#f3f0f9] px-2 py-0.5 text-[10px] font-semibold text-[#5e577a]">
              📍 {tarea.area}
            </span>
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
              🔁 {FRECUENCIA_LABEL[tarea.frecuencia]}
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              ✓ {tarea.pasosCompletados}/{tarea.totalPasos} pasos
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function HistorialSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-violet-100 bg-white p-4">
          <div className="flex gap-3">
            <div className="h-7 w-7 rounded-full bg-emerald-100" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-20 rounded bg-violet-100" />
              <div className="h-4 w-2/3 rounded bg-violet-100" />
              <div className="h-2.5 w-32 rounded bg-violet-50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export function HistorialPage() {
  const { data: tareas = [], isLoading, isError, refetch } = useHistorial()

  const grupos = agruparPorFecha(tareas)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Cabecera ─────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-violet-100 bg-white px-4 pb-4 pt-5">
        <h1 className="text-xl font-extrabold tracking-tight">Historial</h1>
        <p className="mt-0.5 text-sm text-[#5e577a]">
          {isLoading ? '…' : `${tareas.length} tarea${tareas.length !== 1 ? 's' : ''} completada${tareas.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* ── Lista agrupada ───────────────────────────────────── */}
      <div className="flex-1 overflow-auto px-4 pb-4 pt-3">
        {isError && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-center text-sm text-rose-700">
            Error al cargar el historial.{' '}
            <button className="font-bold underline" onClick={() => refetch()}>
              Reintentar
            </button>
          </div>
        )}

        {isLoading ? (
          <HistorialSkeleton />
        ) : tareas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 text-5xl">📋</div>
            <h3 className="text-base font-extrabold">Sin historial aún</h3>
            <p className="mt-1 text-sm text-[#5e577a]">Las tareas que completes aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-6 lg:max-w-2xl lg:mx-auto">
            {Array.from(grupos.entries()).map(([fecha, items]) => (
              <div key={fecha}>
                <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-violet-500">
                  {fecha}
                </div>
                <div className="space-y-2">
                  {items.map((t) => (
                    <HistorialCard key={t.id} tarea={t} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
