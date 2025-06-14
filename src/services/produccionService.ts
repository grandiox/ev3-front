import { api } from '../config/axios';
import { 
  OrdenProduccion, 
  OrdenProduccionCreateInput, 
  OrdenProduccionUpdateInput,
  PlanificacionProduccion,
  PlanificarProduccionInput,
  VerificacionInventario,
  EstadisticasProduccion,
  LoteFabricacion,
  ConsumoMateriaPrima,
  TrazabilidadLote,
  TrazabilidadInversaLoteProducto,
  ParametroProceso,
  ParametroProcesoCreateInput,
  ParametroProcesoUpdateInput,
  ParametroValidationInput,
  ParametroValidationResult,
  ParametroRange,
  ParametroRangeInput,
  ParametroBatchValidationInput,
  ParametroBatchValidationResult,
  ParametroEstadisticas,
  EtapaResumen,
  ParametroTendencia,
  ReporteCalidad,
  ParametroConfig,
  RecetaParametrosConfig,
  ParametroAlerta
} from '../types/produccion';

export const produccionService = {
  // Órdenes de Producción
  getOrdenes: async (params?: {
    recetaId?: number;
    productoTerminadoId?: number;
    estado?: string;
    usuarioResponsableId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
    busqueda?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<{ success: boolean; data: OrdenProduccion[] }>('/produccion/ordenes', { params });
    return response.data;
  },

  getOrdenById: async (id: number) => {
    const response = await api.get<{ success: boolean; data: OrdenProduccion }>(`/produccion/ordenes/${id}`);
    return response.data;
  },

  getOrdenByCodigo: async (codigo: string) => {
    const response = await api.get<{ success: boolean; data: OrdenProduccion }>(`/produccion/ordenes/codigo/${codigo}`);
    return response.data;
  },

  createOrden: async (orden: OrdenProduccionCreateInput) => {
    const response = await api.post<{ success: boolean; data: OrdenProduccion }>('/produccion/ordenes', orden);
    return response.data;
  },

  updateOrden: async (id: number, orden: OrdenProduccionUpdateInput) => {
    const response = await api.put<{ success: boolean; data: OrdenProduccion }>(`/produccion/ordenes/${id}`, orden);
    return response.data;
  },

  deleteOrden: async (id: number) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/produccion/ordenes/${id}`);
    return response.data;
  },

  getOrdenesPendientes: async () => {
    const response = await api.get<{ success: boolean; data: OrdenProduccion[] }>('/produccion/ordenes/pendientes');
    return response.data;
  },

  getOrdenesByUsuario: async (usuarioId: number) => {
    const response = await api.get<{ success: boolean; data: OrdenProduccion[] }>(`/produccion/ordenes/usuario/${usuarioId}`);
    return response.data;
  },

  getEstadisticas: async (params?: { fechaDesde?: string; fechaHasta?: string }) => {
    const response = await api.get<{ success: boolean; data: EstadisticasProduccion }>('/produccion/ordenes/estadisticas', { params });
    return response.data;
  },

  verificarInventario: async (params: { recetaId: number; volumenProgramado: number }) => {
    const response = await api.post<{ success: boolean; data: VerificacionInventario; message: string }>('/produccion/ordenes/verificar-inventario', params);
    return response.data;
  },

  planificarProduccion: async (input: PlanificarProduccionInput) => {
    const response = await api.post<{ success: boolean; data: PlanificacionProduccion }>('/produccion/ordenes/planificar', input);
    return response.data;
  },

  cambiarEstadoOrden: async (id: number, params: {
    nuevoEstado: string;
    fechaInicio?: string;
    fechaFinalizacion?: string;
    notas?: string;
  }) => {
    const response = await api.patch<{ success: boolean; data: OrdenProduccion; message: string }>(`/produccion/ordenes/${id}/estado`, params);
    return response.data;
  },

  // Lotes de Fabricación
  getLoteById: async (id: number) => {
    const response = await api.get<{ success: boolean; data: LoteFabricacion }>(`/produccion/lotes-fabricacion/${id}`);
    return response.data;
  },

  registrarConsumo: async (loteId: number, consumo: {
    materiaPrimaId: number;
    loteMateriaPrimaId?: number;
    cantidadConsumida: number;
    unidadMedida?: string;
    etapaProduccion?: string;
    observaciones?: string;
  }) => {
    const response = await api.post<{ success: boolean; data: ConsumoMateriaPrima }>(`/produccion/lotes-fabricacion/${loteId}/consumo`, consumo);
    return response.data;
  },

  finalizarLote: async (loteId: number, params: {
    cantidadFinal: number;
    rendimientoReal?: number;
    parametrosFinales?: any[];
    observaciones?: string;
    calificacionCalidad?: 'A' | 'B' | 'C' | 'Rechazado';
  }) => {
    const response = await api.post<{ success: boolean; data: LoteFabricacion }>(`/produccion/lotes-fabricacion/${loteId}/finalizar`, params);
    return response.data;
  },

  getTrazabilidad: async (loteId: number) => {
    const response = await api.get<{ success: boolean; data: TrazabilidadLote }>(`/produccion/lotes-fabricacion/${loteId}/trazabilidad`);
    return response.data;
  },

  getConsumos: async (loteId: number) => {
    const response = await api.get<{ success: boolean; data: ConsumoMateriaPrima[] }>(`/produccion/lotes-fabricacion/${loteId}/consumos`);
    return response.data;
  },

  getEficiencia: async (loteId: number) => {
    const response = await api.get<{ success: boolean; data: number }>(`/produccion/lotes-fabricacion/${loteId}/eficiencia`);
    return response.data;
  },

  getTrazabilidadInversa: async (loteId: number) => {
    const response = await api.get<{ success: boolean; data: TrazabilidadInversaLoteProducto }>(`/produccion/lotes-fabricacion/lotes-producto/${loteId}/trazabilidad-inversa`);
    return response.data;
  },

  getLotesByOrden: async (ordenId: number) => {
    const response = await api.get<{ success: boolean; data: LoteFabricacion[] }>(`/produccion/ordenes/${ordenId}/lotes`);
    return response.data;
  },

  createLote: async (ordenId: number, lote: {
    cantidadInicial: number;
    rendimientoEsperado: number;
    observaciones?: string;
  }) => {
    const response = await api.post<{ success: boolean; data: LoteFabricacion }>(`/produccion/ordenes/${ordenId}/lotes`, lote);
    return response.data;
  },

  getLoteActivo: async (ordenId: number) => {
    const response = await api.get<{ success: boolean; data: LoteFabricacion }>(`/produccion/ordenes/${ordenId}/lote-activo`);
    return response.data;
  },

  // Parámetros de Proceso
  createParametroProceso: async (parametro: ParametroProcesoCreateInput) => {
    const response = await api.post<{ success: boolean; data: ParametroProceso }>('/produccion/parametros-proceso', parametro);
    return response.data;
  },

  getParametrosProceso: async (params?: {
    loteFabricacionId?: number;
    ordenProduccionId?: number;
    etapa?: string;
  }) => {
    const response = await api.get<{ success: boolean; data: ParametroProceso[] }>('/produccion/parametros-proceso', { params });
    return response.data;
  },

  getParametroProcesoById: async (id: number) => {
    const response = await api.get<{ success: boolean; data: ParametroProceso }>(`/produccion/parametros-proceso/${id}`);
    return response.data;
  },

  updateParametroProceso: async (id: number, parametro: ParametroProcesoUpdateInput) => {
    const response = await api.put<{ success: boolean; data: ParametroProceso }>(`/produccion/parametros-proceso/${id}`, parametro);
    return response.data;
  },

  deleteParametroProceso: async (id: number) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/produccion/parametros-proceso/${id}`);
    return response.data;
  },

  getParametrosByLote: async (loteFabricacionId: number) => {
    const response = await api.get<{ success: boolean; data: ParametroProceso[] }>(`/produccion/parametros-proceso/lote-fabricacion/${loteFabricacionId}`);
    return response.data;
  },

  getParametrosByOrden: async (ordenProduccionId: number) => {
    const response = await api.get<{ success: boolean; data: ParametroProceso[] }>(`/produccion/parametros-proceso/orden-produccion/${ordenProduccionId}`);
    return response.data;
  },

  getParametrosByEtapa: async (etapa: string) => {
    const response = await api.get<{ success: boolean; data: ParametroProceso[] }>(`/produccion/parametros-proceso/etapa/${etapa}`);
    return response.data;
  },

  validateParametro: async (input: ParametroValidationInput) => {
    const response = await api.post<{ success: boolean; data: ParametroValidationResult }>('/produccion/parametros-proceso/validate', input);
    return response.data;
  },

  getAllParametroRanges: async () => {
    const response = await api.get<{ success: boolean; data: ParametroRange[] }>('/produccion/parametros-proceso/ranges/all');
    return response.data;
  },

  setParametroRange: async (input: ParametroRangeInput) => {
    const response = await api.post<{ success: boolean; data: ParametroRange }>('/produccion/parametros-proceso/ranges', input);
    return response.data;
  },

  validateParametroBatch: async (input: ParametroBatchValidationInput) => {
    const response = await api.post<{ success: boolean; data: ParametroBatchValidationResult }>('/produccion/parametros-proceso/validate-batch', input);
    return response.data;
  },

  createParametroBatch: async (input: any) => {
    const response = await api.post<{ success: boolean; data: ParametroProceso[] }>('/produccion/parametros-proceso/batch', input);
    return response.data;
  },

  getEstadisticasGenerales: async () => {
    const response = await api.get<{ success: boolean; data: ParametroEstadisticas }>('/produccion/parametros-proceso/statistics/general');
    return response.data;
  },

  getResumenEtapa: async (loteFabricacionId: number) => {
    const response = await api.get<{ success: boolean; data: EtapaResumen }>(`/produccion/parametros-proceso/statistics/stage-summary/${loteFabricacionId}`);
    return response.data;
  },

  getTendenciaParametro: async (parametro: string, etapa: string) => {
    const response = await api.get<{ success: boolean; data: ParametroTendencia }>(`/produccion/parametros-proceso/statistics/trend/${parametro}/${etapa}`);
    return response.data;
  },

  getReporteCalidad: async (loteFabricacionId: number) => {
    const response = await api.get<{ success: boolean; data: ReporteCalidad }>(`/produccion/parametros-proceso/reports/quality/${loteFabricacionId}`);
    return response.data;
  },

  getEtapasProduccion: async () => {
    const response = await api.get<{ success: boolean; data: string[] }>('/produccion/parametros-proceso/config/stages');
    return response.data;
  },

  getParametrosByEtapaConfig: async (etapa: string) => {
    const response = await api.get<{ success: boolean; data: ParametroConfig[] }>(`/produccion/parametros-proceso/config/parameters/${etapa}`);
    return response.data;
  },

  getParametrosReceta: async (recetaId: number) => {
    const response = await api.get<{ success: boolean; data: RecetaParametrosConfig }>(`/produccion/parametros-proceso/config/recipe/${recetaId}`);
    return response.data;
  },

  getParametrosFueraDeRango: async () => {
    const response = await api.get<{ success: boolean; data: ParametroAlerta[] }>('/produccion/parametros-proceso/alerts/out-of-range');
    return response.data;
  },

  getParametrosConfig: async () => {
    const response = await api.get<{ success: boolean; data: ParametroConfig[] }>('/produccion/parametros-config');
    return response.data;
  }
}; 