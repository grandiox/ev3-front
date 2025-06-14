import { CalendarioProduccion } from './components/CalendarioProduccion'
import { PanelEstados } from './components/PanelEstados'
import { ModulesLayout } from '@/components/layout/layout'
import { useOrdenesProduccion } from '@/services/api/hooks/useOrdenesProduccion'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePlanificarOrden, useVerificarInventario } from '@/services/api/hooks/usePlanificacion'
import { toast } from 'sonner'
import { CrearOrdenProduccion } from './types'
import { FormularioPlanificarOrden } from './components/FormularioPlanificarOrden'
import { FormularioVerificarInventario, FormularioVerificarInventarioValues } from './components/FormularioVerificarInventario'
import { IconRefresh } from '@tabler/icons-react'

interface MateriaInsuficiente {
  materiaPrimaId: number
  codigo: string
  nombre: string
  cantidadRequerida: string
  cantidadDisponible: string
  deficit: string
  unidadMedida: string
  etapaProduccion: string
}

interface ResumenInventario {
  totalMateriales: number
  materialesDisponibles: number
  materialesInsuficientes: number
  porcentajeDisponibilidad: number
}

interface VerificarInventarioResult {
  esValida: boolean
  materiasInsuficientes: MateriaInsuficiente[]
  resumen: ResumenInventario
}

interface MaterialRequerido {
  materiaPrimaId: number
  codigo: string
  nombre: string
  cantidadRequerida: string
  unidadMedida: string
  etapaProduccion: string
  orden: number
  tiempoAdicion: number | null
  unidadTiempo: string | null
  stockActual: string
  disponible: boolean
}

interface EstimacionTiempo {
  tiempoPreparacion: number
  tiempoProceso: number
  tiempoTotal: number
  fechaInicioEstimada: string
  fechaFinEstimada: string
}

interface PlanificarOrdenResult {
  ordenId: number
  recetaId: number
  volumenProgramado: string
  materialesRequeridos: MaterialRequerido[]
  estimacionTiempo: EstimacionTiempo
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message: string }).message
  }
  return fallback
}

