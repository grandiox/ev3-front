import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header'
import { DataTableRowActions } from './clientes-row-actions'
import { Cliente } from '@/services/api/clientes'
import { CheckCircle, XCircle, PauseCircle } from 'lucide-react'

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
  Suspendido: {
    label: 'Suspendido',
    value: 'Suspendido',
    icon: PauseCircle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
} as const

export const columns: ColumnDef<Cliente>[] = [
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
    meta: { className: 'min-w-[120px]' },
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    meta: { className: 'min-w-[180px]' },
  },
  {
    accessorKey: 'tipo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipo' />
    ),
    meta: { className: 'min-w-[100px]' },
  },
  {
    accessorKey: 'contacto',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Contacto' />
    ),
    meta: { className: 'min-w-[120px]' },
  },
  {
    accessorKey: 'telefono',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Teléfono' />
    ),
    meta: { className: 'min-w-[120px]' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    meta: { className: 'min-w-[180px]' },
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const estado = row.getValue('estado') as string
      const estadoType = estadoTypes[estado as keyof typeof estadoTypes]
      const Icon = estadoType?.icon
      return (
        <div className='flex w-fit items-center gap-2'>
          <div
            className={`flex items-center gap-2 rounded-full px-2 py-1 ${estadoType?.bgColor || ''}`}
          >
            {Icon && <Icon className={`h-4 w-4 ${estadoType?.color || ''}`} />}
            <span className={`text-sm font-medium ${estadoType?.color || ''}`}>
              {estadoType?.label || estado}
            </span>
          </div>
        </div>
      )
    },
    meta: { className: 'min-w-[100px]' },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
] 