import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/shared/lib/utils'
import { useClientes, useCrearCliente } from '../../../hooks/useClientes'
import type { Cliente, TipoEstablecimiento } from '../../../types'
import { TIPO_ESTABLECIMIENTO_LABEL } from '../../../types'

interface Props {
  onNext: (partial: { cliente: Cliente }) => void
}

type Modo = 'existente' | 'nuevo'

const schema = z.object({
  nombre:               z.string().min(3, 'Mínimo 3 caracteres').max(80),
  nit:                  z.string().max(30).optional(),
  tipoEstablecimiento:  z.enum(['panaderia', 'restaurante', 'cafeteria', 'pasteleria', 'otro']),
})

type FormValues = z.infer<typeof schema>

function ClienteCard({ cliente, isSelected, onSelect }: { cliente: Cliente; isSelected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition',
        isSelected
          ? 'border-violet-400 bg-violet-50 shadow-sm shadow-violet-100'
          : 'border-violet-100 bg-white hover:border-violet-200',
      )}
    >
      <div>
        <div className="font-extrabold">{cliente.nombre}</div>
        <div className="mt-0.5 text-[11px] text-[#5e577a]">
          {TIPO_ESTABLECIMIENTO_LABEL[cliente.tipoEstablecimiento]} · {cliente.pisosCount} piso{cliente.pisosCount === 1 ? '' : 's'} · {cliente.poesAsignados} POE asignados
        </div>
      </div>
      {isSelected && <span className="text-lg text-violet-600">✓</span>}
    </button>
  )
}

export function Step1Cliente({ onNext }: Props) {
  const [modo, setModo]               = useState<Modo>('existente')
  const [query, setQuery]             = useState('')
  const [seleccionado, setSeleccionado] = useState<Cliente | null>(null)

  const { data: clientes = [], isLoading } = useClientes()
  const crearMutation = useCrearCliente()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: '', nit: '', tipoEstablecimiento: 'panaderia' },
  })

  const filtrados = clientes.filter((c) => c.nombre.toLowerCase().includes(query.toLowerCase()))

  const handleCrear = (values: FormValues) => {
    crearMutation.mutate(values, {
      onSuccess: (nuevo) => { onNext({ cliente: nuevo }) },
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-violet-600">Paso 1 / 4</div>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight">Cliente</h3>
          <p className="mt-1 text-sm text-[#5e577a]">Selecciona un cliente existente o crea uno nuevo para reutilizar procedimientos.</p>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => { setModo('existente') }}
          className={cn(
            'rounded-full px-4 py-1.5 text-xs font-semibold transition',
            modo === 'existente' ? 'bg-violet-600 text-white shadow-sm' : 'bg-[#f3f0f9] text-[#5e577a] hover:bg-violet-100',
          )}
        >
          Cliente existente
        </button>
        <button
          type="button"
          onClick={() => { setModo('nuevo') }}
          className={cn(
            'rounded-full px-4 py-1.5 text-xs font-semibold transition',
            modo === 'nuevo' ? 'bg-violet-600 text-white shadow-sm' : 'bg-[#f3f0f9] text-[#5e577a] hover:bg-violet-100',
          )}
        >
          + Nuevo cliente
        </button>
      </div>

      {modo === 'existente' ? (
        <div className="flex flex-1 flex-col">
          <div className="mt-6 flex-1 space-y-3 overflow-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value) }}
              placeholder="Buscar cliente por nombre…"
              className="w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />

            {isLoading ? (
              <p className="text-xs text-[#5e577a]">Cargando clientes…</p>
            ) : filtrados.length === 0 ? (
              <p className="text-xs text-[#5e577a]">Sin resultados para "{query}".</p>
            ) : (
              <div className="space-y-2">
                {filtrados.map((c) => (
                  <ClienteCard key={c.id} cliente={c} isSelected={seleccionado?.id === c.id} onSelect={() => { setSeleccionado(c) }} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-violet-100 pt-5">
            <div />
            <div className="font-mono text-xs text-violet-600">1 / 4</div>
            <button
              type="button"
              disabled={!seleccionado}
              onClick={() => { if (seleccionado) onNext({ cliente: seleccionado }) }}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-300 transition hover:from-violet-600 hover:to-violet-800 disabled:opacity-40"
            >
              Continuar →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => { void handleSubmit(handleCrear)(e) }} className="flex flex-1 flex-col">
          <div className="mt-6 flex-1 space-y-4 overflow-auto">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-violet-500">Nombre del cliente</label>
              <input
                placeholder="Panadería Doña Rosa"
                className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                {...register('nombre')}
              />
              {errors.nombre && <p className="mt-0.5 text-[11px] text-rose-600">{errors.nombre.message}</p>}
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-violet-500">NIT (opcional)</label>
              <input
                placeholder="900.000.000-0"
                className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                {...register('nit')}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-violet-500">Tipo de establecimiento</label>
              <select
                className="mt-1 w-full rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
                {...register('tipoEstablecimiento')}
              >
                {(Object.keys(TIPO_ESTABLECIMIENTO_LABEL) as TipoEstablecimiento[]).map((k) => (
                  <option key={k} value={k}>{TIPO_ESTABLECIMIENTO_LABEL[k]}</option>
                ))}
              </select>
              <p className="mt-1 text-[10px] text-violet-500">El sistema sugerirá áreas típicas según este tipo en el siguiente paso.</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-violet-100 pt-5">
            <div />
            <div className="font-mono text-xs text-violet-600">1 / 4</div>
            <button
              type="submit"
              disabled={crearMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-300 transition hover:from-violet-600 hover:to-violet-800 disabled:opacity-60"
            >
              {crearMutation.isPending ? 'Creando…' : 'Crear y continuar →'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
