import { columns } from './components/lotes-fabricacion-columns'
import { LotesFabricacionTable } from './components/lotes-fabricacion-table'
import LotesFabricacionProvider from './context/lotes-fabricacion-context'
import { useLotesFabricacion } from './context/lotes-fabricacion-context'
import { ModulesLayout } from '@/components/layout/layout'
import { useLotesFabricacion as useGetLotesFabricacion } from '@/services/api/hooks/useLotesFabricacion'
import { Button } from '@/components/ui/button'
import { IconRefresh } from '@tabler/icons-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RegistroResultadosModal } from './registro-resultados-modal'
import { format } from 'date-fns'

function LotesFabricacionContent() {
  const { data: lotes, isLoading, refetch } = useGetLotesFabricacion()
  const { setOpen, open, currentRow, setCurrentRow } = useLotesFabricacion()

  const handleCancelarForm = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <ModulesLayout
      title="Lotes de Fabricación"
      subtitle="Gestione los lotes de fabricación del sistema"
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
      <LotesFabricacionTable data={lotes || []} columns={columns} />

      <Dialog 
        open={open === 'edit'} 
        onOpenChange={(open) => { 
          if (!open) {
            handleCancelarForm();
            setCurrentRow(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar</DialogTitle>
          </DialogHeader>
          <RegistroResultadosModal
            lote={currentRow}
            isOpen={open === 'edit'}
            onClose={handleCancelarForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={open === 'view'} 
        onOpenChange={(open) => { 
          if (!open) {
            handleCancelarForm();
            setCurrentRow(null);
          }
        }}
      >
        <DialogContent className="max-w-5xl min-w-[900px]">
          <DialogHeader>
            <DialogTitle>Detalle de Lote</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Cargando detalle...</div>
          ) : currentRow && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg mb-2">Información General</h3>
                  <p><b>Código Lote:</b> {currentRow.codigoLote || '-'}</p>
                  <p><b>Estado:</b> {currentRow.estado || '-'}</p>
                  <p><b>Volumen Obtenido:</b> {currentRow.volumenObtenido || '-'}</p>
                  <p><b>Rendimiento Real:</b> {currentRow.rendimientoReal ? `${currentRow.rendimientoReal}%` : '-'}</p>
                  <p><b>Fecha Inicio:</b> {currentRow.fechaInicio || '-'}</p>
                  <p><b>Fecha Finalización:</b> {currentRow.fechaFinalizacion || '-'}</p>
                  <p><b>Fecha Óptima de Consumo:</b> {currentRow.fechaOptimoConsumo ? format(new Date(currentRow.fechaOptimoConsumo), 'dd/MM/yyyy') : '-'}</p>
                  <p><b>Fecha de Caducidad:</b> {currentRow.fechaCaducidad ? format(new Date(currentRow.fechaCaducidad), 'dd/MM/yyyy') : '-'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg mb-2">Detalles Adicionales</h3>
                  <p><b>Notas:</b> {currentRow.notas || '-'}</p>
                  <p><b>Observaciones:</b> {currentRow.observaciones || '-'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ModulesLayout>
  )
}

export function LotesFabricacion() {
  return (
    <LotesFabricacionProvider>
      <LotesFabricacionContent />
    </LotesFabricacionProvider>
  )
} 