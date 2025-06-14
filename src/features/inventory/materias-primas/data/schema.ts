import { z } from 'zod'

export const estadoSchema = z.enum(['Activo', 'Inactivo', 'Desconocido'])
export type Estado = z.infer<typeof estadoSchema>

export const materiaPrimaSchema = z.object({
  id: z.number(),
  codigo: z.string(),
  nombre: z.string(),
  tipo: z.string(),
  subtipo: z.string().nullable(),
  unidadMedida: z.string(),
  stockMinimo: z.string(),
  stockActual: z.string(),
  ubicacionFisica: z.string().nullable(),
  atributosEspecificos: z.unknown().nullable().optional(),
  notas: z.string().nullable(),
  estado: estadoSchema,
})

export type MateriaPrima = z.infer<typeof materiaPrimaSchema>
export const materiaPrimaListSchema = z.array(materiaPrimaSchema) 