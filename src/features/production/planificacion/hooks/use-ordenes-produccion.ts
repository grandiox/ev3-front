import { useState } from 'react'
import { useOrdenesProduccion, useCrearOrdenProduccion, useCambiarEstadoOrdenProduccion } from '@/services/api/hooks/useOrdenesProduccion'
import { CrearOrdenProduccion, EstadoOrden } from '../types'
import { toast } from 'sonner'

export function useOrdenesProduccionHook() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { data: ordenes, isLoading, refetch } = useOrdenesProduccion()
  const crearOrdenMutation = useCrearOrdenProduccion()
  const cambiarEstadoMutation = useCambiarEstadoOrdenProduccion()

  const handleCrearOrden = async (data: CrearOrdenProduccion) => {
    try {
      await crearOrdenMutation.mutateAsync(data)
      toast.success('Orden creada correctamente')
      return true
    } catch (error) {
      console.error('Error al crear orden:', error)
      toast.error('Error al crear la orden')
      return false
    }
  }

  const handleCambiarEstado = async (ordenId: number, nuevoEstado: EstadoOrden) => {
    setIsUpdating(true)
    try {
      await cambiarEstadoMutation.mutateAsync({ 
        id: ordenId, 
        data: {
          nuevoEstado,
          fechaInicio: nuevoEstado === 'En Proceso' ? new Date().toISOString() : undefined,
          fechaFinalizacion: nuevoEstado === 'Finalizada' ? new Date().toISOString() : undefined,
        }
      })
      toast.success('Estado actualizado correctamente')
      return true
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      toast.error('No se pudo actualizar el estado de la orden')
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  const getResumenEstados = () => {
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

    return resumen
  }

  return {
    ordenes,
    isLoading,
    isUpdating,
    refetch,
    handleCrearOrden,
    handleCambiarEstado,
    getResumenEstados
  }
} 