const STEP_NEXT_LABELS: Record<number, string> = {
  0: 'Continuar a EPP →',
  1: 'Continuar a Productos →',
  2: 'Continuar a Pasos →',
  3: 'Continuar a Frecuencia →',
  4: 'Continuar a Preview →',
  5: '🚀 Publicar POE',
}

interface WizardNavProps {
  step: number
  totalSteps: number
  onBack?: () => void
  isSubmitting?: boolean
}

export function WizardNav({ step, totalSteps, onBack, isSubmitting }: WizardNavProps) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-violet-100 pt-5">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-violet-100 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-[#faf9fc]"
        >
          ← Anterior
        </button>
      ) : (
        <div />
      )}

      <div className="font-mono text-xs text-violet-600">{step + 1} / {totalSteps}</div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-300 transition hover:from-violet-600 hover:to-violet-800 disabled:opacity-60"
      >
        {isSubmitting ? 'Guardando…' : (STEP_NEXT_LABELS[step] ?? 'Continuar →')}
      </button>
    </div>
  )
}
