import { useHasPermission } from '@/hooks/use-has-permission'
import { columns } from './components/lotes-materia-prima-columns'
import { DataTable } from './components/lotes-materia-prima-data-table'
import LotesMateriaPrimaProvider from './context/lotes-materia-prima-context'
import { loteMateriaPrimaListSchema } from './data/schema'
import { useLotesMateriaPrima } from './context/lotes-materia-prima-context'
import { ModulesLayout } from '@/components/layout/layout'
import { useGetLotesMateriaPrima } from '@/services/api/hooks/useLotesMateriaPrima'
import { Button } from '@/components/ui/button'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LotesMateriaPrimaForm } from './components/lotes-materia-prima-form'
import { useCrearLoteMateriaPrima, useActualizarLoteMateriaPrima } from '@/services/api/hooks/useLotesMateriaPrima'
import { toast } from 'sonner'
import { LoteMateriaPrima } from './data/schema'

function LotesMateriaPrimaContent() {
  const { data: lotesData, isLoading, refetch } = useGetLotesMateriaPrima({})
  const lotesList = loteMateriaPrimaListSchema.safeParse(lotesData)
  const { setOpen, open, setCurrentRow, currentRow } = useLotesMateriaPrima()
  const canWrite = useHasPermission('inventario:write')
  const { mutateAsync: crearLote } = useCrearLoteMateriaPrima()
  const { mutateAsync: actualizarLote } = useActualizarLoteMateriaPrima()

  const handleSubmit = async (data: Partial<LoteMateriaPrima>) => {
    try {
    
      if (currentRow?.id) {
        await actualizarLote({ id: currentRow.id, lote: data })
        toast.success('Lote actualizado correctamente')
      } else {
        await crearLote(data as Omit<LoteMateriaPrima, 'id'>)
        toast.success('Lote creado correctamente')
      }
      setOpen(null)
      refetch()
    } catch (error) {
      console.error('Error al guardar lote:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el lote'
      toast.error(errorMessage)
    }
  }

  const handleCancelarForm = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <ModulesLayout
      title="Lotes de Materia Prima"
      subtitle="Gestione los lotes de materia prima del inventario"
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
          <Button
            onClick={() => setOpen('add')}
            disabled={isLoading || !canWrite}
            variant="default"
            size="sm"
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Nuevo
          </Button>
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={lotesList.success ? lotesList.data : []}
      />

      <Dialog open={open === 'add' || open === 'edit'} onOpenChange={open => { if (!open) handleCancelarForm() }}>
        <DialogContent className="p-6 overflow-y-auto flex flex-col max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>
              {open === 'add' ? 'Nuevo Lote de Materia Prima' : 'Editar Lote de Materia Prima'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1">
            <LotesMateriaPrimaForm
              onSubmit={handleSubmit}
            />
          </div>
        </DialogContent>
      </Dialog>
    </ModulesLayout>
  )
}

export function LotesMateriaPrima() {
  return (
    <LotesMateriaPrimaProvider>
      <LotesMateriaPrimaContent />
    </LotesMateriaPrimaProvider>
  )
}
