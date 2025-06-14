import { columns } from './components/movimientos-columns'
import { MovimientosTable } from './components/movimientos-table'
import MovimientosProvider from './context/movimientos-context'
import { movimientoListSchema } from './data/schema'
import { useGetMovimientosInventario } from '@/services/api/hooks/useInventario'
import { ModulesLayout } from '@/components/layout/layout'

export default function MovimientosInventario() {
  const { data: movimientosData } = useGetMovimientosInventario()
  const movimientos = movimientosData || []
  const movimientosList = movimientoListSchema.parse(movimientos)

  return (
    <MovimientosProvider>
      <ModulesLayout
        title="Movimientos de Inventario"
        subtitle="Gestione los movimientos de inventario del sistema"
      >
        <MovimientosTable data={movimientosList} columns={columns} />
      </ModulesLayout>
    </MovimientosProvider>
  )
} 