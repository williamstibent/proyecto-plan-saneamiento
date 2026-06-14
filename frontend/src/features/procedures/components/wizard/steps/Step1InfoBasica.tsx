import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { PoeWizardData, ProgramaMinimo } from '../../../types'
import { PROGRAMAS_LABEL } from '../../../types'
import { WizardNav } from './WizardNav'

const schema = z.object({
  codigo:          z.string().min(3, 'Mínimo 3 caracteres').max(20),
  nombre:          z.string().min(5, 'Mínimo 5 caracteres').max(100),
  descripcion:     z.string().max(300).optional(),
  areaAplicacion:  z.string().min(2, 'Indica el área'),
  programa:        z.enum(['limpieza-desinfeccion', 'agua-potable', 'residuos-solidos', 'control-plagas']),
})

type FormValues = z.infer<typeof schema>

const AREAS = ['Cocina', 'Horno', 'Cuarto frío', 'Almacén', 'Baños', 'Área de ventas', 'Toda la planta', 'Exterior']

interface Props {
  data: PoeWizardData
  onNext: (partial: Partial<PoeWizardData>) => void
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] uppercase tracking-wider text-violet-500">{children}</label>
}

function FieldInput({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <>
      <input
        className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        {...props}
      />
      {error && <p className="mt-0.5 text-[11px] text-rose-600">{error}</p>}
    </>
  )
}

export function Step1InfoBasica({ data, onNext }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      codigo:         data.codigo,
      nombre:         data.nombre,
      descripcion:    data.descripcion,
      areaAplicacion: data.areaAplicacion,
      programa:       data.programa,
    },
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-violet-600">Paso 1 / 6</div>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight">Información básica</h3>
          <p className="mt-1 text-sm text-[#5e577a]">Identifica el procedimiento dentro del plan de saneamiento.</p>
        </div>
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
          auto-guardado
        </span>
      </div>

      <div className="mt-7 flex-1 space-y-5">
        {/* Código */}
        <div>
          <FieldLabel>Código POE</FieldLabel>
          <FieldInput
            placeholder="POE-LYD-02"
            className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 font-mono text-sm uppercase tracking-wider outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            error={errors.codigo?.message}
            {...register('codigo')}
          />
          <p className="mt-1 text-[10px] text-violet-500">Formato sugerido: POE-[PROGRAMA]-[NÚMERO]</p>
        </div>

        {/* Nombre */}
        <div>
          <FieldLabel>Nombre del procedimiento</FieldLabel>
          <FieldInput
            placeholder="Limpiar mesas de trabajo"
            error={errors.nombre?.message}
            {...register('nombre')}
          />
        </div>

        {/* Descripción */}
        <div>
          <FieldLabel>Descripción breve (opcional)</FieldLabel>
          <textarea
            rows={2}
            placeholder="Procedimiento de limpieza y desinfección de superficies de contacto directo con alimentos…"
            className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none"
            {...register('descripcion')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Área */}
          <div>
            <FieldLabel>Área de aplicación</FieldLabel>
            <select
              className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 bg-white"
              {...register('areaAplicacion')}
            >
              <option value="">Seleccionar…</option>
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            {errors.areaAplicacion && (
              <p className="mt-0.5 text-[11px] text-rose-600">{errors.areaAplicacion.message}</p>
            )}
          </div>

          {/* Programa */}
          <div>
            <FieldLabel>Programa mínimo (Res. 2674)</FieldLabel>
            <select
              className="mt-1 w-full rounded-xl border border-violet-100 px-3 py-2 text-sm outline-none focus:border-violet-400 bg-white"
              {...register('programa')}
            >
              {(Object.keys(PROGRAMAS_LABEL) as ProgramaMinimo[]).map((k) => (
                <option key={k} value={k}>{PROGRAMAS_LABEL[k]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Info adicional */}
        <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 text-[11px] text-violet-900/80">
          ⓘ El código POE quedará vinculado a cada ejecución de checklist para garantizar la <b>trazabilidad de auditoría</b> exigida por INVIMA.
        </div>
      </div>

      <WizardNav step={0} totalSteps={6} onBack={undefined} />
    </form>
  )
}
