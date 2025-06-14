import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEdit, IconTrash, IconAlertTriangle } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMateriasPrimas } from '../context/materias-primas-context'
import { MateriaPrima } from '../data/schema'
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { useEliminarMateriaPrima } from '@/services/api/hooks/useMateriasPrimas'
import { toast } from 'sonner'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DataTableRowActionsProps {
  row: Row<MateriaPrima>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useMateriasPrimas()
  const [mostrarDialogoEliminar, setMostrarDialogoEliminar] = useState(false)
  const [confirmValue, setConfirmValue] = useState('')
  const { mutateAsync: eliminarMateriaPrima } = useEliminarMateriaPrima()

  const handleConfirmarEliminar = async () => {
    if (!row.original.id) return
    try {
      await eliminarMateriaPrima(row.original.id)
      toast.success('Materia prima eliminada correctamente')
    } catch (error) {
      console.error('Error al eliminar materia prima:', error)
      toast.error('Error al eliminar la materia prima')
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

  const nombreMateriaPrima = row.original?.codigo || ''
  const confirmDisabled = confirmValue.trim() !== nombreMateriaPrima

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
                <IconAlertTriangle className="stroke-destructive mr-2 inline-block" size={18} />
                Eliminar Materia Prima
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p>
                  ¿Estás seguro que deseas eliminar <span className="font-bold">{nombreMateriaPrima}</span>?
                  <br />
                  Esta acción eliminará permanentemente la materia prima y no se puede deshacer.
                </p>
                <Label className="my-2">
                  Nombre de la materia prima:
                  <Input
                    value={confirmValue}
                    onChange={e => setConfirmValue(e.target.value)}
                    placeholder="Escribe el nombre exacto para confirmar."
                  />
                </Label>
                <Alert variant="destructive">
                  <AlertTitle>¡Advertencia!</AlertTitle>
                  <AlertDescription>
                    Esta operación no se puede revertir. Por favor, confirma escribiendo el nombre exacto de la materia prima.
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