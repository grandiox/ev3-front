import api from '@/lib/api-client'
import type { OrdenProduccion, ActualizarOrdenProduccion } from '../../features/production/planificacion/types'

const BASE_URL = '/api/v1/produccion/ordenes'

export interface OrdenProduccionUpdate {
  estado: string;
  recetaId: number;
  fechaProgramada: string;
  fechaInicio: string;
  fechaFinalizacion: string;
  volumenProgramado: number;
  unidadVolumen: string;
  usuarioResponsableId: number;
  prioridad: string;
  notas: string;
  empresaId: number;
}

export const ordenesApi = {
  // Obtener todas las órdenes
  getOrdenes: async (params?: {
    recetaId?: number
    productoTerminadoId?: number
    estado?: string
    usuarioResponsableId?: number
    fechaDesde?: string
    fechaHasta?: string
    busqueda?: string
    page?: number
    limit?: number
  }) => {
    const { data } = await api.get<{ data: OrdenProduccion[] }>(BASE_URL, { params })
    return data.data
  },

  // Obtener una orden específica
  getOrden: async (id: number) => {
    const { data } = await api.get<{ data: OrdenProduccion }>(`${BASE_URL}/${id}`)
    return data.data
  },

  // Crear una nueva orden
  crearOrden: async (orden: any) => {
    // Generar un código único para la orden (puedes ajustar la lógica según tu sistema)
    const payload = {
      recetaId: orden.recetaId,
      fechaProgramada: orden.fechaProgramada,
      volumenProgramado: orden.volumenProgramado,
      unidadVolumen: orden.unidadVolumen || 'L',
      usuarioResponsableId: orden.usuarioResponsableId || 1, // Ajusta según tu lógica de usuario
      prioridad: orden.prioridad || 'Normal',
      notas: orden.notas || '',
      empresaId: orden.empresaId || 1 // Ajusta según tu lógica de empresa
    };
    const { data } = await api.post<{ data: OrdenProduccion }>(BASE_URL, payload);
    return data.data;
  },

  // Actualizar una orden
  actualizarOrden: async (id: number, orden: ActualizarOrdenProduccion) => {
    const { data } = await api.put<{ data: OrdenProduccion }>(`${BASE_URL}/${id}`, orden)
    return data.data
  },

  // Eliminar una orden
  eliminarOrden: async (id: number) => {
    const { data } = await api.delete<{ success: boolean; message: string }>(`${BASE_URL}/${id}`)
    return data
  },

  // Cambiar estado de una orden
  cambiarEstado: async (id: number, data: { 
    nuevoEstado: string;
    fechaInicio?: string;
    fechaFinalizacion?: string;
    notas?: string;
  }) => {
    const { data: response } = await api.patch<{ data: OrdenProduccion }>(`${BASE_URL}/${id}/estado`, data)
    return response.data
  }
} 