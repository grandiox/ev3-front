import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDashboard } from '@/services/api/hooks/useDashboard'
import { InventoryOverview } from './components/inventory-overview'
import { ProductionOverview } from './components/production-overview'
import { CommercialOverview } from './components/commercial-overview'
import { InventoryChart } from './components/inventory-chart'
import { ProductionChart } from './components/production-chart'
import { ModulesLayout } from '@/components/layout/layout'

function Dashboard() {
  const { data: dashboardData, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent' />
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-lg text-muted-foreground'>No hay datos disponibles</p>
      </div>
    )
  }

  const { inventario, produccion, comercial } = dashboardData
  console.log('produccion', produccion)

  return (
    <>
      <ModulesLayout
        title="Dashboard"
        subtitle="Gestione las recetas de producción"
      >

        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>General</TabsTrigger>
            <TabsTrigger value='inventory'>Inventario</TabsTrigger>
            <TabsTrigger value='production'>Producción</TabsTrigger>
            <TabsTrigger value='commercial'>Comercial</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <InventoryOverview data={inventario} />
            </div>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
              <div className='col-span-4'>
                <InventoryChart data={inventario.productosStock} />
              </div>
              <div className='col-span-3'>
                <ProductionChart data={produccion.ordenesPorEstado} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value='inventory' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <InventoryOverview data={inventario} />
            </div>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
              <div className='col-span-4'>
                <InventoryChart data={inventario.productosStock} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value='production' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <ProductionOverview
                data={produccion}
              />
            </div>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
              <div className='col-span-3'>
                <ProductionChart data={produccion.ordenesPorEstado} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value='commercial' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <CommercialOverview data={comercial} />
            </div>
          </TabsContent>
        </Tabs>
      </ModulesLayout>
    </>
  )
}

export default Dashboard
