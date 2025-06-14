import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header'
import { DataTableRowActions } from './lotes-materia-prima-row-actions'
import { LoteMateriaPrima } from '../data/schema'
import { estadoTypes } from '../data/data'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const columns: ColumnDef<LoteMateriaPrima>[] = [
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
    accessorKey: 'materiaPrima.nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Materia Prima' />
    ),
  },
  {
    accessorKey: 'codigoLote',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Código Lote' />
    ),
  },
  {
    accessorKey: 'proveedor.nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Proveedor' />
    ),
  },
  {
    accessorKey: 'cantidad',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cantidad' />
    ),
    cell: ({ row }) => {
      const cantidad = row.getValue('cantidad') as number
      const unidadMedida = row.original.materiaPrima.unidadMedida
      return (
        <div className='w-fit text-nowrap'>
          {`${cantidad.toLocaleString('es-CL')} ${unidadMedida}`}
        </div>
      )
    },
  },
  {
    accessorKey: 'cantidadDisponible',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cantidad Disponible' />
    ),
    cell: ({ row }) => {
      const cantidad = row.getValue('cantidadDisponible') as number
      const unidadMedida = row.original.materiaPrima.unidadMedida
      return (
        <div className='w-fit text-nowrap'>
          {`${cantidad.toLocaleString('es-CL')} ${unidadMedida}`}
        </div>
      )
    },
  },
  {
    accessorKey: 'precio',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Precio' />
    ),
    cell: ({ row }) => {
      const precio = row.getValue('precio') as number
      return (
        <div className='w-fit text-nowrap'>
          {precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
        </div>
      )
    },
  },
  {
    accessorKey: 'fechaRecepcion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha Recepción' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>
        {format(new Date(row.getValue('fechaRecepcion')), 'PPP', { locale: es })}
      </div>
    ),
  },
  {
    accessorKey: 'fechaCaducidad',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha Caducidad' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>
        {format(new Date(row.getValue('fechaCaducidad')), 'PPP', { locale: es })}
      </div>
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
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
] 