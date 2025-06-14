import { useHasPermission } from '@/hooks/use-has-permission'
import { columns } from './components/recetas-columns'
import { RecetasTable } from './components/recetas-table'
import RecetasProvider from './context/recetas-context'
import { useRecetas } from './context/recetas-context'
import { ModulesLayout } from '@/components/layout/layout'
import { useRecetas as useGetRecetas } from '@/services/api/hooks/useRecetas'
import { Button } from '@/components/ui/button'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormularioReceta } from './formulario-receta'

function RecetasContent() {
  const { data: recetas, isLoading, refetch } = useGetRecetas()
  const { setOpen, open, currentRow, setCurrentRow } = useRecetas()
  const canWrite = useHasPermission('produccion:write')

  const handleCancelarForm = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  const handleSuccess = () => {
    setOpen(null)
    refetch()
  }

  return (
    <ModulesLayout
      title="Recetas"
      subtitle="Gestione las recetas de producción"
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
      <RecetasTable data={recetas || []} columns={columns} />

      <Dialog 
        open={open === 'add' || open === 'edit'} 
        onOpenChange={(open) => { 
          if (!open) {
            handleCancelarForm();
            setCurrentRow(null);
          }
        }}
      >
        <DialogContent className="p-6 overflow-y-auto flex flex-col max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>
              {open === 'edit' ? 'Editar Receta' : 'Crear Receta'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1">
            <FormularioReceta
              onCancel={handleCancelarForm}
              onSuccess={handleSuccess}
              receta={currentRow || undefined}
            />
          </div>
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
        <DialogContent className="max-w-3xl min-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detalle de Receta</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Cargando detalle...</div>
          ) : currentRow && (
            <div className="space-y-8">
              {/* Datos principales */}
              <div className="grid grid-cols-2 gap-6 bg-muted/40 rounded-lg p-4">
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Código</div>
                  <div className="text-lg font-bold">{currentRow.codigo || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Nombre</div>
                  <div className="text-lg font-bold">{currentRow.nombre || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Estilo</div>
                  <div className="text-base">{currentRow.estilo || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Versión</div>
                  <div className="text-base">{currentRow.version || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Volumen Final</div>
                  <div className="text-base">{currentRow.volumenFinal ? Number(currentRow.volumenFinal).toLocaleString() + ' ' + currentRow.unidadVolumen : '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Rendimiento Esperado</div>
                  <div className="text-base">{currentRow.rendimientoEsperado != null ? `${currentRow.rendimientoEsperado}%` : '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Estado</div>
                  <div className="text-base">{currentRow.estado || '-'}</div>
                </div>
                {currentRow.productoTerminado && (
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold">Producto Terminado</div>
                    <div className="text-base">{currentRow.productoTerminado.nombre} ({currentRow.productoTerminado.estilo})</div>
                  </div>
                )}
              </div>
              {/* Notas y descripciones */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-2 bg-muted/30 rounded-md p-3">
                  <span className="text-muted-foreground">
                    <svg width="20" height="20" fill="none"><path d="M4 17.333V4.667A2.667 2.667 0 0 1 6.667 2h6.666A2.667 2.667 0 0 1 16 4.667v10.666A2.667 2.667 0 0 1 13.333 18H6.667A2.667 2.667 0 0 1 4 17.333Z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7.5h6M7 10h6M7 12.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </span>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold">Notas</div>
                    <div className="text-sm">{currentRow.notas || <span className="italic text-muted-foreground">Sin notas</span>}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-muted/30 rounded-md p-3">
                  <span className="text-muted-foreground">
                    <svg width="20" height="20" fill="none"><path d="M4 17.333V4.667A2.667 2.667 0 0 1 6.667 2h6.666A2.667 2.667 0 0 1 16 4.667v10.666A2.667 2.667 0 0 1 13.333 18H6.667A2.667 2.667 0 0 1 4 17.333Z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7.5h6M7 10h6M7 12.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </span>
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold">Descripción</div>
                    <div className="text-sm">{currentRow.descripcion || <span className="italic text-muted-foreground">Sin descripción</span>}</div>
                  </div>
                </div>
              </div>
              {/* Instrucciones y parámetros teóricos */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-muted/20 rounded-md p-3">
                  <div className="text-xs text-muted-foreground font-semibold mb-1">Instrucciones</div>
                  <div className="text-sm whitespace-pre-line">{currentRow.instrucciones || <span className="italic text-muted-foreground">Sin instrucciones</span>}</div>
                </div>
                {currentRow.parametrosTeoricos && (
                  <div className="bg-muted/20 rounded-md p-3">
                    <div className="text-xs text-muted-foreground font-semibold mb-1">Parámetros Teóricos</div>
                    <div className="text-sm">
                      <b>ABV:</b> {currentRow.parametrosTeoricos.ABV?.valor != null ? `${currentRow.parametrosTeoricos.ABV.valor} ${currentRow.parametrosTeoricos.ABV.unidad}` : '-'}<br />
                      <b>IBU:</b> {currentRow.parametrosTeoricos.IBU?.valor != null ? `${currentRow.parametrosTeoricos.IBU.valor} ${currentRow.parametrosTeoricos.IBU.unidad}` : '-'}
                    </div>
                  </div>
                )}
              </div>
              {/* Ingredientes / Detalles de la Receta */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Ingredientes / Detalles de la Receta</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-2 py-1 text-left">Materia Prima</th>
                        <th className="px-2 py-1 text-left">Etapa</th>
                        <th className="px-2 py-1 text-center">Cantidad</th>
                        <th className="px-2 py-1 text-center">Unidad</th>
                        <th className="px-2 py-1 text-center">Tiempo</th>
                        <th className="px-2 py-1 text-center">Unidad Tiempo</th>
                        <th className="px-2 py-1 text-center">Orden</th>
                        <th className="px-2 py-1 text-left">Notas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRow.detalles && currentRow.detalles.length > 0 ? (
                        currentRow.detalles.map((detalle, idx) => (
                          <tr key={detalle.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-2 py-1">{detalle.materiaPrima?.nombre || '-'}</td>
                            <td className="px-2 py-1">{detalle.etapaProduccion || '-'}</td>
                            <td className="px-2 py-1 text-center">{detalle.cantidad || '-'}</td>
                            <td className="px-2 py-1 text-center">{detalle.unidadMedida || '-'}</td>
                            <td className="px-2 py-1 text-center">{detalle.tiempoAdicion != null ? detalle.tiempoAdicion : '-'}</td>
                            <td className="px-2 py-1 text-center">{detalle.unidadTiempo || '-'}</td>
                            <td className="px-2 py-1 text-center">{detalle.orden != null ? detalle.orden : '-'}</td>
                            <td className="px-2 py-1 max-w-[200px] truncate">{detalle.notas || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center text-muted-foreground">No hay detalles registrados.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ModulesLayout>
  )
}

export default function Recetas() {
  return (
    <RecetasProvider>
      <RecetasContent />
    </RecetasProvider>
  )
} 