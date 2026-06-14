import { useTareasHoy } from '../hooks/useTareasHoy'
import type { TareaHoyResponse } from '@/mocks/types'
import type { TaskStatus } from '@/shared/types'

interface ColumnConfig {
  id: string
  estado: TaskStatus
  label: string
  badgeClass: string
  cardClass: string
  textClass: string
}

const COLUMNS: ColumnConfig[] = [
  { id: 'vencidas',      estado: 'EXPIRED',     label: 'Vencidas',      badgeClass: 'bg-rose-100 text-rose-700',    cardClass: 'bg-rose-50 border-rose-100',    textClass: 'text-rose-700'    },
  { id: 'proximas',      estado: 'PENDING',      label: 'Próximas',      badgeClass: 'bg-orange-100 text-orange-700',cardClass: 'bg-orange-50 border-orange-100',textClass: 'text-orange-700'  },
  { id: 'en-ejecucion',  estado: 'IN_PROGRESS',  label: 'En ejecución',  badgeClass: 'bg-violet-100 text-violet-700',cardClass: 'bg-violet-50 border-violet-100',textClass: 'text-violet-700'  },
  { id: 'hechas',        estado: 'COMPLETED',    label: 'Hechas',        badgeClass: 'bg-emerald-100 text-emerald-700',cardClass: 'bg-emerald-50 border-emerald-100',textClass: 'text-emerald-700'},
]

function TareaCard({ tarea, column }: { tarea: TareaHoyResponse; column: ColumnConfig }) {
  return (
    <div className={`rounded-xl border p-3 ${column.cardClass}`}>
      <div className={`flex items-center gap-1 font-mono text-[10px] ${column.textClass}`}>
        {tarea.poeCode}
        {tarea.urgente && <span className="text-orange-500">⚡</span>}
      </div>
      <div className="mt-0.5 text-sm font-bold">{tarea.titulo}</div>
      <div className={`mt-1 text-[11px] ${column.textClass}`}>
        {tarea.area && `${tarea.area} · `}
        {tarea.responsable}
        {tarea.hora && ` · ${tarea.hora}`}
        {tarea.estado === 'COMPLETED' && ' ✓ validada'}
      </div>
      {tarea.estado === 'IN_PROGRESS' && tarea.progreso !== undefined && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-violet-500 transition-[width] duration-700"
            style={{ width: `${tarea.progreso}%` }}
          />
        </div>
      )}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-violet-100 bg-violet-50/40 p-3">
      <div className="h-2.5 w-20 rounded bg-violet-100" />
      <div className="mt-1.5 h-3.5 w-32 rounded bg-violet-100" />
      <div className="mt-1 h-2.5 w-24 rounded bg-violet-100" />
    </div>
  )
}

export function TaskFlowBoard() {
  const { data: tareas = [], isLoading, isError } = useTareasHoy()

  const tareasFor = (estado: TaskStatus) => tareas.filter((t) => t.estado === estado)

  return (
    <div className="rounded-3xl border border-violet-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="font-extrabold">Flujo de tareas — hoy</h4>
          <p className="text-xs text-violet-700">todas las áreas</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 rounded-full bg-[#f3f0f9] px-2.5 py-1 text-[11px] font-semibold text-[#5e577a]">
            📍 Área
          </button>
          <button className="inline-flex items-center gap-1 rounded-full bg-[#f3f0f9] px-2.5 py-1 text-[11px] font-semibold text-[#5e577a]">
            👤 Responsable
          </button>
        </div>
      </div>

      {isError && (
        <p className="text-center text-sm text-rose-600">
          Error al cargar las tareas. Intenta de nuevo.
        </p>
      )}

      <div className="grid grid-cols-4 gap-3">
        {COLUMNS.map((col) => {
          const columnTareas = tareasFor(col.estado)
          return (
            <div key={col.id}>
              <div className={`mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest ${col.textClass}`}>
                <span>{col.label}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${col.badgeClass}`}>
                  {isLoading ? '…' : columnTareas.length}
                </span>
              </div>
              <div className="space-y-2">
                {isLoading
                  ? [0, 1].map((i) => <SkeletonCard key={i} />)
                  : columnTareas.map((t) => <TareaCard key={t.id} tarea={t} column={col} />)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
