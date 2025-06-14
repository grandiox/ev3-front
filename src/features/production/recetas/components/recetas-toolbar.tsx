import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { estadoTypes } from '../data/data'
import { DataTableFacetedFilter } from '@/features/users/components/data-table-faceted-filter'
import { DataTableViewOptions } from '@/features/users/components/data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter by code or name...'
          value={
            (table.getColumn('codigo')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('codigo')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('estado') && (
            <DataTableFacetedFilter
              column={table.getColumn('estado')}
              title='Estado'
              options={Object.values(estadoTypes).map((t) => ({ ...t }))}
            />
          )}
          {table.getColumn('estilo') && (
            <DataTableFacetedFilter
              column={table.getColumn('estilo')}
              title='Estilo'
              options={Array.from(new Set(table.getColumn('estilo')?.getFacetedUniqueValues().keys())).map((estilo) => ({
                label: estilo,
                value: estilo,
              }))}
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