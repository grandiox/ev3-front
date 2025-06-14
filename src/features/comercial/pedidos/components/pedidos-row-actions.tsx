import { Pedido } from '@/services/api/pedidos'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical, IconEye, IconEdit, IconTrash } from '@tabler/icons-react'
import { useHasPermission } from '@/hooks/use-has-permission'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { pedidosApi } from '@/services/api/pedidos'
import { toast } from 'sonner'
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
import { usePedidos } from '../context/pedidos-context'
import { useCambiarEstadoPedido } from '@/services/api/hooks/usePedidos'

interface Props {
  row: {
    original: Pedido
  }
}

const PedidoEstado = {
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  LISTO: 'LISTO',
  VENDIDO: 'VENDIDO',
  CANCELADO: 'CANCELADO',
} as const

type PedidoEstado = keyof typeof PedidoEstado

const transicionesValidas: Record<PedidoEstado, PedidoEstado[]> = {
  PENDIENTE: ['EN_PROCESO', 'CANCELADO'],
  EN_PROCESO: ['LISTO', 'CANCELADO'],
  LISTO: ['VENDIDO', 'CANCELADO'],
  VENDIDO: [],
  CANCELADO: [],
}

const estadoLabels: Record<PedidoEstado, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso',
  LISTO: 'Listo',
  VENDIDO: 'Vendido',
  CANCELADO: 'Cancelado',
}

export function PedidosRowActions({ row }: Props) {
  const canWrite = useHasPermission('comercial:write')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const queryClient = useQueryClient()
  const { setOpen, setCurrentRow } = usePedidos()
  const [showEstadoDialog, setShowEstadoDialog] = useState(false)
  const [estadoTarget, setEstadoTarget] = useState<PedidoEstado | null>(null)
  const { mutateAsync: cambiarEstadoPedido, isPending: loadingEstado } = useCambiarEstadoPedido()

  const handleView = () => {
    setCurrentRow(row.original)
    setOpen('view')
  }

  const handleEdit = () => {
    setCurrentRow(row.original)
    setOpen('edit')
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const handleChangeEstado = (estado: PedidoEstado) => {
    setEstadoTarget(estado)
    setShowEstadoDialog(true)
  }

  const confirmDelete = async () => {
    try {
      if (!row.original.id) {
        throw new Error('ID de pedido no válido')
      }
      
      await pedidosApi.delete(row.original.id)
      toast.success('Pedido eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
    } catch (error: unknown) {
      console.error('Error al eliminar pedido:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al eliminar el pedido'
      toast.error(errorMessage)
    } finally {
      setShowDeleteDialog(false)
    }
  }

  const confirmChangeEstado = async () => {
    if (!row.original.id || !estadoTarget) return
    try {
      await cambiarEstadoPedido({ id: row.original.id, estado: estadoTarget })
      toast.success('Estado del pedido actualizado correctamente')
    } catch (error: unknown) {
      console.error('Error al cambiar estado del pedido:', error)
    } finally {
      setShowEstadoDialog(false)
      setEstadoTarget(null)
    }
  }

  const estadoActual = (row.original.estado?.toUpperCase() || 'PENDIENTE') as PedidoEstado
  const opcionesTransicion = transicionesValidas[estadoActual] || []
  const isVendido = estadoActual === 'VENDIDO'

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleView}>
            <IconEye className="mr-2 h-4 w-4" />
            Ver Detalle
          </DropdownMenuItem>
          {canWrite && !isVendido && (
            <>
              <DropdownMenuItem onClick={handleEdit}>
                <IconEdit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <IconTrash className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
              {opcionesTransicion.length > 0 && (
                <>
                  <DropdownMenuItem disabled className="opacity-70 cursor-default">Cambiar estado a:</DropdownMenuItem>
                  {opcionesTransicion.map((estado) => (
                    <DropdownMenuItem key={estado} onClick={() => handleChangeEstado(estado)}>
                      {estadoLabels[estado]}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el pedido
              {row.original.codigo && ` ${row.original.codigo}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showEstadoDialog} onOpenChange={setShowEstadoDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cambiar estado del pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea cambiar el estado a <b>{estadoTarget ? estadoLabels[estadoTarget] : ''}</b>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingEstado}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmChangeEstado} disabled={loadingEstado}>
              {loadingEstado ? 'Cambiando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 