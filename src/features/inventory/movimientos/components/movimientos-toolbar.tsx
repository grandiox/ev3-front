import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { elementoTypes } from '../data/data'
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
          placeholder='Filter movements...'
          value={
            (table.getColumn('elementoId')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('elementoId')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('tipoMovimiento') && (
            <DataTableFacetedFilter
              column={table.getColumn('tipoMovimiento')}
              title='Tipo'
              options={[
                { label: 'Entrada', value: 'entrada' },
                { label: 'Salida', value: 'salida' },
                { label: 'Ajuste', value: 'ajuste' },
              ]}
            />
          )}
          {table.getColumn('tipoElemento') && (
            <DataTableFacetedFilter
              column={table.getColumn('tipoElemento')}
              title='Elemento'
              options={elementoTypes.map((t) => ({ ...t }))}
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