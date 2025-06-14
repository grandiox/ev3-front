import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconTrash, IconAlertTriangle, IconEye } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLotesProducto } from '../context/lotes-producto-context'
import { LoteProducto } from '../data/schema'
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { useEliminarLoteProducto } from '@/services/api/hooks/useLotesProducto'
import { toast } from 'sonner'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DataTableRowActionsProps {
  row: Row<LoteProducto>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setCurrentRow, setOpen } = useLotesProducto()
  const [mostrarDialogoEliminar, setMostrarDialogoEliminar] = useState(false)
  const [confirmValue, setConfirmValue] = useState('')
  const eliminarLote = useEliminarLoteProducto()

  const handleConfirmarEliminar = async () => {
    if (!row.original.id) return
    try {
      await eliminarLote.mutateAsync(row.original.id)
      toast.success('Lote eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar lote:', error)
      toast.error('Error al eliminar el lote')
    } finally {
      setMostrarDialogoEliminar(false)
      setConfirmValue('')
    }
  }

  const handleDelete = () => {
    setCurrentRow(row.original)
    setMostrarDialogoEliminar(true)
  }

  const handleView = () => {
    setCurrentRow(row.original)
    setOpen('view')
  }

  const nombreLote = row.original?.codigoLote || ''
  const confirmDisabled = confirmValue.trim() !== nombreLote

  return (
    <>
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
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <IconTrash className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={mostrarDialogoEliminar} onOpenChange={(open) => { setMostrarDialogoEliminar(open); if (!open) setConfirmValue('') }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <span className="text-destructive flex items-center">
                <IconAlertTriangle className="stroke-destructive mr-2 inline-block" size={18} />
                Eliminar Lote
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p>
                  ¿Estás seguro que deseas eliminar <span className="font-bold">{nombreLote}</span>?
                  <br />
                  Esta acción eliminará permanentemente el lote y no se puede deshacer.
                </p>
                <Label className="my-2">
                  Nombre del lote:
                  <Input
                    value={confirmValue}
                    onChange={e => setConfirmValue(e.target.value)}
                    placeholder="Escribe el nombre exacto para confirmar."
                  />
                </Label>
                <Alert variant="destructive">
                  <AlertTitle>¡Advertencia!</AlertTitle>
                  <AlertDescription>
                    Esta operación no se puede revertir. Por favor, confirma escribiendo el nombre exacto del lote.
                  </AlertDescription>
                </Alert>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarEliminar}
              disabled={confirmDisabled}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 