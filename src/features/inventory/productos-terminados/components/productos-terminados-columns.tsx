import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header'
import { DataTableRowActions } from '@/features/inventory/productos-terminados/components/productos-terminados-row-actions'
import { ProductoTerminado } from '../data/schema'
import { estadoTypes } from '../data/data'

export const columns: ColumnDef<ProductoTerminado>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'codigo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código" />
    ),
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: 'estilo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estilo" />
    ),
  },
  {
    accessorKey: 'presentacion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Presentación" />
    ),
  },
  {
    accessorKey: 'capacidad',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capacidad" />
    ),
    cell: ({ row }) => {
      const capacidad = row.getValue('capacidad') as number
      const unidadMedida = row.original.unidadMedida
      return `${capacidad} ${unidadMedida}`
    },
  },
  {
    accessorKey: 'stockMinimo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock Mínimo" />
    ),
  },
  {
    accessorKey: 'stockActual',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock Actual" />
    ),
    cell: ({ row }) => {
      const stockActual = row.getValue('stockActual') as number
      const unidadMedida = row.original.unidadMedida
      return `${stockActual} ${unidadMedida}`
    },
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const estado = row.getValue('estado') as string
      const estadoType = estadoTypes[estado as keyof typeof estadoTypes] || estadoTypes['Desconocido']
      const Icon = estadoType.icon
      return (
        <div className="flex w-fit items-center gap-2">
          <div className={`flex items-center gap-2 rounded-full px-2 py-1 ${estadoType.bgColor}`}>
            {Icon && <Icon className={`h-4 w-4 ${estadoType.color}`} />}
            <span className={`text-sm font-medium ${estadoType.color}`}>{estadoType.label}</span>
          </div>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
] 