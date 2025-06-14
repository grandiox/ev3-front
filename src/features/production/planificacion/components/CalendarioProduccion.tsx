import { useState } from 'react'
import { DialogoNuevaOrden } from './DialogoNuevaOrden'
import type { CrearOrdenProduccion, EstadoOrden } from '../types'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarEvent,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
} from '@/components/ui/full-calendar';
import { ChevronRight, Plus, Play, Pause, CheckCircle, XCircle, Settings } from 'lucide-react'
import { ChevronLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { COLORES_ESTADO } from '../constants'
import { format } from 'date-fns-tz'
import { useOrdenesProduccion, useCrearOrdenProduccion, useCambiarEstadoOrdenProduccion } from '@/services/api/hooks/useOrdenesProduccion'
import { FormularioParametrosProceso } from './FormularioParametrosProceso'
import { useParametrosProceso } from '@/services/api/hooks/useParametrosProceso'
import { ListaParametrosProceso } from './ListaParametrosProceso'
import type { ParametroProceso, CrearParametroProceso } from '@/services/api/parametrosProceso'

interface ValidationResult {
  error?: string;
  data?: {
    parametrosValidados: number;
    parametrosEnRango: number;
    parametrosFueraRango: number;
    alertas: Array<{
      parametro: string;
      mensaje: string;
    }>;
    detalles: Array<{
      parametro: string;
      enRango: boolean;
      mensaje?: string;
    }>;
  };
}

// Definimos los estados permitidos para cada estado actual
const ESTADOS_PERMITIDOS = {
  Programada: ['En Preparacion', 'Cancelada'],
  'En Preparacion': ['En Proceso', 'Pausada', 'Cancelada'],
  'En Proceso': ['Pausada', 'Finalizada', 'Cancelada'],
  Pausada: ['En Proceso', 'Cancelada'],
  Finalizada: [],
  Cancelada: []
} as const

// Definimos los íconos para cada estado
const ICONOS_ESTADO = {
  'En Preparacion': <Settings className="w-4 h-4" />,
  'En Proceso': <Play className="w-4 h-4" />,
  Pausada: <Pause className="w-4 h-4" />,
  Finalizada: <CheckCircle className="w-4 h-4" />,
  Cancelada: <XCircle className="w-4 h-4" />
} as const

// Agregar esta función de utilidad al inicio del componente
const normalizarFecha = (fecha: string | Date) => {
  // Si la fecha viene como string UTC (ej: 2025-06-03T15:00:00.000Z)
  // El constructor de Date lo interpreta como UTC y lo muestra en local automáticamente
  return new Date(fecha)
}

export function CalendarioProduccion() {
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState<CalendarEvent | null>(null)
  const [fechaPreseleccionada, setFechaPreseleccionada] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [estadoAConfirmar, setEstadoAConfirmar] = useState<EstadoOrden | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showParametrosDialog, setShowParametrosDialog] = useState(false)
  const [showListaParametrosDialog, setShowListaParametrosDialog] = useState(false)
  const [validando, setValidando] = useState(false)
  const [showValidacion, setShowValidacion] = useState(false)
  const [resultadoValidacion, setResultadoValidacion] = useState<ValidationResult | null>(null)

  const { data: ordenes } = useOrdenesProduccion()
  const crearOrdenMutation = useCrearOrdenProduccion()
  const cambiarEstadoMutation = useCambiarEstadoOrdenProduccion()
  const { parametros, isLoading, crearParametro } = useParametrosProceso(
    eventoSeleccionado?.extendedProps?.loteFabricacionId || 0,
    eventoSeleccionado?.extendedProps?.ordenId || 0
  )
  const usuarioId = parametros[0]?.usuarioId || 1

  // Mapear órdenes a eventos del calendario
  const eventos: CalendarEvent[] = (ordenes || []).map((orden) => {
    const recetaNombre = orden.receta?.nombre || `Receta #${orden.recetaId}`
    const recetaDescripcion = orden.receta?.descripcion || ''
    const estadoColor = COLORES_ESTADO[orden.estado as keyof typeof COLORES_ESTADO] || 'blue'
    const startDate = normalizarFecha(orden.fechaProgramada)
    let endDate = normalizarFecha(orden.fechaFinalizacion || orden.fechaProgramada)
    if (endDate.getTime() === startDate.getTime()) {
      endDate = new Date(endDate.getTime() + 60 * 60 * 1000)
    }
    return {
      id: orden.id.toString(),
      title: recetaNombre,
      start: startDate,
      end: endDate,
      color: estadoColor,
      extendedProps: {
        ordenId: orden.id,
        estado: orden.estado,
        descripcion: recetaDescripcion,
        recetaId: orden.recetaId,
        volumenProgramado: orden.volumenProgramado,
        prioridad: 'Media' as const,
        fechaProgramada: orden.fechaProgramada,
        fechaInicio: orden.fechaInicio,
        fechaFinalizacion: orden.fechaFinalizacion,
        usuarioResponsableId: orden.usuarioResponsableId,
        responsable: orden.usuarioResponsable?.nombre || '',
        loteFabricacionId: orden.lotesFabricacion?.[0]?.id || 0,
      }
    }
  })

  const handleCrearOrden = async (data: CrearOrdenProduccion) => {
    try {
      await crearOrdenMutation.mutateAsync(data)
      toast.success('Orden creada correctamente')
    } catch (error) {
      toast.error('Error inesperado al crear la orden. Revisa la consola para más detalles.')
      console.error(error)
    }
  }

  const handleNuevaOrden = (data: CrearOrdenProduccion) => {
    const fechaLocal = fechaPreseleccionada || data.fechaProgramada;
    const fechaUTC = new Date(fechaLocal).toISOString();
    const datosConFecha = {
      ...data,
      fechaProgramada: fechaUTC
    };
    handleCrearOrden(datosConFecha)
    setFechaPreseleccionada(null)
  }

  const handleCambiarEstado = async (nuevoEstado: string) => {
    if (!eventoSeleccionado) return
    setIsUpdating(true)
    try {
      const ordenId = eventoSeleccionado.extendedProps.ordenId
      await cambiarEstadoMutation.mutateAsync({ 
        id: ordenId, 
        data: {
          nuevoEstado,
          fechaInicio: nuevoEstado === 'En Proceso' ? new Date().toISOString() : undefined,
          fechaFinalizacion: nuevoEstado === 'Finalizada' ? new Date().toISOString() : undefined,
        }
      })
      toast.success('Estado actualizado correctamente')
    } catch (error) {
      toast.error('No se pudo actualizar el estado de la orden')
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCrearParametro = async (data: ParametroProceso) => {
    try {
      const parametroData: CrearParametroProceso = {
        loteFabricacionId: data.loteFabricacionId,
        etapaProduccion: data.etapaProduccion,
        parametro: data.parametro,
        valor: Number(data.valor),
        unidadMedida: data.unidadMedida,
        notas: data.notas
      }
      await crearParametro(parametroData)
      setShowParametrosDialog(false)
    } catch (error) {
      console.error(error)
    }
  }

  // Handler para validar lote desde el pop-up principal
  const handleValidarLote = async () => {
    if (!parametros || parametros.length === 0) return
    setValidando(true)
    setResultadoValidacion(null)
    try {
      const params = parametros.map(p => ({
        etapaProduccion: p.etapaProduccion,
        parametro: p.parametro,
        valor: Number(p.valor),
        unidadMedida: p.unidadMedida,
        fechaMedicion: p.fechaMedicion,
        notas: p.notas || ''
      }))
      const res = await import('@/services/api/parametrosProceso').then(m => m.parametrosProcesoApi.validarLote(
        parametros[0]?.loteFabricacionId || 0,
        params,
        usuarioId
      ))
      setResultadoValidacion(res)
      setShowValidacion(true)
    } catch (e) {
      console.error('Error en validación de lote:', e)
      setResultadoValidacion({ error: 'Error al validar el lote.' })
      setShowValidacion(true)
    } finally {
      setValidando(false)
    }
  }

  return (
    <Card className="p-4">
      <Calendar
        view="month"
        events={eventos}
        onEventClick={(event) => {
          setEventoSeleccionado(event)
        }}
        defaultDate={new Date()}
        locale={es}
      >
        <div className="h-dvh flex flex-col">
          <div className="flex px-6 items-center gap-2 mb-6">          
            <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="day">
              Día
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="week"
              className="aria-[current=true]:bg-accent"
            >
              Semana
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="month"
              className="aria-[current=true]:bg-accent"
            >
              Mes
            </CalendarViewTrigger>          

            <span className="flex-1" />

            <CalendarCurrentDate />

            <CalendarPrevTrigger>
              <ChevronLeft size={20} />
              <span className="sr-only">Anterior</span>
            </CalendarPrevTrigger>

            <CalendarTodayTrigger>Hoy</CalendarTodayTrigger>

            <CalendarNextTrigger>
              <ChevronRight size={20} />
              <span className="sr-only">Siguiente</span>
            </CalendarNextTrigger>
             <Button color="primary" size="icon" onClick={() => setDialogoAbierto(true)}>
              <Plus size={20} />
              <span className="sr-only">Agregar Orden</span>
            </Button>
          </div>

          <div className="flex-1 px-6 overflow-hidden">
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />          
          </div>
        </div>
      </Calendar>
      <Dialog 
        open={!!eventoSeleccionado} 
        onOpenChange={(open) => {
          if (!open) setEventoSeleccionado(null)
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de Orden de Producción</DialogTitle>
          </DialogHeader>
          {eventoSeleccionado && (
            <div className="space-y-6">
              {/* Datos principales */}
              <div className="grid grid-cols-2 gap-6 bg-muted/40 rounded-lg p-4">
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Receta</div>
                  <div className="text-lg font-bold">{eventoSeleccionado.title}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Estado</div>
                  <div className="text-lg font-bold">{eventoSeleccionado.extendedProps?.estado}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Volumen Programado</div>
                  <div className="text-base">{eventoSeleccionado.extendedProps?.volumenProgramado}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Responsable</div>
                  <div className="text-base">{eventoSeleccionado.extendedProps?.responsable || 'N/A'}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground font-semibold">Fecha Programada</div>
                  <div className="text-base">{format(new Date(eventoSeleccionado.start), 'dd/MM/yyyy HH:mm')}</div>
                </div>
              </div>
              {/* Notas */}
              <div className="flex items-start gap-2 bg-muted/30 rounded-md p-3">
                <span className="text-muted-foreground">
                  <svg width="20" height="20" fill="none"><path d="M4 17.333V4.667A2.667 2.667 0 0 1 6.667 2h6.666A2.667 2.667 0 0 1 16 4.667v10.666A2.667 2.667 0 0 1 13.333 18H6.667A2.667 2.667 0 0 1 4 17.333Z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7.5h6M7 10h6M7 12.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </span>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Notas</div>
                  <div className="text-sm">{eventoSeleccionado.extendedProps?.descripcion || <span className="italic text-muted-foreground">Sin notas</span>}</div>
                </div>
              </div>
              {/* Acciones de parámetros */}
              <div className="flex flex-wrap gap-3 justify-between items-center">
                <div className="flex gap-2">
                  {parametros && parametros.length > 0 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowListaParametrosDialog(true)}
                        className="rounded-full"
                      >
                        Ver Parámetros
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleValidarLote}
                        disabled={validando}
                        className="rounded-full"
                      >
                        {validando ? 'Validando...' : 'Validar lote'}
                      </Button>
                    </>
                  )}
                </div>
                {eventoSeleccionado?.extendedProps?.loteFabricacionId > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowParametrosDialog(true)}
                  className="rounded-full"
                  disabled={['Programada', 'En Preparacion'].includes(eventoSeleccionado.extendedProps?.estado)}
                  >
                    Añadir Parámetros
                  </Button>
                )}
              </div>
              {/* Acciones de estado */}
              {(() => {
                const estadosPermitidos = ESTADOS_PERMITIDOS[eventoSeleccionado.extendedProps?.estado as keyof typeof ESTADOS_PERMITIDOS] || [];
                if (!estadosPermitidos.length) return null;
                return (
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {estadosPermitidos.map((estado) => (
                      <Button
                        key={estado}
                        variant="outline"
                        size="lg"
                        className="rounded-full font-bold border-2 flex items-center gap-2 px-6 py-2"
                        style={{
                          borderColor: COLORES_ESTADO[estado as keyof typeof COLORES_ESTADO],
                          color: COLORES_ESTADO[estado as keyof typeof COLORES_ESTADO],
                          background: '#fff',
                        }}
                        onClick={() => {
                          setEstadoAConfirmar(estado);
                          setShowConfirmDialog(true);
                        }}
                        disabled={isUpdating}
                        title={`Cambiar estado a ${estado}`}
                      >
                        {ICONOS_ESTADO[estado as keyof typeof ICONOS_ESTADO]}
                        <span>{estado}</span>
                      </Button>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Confirmar cambio de estado
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center">
            <p className="text-center text-lg text-gray-700">
              ¿Seguro que deseas cambiar el estado a <span className="font-bold text-primary">{estadoAConfirmar}</span>?
            </p>
          </div>
          <DialogFooter className="flex justify-center gap-6">
            <Button variant="outline" size="lg" onClick={() => setShowConfirmDialog(false)} disabled={isUpdating}>
              Cancelar
            </Button>
            <Button
              color="primary"
              size="lg"
              className="font-bold"
              onClick={async () => {
                if (!estadoAConfirmar) return;
                await handleCambiarEstado(estadoAConfirmar);
                setShowConfirmDialog(false);
                setEventoSeleccionado(null)
              }}
              disabled={isUpdating || !estadoAConfirmar}
            >
              {isUpdating ? <span className="animate-spin mr-2">⏳</span> : null}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog 
        open={showParametrosDialog} 
        onOpenChange={setShowParametrosDialog}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Añadir Parámetro de Proceso</DialogTitle>
          </DialogHeader>
          <FormularioParametrosProceso
            loteFabricacionId={eventoSeleccionado?.extendedProps?.loteFabricacionId}
            onSubmit={handleCrearParametro}
            onCancel={() => setShowParametrosDialog(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog 
        open={showListaParametrosDialog} 
        onOpenChange={setShowListaParametrosDialog}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Parámetros de Proceso</DialogTitle>
          </DialogHeader>
          <ListaParametrosProceso
            parametros={parametros || []}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
      <DialogoNuevaOrden
        open={dialogoAbierto}
        onOpenChange={(open) => {
          setDialogoAbierto(open)
          if (!open) setFechaPreseleccionada(null)
        }}
        onSubmit={handleNuevaOrden}
      />
      {/* Modal de resultado de validación */}
      <Dialog open={showValidacion} onOpenChange={setShowValidacion}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Resultado de la validación</DialogTitle>
          </DialogHeader>
          {resultadoValidacion?.error && (
            <div className="text-destructive">{resultadoValidacion.error}</div>
          )}
          {resultadoValidacion?.data && (
            <div className="space-y-2">
              <div>
                <b>Parámetros validados:</b> {resultadoValidacion.data.parametrosValidados}
              </div>
              <div>
                <b>En rango:</b> {resultadoValidacion.data.parametrosEnRango} &nbsp;|&nbsp; <b>Fuera de rango:</b> {resultadoValidacion.data.parametrosFueraRango}
              </div>
              {Array.isArray(resultadoValidacion.data.alertas) && resultadoValidacion.data.alertas.length > 0 && (
                <div className="mt-2">
                  <b>Alertas:</b>
                  <ul className="list-disc ml-6">
                    {resultadoValidacion.data.alertas.map((alerta: { parametro: string; mensaje: string }, idx: number) => (
                      <li key={idx} className="text-destructive">
                        {alerta.parametro}: {alerta.mensaje ? traducirMensaje(alerta.mensaje) : 'Fuera de rango'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(resultadoValidacion.data.detalles) && resultadoValidacion.data.detalles.length > 0 && (
                <div className="mt-2">
                  <b>Detalles:</b>
                  <ul className="list-disc ml-6">
                    {resultadoValidacion.data.detalles.map((detalle: { parametro: string; enRango: boolean; mensaje?: string }, idx: number) => (
                      <li key={idx} className={detalle.enRango === false ? 'text-destructive' : ''}>
                        {detalle.parametro}: {detalle.enRango ? '✔️ En rango' : `❌ Fuera de rango (${detalle.mensaje ? traducirMensaje(detalle.mensaje) : 'Verifique el valor'})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// Traducción básica de mensajes comunes
function traducirMensaje(msg: string) {
  if (!msg) return ''
  return msg
    .replace('cannot exceed', 'no puede ser mayor que')
    .replace('must be greater than or equal to', 'debe ser mayor o igual a')
    .replace('must be less than or equal to', 'debe ser menor o igual a')
    .replace('is required', 'es obligatorio')
    .replace('out of range', 'fuera de rango')
    .replace('too_big', 'demasiado grande')
    .replace('too_small', 'demasiado pequeño')
    .replace('Invalid value', 'Valor inválido')
    .replace('Check the value', 'Verifique el valor')
} 