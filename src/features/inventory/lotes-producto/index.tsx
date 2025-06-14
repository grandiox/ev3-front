import { columns } from './components/lotes-producto-columns'
import { LotesProductoTable } from './components/lotes-producto-table'
import LotesProductoProvider from './context/lotes-producto-context'
import { loteProductoListSchema } from './data/schema'
import { ModulesLayout } from '@/components/layout/layout'
import { useGetLotesProducto } from '@/services/api/hooks/useLotesProducto'

export function LotesProducto() {
  const { data: lotes } = useGetLotesProducto();
  const lotesList = loteProductoListSchema.safeParse(lotes)

  return (
    <LotesProductoProvider>
      <ModulesLayout
        title="Lotes de Producto Terminado"
        subtitle="Gestione los lotes de productos terminados del inventario"
      >
        <LotesProductoTable data={lotesList.data || []} columns={columns} />
      </ModulesLayout>
    </LotesProductoProvider>
  )
}
