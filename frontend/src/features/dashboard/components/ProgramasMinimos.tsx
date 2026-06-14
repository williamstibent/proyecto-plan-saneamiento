import { useState } from 'react'
import { useProgramasCumplimiento } from '../hooks/useProgramasCumplimiento'
import type { ProgramaCumplimientoResponse } from '@/mocks/types'

// Paleta de colores por programa (índice en el orden que devuelve el backend)
// Si el backend agrega más programas, agregar más entradas aquí.
const PALETTE: Array<{ bg: string; border: string; text: string; bar: string }> = [
  { bg: 'bg-emerald-50/60', border: 'border-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  { bg: 'bg-sky-50/60',     border: 'border-sky-100',     text: 'text-sky-700',     bar: 'bg-sky-500'     },
  { bg: 'bg-orange-50/70',  border: 'border-orange-100',  text: 'text-orange-700',  bar: 'bg-orange-500'  },
  { bg: 'bg-violet-50/60',  border: 'border-violet-100',  text: 'text-violet-700',  bar: 'bg-violet-500'  },
]

function ProgramaCard({
  programa,
  index,
}: {
  programa: ProgramaCumplimientoResponse
  index: number
}) {
  const c = PALETTE[index % PALETTE.length]
  return (
    <div className={`rounded-2xl border p-4 ${c.bg} ${c.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-lg shadow-sm">
            {programa.emoji}
          </div>
          <div>
            <div className="text-sm font-extrabold">{programa.nombre}</div>
            <div className={`text-[11px] ${c.text}`}>{programa.descripcion}</div>
          </div>
        </div>
        <div className={`font-mono text-2xl font-extrabold ${c.text}`}>
          {programa.cumplimiento}%
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
        <div
          className={`h-full rounded-full ${c.bar} transition-[width] duration-700`}
          style={{ width: `${programa.cumplimiento}%` }}
        />
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-2xl bg-violet-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-32 rounded bg-violet-100" />
          <div className="h-2.5 w-20 rounded bg-violet-100" />
        </div>
        <div className="h-7 w-12 rounded bg-violet-100" />
      </div>
      <div className="mt-4 h-2 rounded-full bg-violet-100" />
    </div>
  )
}

export function ProgramasMinimos() {
  const [periodo, setPeriodo] = useState<'mes' | 'semana'>('mes')
  const { data: programas, isLoading, isError } = useProgramasCumplimiento(periodo)

  return (
    <div className="rounded-3xl border border-violet-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-extrabold">Programas mínimos</h4>
          <p className="text-xs text-violet-700">Resolución 2674 / 2013 · últimos 30 días</p>
        </div>
        <div className="flex gap-1 text-[11px]">
          <button
            onClick={() => setPeriodo('mes')}
            className={`rounded-full px-2.5 py-1 ${periodo === 'mes' ? 'bg-violet-950 text-white' : 'hover:bg-violet-50'}`}
          >
            Mes
          </button>
          <button
            onClick={() => setPeriodo('semana')}
            className={`rounded-full px-2.5 py-1 ${periodo === 'semana' ? 'bg-violet-950 text-white' : 'hover:bg-violet-50'}`}
          >
            Semana
          </button>
        </div>
      </div>

      {isError && (
        <p className="mt-5 text-center text-sm text-rose-600">
          Error al cargar los programas. Intenta de nuevo.
        </p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : programas?.map((p, i) => <ProgramaCard key={p.id} programa={p} index={i} />)}
      </div>
    </div>
  )
}
