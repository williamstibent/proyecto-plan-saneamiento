import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utilitario estándar de shadcn/ui para combinar clases Tailwind.
 * Uso: cn('base-class', condition && 'conditional-class', props.className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
