import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { ordenesApi } from '@/services/api/ordenes'
import type { OrdenProduccion, CrearOrdenProduccion, ActualizarOrdenProduccion } from '@/features/production/planificacion/types'
import { toast } from 'sonner'

// Consulta de órdenes de producción
export const useOrdenesProduccion = (params?: {
  recetaId?: number
  productoTerminadoId?: number
  estado?: string
  usuarioResponsableId?: number
  fechaDesde?: string
  fechaHasta?: string
  busqueda?: string
  page?: number
  limit?: number
}) => {
  return useQuery<OrdenProduccion[], Error>({
    queryKey: ['ordenesProduccion', params],
    queryFn: () => ordenesApi.getOrdenes(params),
    staleTime: 1000 * 60, // 1 minuto, ajusta según necesidad
  })
}

// Crear orden de producción
export const useCrearOrdenProduccion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CrearOrdenProduccion) => ordenesApi.crearOrden(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenesProduccion'] })
      toast.success('Orden creada correctamente')
    },
    onError: (error) => {
      toast.error('Error al crear la orden')
      console.error('Error al crear orden:', error)
    }
  })
}

// Actualizar orden de producción
export const useActualizarOrdenProduccion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarOrdenProduccion }) =>
      ordenesApi.actualizarOrden(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenesProduccion'] })
      toast.success('Orden actualizada correctamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar la orden')
      console.error('Error al actualizar orden:', error)
    }
  })
}

// Cambiar estado de orden de producción
export const useCambiarEstadoOrdenProduccion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { 
      id: number; 
      data: { 
        nuevoEstado: string;
        fechaInicio?: string;
        fechaFinalizacion?: string;
        notas?: string;
      }
    }) => ordenesApi.cambiarEstado(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenesProduccion'] })
      toast.success('Estado actualizado correctamente')
    },
    onError: (error) => {
      toast.error('Error al cambiar el estado de la orden')
      console.error('Error al cambiar estado:', error)
    }
  })
}
