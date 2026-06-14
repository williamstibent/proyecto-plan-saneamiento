import { cn } from '@/shared/lib/utils'

export interface WizardStep {
  label: string
  sublabel?: string // estado dinámico: "✓ Listo", "4 ítems", "en edición"…
}

interface WizardStepperProps {
  steps: WizardStep[]
  currentStep: number // 0-based
  poeCode: string
  poeNombre: string
  onStepClick?: (index: number) => void
}

export function WizardStepper({ steps, currentStep, poeCode, poeNombre, onStepClick }: WizardStepperProps) {
  return (
    <aside className="col-span-2 flex flex-col border-r border-violet-100 bg-white p-5">
      <a
        href="/poe"
        className="mb-6 flex items-center gap-1 text-xs text-violet-700 hover:text-violet-900"
      >
        ← Procedimientos
      </a>

      <div className="mb-1 text-[10px] uppercase tracking-widest text-violet-500">Construyendo</div>
      {poeCode && (
        <div className="font-extrabold text-sm leading-tight">{poeCode}</div>
      )}
      <div className="mb-6 text-[11px] text-violet-600">
        {poeNombre || 'Nuevo procedimiento'}
      </div>

      <ol className="space-y-4 text-sm">
        {steps.map((step, i) => {
          const isDone    = i < currentStep
          const isActive  = i === currentStep
          const isPending = i > currentStep

          return (
            <li
              key={i}
              className={cn('flex items-start gap-3', onStepClick && isDone && 'cursor-pointer')}
              onClick={() => isDone && onStepClick?.(i)}
            >
              {/* Dot */}
              <div
                className={cn(
                  'mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full',
                  isDone    && 'bg-[#1b1530]',
                  isActive  && 'bg-violet-500 shadow-[0_0_0_4px_rgba(139,92,246,0.18)]',
                  isPending && 'bg-violet-200',
                )}
              />
              {/* Label */}
              <div>
                <div
                  className={cn(
                    'font-medium',
                    isActive  && 'font-extrabold text-violet-700',
                    isPending && 'text-[#1b1530]/40',
                    isDone    && 'font-bold',
                  )}
                >
                  {step.label}
                </div>
                {step.sublabel && (
                  <div
                    className={cn(
                      'text-[11px]',
                      isDone   && 'text-emerald-600',
                      isActive && 'text-violet-600',
                    )}
                  >
                    {step.sublabel}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50 p-3 text-[11px] text-orange-900/80">
        ⚡ Después de publicar, podrás <b>clonar</b> este POE a otros establecimientos.
      </div>
    </aside>
  )
}
