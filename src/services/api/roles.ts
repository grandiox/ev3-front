import apiClient from '@/lib/api-client'

export interface Rol {
  id: number
  nombre: string
  descripcion: string
}

export interface Permiso {
  id: number
  nombre: string
  descripcion: string
  modulo: string
}

export interface RolesResponse {
  success: boolean
  data: Rol[]
  count: number
}

export interface PermisosResponse {
  success: boolean
  data: Permiso[]
  count: number
}

export const rolesApi = {
  getAll: async () => {
    const response = await apiClient.get<RolesResponse>('/api/v1/transversal/roles')
    return response.data
  },
  getById: async (id: number) => {
    const response = await apiClient.get<{ success: boolean; data: Rol }>(`/api/v1/transversal/roles/${id}`)
    return response.data.data
  },
  create: async (rol: Omit<Rol, 'id'>) => {
    const response = await apiClient.post<{ success: boolean; data: Rol }>('/api/v1/transversal/roles', rol)
    return response.data.data
  },
  update: async (id: number, rol: Partial<Rol>) => {
    const response = await apiClient.put<{ success: boolean; data: Rol }>(`/api/v1/transversal/roles/${id}`, rol)
    return response.data.data
  },
  delete: async (id: number) => {
    const response = await apiClient.delete<{ success: boolean; data: Rol }>(`/api/v1/transversal/roles/${id}`)
    return response.data.data
  },
  getPermisos: async (id: number) => {
    const response = await apiClient.get<PermisosResponse>(`/api/v1/transversal/roles/${id}/permisos`)
    return response.data
  },
  asignarPermiso: async (id: number, permisoId: number) => {
    const response = await apiClient.post<{ success: boolean }>(`/api/v1/transversal/roles/${id}/permisos`, { permisoId })
    return response.data
  },
  quitarPermiso: async (id: number, permisoId: number) => {
    const response = await apiClient.delete<{ success: boolean }>(`/api/v1/transversal/roles/${id}/permisos`, { data: { permisoId } })
    return response.data
  },
} 