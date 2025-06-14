export const COLORES_ESTADO = {
  Programada: 'gray',
  'En Preparacion': 'blue',
  'En Proceso': 'purple',
  Pausada: 'orange',
  Finalizada: 'green',
  Cancelada: 'red'
} as const

export const ESTADOS_CLAVE = ['Programada', 'En Preparacion', 'En Proceso'] as const
export const SUBESTADOS = ['Pausada', 'Finalizada', 'Cancelada'] as const

export type Estado = keyof typeof COLORES_ESTADO 