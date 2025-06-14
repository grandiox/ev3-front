import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header'
import { Movimiento } from '../data/schema'
import { movimientoTypes, elementoTypes } from '../data/data'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const columns: ColumnDef<Movimiento>[] = [
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
    accessorKey: 'fecha',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>
        {format(new Date(row.getValue('fecha')), 'PPP', { locale: es })}
      </div>
    ),
  },
  {
    accessorKey: 'tipoMovimiento',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipo' />
    ),
    cell: ({ row }) => {
      const tipo = row.getValue('tipoMovimiento') as string
      const movimientoType = movimientoTypes[tipo as keyof typeof movimientoTypes]
      const Icon = movimientoType.icon

      return (
        <div className='flex w-fit items-center gap-2'>
          <div
            className={`flex items-center gap-2 rounded-full px-2 py-1 ${movimientoType.bgColor}`}
          >
            {Icon && <Icon className={`h-4 w-4 ${movimientoType.color}`} />}
            <span className={`text-sm font-medium ${movimientoType.color}`}>
              {movimientoType.label}
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
    accessorKey: 'tipoElemento',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Elemento' />
    ),
    cell: ({ row }) => {
      const tipo = row.getValue('tipoElemento') as string
      const elementoTipo = elementoTypes.find((t) => t.value === tipo)
      const Icon = elementoTipo?.icon

      return (
        <div className='flex w-fit items-center gap-2'>
          <div className='flex items-center gap-2 rounded-full px-2 py-1 bg-gray-100 dark:bg-gray-800'>
            {Icon && <Icon className='h-4 w-4 text-gray-500 dark:text-gray-400' />}
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              {elementoTipo?.label}
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
    accessorKey: 'elementoId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID Elemento' />
    ),
  },
  {
    accessorKey: 'loteId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID Lote' />
    ),
  },
  {
    accessorKey: 'cantidad',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cantidad' />
    ),
    cell: ({ row }) => {
      const cantidad = parseFloat(row.getValue('cantidad'))
      return (
        <div className='w-fit text-nowrap'>
          {cantidad.toLocaleString('es-CL')}
        </div>
      )
    },
  },
  {
    accessorKey: 'documentoReferencia',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Documento' />
    ),
  },
  {
    accessorKey: 'referenciaId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID Referencia' />
    ),
  },
  {
    accessorKey: 'motivo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Motivo' />
    ),
  },
  {
    accessorKey: 'usuario',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Usuario' />
    ),
    cell: ({ row }) => {
      const usuario = row.getValue('usuario') as { nombre: string; apellido: string }
      return (
        <div className='w-fit text-nowrap'>
          {usuario.nombre} {usuario.apellido}
        </div>
      )
    },
  }
] 