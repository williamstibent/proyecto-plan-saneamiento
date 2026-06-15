import { useState } from 'react'
import { useCompletarTarea } from '../hooks/useTareasOperario'

interface CompletarRapidoModalProps {
  tareaId: string
  tareaNombre: string
  pasosPendientes: number
  onClose: () => void
  onSuccess: () => void
}

/**
 * Modal de confirmación para completar una tarea sin ejecutar cada paso.
 * Registra observación opcional y llama al endpoint /completar.
 * El backend marca todos los pasos pendientes como completados.
 */
export function CompletarRapidoModal({
  tareaId,
  tareaNombre,
  pasosPendientes,
  onClose,
  onSuccess,
}: CompletarRapidoModalProps) {
  const [observacion, setObservacion] = useState('')
  const completarMutation = useCompletarTarea(tareaId)

  const handleConfirmar = () => {
    completarMutation.mutate(
      { observacionGeneral: observacion.trim() || undefined },
      { onSuccess },
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
        {/* Icono + título */}
        <div className="mb-1 flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-xl">
            ⚡
          </div>
          <div>
            <h3 className="font-extrabold leading-snug">Completar sin pasos</h3>
            <p className="mt-0.5 text-[11px] text-[#5e577a] leading-relaxed">
              <span className="font-semibold text-[#1b1530]">{tareaNombre}</span>
              {pasosPendientes > 0 && (
                <> · {pasosPendientes} paso{pasosPendientes > 1 ? 's' : ''} quedarán marcados como completados.</>
              )}
            </p>
          </div>
        </div>

        {/* Aviso de trazabilidad */}
        <div className="my-3 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 text-[11px] text-orange-800">
          ⚠️ Para auditoría INVIMA, se recomienda completar cada paso con evidencia. Usa esto solo si ya ejecutaste la tarea.
        </div>

        {/* Observación */}
        <div>
          <label className="text-[11px] font-bold text-violet-700">
            Observación <span className="font-normal text-[#5e577a]">(opcional)</span>
          </label>
          <textarea
            rows={2}
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            placeholder="Ej: Tarea ejecutada según protocolo, sin novedades."
            className="mt-1.5 w-full resize-none rounded-xl border border-violet-100 bg-[#faf9fc] px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
          />
        </div>

        {/* Acciones */}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={completarMutation.isPending}
            className="flex-1 rounded-2xl border border-violet-100 py-3 text-sm font-semibold hover:bg-[#faf9fc] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={completarMutation.isPending}
            className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-200 disabled:opacity-60"
          >
            {completarMutation.isPending ? 'Guardando…' : '✓ Completar'}
          </button>
        </div>
      </div>
    </div>
  )
}
