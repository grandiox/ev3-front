import apiClient from '@/lib/api-client';

const PREFIX = '/api/v1/produccion/lotes-fabricacion';

export interface LoteFabricacion {
  id: number;
  ordenProduccionId: number;
  recetaId: number | null;
  codigoLote: string;
  estado: 'En Preparación' | 'En Proceso' | 'Finalizado' | 'Cancelado';
  volumenObtenido: number | null;
  rendimientoReal: number | null;
  fechaInicio: string | null;
  fechaFinalizacion: string | null;
  fechaOptimoConsumo: string | null;
  fechaCaducidad: string | null;
  notas: string | null;
  observaciones?: string | null;
}

export const lotesFabricacionApi = {
  // Obtener todos los lotes de fabricación
  getAll: async () => {
    const response = await apiClient.get(PREFIX);
    return response.data;
  },

  // Obtener un lote por ID
  getById: async (id: number) => {
    const response = await apiClient.get(`${PREFIX}/${id}`);
    return response.data;
  },

  // Obtener lotes por producto terminado
  getByProductoTerminado: async (productoTerminadoId: number) => {
    const response = await apiClient.get(`${PREFIX}/producto/${productoTerminadoId}`);
    return response.data;
  },

  // Finalizar un lote de fabricación
  finalizarLote: async (id: number, data: {
    cantidadFinal: number;
    rendimientoReal?: number;
    parametrosFinales?: Array<{
      parametroId: number;
      valor: number;
      unidad: string;
    }>;
    observaciones?: string;
    calificacionCalidad?: 'A' | 'B' | 'C' | 'Rechazado';
  }) => {
    const response = await apiClient.post(`${PREFIX}/${id}/finalizar`, data);
    return response.data;
  }
}; 