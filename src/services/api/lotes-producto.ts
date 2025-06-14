import apiClient from '@/lib/api-client';
import { ProductoTerminado } from './productos-terminados';
import { LoteFabricacion } from './lotes-fabricacion';

const PREFIX = '/api/v1/inventario/productos/lotes';

export interface LoteProducto {
  id?: number;
  productoTerminadoId: number;
  codigoLote: string;
  loteFabricacionId?: number;
  fechaEnvasado: string;
  fechaOptimoConsumo?: string | null;
  fechaCaducidad: string;
  cantidad: number;
  cantidadDisponible: number;
  estado: string;
  ubicacionFisica?: string | null;
  notas?: string | null;
  costoLote?: number;
  productoTerminado?: ProductoTerminado;
  loteFabricacion?: LoteFabricacion;
  
}

// Función auxiliar para formatear fechas
function toDateOnly(dateString: string | undefined | null): string | null {
  if (!dateString) return null;
  // Si ya está en formato YYYY-MM-DD, no modificar
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  // Si viene con T, cortamos antes de la T
  if (dateString.includes('T')) return dateString.split('T')[0];
  return dateString;
}

export const lotesProductoApi = {
  // Obtener todos los lotes de productos
  getAll: async () => {
    const response = await apiClient.get(PREFIX);
    return response.data.data;
  },

  // Obtener un lote por ID
  getById: async (id: number) => {
    const response = await apiClient.get(`${PREFIX}/${id}`);
    return response.data.data;
  },

  // Crear un nuevo lote de producto
  create: async (lote: Omit<LoteProducto, 'id'>) => {
    try {
      const loteFormateado = {
        productoTerminadoId: Number(lote.productoTerminadoId),
        codigoLote: lote.codigoLote,
        loteFabricacionId: lote.loteFabricacionId ? Number(lote.loteFabricacionId) : undefined,
        fechaEnvasado: toDateOnly(lote.fechaEnvasado),
        fechaOptimoConsumo: toDateOnly(lote.fechaOptimoConsumo),
        fechaCaducidad: toDateOnly(lote.fechaCaducidad),
        cantidad: Number(lote.cantidad),
        cantidadDisponible: Number(lote.cantidadDisponible),
        estado: lote.estado || 'Disponible',
        ubicacionFisica: lote.ubicacionFisica || null,
        notas: lote.notas || null,
      };

      // Validaciones previas
      if (!loteFormateado.productoTerminadoId || loteFormateado.productoTerminadoId < 1) {
        throw new Error('El ID de producto terminado es requerido y debe ser mayor a 0');
      }
      if (!loteFormateado.codigoLote) {
        throw new Error('El código de lote es requerido');
      }
      if (!loteFormateado.fechaEnvasado) {
        throw new Error('La fecha de envasado es requerida');
      }
      if (!loteFormateado.fechaCaducidad) {
        throw new Error('La fecha de caducidad es requerida');
      }
      if (!loteFormateado.cantidad || loteFormateado.cantidad <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }
      if (!loteFormateado.cantidadDisponible || loteFormateado.cantidadDisponible < 0) {
        throw new Error('La cantidad disponible debe ser mayor o igual a 0');
      }

      const response = await apiClient.post(PREFIX, loteFormateado);
      return response.data.data;
    } catch (error: any) {
      console.error('Error al guardar lote:', error);
      if (error.response?.data) {
        console.error('Detalles del error:', error.response.data);
      }
      throw error;
    }
  },

  // Actualizar un lote de producto
  update: async (id: number, lote: Partial<LoteProducto>) => {
    try {
      const loteFormateado = {
        productoTerminadoId: lote.productoTerminadoId ? Number(lote.productoTerminadoId) : undefined,
        codigoLote: lote.codigoLote,
        loteFabricacionId: lote.loteFabricacionId ? Number(lote.loteFabricacionId) : undefined,
        fechaEnvasado: lote.fechaEnvasado ? toDateOnly(lote.fechaEnvasado) : undefined,
        fechaOptimoConsumo: lote.fechaOptimoConsumo ? toDateOnly(lote.fechaOptimoConsumo) : undefined,
        fechaCaducidad: lote.fechaCaducidad ? toDateOnly(lote.fechaCaducidad) : undefined,
        cantidad: lote.cantidad ? Number(lote.cantidad) : undefined,
        cantidadDisponible: lote.cantidadDisponible ? Number(lote.cantidadDisponible) : undefined,
        estado: lote.estado,
        ubicacionFisica: lote.ubicacionFisica,
        notas: lote.notas,
      };

      const response = await apiClient.put(`${PREFIX}/${id}`, loteFormateado);
      return response.data.data;
    } catch (error: any) {
      console.error('Error al actualizar lote:', error);
      if (error.response?.data) {
        console.error('Detalles del error:', error.response.data);
      }
      throw error;
    }
  },

  // Eliminar un lote de producto
  delete: async (id: number) => {
    try {
      const response = await apiClient.delete(`${PREFIX}/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error al eliminar lote:', error);
      if (error.response?.data) {
        console.error('Detalles del error:', error.response.data);
      }
      throw error;
    }
  },

  // Obtener lotes por producto terminado
  getByProductoTerminado: async (productoTerminadoId: number) => {
    try {
      const response = await apiClient.get(`/api/v1/inventario/productos/${productoTerminadoId}/lotes`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error al obtener lotes por producto:', error);
      if (error.response?.data) {
        console.error('Detalles del error:', error.response.data);
      }
      throw error;
    }
  },
}; 