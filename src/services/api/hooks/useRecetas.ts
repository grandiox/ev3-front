import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recetasApi, type Receta, RecetasError, type UpdateRecetaDto } from '@/services/api/recetas';
import { toast } from 'sonner';
import { CloneRecetaDto } from '../recetas'
import { AxiosError } from 'axios';

interface UpdateRecetaParams {
  id: number;
  data: UpdateRecetaDto;
}

export const useRecetas = () => {
  return useQuery<Receta[], RecetasError>({
    queryKey: ['recetas'],
    queryFn: () => recetasApi.getAll().then(response => response.data),
  });
};

export const useReceta = (id: number) => {
  return useQuery<Receta, RecetasError>({
    queryKey: ['receta', id],
    queryFn: () => recetasApi.getById(id).then(response => response.data)
  });
};

export const useCrearReceta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recetasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recetas'] });
      toast.success('Receta creada correctamente');
    },
    onError: (error) => {
      console.error('Error creating recipe:', error);
      toast.error(error.message || 'Error al crear la receta');
    }
  });
};

export const useActualizarReceta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateRecetaParams) => recetasApi.update(id, data).then(response => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recetas'] });
      toast.success('Receta actualizada correctamente');
    },
    onError: (error) => {
      console.error('Error updating recipe:', error);
      toast.error(error.message || 'Error al actualizar la receta');
    }
  });
};

export const useActualizarEstadoReceta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { estado: string } }) => recetasApi.updateEstado(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recetas'] });
      queryClient.invalidateQueries({ queryKey: ['receta', id] });
    },
  });
};

export const useEliminarReceta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recetasApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recetas'] });
      toast.success('Receta eliminada correctamente');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Error deleting recipe:', error);
      
      // Handle different types of errors
      if (error.response?.status === 500) {
        toast.error('No se puede eliminar la receta porque está siendo utilizada en otras operaciones. Por favor, verifica que no esté asociada a órdenes de producción o inventario.');
      } else if (error.response?.status === 404) {
        toast.error('La receta no existe o ya ha sido eliminada.');
      } else if (error.response?.status === 403) {
        toast.error('No tienes permisos para eliminar esta receta.');
      } else {
        toast.error(error.response?.data?.message || 'Error al eliminar la receta. Por favor, intente nuevamente.');
      }
    }
  });
};

export const useClonarReceta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CloneRecetaDto }) => 
      recetasApi.clone(id, data).then(response => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recetas'] });
      toast.success('Receta clonada correctamente');
    },
    onError: (error) => {
      console.error('Error cloning recipe:', error);
      toast.error(error.message || 'Error al clonar la receta');
    }
  });
};

export const useValidarReceta = () => {
  return useMutation({
    mutationFn: (id: number) => recetasApi.validate(id),
  });
};

export const useCostoReceta = () => {
  return useMutation({
    mutationFn: (id: number) => recetasApi.cost(id),
  });
}; 