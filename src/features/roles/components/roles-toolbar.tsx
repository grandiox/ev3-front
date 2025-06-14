import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/features/users/components/data-table-view-options'

interface RolesToolbarProps<TData> {
  table: Table<TData>
  onAdd: () => void
}

export function RolesToolbar<TData>({ table, onAdd }: RolesToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between mb-4'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Filtrar por nombre...'
          value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nombre')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <Input
          placeholder='Filtrar por descripción...'
          value={(table.getColumn('descripcion')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('descripcion')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Limpiar
          </Button>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
} 