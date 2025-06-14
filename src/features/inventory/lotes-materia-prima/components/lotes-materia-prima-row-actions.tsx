import { Row } from '@tanstack/react-table'
import { MoreHorizontal, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LoteMateriaPrima } from '../data/schema'
import { useLotesMateriaPrima } from '../context/lotes-materia-prima-context'
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
  import { useEliminarLoteMateriaPrima } from '@/services/api/hooks/useLotesMateriaPrima'
import { IconEdit, IconTrash } from '@tabler/icons-react'

interface DataTableRowActionsProps {
  row: Row<LoteMateriaPrima>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useLotesMateriaPrima()
  const [mostrarDialogoEliminar, setMostrarDialogoEliminar] = useState(false)
  const [confirmValue, setConfirmValue] = useState('')
  const { mutateAsync: eliminarLote } = useEliminarLoteMateriaPrima()

  const handleConfirmarEliminar = async () => {
    if (!row.original.id) return
    try {
      await eliminarLote(row.original.id)
      toast.success('Lote eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar lote:', error)
      toast.error('Error al eliminar el lote')
    } finally {
      setMostrarDialogoEliminar(false)
      setConfirmValue('')
    }
  }
  const handleEdit = () => {
    setCurrentRow(row.original)
    setOpen('edit')
  }
  const handleDelete = () => {
    setCurrentRow(row.original)
    setMostrarDialogoEliminar(true)
  }

  const nombreLote = row.original?.codigoLote || ''
  const confirmDisabled = confirmValue.trim() !== nombreLote

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleEdit}>
            <IconEdit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
                <AlertTriangle className="stroke-destructive mr-2 inline-block" size={18} />
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