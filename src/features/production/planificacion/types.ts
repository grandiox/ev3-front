export type EstadoOrden = 'Programada' | 'En Preparacion' | 'En Proceso' | 'Pausada' | 'Finalizada' | 'Cancelada'
export type PrioridadOrden = 'Baja' | 'Media' | 'Alta'
export type EstadoLoteFabricacion = 'En Preparación' | 'En Proceso' | 'Finalizado' | 'Cancelado'

export interface ProductoTerminado {
  id: number
  empresaId: number
  codigo: string
  nombre: string
  estilo: string
  descripcion: string | null
  presentacion: string
  capacidad: string
  unidadMedida: string
  stockActual: string
  stockMinimo: string
  precioBase: string
  estado: string
  imagen: string | null
  notas: string | null
  fechaCreacion: string
  fechaModificacion: string | null
}

export interface MateriaPrima {
  id: number
  empresaId: number
  codigo: string
  nombre: string
  tipo: string
  subtipo: string | null
  unidadMedida: string
  stockActual: string
  stockMinimo: string
  ubicacionFisica: string | null
  atributosEspecificos: any | null
  estado: string
  notas: string | null
  fechaCreacion: string
  fechaModificacion: string | null
}

export interface DetalleReceta {
  id: number
  recetaId: number
  materiaPrimaId: number
  etapaProduccion: string
  cantidad: string
  unidadMedida: string
  tiempoAdicion: number | null
  unidadTiempo: string | null
  notas: string | null
  orden: number
  materiaPrima: MateriaPrima
}

export interface Receta {
  id: number
  codigo: string
  nombre: string
  estilo: string
  version: string
  productoTerminadoId: number
  descripcion: string
  volumenFinal: string
  unidadVolumen: string
  instrucciones: string
  parametrosTeoricos: {
    ABV: {
      valor: number
      unidad: string
    }
    IBU: {
      valor: number
      unidad: string
    }
  } | null
  rendimientoEsperado: string | null
  estado: string
  usuarioCreadorId: number
  fechaCreacion: string
  fechaModificacion: string | null
  notas: string
  empresaId: number
  productoTerminado: ProductoTerminado
  detalles: DetalleReceta[]
}

export interface UsuarioResponsable {
  id: number
  empresaId: number
  nombreUsuario: string
  nombre: string
  apellido: string
  email: string
  telefono: string | null
  passwordHash: string
  rol: string
  estado: string
  fechaCreacion: string
  ultimoAcceso: string
}

export interface LoteFabricacion {
  id: number
  codigoLote: string
  estado: EstadoLoteFabricacion
  volumenObtenido: string | null
  fechaInicio: string | null
  fechaFinalizacion: string | null
}

export interface OrdenProduccion {
  id: number
  codigo: string
  recetaId: number
  fechaProgramada: string
  volumenProgramado: string
  unidadVolumen: string
  estado: EstadoOrden
  usuarioResponsableId: number
  fechaInicio: string | null
  fechaFinalizacion: string | null
  notas: string | null
  empresaId: number
  receta: Receta
  usuarioResponsable: UsuarioResponsable
  lotesFabricacion: LoteFabricacion[]
}

export interface CrearOrdenProduccion {
  recetaId: number
  volumenProgramado: number
  fechaProgramada: string
}

export interface ActualizarOrdenProduccion {
  recetaId: number
  fechaProgramada: string
  fechaInicio: string
  fechaFinalizacion: string
  volumenProgramado: number
  volumenReal: number
  unidadVolumen: string
  estado: EstadoOrden
  usuarioResponsableId: number
  prioridad: PrioridadOrden
  notas: string
  empresaId: number
}

export interface EventoCalendario {
  id: string
  title: string
  start: string
  end: string
  color: string
  extendedProps: {
    ordenId: number
    estado: EstadoOrden
    descripcion: string
    recetaId: number
    volumenProgramado: number
    prioridad: PrioridadOrden
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
  }
} 