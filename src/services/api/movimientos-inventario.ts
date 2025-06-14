// Servicio para consumir la API de movimientos de inventario
import apiClient from '@/lib/api-client';

const API_URL_MATERIA_PRIMA = '/api/v1/inventario/materias-primas/movimientos';
const API_URL_PRODUCTO_TERMINADO = '/api/v1/inventario/productos/movimientos';

export interface MovimientoInventario {
  id?: number;
  tipoMovimiento: 'Entrada' | 'Salida' | 'Ajuste Positivo' | 'Ajuste Negativo';
  tipoElemento: 'MateriaPrima' | 'ProductoTerminado';
  elementoId: number;
  loteId?: number;
  cantidad: number;
  unidadMedida: string;
  documentoReferencia?: string;
  referenciaId?: number;
  motivo?: string;
  notas?: string | null;
  usuarioId?: number;
  fecha?: string;
}

export interface MovimientosParams {
  tipoElemento?: 'MateriaPrima' | 'ProductoTerminado';
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  request?: unknown;
  message?: string;
}

export const movimientosInventarioApi = {
  // Obtener movimientos (por defecto de materia prima)
  getAll: async (params?: MovimientosParams) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    // Aseguramos que siempre se envíe tipoElemento=MateriaPrima
    const queryParams = { tipoElemento: 'MateriaPrima', ...(params || {}) };
    const response = await apiClient.get('/api/v1/inventario/movimientos?page=1&limit=10', { params: queryParams, headers });
    return response.data;
  },

  // Registrar un nuevo movimiento
  create: async (movimiento: MovimientoInventario) => {
    try {
      let url = API_URL_MATERIA_PRIMA;
      if (movimiento.tipoElemento === 'ProductoTerminado') {
        url = API_URL_PRODUCTO_TERMINADO;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }
      const headers = { Authorization: `Bearer ${token}` };
      
      // Validar datos requeridos
      if (!movimiento.elementoId || !movimiento.cantidad || !movimiento.unidadMedida) {
        throw new Error('Faltan datos requeridos');
      }

      const response = await apiClient.post(url, movimiento, { headers });
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response) {
        // El servidor respondió con un código de error
        throw new Error(apiError.response.data?.message || 'Error al registrar el movimiento');
      } else if (apiError.request) {
        // La petición fue hecha pero no se recibió respuesta
        throw new Error('No se recibió respuesta del servidor');
      } else {
        // Error al configurar la petición
        throw new Error(apiError.message || 'Error al procesar la petición');
      }
    }
  },
}; 