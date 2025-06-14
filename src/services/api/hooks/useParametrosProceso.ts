import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { parametrosProcesoApi, type CrearParametroProceso } from '../parametrosProceso'
import { toast } from 'sonner'

export function useParametrosProceso(loteFabricacionId: number, ordenProduccionId: number) {
  const queryClient = useQueryClient()
  
  const { data, isLoading } = useQuery({
    queryKey: ['parametros-proceso', loteFabricacionId, ordenProduccionId],
    queryFn: () => parametrosProcesoApi.obtenerPorLote(loteFabricacionId, ordenProduccionId),
    enabled: !!loteFabricacionId && !!ordenProduccionId
  })

  const crearParametroMutation = useMutation({
    mutationFn: parametrosProcesoApi.crear,
    onSuccess: () => {
      toast.success('Parámetro guardado correctamente')
      // Invalidar la consulta para que se actualice la lista
      queryClient.invalidateQueries({
        queryKey: ['parametros-proceso', loteFabricacionId, ordenProduccionId]
      })
    },
    onError: (error) => {
      toast.error('Error al guardar el parámetro')
      console.error(error)
    }
  })

  const actualizarParametroMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: CrearParametroProceso }) => parametrosProcesoApi.actualizar(id, data),
    onSuccess: () => {
      toast.success('Parámetro actualizado correctamente')
      queryClient.invalidateQueries({
        queryKey: ['parametros-proceso', loteFabricacionId, ordenProduccionId]
      })
    },
    onError: (error) => {
      toast.error('Error al actualizar el parámetro')
      console.error(error)
    }
  })

  const eliminarParametroMutation = useMutation({
    mutationFn: (id: number) => parametrosProcesoApi.eliminar(id),
    onSuccess: () => {
      toast.success('Parámetro eliminado correctamente')
      queryClient.invalidateQueries({
        queryKey: ['parametros-proceso', loteFabricacionId, ordenProduccionId]
      })
    },
    onError: (error) => {
      toast.error('Error al eliminar el parámetro')
      console.error(error)
    }
  })

  return {
    parametros: data?.data || [],
    isLoading,
    crearParametro: crearParametroMutation.mutateAsync,
    actualizarParametro: actualizarParametroMutation.mutateAsync,
    eliminarParametro: eliminarParametroMutation.mutateAsync
  }
} 