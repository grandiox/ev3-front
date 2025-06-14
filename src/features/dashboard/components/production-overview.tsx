import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ProductionOverviewProps {
  data: {
    totalOrdenes: number
    volumenProgramado: string | number
    volumenProducido: string | number
    eficienciaPromedio: number
    tiempoPromedioProduccion: number
    ordenesPorEstado: {
      Programada: number
      'En Preparacion': number
      'En Proceso': number
      Pausada: number
      Finalizada: number
      Cancelada: number
    }
  }
}

export function ProductionOverview({ data }: ProductionOverviewProps) {
  // Aseguramos que los valores sean numéricos para los cálculos
  const volumenProducido = typeof data.volumenProducido === 'string' ? parseFloat(data.volumenProducido) : data.volumenProducido
  const volumenProgramado = typeof data.volumenProgramado === 'string' ? parseFloat(data.volumenProgramado) : data.volumenProgramado
  const productionProgress = volumenProgramado > 0 ? (volumenProducido / volumenProgramado) * 100 : 0

  return (
      <><Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Total Ordenes</CardTitle>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='text-muted-foreground h-4 w-4'
        >
          <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
        </svg>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{data.totalOrdenes}</div>
        <p className='text-xs text-muted-foreground mt-2'>
          {data.ordenesPorEstado.Finalizada} ordenes finalizadas
        </p>
      </CardContent>
    </Card><Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Volumen de Producción</CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='text-muted-foreground h-4 w-4'
          >
            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{volumenProducido}L</div>
          <Progress value={productionProgress} className='h-2' />
          <p className='text-xs text-muted-foreground mt-2'>
            {productionProgress.toFixed(1)}% de {volumenProgramado}L programado
          </p>
        </CardContent>
      </Card><Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Eficiencia Promedio</CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='text-muted-foreground h-4 w-4'
          >
            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{data.eficienciaPromedio.toFixed(1)}%</div>
          <p className='text-xs text-muted-foreground mt-2'>
            {data.ordenesPorEstado['En Proceso']} ordenes en proceso
          </p>
        </CardContent>
      </Card><Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Tiempo de Producción</CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='text-muted-foreground h-4 w-4'
          >
            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{Number(data.tiempoPromedioProduccion).toFixed(1)}h</div>
          <p className='text-xs text-muted-foreground mt-2'>
            {data.ordenesPorEstado.Programada} ordenes programadas
          </p>
        </CardContent>
      </Card></>
  )
} 