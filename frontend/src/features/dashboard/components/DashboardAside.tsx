import { useDashboardResumen } from '../hooks/useDashboardResumen'
import type { ActividadResponse } from '@/mocks/types'

const DOT_COLOR: Record<ActividadResponse['tipo'], string> = {
  completado: 'bg-emerald-500',
  enviado:    'bg-orange-500',
  evidencia:  'bg-violet-500',
  alerta:     'bg-rose-500',
}

function SkeletonLine() {
  return (
    <li className="ml-3 animate-pulse">
      <div className="h-2.5 w-12 rounded bg-violet-100" />
      <div className="mt-1 h-3.5 w-40 rounded bg-violet-100" />
    </li>
  )
}

export function DashboardAside() {
  const { data, isLoading } = useDashboardResumen()

  return (
    <aside className="scrollbar-clean w-64 shrink-0 overflow-auto border-l border-violet-100 bg-[#faf9fc] p-5">
      {/* Tarjeta INVIMA */}
      <div className="rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 p-5 text-white shadow-xl shadow-violet-200">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest text-white/80">Próxima INVIMA</div>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">estimada</span>
        </div>
        <div className="mt-1 text-4xl font-extrabold">
          {isLoading ? '…' : `${data?.diasParaInvima} días`}
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-700"
            style={{ width: `${data?.paqueteEvidenciaPct ?? 0}%` }}
          />
        </div>
        <div className="mt-1.5 text-[11px] text-white/80">
          {data?.paqueteEvidenciaPct ?? '…'}% paquete de evidencias listo
        </div>
        <button className="mt-3 w-full rounded-2xl bg-white py-2.5 text-xs font-extrabold text-violet-700">
          Preparar visita →
        </button>
      </div>

      {/* Actividad reciente */}
      <h4 className="mb-3 mt-5 flex items-center gap-2 text-sm font-extrabold">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        Actividad reciente
      </h4>

      <ol className="relative ml-2 space-y-4 border-l-2 border-violet-200 text-sm">
        {isLoading
          ? [0, 1, 2, 3].map((i) => <SkeletonLine key={i} />)
          : data?.actividad.map((a) => (
              <li key={a.id} className="ml-3">
                <div
                  className={`absolute -left-2 h-4 w-4 rounded-full ring-4 ring-white ${DOT_COLOR[a.tipo]}`}
                />
                <div className="font-mono text-[11px] text-violet-600">{a.hora}</div>
                <div>
                  <b>{a.usuario}</b> {a.accion}{' '}
                  <span className="text-violet-700">{a.objetivo}</span>
                </div>
              </li>
            ))}
      </ol>

      {/* Sugerencia */}
      <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-3 text-[11px]">
        <div className="mb-1 font-extrabold text-orange-900">💡 Sugerencia</div>
        <div className="text-orange-900/80">
          Residuos sólidos está al 74%.{' '}
          <a href="#" className="font-bold text-orange-700">
            Programar capacitación
          </a>{' '}
          de manipuladores podría ayudar.
        </div>
      </div>
    </aside>
  )
}
