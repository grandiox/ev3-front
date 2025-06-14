import api from '@/lib/api-client'

const PREFIX = '/api/v1/produccion/ordenes'

export interface PlanificarOrdenDto {
  recetaId: number
  volumenProgramado: number
  fechaProgramada: string
}

export interface VerificarInventarioDto {
  recetaId: number
  volumenProgramado: number
}

export interface PlanificarOrdenResponse {
  factible: boolean
  tiempoEstimado: number
  fechaFinEstimado: string
  recursosNecesarios: Array<{
    tipo: string
    cantidad: number
    disponible: boolean
  }>
  etapas: Array<{
    nombre: string
    duracion: number
    fechaInicio: string
    fechaFin: string
  }>
}

export interface VerificarInventarioResponse {
  disponible: boolean
  detalles: Array<{
    materiaPrimaId: number
    nombre: string
    cantidadRequerida: number
    cantidadDisponible: number
    unidadMedida: string
    suficiente: boolean
    faltante: number
  }>
  advertencias: string[]
}

export const planificacionApi = {
  planificar: async (data: PlanificarOrdenDto) => {
    const response = await api.post(`${PREFIX}/planificar`, data)
    return response.data
  },
  verificarInventario: async (data: VerificarInventarioDto) => {
    const response = await api.post(`${PREFIX}/verificar-inventario`, data)
    return response.data
  },
} 