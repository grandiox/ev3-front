import { z } from 'zod'

export const userStatusSchema = z.enum(['Activo', 'Inactivo', 'Suspendido'])
export type UserStatus = z.infer<typeof userStatusSchema>

export const userRoleSchema = z.enum([
  'SuperAdmin',
  'Administrador',
  'Produccion',
  'Inventario',
  'Comercial',
  'Visualizador'
])
export type UserRole = z.infer<typeof userRoleSchema>

export const userSchema = z.object({
  id: z.number(),
  nombreUsuario: z.string(),
  nombre: z.string(),
  apellido: z.string(),
  email: z.string().email(),
  rolId: z.number(),
  estado: z.string(),
  telefono: z.string().nullable().optional()
})

export type User = z.infer<typeof userSchema>

export const userCreateSchema = userSchema.omit({ id: true }).extend({
  password: z.string(),
  telefono: z.string().nullable()
})

export type UserCreate = z.infer<typeof userCreateSchema>

export const userUpdateSchema = userSchema.omit({ id: true }).partial().extend({
  password: z.string().optional(),
  telefono: z.string().nullable().optional()
})

export type UserUpdate = z.infer<typeof userUpdateSchema>

export const userListSchema = z.array(userSchema)
