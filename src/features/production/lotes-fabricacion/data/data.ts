import { CheckCircle, XCircle, Clock, AlertCircle, Beaker, Microscope, Package } from 'lucide-react'

export const estadoTypes = {
  'En Preparación': {
    label: 'En Preparación',
    value: 'En Preparación',
    icon: Beaker,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  'En Proceso': {
    label: 'En Proceso',
    value: 'En Proceso',
    icon: Package,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  'Pausado': {
    label: 'Pausado',
    value: 'Pausado',
    icon: AlertCircle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  'Fermentando': {
    label: 'Fermentando',
    value: 'Fermentando',
    icon: Beaker,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  'Madurando': {
    label: 'Madurando',
    value: 'Madurando',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  'Control Calidad': {
    label: 'Control Calidad',
    value: 'Control Calidad',
    icon: Microscope,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  'Finalizado': {
    label: 'Finalizado',
    value: 'Finalizado',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  'Cancelado': {
    label: 'Cancelado',
    value: 'Cancelado',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
} as const

export const estadoIcons = {
  'En Preparación': Beaker,
  'En Proceso': Package,
  'Pausado': AlertCircle,
  'Fermentando': Beaker,
  'Madurando': Clock,
  'Control Calidad': Microscope,
  'Finalizado': CheckCircle,
  'Cancelado': XCircle,
} as const 