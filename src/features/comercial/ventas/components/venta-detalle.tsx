import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils'
import { estadoTypes, canalTypes } from './ventas-columns'
import { type Venta } from '@/services/api/ventas'

interface Props {
  venta: Venta
}

const formatDate = (date: string | null | undefined) => {
  if (!date) return '-'
  return format(new Date(date), 'PPP', { locale: es })
}

const ensureNumber = (value: number | string | null | undefined): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return parseFloat(value) || 0
  return 0
}

const getEstadoVariant = (estado: string | undefined): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' => {
  switch (estado) {
    case 'PENDIENTE':
      return 'warning'
    case 'PAGADA':
      return 'secondary'
    case 'ENTREGADA':
      return 'success'
    case 'CANCELADA':
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

export default function VentaDetalle({ venta }: Props) {
  if (!venta) {
    return (
      <div className="py-10 text-center text-destructive">
        No se encontró información de la venta
      </div>
    )
  }

  // Validar que detalles sea un array
  const detalles = Array.isArray(venta.detalles) ? venta.detalles : []

  const estadoType = estadoTypes[venta.estado as keyof typeof estadoTypes]
  const canalType = canalTypes[venta.canal as keyof typeof canalTypes]
  const EstadoIcon = estadoType?.icon
  const CanalIcon = canalType?.icon

  return (
    <div className="space-y-8">
      {/* Datos principales */}
      <div className="grid grid-cols-2 gap-6 bg-muted/40 rounded-lg p-4">
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Código</div>
          <div className="text-lg font-bold">{venta.codigo || '-'}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Cliente</div>
          <div className="text-lg font-bold">{venta.cliente?.nombre || '-'}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Fecha de Venta</div>
          <div className="text-base">{formatDate(venta.fechaVenta)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Canal</div>
          <div className="flex items-center gap-2">
            {CanalIcon && <CanalIcon className={`h-4 w-4 ${canalType?.color}`} />}
            <Badge variant={getCanalVariant(venta.canal || '')}>{canalType?.label || venta.canal || '-'}</Badge>
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Estado</div>
          <div className="flex items-center gap-2">
            {EstadoIcon && <EstadoIcon className={`h-4 w-4 ${estadoType?.color}`} />}
            <Badge variant={getEstadoVariant(venta.estado)}>{estadoType?.label || venta.estado || 'Pendiente'}</Badge>
          </div>
        </div>
        {venta.notas && (
          <div>
            <div className="text-xs text-muted-foreground font-semibold">Notas</div>
            <div className="text-base">{venta.notas}</div>
          </div>
        )}
      </div>

      {/* Totales */}
      <div className="grid grid-cols-2 gap-6 bg-muted/40 rounded-lg p-4">
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Subtotal</div>
          <div className="text-lg font-bold">{formatCurrency(ensureNumber(venta.subtotal))}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Descuento</div>
          <div className="text-lg font-bold">{formatCurrency(ensureNumber(venta.descuento))}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Impuestos</div>
          <div className="text-lg font-bold">{formatCurrency(ensureNumber(venta.impuestos))}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">Total</div>
          <div className="text-lg font-bold">{formatCurrency(ensureNumber(venta.total))}</div>
        </div>
      </div>

      {/* Detalles de la Venta */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Detalles de la Venta</h3>
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
                  <td colSpan={7} className="text-center text-muted-foreground">No hay detalles registrados para esta venta</td>
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