import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client'; // Asumiendo que InventarioService usa el mismo apiClient
import { MateriaPrima } from '../materias-primas';
import { ProductoTerminado } from '../productos-terminados';
import { LoteMateriaPrima } from '../lotes-materia-prima';
import { MovimientoInventario } from '../movimientos-inventario';

const API_URL = '/api/v1/inventario';

// Hook para getElementosByTipo
export const useGetElementosInventario = <T extends MateriaPrima | ProductoTerminado>(
  tipoElemento: T extends MateriaPrima ? 'MateriaPrima' : 'ProductoTerminado',
  enabled: boolean = true
) => {
  return useQuery<T[], Error>({
    queryKey: ['elementosInventario', tipoElemento],
    queryFn: async (): Promise<T[]> => {
      let endpoint = '';
      switch (tipoElemento) {
        case 'MateriaPrima':
          endpoint = `${API_URL}/materias-primas`;
          break;
        case 'ProductoTerminado':
          endpoint = `${API_URL}/productos`;
          break;
        // No se necesita default si tipoElemento está restringido por el tipo condicional
      }
      const response = await apiClient.get<unknown>(endpoint); // Especificar unknown para un manejo más seguro
      
      let rawData: unknown[] = [];
      // Extraer datos de forma robusta, considerando estructuras como { data: [...] } o simplemente [...]
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data && Array.isArray((response.data as { data?: unknown[] }).data)) {
          rawData = (response.data as { data: unknown[] }).data;
        } else if (Array.isArray(response.data)) {
          rawData = response.data; // response.data es directamente el array
        }
      }
      
      // Filtrar elementos nulos o indefinidos y asegurar el tipo T[]
      return rawData.filter(item => item != null) as T[];
    },
    enabled: enabled && !!tipoElemento, // La consulta solo se ejecuta si tipoElemento tiene valor y enabled es true
  });
};

// Hook para getLotesByElementoId
export const useGetLotesPorElemento = <T extends LoteMateriaPrima>
  (tipoElemento: T extends LoteMateriaPrima ? 'MateriaPrima' : 'ProductoTerminado', elementoId: number, enabled: boolean = true) => {
  return useQuery<T[], Error>({
    queryKey: ['lotesPorElemento', tipoElemento, elementoId],
    queryFn: async (): Promise<T[]> => {
      let endpoint = '';
      switch (tipoElemento) {
        case 'MateriaPrima':
          endpoint = `${API_URL}/materias-primas/${elementoId}/lotes`;
          break;
        case 'ProductoTerminado':
          // Asumiendo una ruta similar para productos terminados, ajustar si es necesario
          endpoint = `${API_URL}/productos/${elementoId}/lotes`; 
          break;
        default:
          throw new Error('Tipo de elemento no válido para la consulta de lotes');
      }
      const response = await apiClient.get<unknown>(endpoint); // Especificar unknown para un manejo más seguro
      
      let rawData: unknown[] = [];
      // Extraer datos de forma robusta, considerando estructuras como { data: [...] } o simplemente [...]
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data && Array.isArray((response.data as { data?: unknown[] }).data)) {
          rawData = (response.data as { data: unknown[] }).data;
        } else if (Array.isArray(response.data)) {
          rawData = response.data; // response.data es directamente el array
        }
      }
      
      // Filtrar elementos nulos o indefinidos y asegurar el tipo T[]
      return rawData.filter(item => item != null) as T[];
    },
    enabled: enabled && !!tipoElemento, // La consulta solo se ejecuta si tipoElemento tiene valor y enabled es true
  });
};

// Hook para getMovimientosInventario
export const useGetMovimientosInventario = (params?: any, enabled: boolean = true) => {
  return useQuery<MovimientoInventario[], Error>({
    queryKey: ['movimientosInventario', params],
    queryFn: async (): Promise<MovimientoInventario[]> => {
      const endpoint = `${API_URL}/movimientos`;
      // Aseguramos que siempre se envíe tipoElemento=MateriaPrima por defecto si no se especifica
      const queryParams = { tipoElemento: 'MateriaPrima', ...(params || {}) };
      const response = await apiClient.get<unknown>(endpoint);

      let rawData: unknown[] = [];
      // Extraer datos de forma robusta, considerando estructuras como { data: [...] } o simplemente [...]
      if (response.data && typeof response.data === 'object') {
        if ('data' in response.data && Array.isArray((response.data as { data?: unknown[] }).data)) {
          rawData = (response.data as { data: unknown[] }).data;
        } else if (Array.isArray(response.data)) {
          rawData = response.data; // response.data es directamente el array
        }
      }

      // Filtrar elementos nulos o indefinidos y asegurar el tipo MovimientoInventario[]
      return rawData.filter(item => item != null) as MovimientoInventario[];
    },
    enabled: enabled, // La consulta solo se ejecuta si enabled es true
  });
};