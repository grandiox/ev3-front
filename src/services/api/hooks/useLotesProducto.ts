import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lotesProductoApi, type LoteProducto } from '../lotes-producto';

// Hook para obtener todos los lotes de productos
export const useGetLotesProducto = () => {
  return useQuery<LoteProducto[], Error>({
    queryKey: ['lotesProducto'],
    queryFn: lotesProductoApi.getAll,
  });
};

// Hook para obtener un lote específico por ID
export const useGetLoteProducto = (id: number) => {
  return useQuery<LoteProducto, Error>({
    queryKey: ['lotesProducto', id],
    queryFn: () => lotesProductoApi.getById(id),
    enabled: !!id,
  });
};

// Hook para obtener lotes por producto terminado
export const useGetLotesPorProductoTerminado = (productoTerminadoId: number) => {
  return useQuery<LoteProducto[], Error>({
    queryKey: ['lotesProducto', 'producto', productoTerminadoId],
    queryFn: () => lotesProductoApi.getByProductoTerminado(productoTerminadoId),
    enabled: !!productoTerminadoId,
  });
};

// Hook para crear un nuevo lote de producto
export const useCrearLoteProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lote: Omit<LoteProducto, 'id'>) => lotesProductoApi.create(lote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotesProducto'] });
    },
  });
};

// Hook para actualizar un lote de producto
export const useActualizarLoteProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lote }: { id: number; lote: Partial<LoteProducto> }) =>
      lotesProductoApi.update(id, lote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotesProducto'] });
    },
  });
};

// Hook para eliminar un lote de producto
export const useEliminarLoteProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => lotesProductoApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotesProducto'] });
    },
  });
}; 