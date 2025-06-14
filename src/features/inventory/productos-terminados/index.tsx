import { useHasPermission } from '@/hooks/use-has-permission'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ProductosTerminadosProvider, useProductosTerminados } from './context/productos-terminados-context'
import { columns } from './components/productos-terminados-columns'
import { ProductosTerminadosTable } from '@/features/inventory/productos-terminados/components/productos-terminados-table'
import { useCrearProductoTerminado, useActualizarProductoTerminado } from '@/services/api/hooks/useProductosTerminados'
import { productoTerminadoListSchema } from './data/schema'
import { ModulesLayout } from '@/components/layout/layout'
import { useGetElementosInventario } from '@/services/api/hooks/useInventario'
import { Button } from '@/components/ui/button'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { FormularioProductoTerminado } from './formulario-producto-terminado'
import { toast } from 'sonner'
import { ProductoTerminado } from './data/schema'

function ProductosTerminadosContent() {
  const { data: productosTerminados, isLoading, refetch } = useGetElementosInventario('ProductoTerminado')
  const productosTerminadosList = productoTerminadoListSchema.safeParse(productosTerminados)
  const { setOpen, open, setCurrentRow, currentRow } = useProductosTerminados()
  const canWrite = useHasPermission('inventario:write')
  const { mutateAsync: crearProductoTerminado } = useCrearProductoTerminado()
  const { mutateAsync: actualizarProductoTerminado } = useActualizarProductoTerminado()

  const handleSubmit = async (data: Partial<ProductoTerminado>) => {
    try {
      if (currentRow?.id) {
        await actualizarProductoTerminado({ id: currentRow.id, productoTerminado: data })
        toast.success('Producto terminado actualizado correctamente')
      } else {
        await crearProductoTerminado(data as Omit<ProductoTerminado, 'id'>)
        toast.success('Producto terminado creado correctamente')
      }
      setOpen(null)
      refetch()
    } catch (error) {
      console.error('Error al guardar producto terminado:', error)
      toast.error('Error al guardar el producto terminado')
    }
  }

  const handleCancelarForm = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <ModulesLayout
      title="Productos Terminados"
      subtitle="Gestione los productos terminados del inventario"
      actions={
        <div className='flex gap-2'>  <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <IconRefresh className="h-4 w-4" />
        </Button><Button
          onClick={() => setOpen('add')}
          disabled={isLoading || !canWrite}
          variant="default"
          size="sm"
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
            <IconPlus className="h-4 w-4 mr-2" />
            Nuevo
          </Button></div>
      }
    >
      <ProductosTerminadosTable data={productosTerminadosList.data || []} columns={columns} />

      <Dialog open={open === 'add' || open === 'edit'} onOpenChange={open => { if (!open) handleCancelarForm() }}>
        <DialogContent className="p-6 overflow-y-auto flex flex-col max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>
              {open === 'edit' ? 'Editar Producto Terminado' : 'Crear Producto Terminado'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1">
            <FormularioProductoTerminado
              onCancel={handleCancelarForm}
              onSubmit={handleSubmit}
              productoExistente={currentRow}
            />
          </div>
        </DialogContent>
      </Dialog>
    </ModulesLayout>
  )
}

export function ProductosTerminados() {
  return (
    <ProductosTerminadosProvider>
      <ProductosTerminadosContent />
    </ProductosTerminadosProvider>
  )
}