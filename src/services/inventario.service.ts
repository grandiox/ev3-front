import apiClient from '@/lib/api-client';

const API_URL = '/api/v1/inventario';

class InventarioService {
  // Obtener elementos según el tipo
  async getElementosByTipo(tipoElemento: string) {
    try {
      let endpoint = '';
      switch (tipoElemento) {
        case 'MateriaPrima':
          endpoint = `${API_URL}/materias-primas`;
          break;
        case 'ProductoTerminado':
          endpoint = `${API_URL}/productos`;
          break;
        default:
          throw new Error('Tipo de elemento no válido');
      }
      const response = await apiClient.get(endpoint);
      if (!response.data) {
        return [];
      }
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      console.warn('La respuesta del servidor no tiene el formato esperado:', response.data);
      return [];
    } catch (error: any) {
      console.error('Error al obtener elementos:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || 'Error al obtener elementos del inventario');
      } else if (error.request) {
        throw new Error('No se recibió respuesta del servidor');
      } else {
        throw new Error(error.message || 'Error al procesar la petición');
      }
    }
  }

  // Obtener lotes según el tipo de elemento y su ID
  async getLotesByElementoId(tipoElemento: string, elementoId: number) {
    try {
      let endpoint = '';
      switch (tipoElemento) {
        case 'MateriaPrima':
          endpoint = `${API_URL}/materias-primas/${elementoId}/lotes`;
          break;
        case 'ProductoTerminado':
          endpoint = `${API_URL}/productos/${elementoId}/lotes`;
          break;
        default:
          return [];
      }
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener lotes:', error);
      throw error;
    }
  }

  // Obtener referencias según el tipo de movimiento
  async getReferenciasByTipoMovimiento(tipoMovimiento: string) {
    try {
      let endpoint = '';
      switch (tipoMovimiento) {
        case 'ENTRADA_PEDIDO':
          endpoint = '/v1/pedidos';
          break;
        case 'SALIDA_VENTA':
          endpoint = '/v1/ventas';
          break;
        case 'AJUSTE':
          endpoint = `${API_URL}/ajustes`;
          break;
        default:
          return [];
      }
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener referencias:', error);
      throw error;
    }
  }

  // Crear movimiento de inventario
  async createMovimiento(data: any) {
    try {
      let endpoint = '';
      switch (data.tipoElemento) {
        case 'MateriaPrima':
          endpoint = `${API_URL}/materias-primas/movimientos`;
          break;
        case 'ProductoTerminado':
          endpoint = `${API_URL}/productos/movimientos`;
          break;
        default:
          throw new Error('Tipo de elemento no válido');
      }
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      throw error;
    }
  }
}

export const inventarioService = new InventarioService(); 