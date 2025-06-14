import { useHasPermission } from '@/hooks/use-has-permission'
import { PedidosTable } from './components/pedidos-table'
import { PedidosProvider, usePedidos } from './context/pedidos-context'
import { useGetPedidos } from '@/services/api/hooks/usePedidos'
import { Button } from '@/components/ui/button'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { FormularioPedido } from './formulario-pedido'
import PedidoDetalle from './components/pedido-detalle'
import { ModulesLayout } from '@/components/layout/layout'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { columns } from './components/pedidos-columns'

function PedidosContent() {
  const hasWritePermission = useHasPermission('comercial:write')
  const { data, isLoading, error, refetch } = useGetPedidos()
  const { open, setOpen, currentRow, setCurrentRow } = usePedidos()

  const handleCancelarForm = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  const handleSuccess = () => {
    setOpen(null)
    setCurrentRow(null)
    refetch()
  }

  return (
    <ModulesLayout
      title="Pedidos"
      subtitle="Gestión de pedidos de clientes"
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
          {hasWritePermission && (
            <Button
              onClick={() => {
                setCurrentRow(null)
                setOpen('add')
              }}
              disabled={isLoading}
              variant="default"
              size="sm"
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <IconPlus className="h-4 w-4 mr-2" />
              Nuevo
            </Button>
          )}
        </div>
      }
    >
      {error ? (
        <div className="py-10 text-center">
          <p className="text-destructive mb-4">Error al cargar los pedidos</p>
          <Button onClick={() => refetch()} variant="outline">
            Reintentar
          </Button>
        </div>
      ) : (
        <PedidosTable
          columns={columns}
          data={data || []}
        />
      )}

      {/* Modal Crear/Editar Pedido */}
      <Dialog
        open={open === 'add' || open === 'edit'}
        onOpenChange={(open) => {
          if (!open) handleCancelarForm()
        }}
      >
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {open === 'edit' ? 'Editar Pedido' : 'Nuevo Pedido'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <FormularioPedido
              onCancel={handleCancelarForm}
              onSuccess={handleSuccess}
              pedido={open === 'edit' ? currentRow || undefined : undefined}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Detalle Pedido */}
      <Dialog
        open={open === 'view'}
        onOpenChange={(open) => {
          if (!open) handleCancelarForm()
        }}
      >
        <DialogContent className="max-w-3xl min-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Detalle de Pedido</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Cargando detalle...</div>
          ) : currentRow ? (
            <PedidoDetalle pedido={currentRow} />
          ) : (
            <div className="py-10 text-center text-destructive">
              No se pudo cargar el detalle del pedido
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ModulesLayout>
  )
}

export default function Pedidos() {
  return (
    <PedidosProvider>
      <PedidosContent />
    </PedidosProvider>
  )
} 