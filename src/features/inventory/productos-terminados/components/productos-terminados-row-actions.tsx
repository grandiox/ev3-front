import { Row } from '@tanstack/react-table'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconEdit, IconTrash, IconAlertTriangle } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { useProductosTerminados } from '../context/productos-terminados-context'
import { useEliminarProductoTerminado } from '@/services/api/hooks/useProductosTerminados'
import { toast } from 'sonner'
import { ProductoTerminado } from '../data/schema'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DataTableRowActionsProps {
  row: Row<ProductoTerminado>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useProductosTerminados()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [confirmValue, setConfirmValue] = useState('')
  const { mutateAsync: eliminarProductoTerminado } = useEliminarProductoTerminado()

  const handleEdit = () => {
    setCurrentRow(row.original)
    setOpen('edit')
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmarEliminar = async () => {
    if (!row.original.id) return
    try {
      await eliminarProductoTerminado(row.original.id)
      toast.success('Producto terminado eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar producto terminado:', error)
      toast.error('Error al eliminar el producto terminado')
    } finally {
      setShowDeleteDialog(false)
      setConfirmValue('')
    }
  }

  const nombreProducto = row.original?.codigo || ''
  const confirmDisabled = confirmValue.trim() !== nombreProducto

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={(open) => { setShowDeleteDialog(open); if (!open) setConfirmValue('') }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <span className="text-destructive flex items-center">
                <IconAlertTriangle className="stroke-destructive mr-2 inline-block" size={18} />
                Eliminar Producto Terminado
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p>
                  ¿Estás seguro que deseas eliminar <span className="font-bold">{nombreProducto}</span>?
                  <br />
                  Esta acción eliminará permanentemente el producto terminado y no se puede deshacer.
                </p>
                <Label className="my-2">
                  Nombre del producto:
                  <Input
                    value={confirmValue}
                    onChange={e => setConfirmValue(e.target.value)}
                    placeholder="Escribe el nombre exacto para confirmar."
                  />
                </Label>
                <Alert variant="destructive">
                  <AlertTitle>¡Advertencia!</AlertTitle>
                  <AlertDescription>
                    Esta operación no se puede revertir. Por favor, confirma escribiendo el nombre exacto del producto.
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