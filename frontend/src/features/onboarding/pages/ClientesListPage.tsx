import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { useClientes } from '../hooks/useClientes'
import { TIPO_ESTABLECIMIENTO_LABEL } from '../types'
import type { Cliente } from '../types'

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-violet-100 bg-white p-5">
      <div className="mb-3 h-5 w-1/2 rounded bg-violet-100" />
      <div className="h-3 w-1/3 rounded bg-violet-50" />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-20 rounded-full bg-violet-100" />
        <div className="h-5 w-16 rounded-full bg-violet-100" />
      </div>
    </div>
  )
}

function ClienteCard({ cliente }: { cliente: Cliente }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-extrabold leading-snug text-[#1b1530]">{cliente.nombre}</h3>
        <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-semibold text-violet-700">
          {TIPO_ESTABLECIMIENTO_LABEL[cliente.tipoEstablecimiento]}
        </span>
      </div>

      {cliente.nit && <div className="mt-1 font-mono text-[11px] text-[#5e577a]">NIT {cliente.nit}</div>}

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded-full bg-[#f3f0f9] px-2.5 py-0.5 font-semibold text-[#5e577a]">
          🏢 {cliente.pisosCount} piso{cliente.pisosCount === 1 ? '' : 's'}
        </span>
        <span className="rounded-full bg-[#f3f0f9] px-2.5 py-0.5 font-semibold text-[#5e577a]">
          📍 {cliente.areasCount} área{cliente.areasCount === 1 ? '' : 's'}
        </span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700">
          📑 {cliente.poesAsignados} POE
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-violet-50 pt-3">
        <div className="text-[10px] text-[#5e577a]">Desde {formatFecha(cliente.creadoEn)}</div>
        <Link
          to="/clientes/onboarding"
          className="text-[11px] font-semibold text-violet-600 opacity-0 transition group-hover:opacity-100 hover:text-violet-800"
        >
          Asignar POE →
        </Link>
      </div>
    </div>
  )
}

export function ClientesListPage() {
  const { data: clientes, isLoading } = useClientes()
  const [toast, setToast] = useState<{ clienteNombre?: string; poeNombre?: string } | null>(null)
  const location = useLocation()

  useEffect(() => {
    const state = location.state as { clienteNombre?: string; poeNombre?: string } | null
    if (state?.clienteNombre) {
      setToast(state)
      const t = setTimeout(() => { setToast(null) }, 4000)
      return () => { clearTimeout(t) }
    }
  }, [location.state])

  const total = clientes?.length ?? 0
  const conPoes = clientes?.filter((c) => c.poesAsignados > 0).length ?? 0

  return (
    <div className="flex h-full flex-col">
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 rounded-2xl bg-[#1b1530] px-6 py-3 text-sm font-semibold text-white shadow-xl">
          🎉 POE <span className="font-mono text-violet-300">{toast.poeNombre}</span> asignado a {toast.clienteNombre}
        </div>
      )}

      <div className="flex flex-col gap-3 border-b border-violet-100 bg-white px-4 pb-4 pt-5 sm:flex-row sm:items-end sm:justify-between lg:px-8 lg:pb-5 lg:pt-7">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-500">Multi-tenant</div>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">Clientes</h1>
          <p className="mt-1 text-sm text-[#5e577a]">Reutiliza POEs del repositorio entre distintos clientes.</p>
        </div>

        <Link
          to="/clientes/onboarding"
          className="inline-flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:from-violet-600 hover:to-violet-800"
        >
          + Onboarding de cliente
        </Link>
      </div>

      {!isLoading && (
        <div className="flex gap-4 border-b border-violet-50 bg-[#faf9fc] px-4 py-3 text-[11px] text-[#5e577a] lg:px-8">
          <span><b className="text-[#1b1530]">{total}</b> clientes</span>
          <span>·</span>
          <span><b className="text-emerald-600">{conPoes}</b> con POE asignado</span>
        </div>
      )}

      <div className={cn('flex-1 overflow-auto px-4 py-4 lg:px-8 lg:py-6')}>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : clientes && clientes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {clientes.map((c) => <ClienteCard key={c.id} cliente={c} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-5xl">🏢</div>
            <h3 className="text-lg font-extrabold">Sin clientes aún</h3>
            <p className="mt-1 text-sm text-[#5e577a]">Crea tu primer cliente para empezar a reutilizar POEs.</p>
            <Link
              to="/clientes/onboarding"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200"
            >
              + Crear primer cliente
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
