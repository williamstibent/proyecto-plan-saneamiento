import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import type { PoeWizardData, ProductoQuimico, TipoProducto } from '../../../types'
import { METODOS_APLICACION, TIPOS_PRODUCTO } from '../../../types'
import { WizardNav } from './WizardNav'

interface Props {
  data: PoeWizardData
  onNext: (partial: Partial<PoeWizardData>) => void
  onBack: () => void
}

let _id = 0
const newId = () => `p-${++_id}-${Date.now()}`

function emptyProducto(): ProductoQuimico {
  return {
    id: newId(),
    nombre: '',
    tipo: 'desinfectante',
    dilucion: '',
    tiempoContactoMin: undefined,
    metodoAplicacion: 'paño',
    requiereEnjuague: false,
  }
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] uppercase tracking-wider text-violet-500">{children}</label>
}

function ProductoBlock({
  producto,
  index,
  onChange,
  onRemove,
}: {
  producto: ProductoQuimico
  index: number
  onChange: (updated: ProductoQuimico) => void
  onRemove: () => void
}) {
  const set = <K extends keyof ProductoQuimico>(key: K, value: ProductoQuimico[K]) =>
    onChange({ ...producto, [key]: value })

  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-1 text-xs font-extrabold text-sky-800">
          🧪 Producto {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-rose-400 hover:text-rose-600"
        >
          Eliminar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Nombre */}
        <div className="col-span-2">
          <FieldLabel>Nombre comercial / químico</FieldLabel>
          <input
            type="text"
            placeholder="Hipoclorito de sodio 5%"
            value={producto.nombre}
            onChange={(e) => set('nombre', e.target.value)}
            className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Tipo */}
        <div>
          <FieldLabel>Tipo de producto</FieldLabel>
          <select
            value={producto.tipo}
            onChange={(e) => set('tipo', e.target.value as TipoProducto)}
            className="mt-1 w-full rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
          >
            {TIPOS_PRODUCTO.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Método */}
        <div>
          <FieldLabel>Método de aplicación</FieldLabel>
          <select
            value={producto.metodoAplicacion}
            onChange={(e) => set('metodoAplicacion', e.target.value)}
            className="mt-1 w-full rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
          >
            {METODOS_APLICACION.map((m) => (
              <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Dilución */}
        <div>
          <FieldLabel>Dilución / concentración</FieldLabel>
          <input
            type="text"
            placeholder="200 ppm · 1:50"
            value={producto.dilucion}
            onChange={(e) => set('dilucion', e.target.value)}
            className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Tiempo contacto */}
        <div>
          <FieldLabel>Tiempo de contacto (min)</FieldLabel>
          <input
            type="number"
            min={0}
            placeholder="10"
            value={producto.tiempoContactoMin ?? ''}
            onChange={(e) => set('tiempoContactoMin', e.target.value ? Number(e.target.value) : undefined)}
            className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
          <p className="mt-0.5 text-[10px] text-violet-500">Genera timer automático</p>
        </div>
      </div>

      {/* Enjuague */}
      <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm">
        <div
          onClick={() => set('requiereEnjuague', !producto.requiereEnjuague)}
          className={cn(
            'relative h-5 w-9 rounded-full transition',
            producto.requiereEnjuague ? 'bg-violet-500' : 'bg-violet-200',
          )}
        >
          <div className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
            producto.requiereEnjuague ? 'left-[18px]' : 'left-0.5',
          )} />
        </div>
        <span className="font-medium">Requiere enjuague posterior</span>
      </label>
    </div>
  )
}

export function Step3ProductosDosis({ data, onNext, onBack }: Props) {
  const [productos, setProductos] = useState<ProductoQuimico[]>(
    data.productos.length ? data.productos : [emptyProducto()],
  )

  const addProducto = () => setProductos((prev) => [...prev, emptyProducto()])

  const updateProducto = (index: number, updated: ProductoQuimico) =>
    setProductos((prev) => prev.map((p, i) => (i === index ? updated : p)))

  const removeProducto = (index: number) =>
    setProductos((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({ productos })
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-violet-600">Paso 3 / 6</div>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight">Productos y dosis</h3>
          <p className="mt-1 text-sm text-[#5e577a]">Define los productos químicos y sus concentraciones.</p>
        </div>
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
          auto-guardado
        </span>
      </div>

      <div className="mt-7 flex-1 space-y-3 overflow-auto">
        {productos.map((prod, i) => (
          <ProductoBlock
            key={prod.id}
            producto={prod}
            index={i}
            onChange={(updated) => updateProducto(i, updated)}
            onRemove={() => removeProducto(i)}
          />
        ))}

        <button
          type="button"
          onClick={addProducto}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-violet-200 py-3 text-sm font-semibold text-violet-500 hover:border-violet-400 hover:bg-violet-50/60 hover:text-violet-700 transition"
        >
          + Agregar producto
        </button>

        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-3 text-[11px] text-sky-900/80">
          ⓘ Los productos con tiempo de contacto generarán un <b>timer automático</b> en la app del operario.
          La dilución queda registrada en cada ejecución para auditoría INVIMA.
        </div>
      </div>

      <WizardNav step={2} totalSteps={6} onBack={onBack} />
    </form>
  )
}
