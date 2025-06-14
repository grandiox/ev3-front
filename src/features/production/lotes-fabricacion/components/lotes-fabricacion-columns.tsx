import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header'
import { DataTableRowActions } from './lotes-fabricacion-row-actions'
import { LoteFabricacion } from '@/services/api/lotes-fabricacion'
import { estadoTypes } from '../data/data'
import { format } from 'date-fns'

export const columns: ColumnDef<LoteFabricacion>[] = [
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
    accessorKey: 'codigoLote',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Código Lote' />
    ),
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
    accessorKey: 'volumenObtenido',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Volumen Obtenido' />
    ),
    cell: ({ row }) => {
      const volumen = row.getValue('volumenObtenido') as number
      return <div className='text-center'>{volumen || '-'}</div>
    },
  },
  {
    accessorKey: 'rendimientoReal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rendimiento Real' />
    ),
    cell: ({ row }) => {
      const rendimiento = row.getValue('rendimientoReal') as number
      return <div className='text-center'>{rendimiento ? `${rendimiento}%` : '-'}</div>
    },
  },
  {
    accessorKey: 'fechaInicio',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha Inicio' />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue('fechaInicio') as string
      return <div className='text-center'>{fecha ? format(new Date(fecha), 'dd/MM/yyyy') : '-'}</div>
    },
  },
  {
    accessorKey: 'fechaFinalizacion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha Finalización' />
    ),
    cell: ({ row }) => {
      const fecha = row.getValue('fechaFinalizacion') as string
      return <div className='text-center'>{fecha ? format(new Date(fecha), 'dd/MM/yyyy') : '-'}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
] 