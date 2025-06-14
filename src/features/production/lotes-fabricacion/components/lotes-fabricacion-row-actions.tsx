import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEye, IconClipboard } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLotesFabricacion } from '../context/lotes-fabricacion-context'
import { LoteFabricacion } from '@/services/api/lotes-fabricacion'

interface DataTableRowActionsProps {
  row: Row<LoteFabricacion>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useLotesFabricacion()

  const handleView = () => {
    setCurrentRow(row.original)
    setOpen('view')
  }

  const handleRegistrarResultados = () => {
    setCurrentRow(row.original)
    setOpen('edit')
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleView}>
          <IconEye className="mr-2 h-4 w-4" />
          Ver Detalle
        </DropdownMenuItem>
        {row.original.estado !== 'Finalizado' && (
          <DropdownMenuItem onClick={handleRegistrarResultados}>
            <IconClipboard className="mr-2 h-4 w-4" />
            Finalizar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 