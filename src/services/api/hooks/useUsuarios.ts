import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usuariosApi, UsuarioUpdate } from '../usuarios'
import { UserCreate } from '@/features/users/data/schema'

interface UsuariosParams {
  page?: number
  limit?: number
}

// Hook para obtener todos los usuarios
export const useGetUsuarios = (params?: UsuariosParams) => {
  return useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuariosApi.getAll()
  })
}

// Hook para obtener un usuario por ID
export const useGetUsuario = (id?: number) => {
  return useQuery({
    queryKey: ['usuario', id],
    queryFn: () => usuariosApi.getById(id!),
    enabled: !!id
  })
}

// Hook para obtener el perfil del usuario actual
export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => usuariosApi.getProfile()
  })
}

// Hook para obtener roles
export const useGetRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => usuariosApi.getRoles()
  })
}

// Hook para crear un nuevo usuario
export const useCrearUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (usuario: UserCreate) => usuariosApi.create(usuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    }
  })
}

// Hook para actualizar un usuario
export const useActualizarUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, usuario }: { id: number; usuario: UsuarioUpdate }) =>
      usuariosApi.update(id, usuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })
}

// Hook para eliminar un usuario
export const useEliminarUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usuariosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
    }
  })
} 