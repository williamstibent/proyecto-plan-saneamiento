import { useEffect, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { usePisos } from '../hooks/useFloorPlan'
import { FloorSelector, FloorSelectorSkeleton } from '../components/FloorSelector'
import { FloorPlanCanvas } from '../components/FloorPlanCanvas'
import { AreaTasksPanel } from '../components/AreaTasksPanel'

function LeyendaItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('h-2 w-2 rounded-full', color)} />
      {label}
    </span>
  )
}

/**
 * Mapa interactivo del establecimiento: piso → área → tareas del día.
 * Solo lectura — las tareas se asignan al área completa, no a un operario
 * en particular, así que no hay acciones de reasignar ni de abrir NC aquí.
 */
export function MapaPage() {
  const { data: pisos = [], isLoading, isError, refetch } = usePisos()
  const [pisoId, setPisoId] = useState<string | null>(null)
  const [areaId, setAreaId] = useState<string | null>(null)

  useEffect(() => {
    if (!pisoId && pisos.length > 0) setPisoId(pisos[0].id)
  }, [pisos, pisoId])

  const piso = pisos.find((p) => p.id === pisoId) ?? null
  const area = piso?.areas.find((a) => a.id === areaId) ?? null

  const handleSelectFloor = (id: string) => {
    setPisoId(id)
    setAreaId(null)
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Contenido principal ────────────────────── */}
      <main className="scrollbar-clean flex-1 overflow-auto bg-white p-4 lg:p-6">
        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-widest text-violet-600">Mapa del establecimiento</div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight lg:text-3xl">Plano interactivo</h1>
          <p className="text-sm text-[#5e577a]">Selecciona un piso y luego un área para ver sus tareas del día.</p>
        </div>

        {isError && (
          <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-center text-sm text-rose-700">
            Error al cargar el plano.{' '}
            <button className="font-bold underline" onClick={() => { void refetch() }}>
              Reintentar
            </button>
          </div>
        )}

        {isLoading ? (
          <FloorSelectorSkeleton />
        ) : (
          pisos.length > 0 && <FloorSelector pisos={pisos} selectedId={pisoId} onSelect={handleSelectFloor} />
        )}

        <div className="mt-4">
          {isLoading || !piso ? (
            <div className="w-full animate-pulse rounded-3xl bg-violet-50" style={{ aspectRatio: '1 / 0.62' }} />
          ) : (
            <FloorPlanCanvas areas={piso.areas} selectedAreaId={areaId} onSelectArea={setAreaId} />
          )}
        </div>

        {/* Leyenda */}
        {!isLoading && (
          <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-[#5e577a]">
            <LeyendaItem color="bg-emerald-500" label="Al día" />
            <LeyendaItem color="bg-orange-500" label="Próxima a vencer" />
            <LeyendaItem color="bg-rose-500" label="Vencida" />
            <LeyendaItem color="bg-violet-600" label="En ejecución" />
          </div>
        )}
      </main>

      {/* ── Panel lateral derecho — solo desktop ───── */}
      <aside className="hidden w-80 shrink-0 border-l border-violet-100 lg:block">
        <AreaTasksPanel area={area} />
      </aside>

      {/* ── Bottom sheet — solo móvil ───────────────── */}
      {area && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => { setAreaId(null) }}>
          <div
            className="absolute inset-x-0 bottom-0 flex h-[75vh] flex-col rounded-t-3xl bg-white shadow-2xl"
            onClick={(e) => { e.stopPropagation() }}
          >
            <div className="flex shrink-0 items-center justify-center pb-1 pt-2">
              <span className="h-1 w-10 rounded-full bg-violet-200" />
            </div>
            <div className="flex-1 overflow-hidden">
              <AreaTasksPanel area={area} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
