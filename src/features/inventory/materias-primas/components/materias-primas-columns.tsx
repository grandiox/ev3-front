import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header'
import { DataTableRowActions } from './materias-primas-row-actions'
import { MateriaPrima } from '../data/schema'
import { estadoTypes } from '../data/data'

export const columns: ColumnDef<MateriaPrima>[] = [
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
    accessorKey: 'nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
  },
  {
    accessorKey: 'tipo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipo' />
    ),
  },
  {
    accessorKey: 'subtipo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Subtipo' />
    ),
    cell: ({ row }) => {
      const subtipo = row.getValue('subtipo') as string | null
      return <div className='w-fit text-nowrap'>{subtipo || '-'}</div>
    },
  },
  {
    accessorKey: 'unidadMedida',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Unidad' />
    ),
  },
  {
    accessorKey: 'stockMinimo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stock Mínimo' />
    ),
  },
  {
    accessorKey: 'stockActual',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stock Actual' />
    ),
  },
  {
    accessorKey: 'ubicacionFisica',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ubicación' />
    ),
    cell: ({ row }) => {
      const ubicacion = row.getValue('ubicacionFisica') as string | null
      return <div className='w-fit text-nowrap'>{ubicacion || '-'}</div>
    },
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const estado = row.getValue('estado') as string
      const estadoType = estadoTypes[estado as keyof typeof estadoTypes]
      const Icon = estadoType.icon

      return (
        <div className='flex w-fit items-center gap-2'>
          <div
            className={`flex items-center gap-2 rounded-full px-2 py-1 ${estadoType.bgColor}`}
          >
            {Icon && <Icon className={`h-4 w-4 ${estadoType.color}`} />}
            <span className={`text-sm font-medium ${estadoType.color}`}>
              {estadoType.label}
            </span>
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'notas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Notas' />
    ),
    cell: ({ row }) => {
      const notas = row.getValue('notas') as string | null
      return <div className='w-fit text-nowrap'>{notas || '-'}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
] 