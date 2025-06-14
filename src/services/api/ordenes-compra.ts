import apiClient from "@/lib/api-client";

const PREFIX = '/api/v1/administrativo/ordenes-compra';

export interface OrdenCompra {
  id: number;
  codigo: string;
  numero?: string;
}

export const ordenesCompraApi = {
  getAll: async () => {
    try {
      const response = await apiClient.get(PREFIX);
      return response.data.data;
    } catch (error: any) {
      console.error('Error al obtener órdenes de compra:', error);
      throw error;
    }
  },
};