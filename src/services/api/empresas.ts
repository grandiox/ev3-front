import apiClient from '@/lib/api-client'

export interface Empresa {
  id: number
  codigo: string
  nombre: string
  razonSocial: string
  rut: string
  direccion: string
  comuna: string
  ciudad: string
  pais: string
  telefono: string
  email: string
  estado: string
  fechaCreacion: string
  fechaModificacion: string | null
  notas?: string
}

export interface EmpresaUpdate {
  codigo: string
  nombre: string
  razonSocial: string
  rut: string
  direccion: string
  comuna: string
  ciudad: string
  pais: string
  telefono: string
  email: string
  estado: string
  notas?: string
}

export const empresasApi = {
  getEmpresa: async (id: string | number): Promise<Empresa> => {
    const response = await apiClient.get(`/administrativo/empresas/${id}`)
    return response.data
  },

  actualizarEmpresa: async (id: string | number, empresa: EmpresaUpdate): Promise<Empresa> => {
    const response = await apiClient.put(`/administrativo/empresas/${id}`, empresa)
    return response.data
  },
} 