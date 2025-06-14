import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ProductionChartProps {
  data: {
    Programada: number
    'En Preparacion': number
    'En Proceso': number
    Pausada: number
    Finalizada: number
    Cancelada: number
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF0000']

const STATE_LABELS: Record<string, string> = {
  Programada: 'Programada',
  'En Preparacion': 'En Preparación',
  'En Proceso': 'En Proceso',
  Pausada: 'Pausada',
  Finalizada: 'Finalizada',
  Cancelada: 'Cancelada',
}

export function ProductionChart({ data }: ProductionChartProps) {
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: STATE_LABELS[key] || key,
      value,
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ordenes de Producción por Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={chartData}
                cx='50%'
                cy='50%'
                labelLine={false}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 