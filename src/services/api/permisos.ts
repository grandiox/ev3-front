import apiClient from '@/lib/api-client'

export interface Permiso {
  id: number
  nombre: string
  descripcion: string
  modulo: string
}

export interface PermisosResponse {
  success: boolean
  data: Permiso[]
  count: number
}

export const permisosApi = {
  getAll: async () => {
    const response = await apiClient.get<PermisosResponse>('/api/v1/transversal/permisos')
    return response.data
  },
  getById: async (id: number) => {
    const response = await apiClient.get<{ success: boolean; data: Permiso }>(`/api/v1/transversal/permisos/${id}`)
    return response.data.data
  },
  create: async (permiso: Omit<Permiso, 'id'>) => {
    const response = await apiClient.post<{ success: boolean; data: Permiso }>('/api/v1/transversal/permisos', permiso)
    return response.data.data
  },
  update: async (id: number, permiso: Partial<Permiso>) => {
    const response = await apiClient.put<{ success: boolean; data: Permiso }>(`/api/v1/transversal/permisos/${id}`, permiso)
    return response.data.data
  },
  delete: async (id: number) => {
    const response = await apiClient.delete<{ success: boolean; data: Permiso }>(`/api/v1/transversal/permisos/${id}`)
    return response.data.data
  },
} 