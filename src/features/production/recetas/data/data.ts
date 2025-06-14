import { CheckCircle, XCircle, Clock } from 'lucide-react'

export const estadoTypes = {
  Activo: {
    label: 'Activo',
    value: 'Activo',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  Inactivo: {
    label: 'Inactivo',
    value: 'Inactivo',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  Borrador: {
    label: 'Borrador',
    value: 'Borrador',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
} as const

export const estadoIcons = {
  Activo: CheckCircle,
  Inactivo: XCircle,
  Borrador: Clock,
} as const 