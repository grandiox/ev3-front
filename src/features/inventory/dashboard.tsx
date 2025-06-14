import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDashboardInventory } from '@/services/api/hooks/useDashboard';
import { IconCircleCheck, IconAlertTriangle, IconClock, IconPackage, IconChartBar, IconChartPie } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie } from 'recharts';

interface DashboardData {
  materiaPrima: {
    stockSano: number;
    stockBajo: number;
  };
  lotesPorCaducar: number;
  productosStock: Array<{
    nombre: string;
    estilo: string;
    presentacion: string;
    capacidad: number;
    stock: number;
  }>;
  valoracionInventario?: {
    valorMateriaPrima: number;
    valorProductosTerminados: number;
    valorTotal: number;
    rotacionInventario: number;
  };
  topProductos?: Array<{
    nombre: string;
    cantidad: number;
  }>;
  metricasCalidad?: {
    lotesEnCuarentena: number;
    productosOptimoConsumo: number;
    tasaMerma: number;
  };
}

function DashboardSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="relative">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StockChart({ data }: { data: DashboardData }) {
  const chartData = [
    { name: 'Stock Sano', value: data.materiaPrima.stockSano, color: '#22c55e' },
    { name: 'Stock Bajo', value: data.materiaPrima.stockBajo, color: '#ef4444' },
    { name: 'Por Caducar', value: data.lotesPorCaducar, color: '#eab308' },
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ValoracionChart({ data }: { data: DashboardData }) {
  const chartData = [
    { name: 'Materia Prima', value: data.valoracionInventario?.valorMateriaPrima, color: '#3b82f6' },
    { name: 'Productos Terminados', value: data.valoracionInventario?.valorProductosTerminados, color: '#8b5cf6' },
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function InventoryDashboard() {
  const { data, isLoading, error } = useDashboardInventory();
  const navigate = useNavigate();

  if (isLoading) return <DashboardSkeleton />;
  if (error) return (
    <Alert variant="destructive">
      <AlertDescription>Error al cargar el dashboard: {error.message}</AlertDescription>
    </Alert>
  );
  if (!data) return null;

  const linkClass = 'absolute top-3 right-4 text-sm text-foreground hover:underline cursor-pointer font-medium';

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tarjeta Stock sano */}
        <Card className="relative">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <IconCircleCheck className="h-5 w-5 text-green-600" />
            <CardTitle>Materias primas con stock suficiente</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-green-600 block">{data.materiaPrima.stockSano}</span>
            <span className="text-muted-foreground text-sm">Stock sano</span>
            <span
              className={linkClass + ' bottom-3 right-4 top-auto'}
              onClick={() => navigate({ to: '/inventory/materias-primas', search: { stock: 'sano' } })}
              style={{ position: 'absolute' }}
            >
              Ver detalles
            </span>
          </CardContent>
        </Card>

        {/* Tarjeta Stock bajo */}
        <Card className="relative">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <IconAlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle>Materias primas bajo el mínimo</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-red-600 block">{data.materiaPrima.stockBajo}</span>
            <span className="text-muted-foreground text-sm">Stock bajo</span>
            <span
              className={linkClass + ' bottom-3 right-4 top-auto'}
              onClick={() => navigate({ to: '/inventory/materias-primas', search: { stock: 'bajo' } })}
              style={{ position: 'absolute' }}
            >
              Ver detalles
            </span>
          </CardContent>
        </Card>

        {/* Tarjeta Lotes por caducar */}
        <Card className="relative">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <IconClock className="h-5 w-5 text-yellow-600" />
            <CardTitle>Lotes próximos a vencer</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-yellow-600 block">{data.lotesPorCaducar}</span>
            <span className="text-muted-foreground text-sm">Por caducar</span>
            <span
              className={linkClass + ' bottom-3 right-4 top-auto'}
              onClick={() => navigate({ to: '/inventory/lotes-materia-prima', search: { caducar: 'true' } })}
              style={{ position: 'absolute' }}
            >
              Ver detalles
            </span>
          </CardContent>
        </Card>

        {/* Tarjeta Valor Total Inventario */}
        {data.valoracionInventario && (
          <Card className="relative">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <IconPackage className="h-5 w-5 text-blue-600" />
              <CardTitle>Valor Total Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-blue-600 block">
                {formatCurrency(data.valoracionInventario.valorTotal)}
              </span>
              <span className="text-muted-foreground text-sm">Valor total</span>
            </CardContent>
          </Card>
        )}

        {/* Tarjeta Rotación de Inventario */}
        {data.valoracionInventario && (
          <Card className="relative">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <IconChartBar className="h-5 w-5 text-purple-600" />
              <CardTitle>Rotación de Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-purple-600 block">
                {data.valoracionInventario.rotacionInventario.toFixed(2)}
              </span>
              <span className="text-muted-foreground text-sm">Veces por año</span>
            </CardContent>
          </Card>
        )}

        {/* Tarjeta Tasa de Merma */}
        {data.metricasCalidad && (
          <Card className="relative">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <IconChartPie className="h-5 w-5 text-orange-600" />
              <CardTitle>Tasa de Merma</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold text-orange-600 block">
                {data.metricasCalidad.tasaMerma.toFixed(2)}%
              </span>
              <span className="text-muted-foreground text-sm">Porcentaje</span>
            </CardContent>
          </Card>
        )}

        {/* Gráfico de Stock */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <StockChart data={data} />
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Valoración */}
        {data.valoracionInventario && (
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Valoración del Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <ValoracionChart data={data} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabla de productos con stock */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Productos con stock disponible</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Estilo</TableHead>
                    <TableHead>Presentación</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.productosStock.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No hay productos con stock disponible.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.productosStock.map((prod, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{prod.nombre}</TableCell>
                        <TableCell>{prod.estilo}</TableCell>
                        <TableCell>{prod.presentacion}</TableCell>
                        <TableCell>{prod.capacidad}ml</TableCell>
                        <TableCell>{prod.stock}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 