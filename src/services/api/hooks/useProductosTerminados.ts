import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productosTerminadosApi, type ProductoTerminado } from '@/services/api/productos-terminados';

interface ProductosTerminadosParams {
  codigo?: string;
  nombre?: string;
  estilo?: string;
  presentacion?: string;
  estado?: string;
  stockBajo?: boolean;
  // Agrega aquí cualquier otro parámetro que tu API acepte para filtrar productos terminados
}

export const useGetProductosTerminados = (params: ProductosTerminadosParams = {}) => {
  return useQuery<ProductoTerminado[], Error>({
    // Si la API devuelve una estructura más compleja (ej. con paginación), ajusta el tipo aquí y en queryFn
    // queryKey debe ser único para esta consulta y reflejar los parámetros
    queryKey: ['productosTerminados', params],
    queryFn: () => productosTerminadosApi.getAll(params),
    // Opcional: mantener datos anteriores mientras se cargan nuevos datos
    //keepPreviousData: true,
  });
};

// Hook específico para obtener productos con stock bajo
export const useGetProductosStockBajo = () => {
  return useQuery<ProductoTerminado[], Error>({
    queryKey: ['productosStockBajo'],
    queryFn: productosTerminadosApi.getStockBajo,
  });
};

export function useGetProductoTerminado(id: number) {
  return useQuery({
    queryKey: ['productos-terminados', id],
    queryFn: async () => {
      const response = await productosTerminadosApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCrearProductoTerminado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productoTerminado: Omit<ProductoTerminado, 'id'>) => {
      const response = await productosTerminadosApi.create(productoTerminado);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos-terminados'] });
    },
  });
}

export function useActualizarProductoTerminado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, productoTerminado }: { id: number; productoTerminado: Partial<ProductoTerminado> }) => {
      const response = await productosTerminadosApi.update(id, productoTerminado);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos-terminados'] });
    },
  });
}

export function useEliminarProductoTerminado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await productosTerminadosApi.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos-terminados'] });
    },
  });
}