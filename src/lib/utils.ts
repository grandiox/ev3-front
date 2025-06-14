import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(amount)
}

export function formatDate(dateValue: string | null | undefined) {
  if (!dateValue) return '-'
  const date = new Date(dateValue)
  return isValid(date) ? format(date, 'dd/MM/yyyy', { locale: es }) : '-'
}
