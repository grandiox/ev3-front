import apiClient from '@/lib/api-client';
import { ApiResponse } from '@/lib/api-client';

const PREFIX = '/api/v1/inventario/productos';

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  estilo: string;
  descripcion?: string;
  presentacion: string;
  capacidad: number;
  unidadMedida: string;
  stockActual: number;
  stockMinimo: number;
  precioBase?: number;
  estado: string;
  imagen?: string;
  notas?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface ProductosResponse extends ApiResponse<Producto[]> {}

export const productosApi = {
  getAll: async (): Promise<ProductosResponse> => {
    const response = await apiClient.get<ProductosResponse>(PREFIX);
    return response.data;
  },

  getById: async (id: number): Promise<Producto> => {
    const response = await apiClient.get<ApiResponse<Producto>>(`${PREFIX}/${id}`);
    return response.data.data;
  }
}; 