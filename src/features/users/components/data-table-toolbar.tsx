import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { callTypes, userTypes } from '../data/data'
import { User } from '../data/schema'
import { useAuthStore } from '@/stores/authStore'

interface DataTableToolbarProps {
  table: Table<User>
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const { user } = useAuthStore((state) => state.auth)
  const isSuperAdmin = user?.user_metadata.rol === 'SuperAdmin'
  const isFiltered = table.getState().columnFilters.length > 0

  const estadoOptions = Object.values(callTypes).map(({ label, value, icon }) => ({
    label,
    value,
    icon
  }))

  const rolOptions = userTypes.filter(({ value }) => { 
    if (!isSuperAdmin) {
      return value.toLowerCase() !== 'superadmin'
    }
    return true
  }).map(({ label, value, icon }) => ({
    label,
    value,
    icon
  }))

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Filtrar por email...'
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
          <div className='flex gap-x-2'>
            {table.getColumn('estado') && (
              <DataTableFacetedFilter
                column={table.getColumn('estado')}
                title='Estado'
                options={estadoOptions}
              />
            )}
            {table.getColumn('rol') && (
              <DataTableFacetedFilter
                column={table.getColumn('rol')}
                title='Rol'
                options={rolOptions}
              />
            )}
          </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
