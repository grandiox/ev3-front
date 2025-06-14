import { ArrowDownToLine, ArrowUpFromLine, Package, PackageCheck, PackageX, RotateCcw } from 'lucide-react'

export const movimientoTypes = {
  Entrada: {
    label: 'Entrada',
    value: 'Entrada',
    icon: ArrowDownToLine,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  Salida: {
    label: 'Salida',
    value: 'Salida',
    icon: ArrowUpFromLine,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  Ajuste: {
    label: 'Ajuste',
    value: 'Ajuste',
    icon: RotateCcw,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
} as const

export const elementoTypes = [
  {
    label: 'Materia Prima',
    value: 'MateriaPrima',
    icon: Package,
  },
  {
    label: 'Producto Terminado',
    value: 'ProductoTerminado',
    icon: PackageCheck,
  },
  {
    label: 'Envase',
    value: 'Envase',
    icon: PackageX,
  },
] as const

export const movimientoIcons = {
  Entrada: ArrowDownToLine,
  Salida: ArrowUpFromLine,
  Ajuste: RotateCcw,
} as const 