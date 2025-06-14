export interface OrdenProduccion {
  id: number;
  codigo: string;
  recetaId: number;
  receta: {
    id: number;
    nombre: string;
    codigo: string;
  };
  productoTerminadoId: number;
  productoTerminado: {
    id: number;
    nombre: string;
    codigo: string;
  };
  volumenProgramado: number;
  fechaInicio: string;
  fechaFinalizacion: string;
  estado: 'Programada' | 'En Preparacion' | 'En Proceso' | 'Pausada' | 'Finalizada' | 'Cancelada';
  usuarioResponsableId: number;
  usuarioResponsable: {
    id: number;
    nombre: string;
    apellido: string;
  };
  prioridad: number;
  notas: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdenProduccionCreateInput {
  recetaId: number;
  productoTerminadoId: number;
  volumenProgramado: number;
  fechaInicio: string;
  fechaFinalizacion: string;
  usuarioResponsableId: number;
  prioridad?: number;
  notas?: string;
}

export interface OrdenProduccionUpdateInput {
  volumenProgramado?: number;
  fechaInicio?: string;
  fechaFinalizacion?: string;
  usuarioResponsableId?: number;
  prioridad?: number;
  notas?: string;
}

export interface PlanificarProduccionInput {
  fechaInicio: string;
  fechaFin: string;
  ordenes: {
    ordenId: number;
    fechaInicio: string;
    fechaFin: string;
  }[];
}

export interface PlanificacionProduccion {
  ordenes: {
    ordenId: number;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
  }[];
  conflictos: {
    tipo: string;
    mensaje: string;
    ordenes: number[];
  }[];
}

export interface VerificacionInventario {
  disponible: boolean;
  faltantes: {
    materiaPrimaId: number;
    nombre: string;
    cantidadNecesaria: number;
    cantidadDisponible: number;
    unidad: string;
  }[];
}

export interface EstadisticasProduccion {
  totalOrdenes: number;
  ordenesPorEstado: {
    estado: string;
    cantidad: number;
  }[];
  volumenTotal: number;
  eficienciaPromedio: number;
  tiempoPromedio: number;
}

export interface LoteFabricacion {
  id: number;
  ordenProduccionId: number;
  ordenProduccion: OrdenProduccion;
  codigo: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: 'En Proceso' | 'Finalizado' | 'Cancelado';
  cantidadInicial: number;
  cantidadFinal?: number;
  rendimientoEsperado: number;
  rendimientoReal?: number;
  parametrosFinales?: ParametroFinal[];
  observaciones?: string;
  calificacionCalidad?: 'A' | 'B' | 'C' | 'Rechazado';
  createdAt: string;
  updatedAt: string;
}

export interface ParametroFinal {
  parametroId: number;
  nombre: string;
  valor: number;
  unidad: string;
  dentroDeRango: boolean;
}

export interface ConsumoMateriaPrima {
  id: number;
  loteFabricacionId: number;
  materiaPrimaId: number;
  materiaPrima: {
    id: number;
    nombre: string;
    codigo: string;
  };
  loteMateriaPrimaId?: number;
  loteMateriaPrima?: {
    id: number;
    codigo: string;
  };
  cantidadConsumida: number;
  unidadMedida: string;
  etapaProduccion?: string;
  observaciones?: string;
  fechaConsumo: string;
}

export interface TrazabilidadLote {
  lote: LoteFabricacion;
  consumos: ConsumoMateriaPrima[];
  eventos: {
    id: number;
    tipo: string;
    descripcion: string;
    fecha: string;
    usuario: {
      id: number;
      nombre: string;
      apellido: string;
    };
  }[];
}

export interface TrazabilidadInversaLoteProducto {
  loteProducto: {
    id: number;
    codigo: string;
    producto: {
      id: number;
      nombre: string;
      codigo: string;
    };
  };
  lotesFabricacion: {
    lote: LoteFabricacion;
    consumos: ConsumoMateriaPrima[];
  }[];
}

export interface ParametroProceso {
  id: number;
  nombre: string;
  descripcion?: string;
  unidad: string;
  valor: number;
  valorMinimo?: number;
  valorMaximo?: number;
  etapa: string;
  loteFabricacionId?: number;
  ordenProduccionId?: number;
  fechaRegistro: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParametroProcesoCreateInput {
  nombre: string;
  descripcion?: string;
  unidad: string;
  valor: number;
  valorMinimo?: number;
  valorMaximo?: number;
  etapa: string;
  loteFabricacionId?: number;
  ordenProduccionId?: number;
  observaciones?: string;
}

export interface ParametroProcesoUpdateInput {
  valor?: number;
  observaciones?: string;
}

export interface ParametroValidationInput {
  nombre: string;
  valor: number;
  etapa: string;
}

export interface ParametroValidationResult {
  valido: boolean;
  mensaje?: string;
  rango?: {
    minimo: number;
    maximo: number;
  };
}

export interface ParametroRange {
  id: number;
  nombre: string;
  etapa: string;
  valorMinimo: number;
  valorMaximo: number;
  unidad: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParametroRangeInput {
  nombre: string;
  etapa: string;
  valorMinimo: number;
  valorMaximo: number;
  unidad: string;
}

export interface ParametroBatchValidationInput {
  parametros: {
    nombre: string;
    valor: number;
    etapa: string;
  }[];
}

export interface ParametroBatchValidationResult {
  resultados: {
    nombre: string;
    valido: boolean;
    mensaje?: string;
  }[];
}

export interface ParametroBatchCreateInput {
  parametros: ParametroProcesoCreateInput[];
}

export interface ParametroEstadisticas {
  totalParametros: number;
  parametrosPorEtapa: {
    etapa: string;
    cantidad: number;
  }[];
  parametrosFueraDeRango: number;
  tendencias: {
    parametro: string;
    tendencia: 'ascendente' | 'descendente' | 'estable';
    ultimoValor: number;
  }[];
}

export interface EtapaResumen {
  etapa: string;
  parametros: {
    nombre: string;
    valorPromedio: number;
    desviacionEstandar: number;
    fueraDeRango: number;
  }[];
  eficiencia: number;
}

export interface ParametroTendencia {
  parametro: string;
  etapa: string;
  valores: {
    fecha: string;
    valor: number;
  }[];
  tendencia: 'ascendente' | 'descendente' | 'estable';
  promedio: number;
  desviacionEstandar: number;
}

export interface ReporteCalidad {
  loteFabricacionId: number;
  fecha: string;
  parametros: {
    nombre: string;
    valor: number;
    valorEsperado: number;
    desviacion: number;
    dentroDeRango: boolean;
  }[];
  calificacion: 'A' | 'B' | 'C' | 'Rechazado';
  observaciones?: string;
}

export interface ParametroConfig {
  nombre: string;
  descripcion?: string;
  unidad: string;
  valorMinimo: number;
  valorMaximo: number;
  obligatorio: boolean;
  orden: number;
}

export interface RecetaParametrosConfig {
  recetaId: number;
  etapas: {
    nombre: string;
    parametros: ParametroConfig[];
  }[];
}

export interface ParametroAlerta {
  id: number;
  parametro: string;
  etapa: string;
  valor: number;
  valorEsperado: {
    minimo: number;
    maximo: number;
  };
  fecha: string;
  loteFabricacionId?: number;
  ordenProduccionId?: number;
  severidad: 'baja' | 'media' | 'alta';
} 