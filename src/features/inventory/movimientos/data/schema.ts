import { z } from 'zod'

export const movimientoTipoSchema = z.enum(['Entrada', 'Salida', 'Ajuste'])
export type MovimientoTipo = z.infer<typeof movimientoTipoSchema>

export const elementoTipoSchema = z.enum(['MateriaPrima', 'ProductoTerminado', 'Envase'])
export type ElementoTipo = z.infer<typeof elementoTipoSchema>


const usuarioSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  apellido: z.string(),
})

export const movimientoSchema = z.object({
  id: z.number(),
  fecha: z.string().transform((str) => new Date(str)),
  tipoMovimiento: movimientoTipoSchema,
  tipoElemento: elementoTipoSchema,
  elementoId: z.number(),
  loteId: z.number(),
  cantidad: z.string().transform((str) => parseFloat(str)),
  documentoReferencia: z.string(),
  referenciaId: z.number(),
  motivo: z.string(),
  usuarioId: z.number(),
  notas: z.string().nullable().optional(),
  usuario: usuarioSchema,
})

export type Movimiento = z.infer<typeof movimientoSchema>
export const movimientoListSchema = z.array(movimientoSchema) 