export default function Planificacion() {
  const { data: ordenes, isLoading, refetch } = useOrdenesProduccion()
  const [openPlanificar, setOpenPlanificar] = useState(false)
  const [openVerificar, setOpenVerificar] = useState(false)
  const [verificacionResult, setVerificacionResult] = useState<VerificarInventarioResult | null>(null)
  const [planificacionResult, setPlanificacionResult] = useState<PlanificarOrdenResult | null>(null)
  const planificarOrden = usePlanificarOrden()
  const verificarInventario = useVerificarInventario()

  const resumen = {
    Programada: 0,
    'En Preparacion': 0,
    'En Proceso': 0,
    Pausada: 0,
    Finalizada: 0,
    Cancelada: 0
  }
  if (ordenes) {
    for (const estado in resumen) {
      resumen[estado as keyof typeof resumen] = ordenes.filter((o: any) => o.estado === estado).length
    }
  }

  const handlePlanificar = async (data: CrearOrdenProduccion) => {
    try {
      const result = await planificarOrden.mutateAsync(data)
      if (result.data) {
        setPlanificacionResult(result.data)
      } else {
        setPlanificacionResult(null)
        toast.error('Respuesta inesperada del servidor')
      }
    } catch (error) {
      setPlanificacionResult(null)
      toast.error(getErrorMessage(error, 'Error al planificar la orden'))
    }
  }

  const handleVerificar = async (data: FormularioVerificarInventarioValues) => {
    try {
      const result = await verificarInventario.mutateAsync(data)
      if (result.data) {
        setVerificacionResult(result.data)
      } else {
        setVerificacionResult(null)
        toast.error('Respuesta inesperada del servidor')
      }
    } catch (error) {
      setVerificacionResult(null)
      toast.error(getErrorMessage(error, 'Error al verificar inventario'))
    }
  }

  const handleCloseVerificar = () => {
    setOpenVerificar(false)
    setVerificacionResult(null)
  }

  const handleClosePlanificar = () => {
    setOpenPlanificar(false)
    setPlanificacionResult(null)
  }

  return (
    <ModulesLayout
      title="Planificación de Producción"
      subtitle="Gestione la planificación de producción"
      actions={
        <div className="flex gap-2">

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <IconRefresh className="h-4 w-4" />
          </Button>
          <Button onClick={() => setOpenPlanificar(true)} variant="default" size="sm"
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50">
            Planificar Orden
          </Button>
          <Button onClick={() => setOpenVerificar(true)} variant="outline" size="sm"
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50">
            Verificar Inventario
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <PanelEstados resumen={resumen} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-full">
            <CalendarioProduccion />
          </div>
        </div>
      </div>
      {/* Dialogo para planificar */}
      <Dialog open={openPlanificar} onOpenChange={handleClosePlanificar}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Planificar Orden</DialogTitle>
          </DialogHeader>
          <FormularioPlanificarOrden
            onSubmit={handlePlanificar}
            onCancel={handleClosePlanificar}
          />
          {planificacionResult && (
            <div className="mt-6">
              <h4 className="font-semibold text-lg mb-2">
                Planificación completada
              </h4>
              <div className="mb-2">
                <b>Estimación de tiempos:</b>
                <ul className="ml-4 list-disc">
                  <li>Preparación: {planificacionResult.estimacionTiempo.tiempoPreparacion} min</li>
                  <li>Proceso: {planificacionResult.estimacionTiempo.tiempoProceso} min</li>
                  <li>Total: {planificacionResult.estimacionTiempo.tiempoTotal} min</li>
                  <li>Inicio estimado: {new Date(planificacionResult.estimacionTiempo.fechaInicioEstimada).toLocaleString()}</li>
                  <li>Fin estimado: {new Date(planificacionResult.estimacionTiempo.fechaFinEstimada).toLocaleString()}</li>
                </ul>
              </div>
              <div>
                <b>Materiales requeridos:</b>
                <table className="min-w-full text-sm border mt-2">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-2 py-1 text-left">Código</th>
                      <th className="px-2 py-1 text-left">Nombre</th>
                      <th className="px-2 py-1 text-center">Etapa</th>
                      <th className="px-2 py-1 text-center">Requerido</th>
                      <th className="px-2 py-1 text-center">Stock Actual</th>
                      <th className="px-2 py-1 text-center">Unidad</th>
                      <th className="px-2 py-1 text-center">Disponible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planificacionResult.materialesRequeridos.map((mat) => (
                      <tr key={mat.materiaPrimaId}>
                        <td className="px-2 py-1">{mat.codigo}</td>
                        <td className="px-2 py-1">{mat.nombre}</td>
                        <td className="px-2 py-1 text-center">{mat.etapaProduccion}</td>
                        <td className="px-2 py-1 text-center">{mat.cantidadRequerida}</td>
                        <td className="px-2 py-1 text-center">{mat.stockActual}</td>
                        <td className="px-2 py-1 text-center">{mat.unidadMedida}</td>
                        <td className="px-2 py-1 text-center">
                          {mat.disponible ? (
                            <span className="text-green-600 font-semibold">Sí</span>
                          ) : (
                            <span className="text-red-600 font-semibold">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Dialogo para verificar inventario */}
      <Dialog open={openVerificar} onOpenChange={handleCloseVerificar}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Verificar Inventario</DialogTitle>
          </DialogHeader>
          <FormularioVerificarInventario
            onSubmit={handleVerificar}
            onCancel={handleCloseVerificar}
          />
          {verificacionResult && (
            <div className="mt-6">
              <h4 className="font-semibold text-lg mb-2">
                {verificacionResult.esValida
                  ? 'Inventario suficiente para la orden'
                  : 'Faltan insumos para la orden'}
              </h4>
              <div className="mb-2">
                <b>Resumen:</b>
                <ul className="ml-4 list-disc">
                  <li>Total materiales: {verificacionResult.resumen.totalMateriales}</li>
                  <li>Materiales disponibles: {verificacionResult.resumen.materialesDisponibles}</li>
                  <li>Materiales insuficientes: {verificacionResult.resumen.materialesInsuficientes}</li>
                  <li>Porcentaje disponibilidad: {verificacionResult.resumen.porcentajeDisponibilidad}%</li>
                </ul>
              </div>
              {!verificacionResult.esValida && verificacionResult.materiasInsuficientes.length > 0 && (
                <div>
                  <b>Insumos insuficientes:</b>
                  <table className="min-w-full text-sm border mt-2">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-2 py-1 text-left">Código</th>
                        <th className="px-2 py-1 text-left">Nombre</th>
                        <th className="px-2 py-1 text-center">Etapa</th>
                        <th className="px-2 py-1 text-center">Requerido</th>
                        <th className="px-2 py-1 text-center">Disponible</th>
                        <th className="px-2 py-1 text-center">Déficit</th>
                        <th className="px-2 py-1 text-center">Unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verificacionResult.materiasInsuficientes.map((mat) => (
                        <tr key={mat.materiaPrimaId}>
                          <td className="px-2 py-1">{mat.codigo}</td>
                          <td className="px-2 py-1">{mat.nombre}</td>
                          <td className="px-2 py-1 text-center">{mat.etapaProduccion}</td>
                          <td className="px-2 py-1 text-center">{mat.cantidadRequerida}</td>
                          <td className="px-2 py-1 text-center">{mat.cantidadDisponible}</td>
                          <td className="px-2 py-1 text-center">{mat.deficit}</td>
                          <td className="px-2 py-1 text-center">{mat.unidadMedida}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ModulesLayout>
  )
} 