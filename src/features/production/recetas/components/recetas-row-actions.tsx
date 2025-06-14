import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEdit, IconTrash, IconEye, IconToggleLeft, IconToggleRight, IconCopy, IconCircle, IconCalculator } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRecetas } from '../context/recetas-context'
import { Receta } from '@/services/api/recetas'
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { useEliminarReceta, useActualizarEstadoReceta, useClonarReceta, useValidarReceta, useCostoReceta } from '@/services/api/hooks/useRecetas'
import { toast } from 'sonner'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface DataTableRowActionsProps {
  row: Row<Receta>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useRecetas()
  const [mostrarDialogoEliminar, setMostrarDialogoEliminar] = useState(false)
  const [confirmValue, setConfirmValue] = useState('')
  const { mutateAsync: eliminarReceta } = useEliminarReceta()
  const { mutateAsync: actualizarEstadoReceta } = useActualizarEstadoReceta()
  const { mutateAsync: clonarReceta } = useClonarReceta()
  const { mutateAsync: validarReceta } = useValidarReceta()
  const { mutateAsync: costoReceta } = useCostoReceta()
  const [showCloneDialog, setShowCloneDialog] = useState(false)
  const [cloneVersion, setCloneVersion] = useState('')
  const [cloneDescription, setCloneDescription] = useState('')

  const handleConfirmarEliminar = async () => {
    if (!row.original.id) return
    try {
      await eliminarReceta(row.original.id)
      toast.success('Receta eliminada correctamente')
    } catch (error: unknown) {
      console.error('Error al eliminar receta:', error)
    } finally {
      setMostrarDialogoEliminar(false)
      setConfirmValue('')
    }
  }

  const handleToggleEstado = async () => {
    try {
      const nuevoEstado = row.original.estado === 'Activo' ? 'Inactivo' : 'Activo'
      await actualizarEstadoReceta({
        id: row.original.id,
        data: { estado: nuevoEstado }
      })
      toast.success(`Receta ${nuevoEstado === 'Activo' ? 'activada' : 'desactivada'} correctamente`)
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      toast.error('Error al cambiar el estado de la receta')
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

  const handleView = () => {
    setCurrentRow(row.original)
    setOpen('view')
  }

  const handleClonar = async () => {
    setShowCloneDialog(true)
  }

  const handleConfirmClone = async () => {
    try {
      await clonarReceta({
        id: row.original.id,
        data: {
          nuevaVersion: cloneVersion,
          descripcion: cloneDescription,
        },
      })
      toast.success('Receta clonada correctamente')
      setShowCloneDialog(false)
      setCloneVersion('')
      setCloneDescription('')
    } catch {
      toast.error('Error al clonar la receta')
    }
  }

  const handleValidar = async () => {
    try {
      const result = await validarReceta(row.original.id);
      if (result.data.esValida) {
        toast.success('Receta válida');
      } else {
        toast.error(
          `Receta inválida. Errores: ${result.data.errores.join(', ') || 'Ninguno'}`
        );
      }
      if (result.data.advertencias.length > 0) {
        toast.warning(
          `Advertencias: ${result.data.advertencias.join(', ')}`
        );
      }
    } catch {
      toast.error('Error al validar la receta');
    }
  }

  const handleCosto = async () => {
    try {
      const result = await costoReceta(row.original.id);
      toast.info(
        `Costo total: $${Number(result.data.costoTotal).toLocaleString()} | Costo por litro: $${Number(result.data.costoPorLitro).toFixed(2)}`
      );
    } catch {
      toast.error('Error al calcular el costo de la receta');
    }
  }

  const nombreReceta = row.original?.nombre || ''
  const confirmDisabled = confirmValue.trim() !== nombreReceta

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
          <DropdownMenuItem onClick={handleEdit}>
            <IconEdit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleEstado}>
            {row.original.estado === 'Activo' ? (
              <>
                <IconToggleLeft className="mr-2 h-4 w-4" />
                Desactivar
              </>
            ) : (
              <>
                <IconToggleRight className="mr-2 h-4 w-4" />
                Activar
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleClonar}>
            <IconCopy className="mr-2 h-4 w-4" />
            Clonar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleValidar}>
            <IconCircle className="mr-2 h-4 w-4" />
            Validar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCosto}>
            <IconCalculator className="mr-2 h-4 w-4" />
            Calcular costo
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
                <IconTrash className="stroke-destructive mr-2 inline-block" size={18} />
                Eliminar Receta
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p>
                  ¿Estás seguro que deseas eliminar <span className="font-bold">{nombreReceta}</span>?
                  <br />
                  Esta acción eliminará permanentemente la receta y no se puede deshacer.
                </p>
                <Label className="my-2">
                  Nombre de la receta:
                  <Input
                    value={confirmValue}
                    onChange={e => setConfirmValue(e.target.value)}
                    placeholder="Escribe el nombre exacto para confirmar."
                  />
                </Label>
                <Alert variant="destructive">
                  <AlertTitle>¡Advertencia!</AlertTitle>
                  <AlertDescription>
                    Esta operación no se puede revertir. Por favor, confirma escribiendo el nombre exacto de la receta.
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
      <Dialog open={showCloneDialog} onOpenChange={setShowCloneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clonar Receta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nueva versión</label>
              <Input value={cloneVersion} onChange={e => setCloneVersion(e.target.value)} placeholder="Ej: 2.0.0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <Input value={cloneDescription} onChange={e => setCloneDescription(e.target.value)} placeholder="Descripción de la nueva versión" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloneDialog(false)}>Cancelar</Button>
            <Button onClick={handleConfirmClone} disabled={!cloneVersion || !cloneDescription}>Clonar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 