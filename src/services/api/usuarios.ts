import { UserCreate } from '@/features/users/data/schema'
import apiClient from '@/lib/api-client'

export interface Rol {
  id: number
  nombre: string
  descripcion: string
}

export interface RolesResponse {
  success: boolean
  data: Rol[]
  count: number
}

export interface Usuario {
  id: number
  nombreUsuario: string
  nombre: string
  apellido: string
  email: string
  rolId: number
  estado: string
  telefono?: string | null
  empresaId: number
  fechaCreacion: string
  ultimoAcceso: string
}

export interface UsuariosResponse {
  success: boolean
  data: Usuario[]
  count: number
}

export interface UsuarioUpdate {
  nombre: string
  apellido: string
  telefono?: string
  rolId?: number
  estado?: string
}

export const usuariosApi = {
  // Obtener todos los roles
  getRoles: async () => {
    try {
      const response = await apiClient.get<RolesResponse>('/api/v1/transversal/roles')
      return response.data
    } catch (error) {
      console.error('Error al obtener roles:', error)
      throw error
    }
  },

  // Obtener todos los usuarios
  getAll: async () => {
    try {
      const response = await apiClient.get<UsuariosResponse>('/api/v1/usuarios/usuarios')
      return response.data
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      throw error
    }
  },

  // Obtener un usuario por ID
  getById: async (id: number) => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Usuario }>(`/api/v1/usuarios/usuarios/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error)
      throw error
    }
  },

  // Crear un nuevo usuario
  create: async (usuario: UserCreate) => {
    try {
      const response = await apiClient.post<{ success: boolean; data: Usuario }>('/api/v1/usuarios/usuarios', usuario)
      return response.data.data
    } catch (error) {
      console.error('Error al crear usuario:', error)
      throw error
    }
  },

  // Actualizar un usuario
  update: async (id: number, usuario: Partial<Usuario>) => {
    try {
      const response = await apiClient.put<{ success: boolean; data: Usuario }>(`/api/v1/usuarios/usuarios/${id}`, usuario)
      return response.data.data
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      throw error
    }
  },

  // Eliminar un usuario
  delete: async (id: number) => {
    try {
      const response = await apiClient.delete<{ success: boolean; data: Usuario }>(`/api/v1/usuarios/usuarios/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      throw error
    }
  },
  getProfile: async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Usuario }>('/api/v1/usuarios/auth/profile')
      return response.data.data
    } catch (error) {
      console.error('Error al obtener perfil:', error)
      throw error
    }
  }
} 