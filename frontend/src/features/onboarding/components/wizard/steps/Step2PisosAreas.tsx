import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { usePisosCliente, useCrearPisos } from '../../../hooks/useClientes'
import { AREAS_SUGERIDAS } from '../../../types'
import type { Cliente, PisoCliente } from '../../../types'

interface Props {
  cliente: Cliente
  onNext: (partial: { pisos: PisoCliente[] }) => void
  onBack: () => void
}

interface PisoDraft {
  id: string
  nombre: string
  areas: string[]
}

let draftSeq = 0
function nuevoPisoDraft(): PisoDraft {
  draftSeq += 1
  return { id: `draft-${String(draftSeq)}`, nombre: '', areas: [] }
}

export function Step2PisosAreas({ cliente, onNext, onBack }: Props) {
  const { data: pisosExistentes = [], isLoading } = usePisosCliente(cliente.id)
  const crearPisosMutation = useCrearPisos()

  const [drafts, setDrafts] = useState<PisoDraft[]>([nuevoPisoDraft()])
  const [areaInputPorPiso, setAreaInputPorPiso] = useState<Record<string, string>>({})

  const sugeridas = AREAS_SUGERIDAS[cliente.tipoEstablecimiento]

  const actualizarNombre = (pisoId: string, nombre: string) => {
    setDrafts((prev) => prev.map((p) => (p.id === pisoId ? { ...p, nombre } : p)))
  }

  const agregarArea = (pisoId: string, area: string) => {
    const nombre = area.trim()
    if (!nombre) return
    setDrafts((prev) => prev.map((p) => (p.id === pisoId && !p.areas.includes(nombre) ? { ...p, areas: [...p.areas, nombre] } : p)))
    setAreaInputPorPiso((prev) => ({ ...prev, [pisoId]: '' }))
  }

  const quitarArea = (pisoId: string, area: string) => {
    setDrafts((prev) => prev.map((p) => (p.id === pisoId ? { ...p, areas: p.areas.filter((a) => a !== area) } : p)))
  }

  const agregarPiso = () => { setDrafts((prev) => [...prev, nuevoPisoDraft()]) }

  const eliminarPiso = (pisoId: string) => { setDrafts((prev) => prev.filter((p) => p.id !== pisoId)) }

  const draftsValidos = drafts.filter((p) => p.nombre.trim() !== '' && p.areas.length > 0)
  const puedeContinuar = pisosExistentes.length > 0 || draftsValidos.length > 0

  const handleContinuar = () => {
    if (draftsValidos.length === 0) {
      onNext({ pisos: pisosExistentes })
      return
    }

    crearPisosMutation.mutate(
      { clienteId: cliente.id, pisos: draftsValidos.map((p) => ({ nombre: p.nombre.trim(), areas: p.areas })) },
      { onSuccess: (todosPisos) => { onNext({ pisos: todosPisos }) } },
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-violet-600">Paso 2 / 4</div>
        <h3 className="mt-1 text-2xl font-extrabold tracking-tight">Pisos y áreas</h3>
        <p className="mt-1 text-sm text-[#5e577a]">
          Define los pisos del establecimiento de <b>{cliente.nombre}</b> y las áreas dentro de cada uno.
        </p>
      </div>

      <div className="mt-6 flex-1 space-y-5 overflow-auto">
        {!isLoading && pisosExistentes.length > 0 && (
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-wider text-violet-500">Pisos ya registrados</div>
            <div className="space-y-2">
              {pisosExistentes.map((piso) => (
                <div key={piso.id} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                  <div className="text-sm font-bold text-emerald-900">{piso.nombre}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {piso.areas.map((area) => (
                      <span key={area.id} className="rounded-full bg-white px-2.5 py-1 text-[11px] text-emerald-800">
                        {area.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-wider text-violet-500">
              {pisosExistentes.length > 0 ? 'Agregar pisos nuevos (opcional)' : 'Nuevos pisos'}
            </div>
          </div>

          <div className="space-y-3">
            {drafts.map((piso) => (
              <div key={piso.id} className="rounded-2xl border border-violet-100 bg-white p-4">
                <div className="flex items-center gap-2">
                  <input
                    value={piso.nombre}
                    onChange={(e) => { actualizarNombre(piso.id, e.target.value) }}
                    placeholder="Nombre del piso (ej. Planta de producción)"
                    className="flex-1 rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  />
                  {drafts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => { eliminarPiso(piso.id) }}
                      className="rounded-lg px-2 py-1 text-xs text-rose-500 hover:bg-rose-50"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sugeridas.map((area) => {
                    const yaAgregada = piso.areas.includes(area)
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => { if (yaAgregada) quitarArea(piso.id, area); else agregarArea(piso.id, area) }}
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-[11px] transition',
                          yaAgregada
                            ? 'border-violet-300 bg-violet-100 text-violet-800'
                            : 'border-violet-100 bg-[#f7f5fb] text-[#5e577a] hover:border-violet-300',
                        )}
                      >
                        {yaAgregada ? '✓ ' : '+ '}{area}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={areaInputPorPiso[piso.id] ?? ''}
                    onChange={(e) => { setAreaInputPorPiso((prev) => ({ ...prev, [piso.id]: e.target.value })) }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        agregarArea(piso.id, areaInputPorPiso[piso.id] ?? '')
                      }
                    }}
                    placeholder="Otra área…"
                    className="flex-1 rounded-xl border border-violet-100 px-3 py-1.5 text-xs outline-none focus:border-violet-400"
                  />
                  <button
                    type="button"
                    onClick={() => { agregarArea(piso.id, areaInputPorPiso[piso.id] ?? '') }}
                    className="rounded-xl bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-200"
                  >
                    Agregar
                  </button>
                </div>

                {piso.areas.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 border-t border-violet-50 pt-3">
                    {piso.areas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center gap-1 rounded-full bg-[#1b1530] px-2.5 py-1 text-[11px] text-white"
                      >
                        {area}
                        <button type="button" onClick={() => { quitarArea(piso.id, area) }} className="text-white/60 hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={agregarPiso}
              className="w-full rounded-2xl border-2 border-dashed border-violet-200 py-3 text-sm font-semibold text-violet-600 hover:bg-violet-50"
            >
              + Agregar otro piso
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-violet-100 pt-5">
        <button type="button" onClick={onBack} className="text-sm font-semibold text-[#5e577a] hover:text-[#1b1530]">
          ← Atrás
        </button>
        <div className="font-mono text-xs text-violet-600">2 / 4</div>
        <button
          type="button"
          disabled={!puedeContinuar || crearPisosMutation.isPending}
          onClick={handleContinuar}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-300 transition hover:from-violet-600 hover:to-violet-800 disabled:opacity-40"
        >
          {crearPisosMutation.isPending ? 'Guardando…' : 'Continuar →'}
        </button>
      </div>
    </div>
  )
}
