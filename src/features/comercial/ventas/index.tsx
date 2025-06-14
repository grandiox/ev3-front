import { useHasPermission } from '@/hooks/use-has-permission'
import { VentasTable } from '@/features/comercial/ventas/components/ventas-table'
import { VentasProvider, useVentas } from './context/ventas-context'
import { useGetVentas } from '@/services/api/hooks/useVentas'
import { Button } from '@/components/ui/button'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { ModulesLayout } from '@/components/layout/layout'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { columns } from './components/ventas-columns'
import VentaDetalle from './components/venta-detalle'

function VentasContent() {
  const hasWritePermission = useHasPermission('comercial:write')
  const { data, isLoading, error, refetch } = useGetVentas()
  const { open, setOpen, currentRow, setCurrentRow } = useVentas()

  const handleCancelarForm = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <ModulesLayout
      title="Ventas"
      subtitle="Gestión de ventas"
      actions={
        <div className='flex gap-2'>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <IconRefresh className="h-4 w-4" />
          </Button>
        </div>
      }
    >
      {error ? (
        <div className="py-10 text-center">
          <p className="text-destructive mb-4">Error al cargar las ventas</p>
          <Button onClick={() => refetch()} variant="outline">
            Reintentar
          </Button>
        </div>
      ) : (
        <VentasTable
          columns={columns}
          data={data || []}
        />
      )}

      {/* Modal Detalle Venta */}
      <Dialog
        open={open === 'view'}
        onOpenChange={(open) => {
          if (!open) handleCancelarForm()
        }}
      >
        <DialogContent className="max-w-3xl min-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Detalle de Venta</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Cargando detalle...</div>
          ) : currentRow ? (
            <VentaDetalle venta={currentRow} />
          ) : (
            <div className="py-10 text-center text-destructive">
              No se pudo cargar el detalle de la venta
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ModulesLayout>
  )
}

export default function Ventas() {
  return (
    <VentasProvider>
      <VentasContent />
    </VentasProvider>
  )
} 