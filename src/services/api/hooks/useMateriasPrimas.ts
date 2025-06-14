import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materiasPrimasApi, type MateriaPrima } from '@/services/api/materias-primas';

interface MateriasPrimasParams {
  page?: number;
  limit?: number;
  estado?: string;
}

// Define un tipo para la respuesta esperada de la API, que incluye paginación
interface PaginatedMateriasPrimasResponse {
  items: MateriaPrima[];
  total: number;
  page: number;
  limit: number;
  // Agrega aquí cualquier otra propiedad de paginación que tu API devuelva
}

// Hook para obtener materias primas
export const useGetMateriasPrimas = (params: MateriasPrimasParams = {}) => {
  const { page = 1, limit = 10, estado } = params;
  return useQuery<PaginatedMateriasPrimasResponse, Error>({
    queryKey: ['materiasPrimas', { page, limit, estado }],
    queryFn: () => materiasPrimasApi.getAll(page, limit, estado),
    
    // Opcional: mantener datos anteriores mientras se cargan nuevos datos
    // keepPreviousData: true,
  });
};

// Hook para obtener una materia prima por ID
export const useGetMateriaPrima = (id: number) => {
  return useQuery<MateriaPrima, Error>({
    queryKey: ['materiasPrimas', id],
    queryFn: () => materiasPrimasApi.getById(id),
    enabled: !!id,
  });
};

// Hook para crear una nueva materia prima
export const useCrearMateriaPrima = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (materiaPrima: Omit<MateriaPrima, 'id'>) => materiasPrimasApi.create(materiaPrima),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiasPrimas'] });
    },
  });
};

// Hook para actualizar una materia prima
export const useActualizarMateriaPrima = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, materiaPrima }: { id: number; materiaPrima: Partial<MateriaPrima> }) =>
      materiasPrimasApi.update(id, materiaPrima),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiasPrimas'] });
    },
  });
};

// Hook para eliminar una materia prima
export const useEliminarMateriaPrima = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => materiasPrimasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiasPrimas'] });
    },
  });
};