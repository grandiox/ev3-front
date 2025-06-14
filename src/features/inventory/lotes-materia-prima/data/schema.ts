import { z } from 'zod'

export const estadoSchema = z.enum(['Disponible', 'Agotado', 'Caducado', 'Reservado', 'Bloqueado'])
export type Estado = z.infer<typeof estadoSchema>

const materiaPrimaSchema = z.object({
  id: z.number().optional(),
  codigo: z.string(),
  nombre: z.string(),
  tipo: z.string(),
  unidadMedida: z.string(),
})

const proveedorSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  codigo: z.string().optional(),
})

const ordenCompraSchema = z.object({
  id: z.number(),
  codigo: z.string(),
}).optional()

export const loteMateriaPrimaSchema = z.object({
  id: z.number(),
  materiaPrimaId: z.number(),
  codigoLote: z.string(),
  proveedorId: z.number(),
  fechaRecepcion: z.string(),
  fechaProduccion: z.string().nullable(),
  fechaCaducidad: z.string().nullable(),
  cantidad: z.string().transform((val) => parseFloat(val)),
  cantidadDisponible: z.string().transform((val) => parseFloat(val)),
  precio: z.string().nullable().transform((val) => val ? parseFloat(val) : null),
  ordenCompraId: z.number().nullable(),
  estado: estadoSchema,
  notas: z.string().nullable(),
  materiaPrima: materiaPrimaSchema,
  proveedor: proveedorSchema,
  ordenCompra: ordenCompraSchema,
})

export type LoteMateriaPrima = z.infer<typeof loteMateriaPrimaSchema>
export const loteMateriaPrimaListSchema = z.array(loteMateriaPrimaSchema) 