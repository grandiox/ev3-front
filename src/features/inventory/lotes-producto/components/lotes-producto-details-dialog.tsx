import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoteProducto } from '../data/schema'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { estadoTypes } from '../data/data'

interface LotesProductoDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lote: LoteProducto | null
}

export function LotesProductoDetailsDialog({
  open,
  onOpenChange,
  lote,
}: LotesProductoDetailsDialogProps) {
  if (!lote) return null

  const estadoType = estadoTypes[lote.estado as keyof typeof estadoTypes]
  const Icon = estadoType.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalle de Lote</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Info principal: Producto y Lote */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted p-4 flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-semibold mb-1">Producto</span>
              <div className="text-sm"><span className="text-muted-foreground">Nombre:</span> <span className="font-medium">{lote.productoTerminado.nombre}</span></div>
              <div className="text-sm"><span className="text-muted-foreground">Código:</span> {lote.productoTerminado.codigo}</div>
              <div className="text-sm"><span className="text-muted-foreground">Estilo:</span> {lote.productoTerminado.estilo}</div>
              <div className="text-sm"><span className="text-muted-foreground">Presentación:</span> {lote.productoTerminado.presentacion}</div>
            </div>
            <div className="rounded-lg bg-muted p-4 flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-semibold mb-1">Lote</span>
              <div className="text-sm"><span className="text-muted-foreground">Código Lote:</span> <span className="font-medium">{lote.codigoLote}</span></div>
              <div className="text-sm"><span className="text-muted-foreground">Fecha Envasado:</span> {format(lote.fechaEnvasado, 'PPP', { locale: es })}</div>
              <div className="text-sm"><span className="text-muted-foreground">Fecha Óptimo Consumo:</span> {lote.fechaOptimoConsumo ? format(lote.fechaOptimoConsumo, 'PPP', { locale: es }) : '-'}</div>
              <div className="text-sm"><span className="text-muted-foreground">Fecha Caducidad:</span> {lote.fechaCaducidad ? format(lote.fechaCaducidad, 'PPP', { locale: es }) : '-'}</div>
            </div>
          </div>

          {/* Cantidades */}
          <div className="rounded-lg bg-muted p-4 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-semibold mb-1">Cantidades</span>
            <div className="text-sm"><span className="text-muted-foreground">Total:</span> <span className="font-medium">{lote.cantidad.toLocaleString('es-CL')}</span></div>
            <div className="text-sm"><span className="text-muted-foreground">Disponible:</span> <span className="font-medium">{lote.cantidadDisponible.toLocaleString('es-CL')}</span></div>
          </div>

          {/* Estado y Ubicación */}
          <div className="rounded-lg bg-muted p-4 flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-semibold mb-1">Estado y Ubicación</span>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-muted-foreground text-sm">Estado:</span>
              <div className={`flex items-center gap-2 rounded-full px-2 py-1 ${estadoType.bgColor}`}>
                {Icon && <Icon className={`h-4 w-4 ${estadoType.color}`} />}
                <span className={`text-xs font-medium ${estadoType.color}`}>{estadoType.label}</span>
              </div>
            </div>
            <div className="text-sm"><span className="text-muted-foreground">Ubicación Física:</span> {lote.ubicacionFisica || '-'}</div>
          </div>

          {/* Notas */}
          <div className="col-span-1 md:col-span-2">
            <div className="rounded-lg bg-muted p-4 mt-2">
              <span className="text-xs text-muted-foreground font-semibold mb-1 block">Notas</span>
              <div className="text-sm text-muted-foreground italic">
                {lote.notas ? lote.notas : 'Sin notas'}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 