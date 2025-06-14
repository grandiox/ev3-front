import { InventoryDashboard } from './dashboard'
import { ModulesLayout } from '@/components/layout/layout'

export function Inventory() {
  return (
    <ModulesLayout
      title="Inventario"
      subtitle="Gestione el inventario de la empresa"
    >
      <InventoryDashboard />
    </ModulesLayout>
  )
} 
