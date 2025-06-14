import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rolesApi } from '../roles'
import { permisosApi } from '../permisos'

// ROLES
export const useGetRoles = () => useQuery({ queryKey: ['roles'], queryFn: rolesApi.getAll })
export const useGetRol = (id?: number) => useQuery({ queryKey: ['rol', id], queryFn: () => rolesApi.getById(id!), enabled: !!id })
export const useCrearRol = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rolesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] })
  })
}
export const useActualizarRol = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, rol }: { id: number; rol: Partial<ReturnType<typeof rolesApi.getById>> }) => rolesApi.update(id, rol),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] })
  })
}
export const useEliminarRol = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rolesApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] })
  })
}
export const useGetPermisosRol = (id?: number) => useQuery({ queryKey: ['rol', id, 'permisos'], queryFn: () => rolesApi.getPermisos(id!), enabled: !!id })
export const useAsignarPermisoRol = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, permisoId }: { id: number; permisoId: number }) => rolesApi.asignarPermiso(id, permisoId),
    onSuccess: (_data, variables) => queryClient.invalidateQueries({ queryKey: ['rol', variables.id, 'permisos'] })
  })
}
export const useQuitarPermisoRol = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, permisoId }: { id: number; permisoId: number }) => rolesApi.quitarPermiso(id, permisoId),
    onSuccess: (_data, variables) => queryClient.invalidateQueries({ queryKey: ['rol', variables.id, 'permisos'] })
  })
}

// PERMISOS
export const useGetPermisos = () => useQuery({ queryKey: ['permisos'], queryFn: permisosApi.getAll })
export const useGetPermiso = (id?: number) => useQuery({ queryKey: ['permiso', id], queryFn: () => permisosApi.getById(id!), enabled: !!id })
export const useCrearPermiso = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: permisosApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permisos'] })
  })
}
export const useActualizarPermiso = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, permiso }: { id: number; permiso: Partial<ReturnType<typeof permisosApi.getById>> }) => permisosApi.update(id, permiso),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permisos'] })
  })
}
export const useEliminarPermiso = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: permisosApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permisos'] })
  })
} 