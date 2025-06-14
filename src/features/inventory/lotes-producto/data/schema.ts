import { z } from 'zod'

export const estadoSchema = z.enum(['Disponible', 'Agotado', 'Caducado', 'Reservado', 'Desconocido'])
export type Estado = z.infer<typeof estadoSchema>

const productoTerminadoSchema = z.object({
  codigo: z.string(),
  nombre: z.string(),
  estilo: z.string(),
  presentacion: z.string(),
})

const loteFabricacionSchema = z.object({
  id: z.number(),
  codigoLote: z.string(),
}).optional()

export const loteProductoSchema = z.object({
  id: z.number(),
  productoTerminadoId: z.number(),
  codigoLote: z.string(),
  loteFabricacionId: z.number().optional(),
  fechaEnvasado: z.string().transform((str) => new Date(str)),
  fechaOptimoConsumo: z.string().nullable().transform((str) => str ? new Date(str) : null),
  fechaCaducidad: z.string().nullable().transform((str) => str ? new Date(str) : null),
  cantidad: z.string().transform((str) => parseFloat(str)),
  cantidadDisponible: z.string().transform((str) => parseFloat(str)),
  estado: estadoSchema,
  ubicacionFisica: z.string().nullable(),
  notas: z.string().nullable(),
  productoTerminado: productoTerminadoSchema,
  loteFabricacion: loteFabricacionSchema,
})

export type LoteProducto = z.infer<typeof loteProductoSchema>
export const loteProductoListSchema = z.array(loteProductoSchema) 