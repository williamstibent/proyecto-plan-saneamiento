import { cn } from '@/shared/lib/utils'

export interface OnboardingStep {
  label: string
  sublabel?: string
}

interface OnboardingStepperProps {
  steps: OnboardingStep[]
  currentStep: number // 0-based
  clienteNombre?: string
  onStepClick?: (index: number) => void
}

export function OnboardingStepper({ steps, currentStep, clienteNombre, onStepClick }: OnboardingStepperProps) {
  return (
    <aside className="hidden lg:flex col-span-2 flex-col border-r border-violet-100 bg-white p-5">
      <a
        href="/clientes"
        className="mb-6 flex items-center gap-1 text-xs text-violet-700 hover:text-violet-900"
      >
        ← Clientes
      </a>

      <div className="mb-1 text-[10px] uppercase tracking-widest text-violet-500">Onboarding</div>
      <div className="mb-6 text-[11px] font-extrabold text-violet-700">
        {clienteNombre || 'Nuevo cliente'}
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
              onClick={() => { if (isDone) onStepClick?.(i) }}
            >
              <div
                className={cn(
                  'mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full',
                  isDone    && 'bg-[#1b1530]',
                  isActive  && 'bg-violet-500 shadow-[0_0_0_4px_rgba(139,92,246,0.18)]',
                  isPending && 'bg-violet-200',
                )}
              />
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

      <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-3 text-[11px] text-violet-900/80">
        ♻ Los POE del repositorio se <b>clonan</b>: adaptarlos aquí nunca modifica la plantilla original.
      </div>
    </aside>
  )
}
