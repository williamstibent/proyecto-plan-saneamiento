import { ProgramasMinimos } from '../components/ProgramasMinimos'
import { TaskFlowBoard }    from '../components/TaskFlowBoard'
import { DashboardAside }   from '../components/DashboardAside'
import { useDashboardResumen } from '../hooks/useDashboardResumen'

export function DashboardPage() {
  const { data: resumen, isLoading } = useDashboardResumen()

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Contenido principal ────────────────────── */}
      <main className="scrollbar-clean flex-1 overflow-auto bg-white p-6">
        {/* Cabecera */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-violet-600">
              {resumen?.fecha ?? <span className="inline-block h-3 w-32 animate-pulse rounded bg-violet-100" />}
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
              {isLoading
                ? <span className="inline-block h-9 w-64 animate-pulse rounded bg-violet-100" />
                : `Buen día, ${resumen?.saludo} ✨`}
            </h1>
            {!isLoading && resumen && (
              <p className="text-sm text-[#5e577a]">
                Hoy tienes <b className="text-[#1b1530]">{resumen.totalTareasDia} tareas</b> en{' '}
                {resumen.areasActivas} áreas.{' '}
                {resumen.tareasProximasAVencer > 0 && (
                  <b className="text-orange-700">{resumen.tareasProximasAVencer} cerca de vencer</b>
                )}
                .
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex w-64 items-center gap-2 rounded-2xl border border-violet-100 bg-white px-3 py-2 text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6">
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <path strokeWidth="2" d="M21 21l-4-4" />
              </svg>
              <input className="w-full bg-transparent text-sm outline-none" placeholder="Buscar..." />
            </div>
            <button className="rounded-2xl border border-violet-100 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-[#faf9fc]">
              📤 Exportar
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-300">
              + Nueva
            </button>
          </div>
        </div>

        <ProgramasMinimos />

        <div className="mt-5">
          <TaskFlowBoard />
        </div>
      </main>

      {/* ── Panel lateral derecho ───────────────────── */}
      <DashboardAside />
    </div>
  )
}
