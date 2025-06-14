import { ColumnDef } from '@tanstack/react-table'
import { Rol } from '@/services/api/roles'
import { DataTableColumnHeader } from '@/features/users/components/data-table-column-header'
import { DataTableRowActions } from './roles-row-actions'
import { RolesDialogType } from './roles-dialogs'

interface UseRolesColumnsProps {
  setOpen: (d: RolesDialogType) => void
  setCurrentRow: (r: Rol) => void
}

export const useRolesColumns = ({ setOpen, setCurrentRow }: UseRolesColumnsProps): ColumnDef<Rol>[] => [
  {
    accessorKey: 'nombre',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Nombre' />,
    cell: ({ row }) => <span className='font-medium'>{row.getValue('nombre')}</span>,
  },
  {
    accessorKey: 'descripcion',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Descripción' />,
    cell: ({ row }) => <span>{row.getValue('descripcion')}</span>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} setOpen={setOpen} setCurrentRow={setCurrentRow} />,
  },
] 