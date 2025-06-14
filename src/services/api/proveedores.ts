import apiClient from "@/lib/api-client";


const PREFIX = '/api/v1/administrativo/proveedores';

export interface Proveedor {
  id: number;
  nombre: string;
  codigo: string;
}

export const proveedoresApi = {
  getAll: async () => {
    try {
      const response = await apiClient.get(PREFIX);
      return response.data.data;
    } catch (error: any) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  },
}; 