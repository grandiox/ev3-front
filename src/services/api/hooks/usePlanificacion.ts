import { useMutation } from '@tanstack/react-query'
import { planificacionApi } from '@/services/api/planificacion'

export const usePlanificarOrden = () => {
  return useMutation({
    mutationFn: planificacionApi.planificar,
  })
}

export const useVerificarInventario = () => {
  return useMutation({
    mutationFn: planificacionApi.verificarInventario,
  })
} 