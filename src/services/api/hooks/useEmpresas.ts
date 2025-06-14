import { useMutation, useQuery } from '@tanstack/react-query'
import { empresasApi, type EmpresaUpdate } from '../empresas'

export const useGetEmpresa = (id?: string | number) => {
  return useQuery({
    queryKey: ['empresa', id],
    queryFn: () => empresasApi.getEmpresa(id!),
    enabled: !!id,
  })
}

export const useActualizarEmpresa = () => {
  return useMutation({
    mutationFn: ({ id, empresa }: { id: string | number; empresa: EmpresaUpdate }) =>
      empresasApi.actualizarEmpresa(id, empresa),
  })
} 