import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useClientes } from '../context/clientes-context'
import { Cliente } from '@/services/api/clientes'
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { toast } from 'sonner'
import { clientesApi } from '@/services/api/clientes'
import { useQueryClient } from '@tanstack/react-query'
import { useHasPermission } from '@/hooks/use-has-permission'

interface DataTableRowActionsProps {
  row: Row<Cliente>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useClientes()
  const [mostrarDialogoEliminar, setMostrarDialogoEliminar] = useState(false)
  const [confirmValue, setConfirmValue] = useState('')
  const queryClient = useQueryClient()
  const canWrite = useHasPermission('comercial:write')

  const handleEdit = () => {
    setCurrentRow(row.original)
    setOpen('edit')
  }

  const handleDelete = () => {
    setCurrentRow(row.original)
    setMostrarDialogoEliminar(true)
  }

  const handleView = () => {
    setCurrentRow(row.original)
    setOpen('view')
  }

  const handleConfirmarEliminar = async () => {
    try {
      await clientesApi.delete(row.original.id)
      toast.success('Cliente eliminado correctamente')
      setMostrarDialogoEliminar(false)
      setConfirmValue('')
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    } catch (_error) {
      toast.error('Error al eliminar el cliente')
    }
  }

  const nombreCliente = row.original?.nombre || ''
  const confirmDisabled = confirmValue.trim() !== nombreCliente

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
          {canWrite && (
            <>
              <DropdownMenuItem onClick={handleEdit}>
                <IconEdit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <IconTrash className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={mostrarDialogoEliminar} onOpenChange={(open) => { setMostrarDialogoEliminar(open); if (!open) setConfirmValue('') }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <span className="text-destructive flex items-center">
                <IconTrash className="stroke-destructive mr-2 inline-block" size={18} />
                Eliminar Cliente
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p>
                  ¿Estás seguro que deseas eliminar <span className="font-bold">{nombreCliente}</span>?
                  <br />
                  Esta acción eliminará permanentemente el cliente y no se puede deshacer.
                </p>
                <div className="my-2">
                  Nombre del cliente:
                  <input
                    value={confirmValue}
                    onChange={e => setConfirmValue(e.target.value)}
                    placeholder="Escribe el nombre exacto para confirmar."
                    className="input input-bordered w-full mt-1"
                  />
                </div>
                <div className="bg-red-100 text-red-700 p-2 rounded">
                  Esta operación no se puede revertir. Por favor, confirma escribiendo el nombre exacto del cliente.
                </div>
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