import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical, IconEye } from '@tabler/icons-react'
import { useHasPermission } from '@/hooks/use-has-permission'
import { useState } from 'react'
import { useVentas } from '../context/ventas-context'
import { useCambiarEstadoVenta } from '@/services/api/hooks/useVentas'
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
import { type Venta } from '@/services/api/ventas'

const transicionesValidas: Record<string, string[]> = {
  PENDIENTE: ['PAGADA', 'CANCELADA'],
  PAGADA: ['ENTREGADA', 'CANCELADA'],
  ENTREGADA: [],
  CANCELADA: [],
}

const estadoLabels: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  PAGADA: 'Pagada',
  ENTREGADA: 'Entregada',
  CANCELADA: 'Cancelada',
}

export function VentasRowActions({ row }: { row: { original: Venta } }) {
  const canWrite = useHasPermission('comercial:write')
  const [showEstadoDialog, setShowEstadoDialog] = useState(false)
  const [estadoTarget, setEstadoTarget] = useState<string | null>(null)
  const { setOpen, setCurrentRow } = useVentas()
  const { mutateAsync: cambiarEstadoVenta, isPending: loadingEstado } = useCambiarEstadoVenta()

  const handleView = () => {
    setCurrentRow(row.original)
    setOpen('view')
  }

  const handleChangeEstado = (estado: string) => {
    setEstadoTarget(estado)
    setShowEstadoDialog(true)
  }

  const confirmChangeEstado = async () => {
    if (!row.original.id || !estadoTarget) return
    await cambiarEstadoVenta({ id: row.original.id, estado: estadoTarget })
    setShowEstadoDialog(false)
    setEstadoTarget(null)
  }

  const estadoActual = (row.original.estado?.toUpperCase() || 'PENDIENTE')
  const opcionesTransicion = transicionesValidas[estadoActual] || []
  const isEntregada = estadoActual === 'ENTREGADA'

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
          {canWrite && !isEntregada && (
            <>
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

      <AlertDialog open={showEstadoDialog} onOpenChange={setShowEstadoDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cambiar estado de la venta?</AlertDialogTitle>
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

export default VentasRowActions 