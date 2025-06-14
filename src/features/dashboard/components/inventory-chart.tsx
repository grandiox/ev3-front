import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface InventoryChartProps {
  data: Array<{
    nombre: string
    estilo: string
    presentacion: string
    capacidad: number
    stock: number
  }>
}

export function InventoryChart({ data }: InventoryChartProps) {
  const chartData = data.map((item) => ({
    name: item.nombre,
    stock: item.stock,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Niveles de Stock de Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='stock' fill='#8884d8' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 