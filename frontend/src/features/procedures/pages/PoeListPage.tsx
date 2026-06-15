import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { useProcedimientos } from '../hooks/useProcedimientos'
import type { ProgramaMinimo, TaskFrequency } from '../types'
import { PROGRAMAS_LABEL, FRECUENCIA_LABEL } from '../types'
import type { PoeResumen } from '@/mocks/data/procedures'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PROGRAMA_COLORS: Record<ProgramaMinimo, { bg: string; text: string; dot: string }> = {
  'limpieza-desinfeccion': { bg: 'bg-violet-100', text: 'text-violet-800', dot: 'bg-violet-500' },
  'agua-potable':          { bg: 'bg-sky-100',    text: 'text-sky-800',    dot: 'bg-sky-500'    },
  'residuos-solidos':      { bg: 'bg-emerald-100',text: 'text-emerald-800',dot: 'bg-emerald-500'},
  'control-plagas':        { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
}

const ESTADO_STYLES: Record<PoeResumen['estado'], { label: string; cls: string }> = {
  activo:      { label: 'Activo',     cls: 'bg-emerald-100 text-emerald-700' },
  borrador:    { label: 'Borrador',   cls: 'bg-amber-100 text-amber-700'     },
  desactivado: { label: 'Inactivo',   cls: 'bg-rose-100 text-rose-700'       },
}

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-violet-100 bg-white p-5">
      <div className="mb-3 flex items-start justify-between">
        <div className="h-4 w-24 rounded bg-violet-100" />
        <div className="h-5 w-16 rounded-full bg-violet-100" />
      </div>
      <div className="mb-1 h-5 w-3/4 rounded bg-violet-100" />
      <div className="h-3 w-full rounded bg-violet-50" />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-20 rounded-full bg-violet-100" />
        <div className="h-5 w-16 rounded-full bg-violet-100" />
      </div>
      <div className="mt-4 flex justify-between border-t border-violet-50 pt-3">
        <div className="h-3 w-16 rounded bg-violet-50" />
        <div className="h-3 w-20 rounded bg-violet-50" />
      </div>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function PoeCard({ poe }: { poe: PoeResumen }) {
  const prog   = PROGRAMA_COLORS[poe.programa]
  const estado = ESTADO_STYLES[poe.estado]

  return (
    <div className="group flex flex-col rounded-2xl border border-violet-100 bg-white shadow-sm transition hover:border-violet-300 hover:shadow-md">
      <div className="flex-1 p-5">
        {/* Header: código + estado */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className="font-mono text-xs font-bold text-violet-700">{poe.codigo}</span>
          <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', estado.cls)}>
            {estado.label}
          </span>
        </div>

        {/* Nombre */}
        <h3 className="mb-1 text-sm font-extrabold leading-snug text-[#1b1530] line-clamp-2">
          {poe.nombre}
        </h3>

        {/* Descripción */}
        {poe.descripcion && (
          <p className="mb-3 text-[11px] leading-relaxed text-[#5e577a] line-clamp-2">
            {poe.descripcion}
          </p>
        )}

        {/* Badges: programa + área */}
        <div className="flex flex-wrap gap-1.5">
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold', prog.bg, prog.text)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', prog.dot)} />
            {PROGRAMAS_LABEL[poe.programa]}
          </span>
          <span className="rounded-full bg-[#f3f0f9] px-2.5 py-0.5 text-[10px] font-semibold text-[#5e577a]">
            📍 {poe.areaAplicacion}
          </span>
          <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-semibold text-orange-700">
            🔁 {FRECUENCIA_LABEL[poe.frecuencia as TaskFrequency]}
          </span>
        </div>

        {/* Stats: EPP, pasos, productos */}
        <div className="mt-3 flex gap-3 text-[11px] text-[#5e577a]">
          {poe.eppCount > 0 && (
            <span>🥽 {poe.eppCount} EPP</span>
          )}
          {poe.pasosCount > 0 && (
            <span>✅ {poe.pasosCount} pasos</span>
          )}
          {poe.productosCount > 0 && (
            <span>🧪 {poe.productosCount} {poe.productosCount === 1 ? 'producto' : 'productos'}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-violet-50 px-5 py-3">
        <div className="text-[10px] text-[#5e577a]">
          v{poe.version} · {formatFecha(poe.actualizadoEn)}
        </div>
        <Link
          to={`/poe/${poe.id}`}
          className="text-[11px] font-semibold text-violet-600 opacity-0 transition group-hover:opacity-100 hover:text-violet-800"
        >
          Ver detalle →
        </Link>
      </div>
    </div>
  )
}

// ─── Filtro tabs ──────────────────────────────────────────────────────────────

const FILTROS: { value: ProgramaMinimo | 'todos'; label: string }[] = [
  { value: 'todos',                label: 'Todos'                   },
  { value: 'limpieza-desinfeccion',label: 'Limpieza y desinfección' },
  { value: 'agua-potable',         label: 'Agua potable'            },
  { value: 'residuos-solidos',     label: 'Residuos sólidos'        },
  { value: 'control-plagas',       label: 'Control de plagas'       },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PoeListPage() {
  const [filtro, setFiltro]         = useState<ProgramaMinimo | 'todos'>('todos')
  const [toastCodigo, setToastCodigo] = useState<string | null>(null)
  const location = useLocation()

  // Mostrar toast cuando se llega desde el wizard tras publicar
  useEffect(() => {
    const state = location.state as { nuevoCodigo?: string } | null
    if (state?.nuevoCodigo) {
      setToastCodigo(state.nuevoCodigo)
      const t = setTimeout(() => setToastCodigo(null), 4000)
      return () => clearTimeout(t)
    }
  }, [location.state])

  const { data: poes, isLoading } = useProcedimientos(
    filtro === 'todos' ? undefined : filtro,
  )

  const total    = poes?.length ?? 0
  const activos  = poes?.filter((p) => p.estado === 'activo').length ?? 0
  const borradores = poes?.filter((p) => p.estado === 'borrador').length ?? 0

  return (
    <div className="flex h-full flex-col">
      {/* ── Toast de éxito ───────────────────────────── */}
      {toastCodigo && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 rounded-2xl bg-[#1b1530] px-6 py-3 text-sm font-semibold text-white shadow-xl">
          🎉 <span className="font-mono text-violet-300">{toastCodigo}</span> publicado correctamente
        </div>
      )}

      {/* ── Header ───────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b border-violet-100 bg-white px-4 pb-4 pt-5 sm:flex-row sm:items-end sm:justify-between lg:px-8 lg:pb-5 lg:pt-7">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-violet-500">
            Plan de saneamiento
          </div>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
            Procedimientos operativos estándar
          </h1>
          <p className="mt-1 text-sm text-[#5e577a]">
            Resolución 2674 de 2013 — 4 programas mínimos
          </p>
        </div>

        <Link
          to="/poe/nuevo"
          className="inline-flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:from-violet-600 hover:to-violet-800"
        >
          + Nuevo POE
        </Link>
      </div>

      {/* ── Resumen ──────────────────────────────────── */}
      {!isLoading && (
        <div className="flex gap-4 border-b border-violet-50 bg-[#faf9fc] px-4 py-3 text-[11px] text-[#5e577a] lg:px-8">
          <span><b className="text-[#1b1530]">{total}</b> procedimientos</span>
          <span>·</span>
          <span><b className="text-emerald-600">{activos}</b> activos</span>
          {borradores > 0 && (
            <>
              <span>·</span>
              <span><b className="text-amber-600">{borradores}</b> en borrador</span>
            </>
          )}
        </div>
      )}

      {/* ── Filtros ──────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto border-b border-violet-100 bg-white px-4 py-3 lg:px-8">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition',
              filtro === f.value
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-[#f3f0f9] text-[#5e577a] hover:bg-violet-100',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Grid de cards ────────────────────────────── */}
      <div className="flex-1 overflow-auto px-4 py-4 lg:px-8 lg:py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : poes && poes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {poes.map((poe) => <PoeCard key={poe.id} poe={poe} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-5xl">📑</div>
            <h3 className="text-lg font-extrabold">Sin procedimientos</h3>
            <p className="mt-1 text-sm text-[#5e577a]">
              {filtro === 'todos'
                ? 'Crea tu primer POE para comenzar a digitalizar el plan de saneamiento.'
                : 'No hay POE para este programa. Puedes crear uno ahora.'}
            </p>
            <Link
              to="/poe/nuevo"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200"
            >
              + Crear primer POE
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
