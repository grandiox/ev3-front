import { z } from 'zod'

export const estadoSchema = z.enum(['Activo', 'Inactivo', 'Desconocido'])

export const productoTerminadoSchema = z.object({
  id: z.number().optional(),
  codigo: z.string(),
  nombre: z.string(),
  estilo: z.string(),
  presentacion: z.string(),
  capacidad: z.string(),
  unidadMedida: z.string(),
  stockMinimo: z.string(),
  stockActual: z.string(),
  descripcion: z.string().nullable().optional(),
  precioBase: z.string().optional(),
  imagen: z.string().nullable().optional(),
  notas: z.string().nullable().optional(),
  estado: estadoSchema,
})

export const productoTerminadoListSchema = z.array(productoTerminadoSchema)

export type ProductoTerminado = z.infer<typeof productoTerminadoSchema>
export type ProductoTerminadoList = z.infer<typeof productoTerminadoListSchema> 