import apiClient from "@/lib/api-client";
import { AxiosError } from "axios";

const PREFIX = '/api/v1/inventario/materias-primas';

// Función para convertir fechas a formato ISO-8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
const toISODate = (dateStr?: string | null) => {
  if (!dateStr) return null;
  // Si ya está en formato ISO-8601, no modificar
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z?/.test(dateStr)) return dateStr;
  // Si viene solo la fecha, agregar la hora a las 00:00:00.000Z
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return `${dateStr}T00:00:00.000Z`;
  // Si viene con T pero sin Z, agregar Z
  if (dateStr.includes('T') && !dateStr.endsWith('Z')) return `${dateStr}Z`;
  return dateStr;
};

export interface LoteMateriaPrima {
  id?: number;
  materiaPrimaId: number;
  codigoLote?: string;
  proveedorId: number;
  fechaRecepcion: string;
  fechaProduccion?: string | null;
  fechaCaducidad?: string | null;
  cantidad: number;
  cantidadDisponible?: number;
  precio?: number | null;
  ordenCompraId?: number | null;
  estado?: 'Disponible' | 'Agotado' | 'Caducado' | 'Reservado' | 'Bloqueado';
  notas?: string | null;
  unidadMedida?: string;
  ubicacion?: string;
}

export const lotesMateriaPrimaApi = {
  // Obtener todos los lotes
  getAll: async (estado?: string) => {
    try {
      const response = await apiClient.get(`${PREFIX}/lotes`, {
        params: { estado }
      });
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error al obtener lotes:', error);
      throw error;
    }
  },

  // Crear un nuevo lote
  create: async (lote: Omit<LoteMateriaPrima, 'id'>) => {
    try {
      
      const loteFormateado = {
        materiaPrimaId: Number(lote.materiaPrimaId),
        codigoLote: lote.codigoLote,
        proveedorId: Number(lote.proveedorId),
        fechaRecepcion: toISODate(lote.fechaRecepcion),
        cantidad: Number(lote.cantidad),
        cantidadDisponible: lote.cantidadDisponible !== undefined ? Number(lote.cantidadDisponible) : Number(lote.cantidad),
        precio: lote.precio !== undefined ? Number(lote.precio) : null,
        ordenCompraId: lote.ordenCompraId !== undefined ? Number(lote.ordenCompraId) : null,
        estado: lote.estado || 'Disponible',
        notas: lote.notas || null,
        fechaProduccion: toISODate(lote.fechaProduccion),
        fechaCaducidad: toISODate(lote.fechaCaducidad)
      };

      // Validaciones previas
      if (!loteFormateado.materiaPrimaId || loteFormateado.materiaPrimaId < 1) {
        throw new Error('El ID de materia prima es requerido y debe ser mayor a 0');
      }
      if (!loteFormateado.proveedorId || loteFormateado.proveedorId < 1) {
        throw new Error('El ID de proveedor es requerido y debe ser mayor a 0');
      }
      if (!loteFormateado.fechaRecepcion) {
        throw new Error('La fecha de recepción es requerida');
      }
      if (!loteFormateado.cantidad || loteFormateado.cantidad <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      const response = await apiClient.post(`${PREFIX}/lotes`, loteFormateado);
      
      return response.data;
    } catch (error: unknown) {
      console.error('Error al guardar lote:', error);
      if (error instanceof AxiosError && error.response?.data) {
        console.error('Detalles del error:', error.response.data);
      }
      throw error;
    }
  },

  // Obtener un lote por ID
  getById: async (id: number) => {
    try {
      const response = await apiClient.get(`${PREFIX}/lotes/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error al obtener lote por ID:', error);
      throw error;
    }
  },

  // Actualizar un lote
  update: async (id: number, lote: Partial<LoteMateriaPrima>) => {
    try {
      const loteFormateado = {
        materiaPrimaId: lote.materiaPrimaId ? Number(lote.materiaPrimaId) : undefined,
        // codigoLote: lote.codigoLote,
        proveedorId: lote.proveedorId ? Number(lote.proveedorId) : undefined,
        fechaRecepcion: lote.fechaRecepcion ? toISODate(lote.fechaRecepcion) : undefined,
        fechaProduccion: lote.fechaProduccion ? toISODate(lote.fechaProduccion) : undefined,
        fechaCaducidad: lote.fechaCaducidad ? toISODate(lote.fechaCaducidad) : undefined,
        cantidad: lote.cantidad ? Number(lote.cantidad) : undefined,
        cantidadDisponible: lote.cantidadDisponible ? Number(lote.cantidadDisponible) : undefined,
        precio: lote.precio !== undefined ? Number(lote.precio) : undefined,
        ordenCompraId: lote.ordenCompraId ? Number(lote.ordenCompraId) : undefined,
        // estado: lote.estado,
        notas: lote.notas
      };

      const response = await apiClient.put(`${PREFIX}/lotes/${id}`, loteFormateado);
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error al actualizar lote:', error);
      throw error;
    }
  },

  // Eliminar un lote
  delete: async (id: number) => {
    try {
      const response = await apiClient.delete(`${PREFIX}/lotes/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error al eliminar lote:', error);
      throw error;
    }
  },

  // Obtener lotes por materia prima
  getByMateriaPrima: async (materiaPrimaId: number) => {
    try {
      const response = await apiClient.get(`${PREFIX}/${materiaPrimaId}/lotes`);
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error al obtener lotes por materia prima:', error);
      throw error;
    }
  },

  // Obtener lotes por proveedor
  getByProveedor: async (proveedorId: number) => {
    try {
      const response = await apiClient.get(`${PREFIX}/lotes/proveedor/${proveedorId}`);
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error al obtener lotes por proveedor:', error);
      throw error;
    }
  }
}; 
