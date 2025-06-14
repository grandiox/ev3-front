import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header'
import VentasRowActions from './ventas-row-actions'
import { CheckCircle, XCircle, Clock, ShoppingCart, Globe, Store, Phone } from 'lucide-react'
import { type Venta } from '@/services/api/ventas'

export const estadoTypes = {
  PENDIENTE: {
    label: 'Pendiente',
    value: 'PENDIENTE',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  PAGADA: {
    label: 'Pagada',
    value: 'PAGADA',
    icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  ENTREGADA: {
    label: 'Entregada',
    value: 'ENTREGADA',
    icon: ShoppingCart,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  CANCELADA: {
    label: 'Cancelada',
    value: 'CANCELADA',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
} as const

export const canalTypes = {
  ONLINE: {
    label: 'Online',
    value: 'online',
    icon: Globe,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  PRESENCIAL: {
    label: 'Presencial',
    value: 'presencial',
    icon: Store,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  TELEFONO: {
    label: 'Teléfono',
    value: 'telefono',
    icon: Phone,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  DIRECTO: {
    label: 'Directo',
    value: 'directo',
    icon: Store,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
} as const

export const columns: ColumnDef<Venta>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'codigo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Código' />
    ),
  },
  {
    accessorKey: 'clienteId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cliente' />
    ),
    cell: ({ row }) => {
      return row.original.cliente?.nombre || row.original.clienteId || '-'
    },
    meta: { className: 'min-w-[180px]' },
  },
  {
    accessorKey: 'fechaVenta',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha' />
    ),
  },
  {
    accessorKey: 'canal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Canal' />
    ),
    cell: ({ row }) => {
      const canal = row.getValue('canal') as string
      const canalType = canalTypes[canal.toUpperCase() as keyof typeof canalTypes]
      const Icon = canalType?.icon
      return (
        <div className='flex w-fit items-center gap-2'>
          <div className={`flex items-center gap-2 rounded-full px-2 py-1 ${canalType?.bgColor}`}>
            {Icon && <Icon className={`h-4 w-4 ${canalType?.color}`} />}
            <span className={`text-sm font-medium ${canalType?.color}`}>{canalType?.label || canal}</span>
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const estado = row.getValue('estado') as string
      const estadoType = estadoTypes[estado.toUpperCase() as keyof typeof estadoTypes]
      const Icon = estadoType?.icon
      return (
        <div className='flex w-fit items-center gap-2'>
          <div className={`flex items-center gap-2 rounded-full px-2 py-1 ${estadoType?.bgColor}`}>
            {Icon && <Icon className={`h-4 w-4 ${estadoType?.color}`} />}
            <span className={`text-sm font-medium ${estadoType?.color}`}>{estadoType?.label || estado}</span>
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <VentasRowActions row={row} />,
  },
] 