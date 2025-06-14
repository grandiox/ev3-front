import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lotesFabricacionApi } from '../lotes-fabricacion'
import { toast } from 'sonner'

interface FinalizarLoteData {
  cantidadFinal: number
  rendimientoReal?: number
  parametrosFinales?: Array<{
    parametroId: number
    valor: number
    unidad: string
  }>
  observaciones?: string
  calificacionCalidad?: 'A' | 'B' | 'C' | 'Rechazado'
}

export function useLotesFabricacion() {
  return useQuery({
    queryKey: ['lotes-fabricacion'],
    queryFn: async () => {
      const response = await lotesFabricacionApi.getAll()
      return response.data
    },
  })
}

export function useFinalizarLote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FinalizarLoteData }) => {
      const response = await lotesFabricacionApi.finalizarLote(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes-fabricacion'] })
      toast.success('Lote finalizado correctamente')
    },
    onError: (error) => {
      console.error('Error al finalizar lote:', error)
      toast.error('Error al finalizar el lote')
    },
  })
} 