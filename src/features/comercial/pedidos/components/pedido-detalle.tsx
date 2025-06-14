import { Pedido } from '@/services/api/pedidos'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils'
import { estadoTypes, canalTypes } from './pedidos-columns'

interface Props {
  pedido: Pedido
}

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return format(new Date(date), 'PPP', { locale: es })
}

const ensureNumber = (value: number | string | null | undefined): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return parseFloat(value) || 0
  return 0
}

const getEstadoVariant = (estado: string | undefined) => {
  if (!estado) return 'default'
  
  switch (estado) {
    case 'PENDIENTE':
      return 'warning'
    case 'EN_PROCESO':
      return 'secondary'
    case 'LISTO':
      return 'success'
    case 'VENDIDO':
      return 'default'
    case 'CANCELADO':
      return 'destructive'
    default:
      return 'default'
  }
}

const getCanalVariant = (canal: string) => {
  switch (canal) {
    case 'online':
      return 'secondary'
    case 'presencial':
      return 'default'
    case 'telefono':
      return 'success'
    default:
      return 'default'
  }
}

export default function PedidoDetalle({ pedido }: Props) {
  if (!pedido) {
    return (
      <div className="py-10 text-center text-destructive">
        No se encontró información del pedido
      </div>
    )
  }

  // Validar que detalles sea un array
  const detalles = Array.isArray(pedido.detalles) ? pedido.detalles : []

  const estadoType = estadoTypes[pedido.estado as keyof typeof estadoTypes]
  const canalType = canalTypes[pedido.canal as keyof typeof canalTypes]
  const EstadoIcon = estadoType?.icon
  const CanalIcon = canalType?.icon

  return (
    <div className="space-y-8">
      {/* Datos principales */}
      <div className="grid grid-cols-2 gap-6 bg-muted/40 rounded-lg p-4">
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Código</div>
          <div className="text-lg font-bold">{pedido.codigo || '-'}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Cliente</div>
          <div className="text-lg font-bold">{pedido.cliente?.nombre || '-'}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Fecha Pedido</div>
          <div className="text-base">{formatDate(pedido.fechaPedido)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Fecha Entrega</div>
          <div className="text-base">{formatDate(pedido.fechaEntregaProgramada)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Canal</div>
          <div className="flex items-center gap-2">
            {CanalIcon && <CanalIcon className={`h-4 w-4 ${canalType?.color}`} />}
            <Badge variant={getCanalVariant(pedido.canal || '')}>{canalType?.label || pedido.canal || '-'}</Badge>
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Estado</div>
          <div className="flex items-center gap-2">
            {EstadoIcon && <EstadoIcon className={`h-4 w-4 ${estadoType?.color}`} />}
            <Badge variant={getEstadoVariant(pedido.estado)}>{estadoType?.label || pedido.estado || 'Pendiente'}</Badge>
          </div>
        </div>
        {pedido.notas && (
          <div>
            <div className="text-xs text-muted-foreground font-semibold">Notas</div>
            <div className="text-base">{pedido.notas}</div>
          </div>
        )}
      </div>

      {/* Totales */}
      <div className="grid grid-cols-2 gap-6 bg-muted/40 rounded-lg p-4">
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Subtotal</div>
          <div className="text-lg font-bold">{formatCurrency(ensureNumber(pedido.subtotal))}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Descuento</div>
          <div className="text-lg font-bold">{formatCurrency(ensureNumber(pedido.descuento))}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Impuestos</div>
          <div className="text-lg font-bold">{formatCurrency(ensureNumber(pedido.impuestos))}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Total</div>
          <div className="text-lg font-bold">{formatCurrency(ensureNumber(pedido.total))}</div>
        </div>
      </div>

      {/* Detalles del Pedido */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Detalles del Pedido</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-muted">
                <th className="px-2 py-1 text-left">Producto</th>
                <th className="px-2 py-1 text-center">Cantidad</th>
                <th className="px-2 py-1 text-center">Unidad</th>
                <th className="px-2 py-1 text-center">Precio Unitario</th>
                <th className="px-2 py-1 text-center">Descuento</th>
                <th className="px-2 py-1 text-center">Subtotal</th>
                <th className="px-2 py-1 text-left">Notas</th>
              </tr>
            </thead>
            <tbody>
              {detalles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted-foreground">No hay detalles registrados para este pedido</td>
                </tr>
              ) : (
                detalles.map((detalle, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 py-1">{detalle.producto?.nombre || detalle.productoId}</td>
                    <td className="px-2 py-1 text-center">{detalle.cantidad?.toLocaleString('es-MX') || '0'}</td>
                    <td className="px-2 py-1 text-center">{detalle.unidadMedida || '-'}</td>
                    <td className="px-2 py-1 text-center">{formatCurrency(ensureNumber(detalle.precioUnitario))}</td>
                    <td className="px-2 py-1 text-center">{formatCurrency(ensureNumber(detalle.descuento))}</td>
                    <td className="px-2 py-1 text-center">{formatCurrency(ensureNumber(detalle.subtotal))}</td>
                    <td className="px-2 py-1 max-w-[200px] truncate">{detalle.notas || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 