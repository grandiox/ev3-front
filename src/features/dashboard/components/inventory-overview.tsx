import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'

interface InventoryOverviewProps {
  data: {
    stockSano: number
    stockBajo: number
    lotesPorCaducar: number
    productosStock: Array<{
      nombre: string
      estilo: string
      presentacion: string
      capacidad: number
      stock: number
    }>
    valorMateriaPrima: number
    valorProductosTerminados: number
    valorTotal: number
    topProductos: Array<{
      nombre: string
      estilo: string
      cantidadVendida: number
      valorTotal: number
    }>
    lotesEnCuarentena: number
    productosOptimoConsumo: number
  }
}

export function InventoryOverview({ data }: InventoryOverviewProps) {
  const totalStock = data.stockSano + data.stockBajo
  const stockHealthPercentage = totalStock > 0 ? (data.stockSano / totalStock) * 100 : 0

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Salud del Stock</CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stockHealthPercentage.toFixed(1)}%</div>
          <Progress value={stockHealthPercentage} className='mt-2' />
          <p className='text-xs text-muted-foreground mt-2'>
            {data.stockSano} items saludables de {totalStock} total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Materias Primas</CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{formatCurrency(data.valorMateriaPrima)}</div>
          <p className='text-xs text-muted-foreground mt-2'>
            {data.stockBajo} items con stock bajo
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Productos Terminados</CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{formatCurrency(data.valorProductosTerminados)}</div>
          <p className='text-xs text-muted-foreground mt-2'>
            {data.lotesPorCaducar} lotes por caducar
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Valor Total del Inventario</CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'
          >
            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{formatCurrency(data.valorTotal)}</div>
          <p className='text-xs text-muted-foreground mt-2'>
            {data.lotesEnCuarentena} lotes en cuarentena
          </p>
        </CardContent>
      </Card>
    </>
  )
} 