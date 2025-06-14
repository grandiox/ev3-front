import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pedidosApi, type Pedido } from '../pedidos';
import { toast } from 'sonner';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useGetPedidos = () => {
  return useQuery<Pedido[], Error>({
    queryKey: ['pedidos'],
    queryFn: async () => {
      const response = await pedidosApi.getAll();
      return response.data;
    },
  });
};

export const useGetPedido = (id: number) => {
  return useQuery<Pedido, Error>({
    queryKey: ['pedido', id],
    queryFn: async () => {
      const response = await pedidosApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreatePedido = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: pedidosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast.success('Pedido creado exitosamente');
    },
    onError: (error: ApiError) => {
      console.error('Error al crear pedido:', error);
      toast.error(error.response?.data?.message || 'Error al crear el pedido');
    },
  });
};

export const useUpdatePedido = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Pedido> }) =>
      pedidosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast.success('Pedido actualizado exitosamente');
    },
    onError: (error: ApiError) => {
      console.error('Error al actualizar pedido:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el pedido');
    },
  });
};

export const useDeletePedido = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: pedidosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast.success('Pedido eliminado exitosamente');
    },
    onError: (error: ApiError) => {
      console.error('Error al eliminar pedido:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar el pedido');
    },
  });
};

export const useCambiarEstadoPedido = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) => pedidosApi.cambiarEstado(id, { estado }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast.success('Estado actualizado correctamente');
    },
    onError: (error: ApiError) => {
      console.error('Error al cambiar estado del pedido:', error);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Error al cambiar el estado del pedido');
    },
  });
};

export const usePedidoForm = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Pedido, 'id' | 'codigo' | 'estado' | 'fechaCreacion' | 'fechaModificacion' | 'empresaId'>) => {
      if (!data.clienteId || data.clienteId < 1) {
        throw new Error('El ID de cliente es requerido y debe ser mayor a 0');
      }
      if (!data.canal) {
        throw new Error('El canal de venta es requerido');
      }
      if (!data.fechaEntregaProgramada) {
        throw new Error('La fecha de entrega programada es requerida');
      }
      if (!data.detalles || data.detalles.length === 0) {
        throw new Error('El pedido debe tener al menos un detalle');
      }
      if (data.detalles.some(detalle => !detalle.productoId || detalle.productoId < 1)) {
        throw new Error('Todos los detalles deben tener un producto válido');
      }
      if (data.detalles.some(detalle => !detalle.cantidad || detalle.cantidad <= 0)) {
        throw new Error('Todos los detalles deben tener una cantidad válida');
      }
      if (data.detalles.some(detalle => !detalle.precioUnitario || detalle.precioUnitario < 0)) {
        throw new Error('Todos los detalles deben tener un precio válido');
      }

      return pedidosApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast.success('Pedido creado correctamente');
      onSuccess?.();
    },
    onError: (error: ApiError) => {
      console.error('Error al guardar pedido:', error);
      const mensaje = error.response?.data?.message || error.message || 'Error al guardar el pedido';
      toast.error(mensaje);
    },
  });
}; 