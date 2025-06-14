import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ventasApi, type Venta } from '../ventas';
import { toast } from 'sonner';
import { AxiosResponse, AxiosError } from 'axios';

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface ErrorResponse {
  error: string;
}

export function useGetVentas() {
  return useQuery({
    queryKey: ['ventas'],
    queryFn: () => ventasApi.getAll().then((r: AxiosResponse<ApiResponse<Venta[]>>) => r.data.data),
  });
}

export function useGetVenta(id: number) {
  return useQuery({
    queryKey: ['venta', id],
    queryFn: () => ventasApi.getById(id).then((r: AxiosResponse<ApiResponse<Venta>>) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateVenta() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Venta, 'id'>) => ventasApi.create(data).then((r: AxiosResponse<ApiResponse<Venta>>) => r.data.data),
    onSuccess: () => {
      toast.success('Venta creada correctamente');
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
    onError: (error) => {
      toast.error('Error al crear la venta');
      console.error(error);
    },
  });
}

export function useUpdateVenta() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Venta> }) => 
      ventasApi.update(id, data).then((r: AxiosResponse<ApiResponse<Venta>>) => r.data.data),
    onSuccess: () => {
      toast.success('Venta actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
    onError: (error) => {
      toast.error('Error al actualizar la venta');
      console.error(error);
    },
  });
}

export function useDeleteVenta() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => ventasApi.delete(id).then((r: AxiosResponse<ApiResponse<Venta>>) => r.data.data),
    onSuccess: () => {
      toast.success('Venta eliminada correctamente');
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
    onError: (error) => {
      toast.error('Error al eliminar la venta');
      console.error(error);
    },
  });
}

export function useCambiarEstadoVenta() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) => 
      ventasApi.cambiarEstado(id, estado).then((r: AxiosResponse<ApiResponse<Venta>>) => r.data.data),
    onSuccess: () => {
      toast.success('Estado de venta actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.error || error.message;
      
      if (error.response?.status === 400) {
        toast.error('No se puede cambiar el estado de la venta porque el pedido asociado no lo permite');
      } else {
        toast.error(`Error al actualizar el estado de la venta: ${errorMessage}`);
      }
      console.error('Error al cambiar estado de venta:', error);
    },
  });
} 