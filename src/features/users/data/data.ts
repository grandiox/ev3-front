import {
  IconCash,
  IconShield,
  IconUsersGroup,
  IconUserShield,
  IconChartBar,
  IconEye,
  IconCircleCheck,
  IconCircleX
} from '@tabler/icons-react'

export const callTypes = {
  Activo: {
    label: 'Activo',
    value: 'Activo',
    icon: IconCircleCheck,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  Inactivo: {
    label: 'Inactivo',
    value: 'Inactivo',
    icon: IconCircleX,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  Suspendido: {
    label: 'Suspendido',
    value: 'Suspendido',
    icon: IconCircleX,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
} as const

export const userTypes = [
  {
    label: 'SuperAdmin',
    value: 'SuperAdmin',
    icon: IconShield
  },
  {
    label: 'Administrador',
    value: 'Administrador',
    icon: IconUserShield
  },
  {
    label: 'Producción',
    value: 'Produccion',
    icon: IconUsersGroup
  },
  {
    label: 'Inventario',
    value: 'Inventario',
    icon: IconCash
  },
  {
    label: 'Comercial',
    value: 'Comercial',
    icon: IconChartBar
  },
  {
    label: 'Visualizador',
    value: 'Visualizador',
    icon: IconEye
  }
] as const
