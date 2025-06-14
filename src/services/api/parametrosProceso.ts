import apiClient from '@/lib/api-client'

export interface Usuario {
  id: number
  nombre: string
  email: string
}

export interface Receta {
  id: number
  nombre: string
  version: string
}

export interface OrdenProduccion {
  id: number
  codigo: string
  recetaId: number
  fechaProgramada: string
  volumenProgramado: string
  unidadVolumen: string
  estado: string
  usuarioResponsableId: number
  fechaInicio: string
  fechaFinalizacion: string
  notas: string
  empresaId: number
  receta: Receta
}

export interface LoteFabricacion {
  id: number
  ordenProduccionId: number
  recetaId: number
  codigoLote: string
  estado: string
  volumenObtenido: string
  rendimientoReal: string | null
  fechaInicio: string
  fechaFinalizacion: string
  notas: string | null
  ordenProduccion: OrdenProduccion
}

export interface ParametroProceso {
  id: number
  loteFabricacionId: number
  etapaProduccion: string
  parametro: string
  valor: string
  unidadMedida: string
  fechaMedicion: string
  usuarioId: number
  enRango: boolean
  notas?: string
  loteFabricacion: LoteFabricacion
  usuario: Usuario
}

export interface PaginationResponse {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface ParametrosProcesoResponse {
  success: boolean
  data: ParametroProceso[]
  pagination: PaginationResponse
  message: string
}

export interface CrearParametroProceso {
  loteFabricacionId: number
  etapaProduccion: string
  parametro: string
  valor: number
  unidadMedida: string
  notas?: string
}

export const parametrosProcesoApi = {
  crear: async (data: CrearParametroProceso) => {
    const response = await apiClient.post('/api/v1/produccion/parametros-proceso', data)
    return response.data
  },

  obtenerPorLote: async (loteFabricacionId: number, ordenProduccionId: number) => {
    const response = await apiClient.get<ParametrosProcesoResponse>(
      `/api/v1/produccion/parametros-proceso?loteFabricacionId=${loteFabricacionId}&ordenProduccionId=${ordenProduccionId}`
    )
    return response.data
  },

  actualizar: async (id: number, data: CrearParametroProceso) => {
    const response = await apiClient.put(`/api/v1/produccion/parametros-proceso/${id}`, data)
    return response.data
  },

  eliminar: async (id: number) => {
    const response = await apiClient.delete(`/api/v1/produccion/parametros-proceso/${id}`)
    return response.data
  },

  validarLote: async (loteFabricacionId: number, parametros: any[], usuarioId: number) => {
    const response = await apiClient.post('/api/v1/produccion/parametros-proceso/validate-batch', {
      loteFabricacionId,
      parametros,
      usuarioId
    })
    return response.data
  }
} 