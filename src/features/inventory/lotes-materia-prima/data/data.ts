import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export const estadoTypes = {
  Disponible: {
    label: 'Disponible',
    value: 'Disponible',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  Agotado: {
    label: 'Agotado',
    value: 'Agotado',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  Caducado: {
    label: 'Caducado',
    value: 'Caducado',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  Reservado: {
    label: 'Reservado',
    value: 'Reservado',
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
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
  Disponible: CheckCircle,
  Agotado: XCircle,
  Caducado: XCircle,
  Reservado: AlertTriangle,
  Desconocido: XCircle,
} as const 