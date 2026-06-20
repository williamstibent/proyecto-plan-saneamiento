import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { usePoeRepositorio } from '../../../hooks/usePoeRepositorio'
import { ORIGEN_POE_LABEL } from '../../../types'
import type { ModoBusquedaPoe, OrigenPoe } from '../../../types'
import { PROGRAMAS_LABEL } from '@/features/procedures/types'
import type { ProgramaMinimo } from '@/features/procedures/types'
import type { PoeRepositorioItem } from '@/mocks/data/poe-repositorio'

interface Props {
  onNext: (partial: { poeSeleccionado: PoeRepositorioItem }) => void
  onBack: () => void
}

const ORIGEN_BADGE_STYLE: Record<OrigenPoe, string> = {
  'plantilla-plataforma': 'bg-violet-100 text-violet-700',
  'plantilla-tenant':     'bg-amber-100 text-amber-700',
  cliente:                'bg-slate-100 text-slate-700',
}

function PoeCard({ item, isSelected, onSelect }: { item: PoeRepositorioItem; isSelected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full rounded-2xl border-2 p-4 text-left transition',
        isSelected ? 'border-violet-400 bg-violet-50 shadow-sm shadow-violet-100' : 'border-violet-100 bg-white hover:border-violet-200',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-violet-600">{item.codigo}</span>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', ORIGEN_BADGE_STYLE[item.origen])}>
              {ORIGEN_POE_LABEL[item.origen]}
            </span>
          </div>
          <div className="mt-1 font-extrabold">{item.nombre}</div>
          <p className="mt-0.5 text-[12px] text-[#5e577a]">{item.descripcion}</p>
          <div className="mt-2 text-[11px] text-[#5e577a]">
            {PROGRAMAS_LABEL[item.programa]} · {item.areaAplicacion} · usado {item.vecesUtilizado}×
            {item.clienteOrigenNombre && <> · originalmente de <b>{item.clienteOrigenNombre}</b></>}
          </div>
        </div>
        {isSelected && <span className="text-lg text-violet-600">✓</span>}
      </div>
    </button>
  )
}

export function Step3BuscarPoe({ onNext, onBack }: Props) {
  const [modo, setModo]               = useState<ModoBusquedaPoe>('todos')
  const [query, setQuery]             = useState('')
  const [programa, setPrograma]       = useState<ProgramaMinimo | undefined>(undefined)
  const [seleccionado, setSeleccionado] = useState<PoeRepositorioItem | null>(null)

  const { data: resultados = [], isLoading } = usePoeRepositorio(
    query.trim() || undefined,
    modo === 'programa' ? programa : undefined,
  )

  const cambiarModo = (nuevoModo: ModoBusquedaPoe) => {
    setModo(nuevoModo)
    if (nuevoModo === 'todos') setPrograma(undefined)
  }

  return (
    <div className="flex h-full flex-col">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-violet-600">Paso 3 / 4</div>
        <h3 className="mt-1 text-2xl font-extrabold tracking-tight">Buscar POE</h3>
        <p className="mt-1 text-sm text-[#5e577a]">
          Busca en el repositorio: plantillas de SanitIA, plantillas publicadas por otros clientes y POEs ya creados.
        </p>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => { cambiarModo('todos') }}
          className={cn('rounded-full px-4 py-1.5 text-xs font-semibold transition', modo === 'todos' ? 'bg-violet-600 text-white shadow-sm' : 'bg-[#f3f0f9] text-[#5e577a] hover:bg-violet-100')}
        >
          Todos los procedimientos
        </button>
        <button
          type="button"
          onClick={() => { cambiarModo('programa') }}
          className={cn('rounded-full px-4 py-1.5 text-xs font-semibold transition', modo === 'programa' ? 'bg-violet-600 text-white shadow-sm' : 'bg-[#f3f0f9] text-[#5e577a] hover:bg-violet-100')}
        >
          Por programa mínimo
        </button>
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value) }}
          placeholder={modo === 'todos' ? 'Buscar por código, nombre o descripción…' : 'Refinar por texto (opcional)…'}
          className="w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />

        {modo === 'programa' && (
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(PROGRAMAS_LABEL) as ProgramaMinimo[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { setPrograma((prev) => (prev === p ? undefined : p)) }}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-[11px] font-medium transition',
                  programa === p ? 'border-violet-400 bg-violet-100 text-violet-800' : 'border-violet-100 bg-white text-[#5e577a] hover:border-violet-300',
                )}
              >
                {PROGRAMAS_LABEL[p]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex-1 space-y-2 overflow-auto">
        {isLoading ? (
          <p className="text-xs text-[#5e577a]">Buscando…</p>
        ) : resultados.length === 0 ? (
          <p className="text-xs text-[#5e577a]">Sin resultados. Ajusta la búsqueda o el programa.</p>
        ) : (
          resultados.map((item) => (
            <PoeCard key={item.id} item={item} isSelected={seleccionado?.id === item.id} onSelect={() => { setSeleccionado(item) }} />
          ))
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-violet-100 pt-5">
        <button type="button" onClick={onBack} className="text-sm font-semibold text-[#5e577a] hover:text-[#1b1530]">
          ← Atrás
        </button>
        <div className="font-mono text-xs text-violet-600">3 / 4</div>
        <button
          type="button"
          disabled={!seleccionado}
          onClick={() => { if (seleccionado) onNext({ poeSeleccionado: seleccionado }) }}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-300 transition hover:from-violet-600 hover:to-violet-800 disabled:opacity-40"
        >
          Adaptar este POE →
        </button>
      </div>
    </div>
  )
}
