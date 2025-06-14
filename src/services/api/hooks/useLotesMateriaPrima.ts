import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lotesMateriaPrimaApi, LoteMateriaPrima } from '../lotes-materia-prima';

interface LotesMateriaPrimaParams {
  page?: number;
  limit?: number;
  estado?: string;
}

// Hook para obtener todos los lotes
export const useGetLotesMateriaPrima = (params: LotesMateriaPrimaParams) => {
  return useQuery({
    queryKey: ['lotesMateriaPrima', params],
    queryFn: () => lotesMateriaPrimaApi.getAll(params.estado),
  });
};

// Hook para obtener un lote por ID
export const useGetLoteMateriaPrima = (id: number) => {
  return useQuery({
    queryKey: ['lotesMateriaPrima', id],
    queryFn: () => lotesMateriaPrimaApi.getById(id),
    enabled: !!id
  });
};

// Hook para crear un nuevo lote
export const useCrearLoteMateriaPrima = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lote: Omit<LoteMateriaPrima, 'id'>) => lotesMateriaPrimaApi.create(lote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotesMateriaPrima'] });
    }
  });
};

// Hook para actualizar un lote
export const useActualizarLoteMateriaPrima = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lote }: { id: number; lote: Partial<LoteMateriaPrima> }) => 
      lotesMateriaPrimaApi.update(id, lote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotesMateriaPrima'] });
    }
  });
};

// Hook para eliminar un lote
export const useEliminarLoteMateriaPrima = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => lotesMateriaPrimaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotesMateriaPrima'] });
    }
  });
};

// Hook para obtener lotes por materia prima
export const useGetLotesPorMateriaPrima = (materiaPrimaId: number) => {
  return useQuery({
    queryKey: ['lotesMateriaPrima', 'materiaPrima', materiaPrimaId],
    queryFn: () => lotesMateriaPrimaApi.getByMateriaPrima(materiaPrimaId),
    enabled: !!materiaPrimaId
  });
};

// Hook para obtener lotes por proveedor
export const useGetLotesPorProveedor = (proveedorId: number) => {
  return useQuery({
    queryKey: ['lotesMateriaPrima', 'proveedor', proveedorId],
    queryFn: () => lotesMateriaPrimaApi.getByProveedor(proveedorId),
    enabled: !!proveedorId
  });
};