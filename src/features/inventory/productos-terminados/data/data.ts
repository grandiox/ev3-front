import { CheckCircle, XCircle } from 'lucide-react'

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
  Desconocido: {
    label: 'Desconocido',
    value: 'Desconocido',
    icon: XCircle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
} as const

export const estadoIcons = {
  Activo: CheckCircle,
  Inactivo: XCircle,
  Desconocido: XCircle,
} as const 