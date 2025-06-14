import { ColumnDef, Column } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { callTypes, userTypes } from '../data/data'
import { User, UserRole } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { useAuthStore } from '@/stores/authStore'

export const useColumns = () => {
  const { user } = useAuthStore((state) => state.auth)
  const isSuperAdmin = user?.user_metadata.rol === 'SuperAdmin'

  const columns: ColumnDef<User>[] = [
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
      meta: {
        className: cn(
          'sticky md:table-cell left-0 z-10 rounded-tl',
          'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
        ),
      },
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
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }) => (
        <div className='w-fit text-nowrap'>{row.getValue('email')}</div>
      ),
    },
    {
      id: 'nombreCompleto',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Nombre' />
      ),
      cell: ({ row }) => {
        const { nombre, apellido } = row.original
        const nombreCompleto = `${nombre} ${apellido}`
        return <LongText className='max-w-50'>{nombreCompleto}</LongText>
      },
    },
    {
      accessorKey: 'estado',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Estado' />
      ),
      cell: ({ row }) => {
        const estado = row.getValue('estado') as string
        const estadoType = callTypes[estado as keyof typeof callTypes]
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
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: 'rolId',
      header: ({ column }: { column: Column<User, unknown> }) => (
        <DataTableColumnHeader column={column} title='Rol' />
      ),
      cell: ({ row }: { row: { original: User } }) => {
        const { rolId } = row.original
        // NOTA: En producción, deberías obtener el nombre del rol desde el catálogo real de roles usando rolId
        // Aquí solo mostramos el rolId por simplicidad
        return (
          <div className='flex items-center gap-x-2'>
            <span className='text-sm capitalize'>{rolId}</span>
          </div>
        )
      },
      filterFn: (row: any, id: string, value: any) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
      enableHiding: false,
    },
    ...(isSuperAdmin ? [{
      accessorKey: 'empresa',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Empresa' />
      ),
      cell: ({ row }) => {
        const empresa = row.original.empresa
        return <div className='w-fit text-nowrap'>{empresa?.nombre || '-'}</div>
      },
    }] : []),
    {
      id: 'actions',
      cell: DataTableRowActions,
    },
  ]

  return columns
}
