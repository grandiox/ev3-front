import { useQuery } from '@tanstack/react-query';
import { ordenesCompraApi, type OrdenCompra } from '@/services/api/ordenes-compra';

export const useGetOrdenesCompra = () => {
  return useQuery<OrdenCompra[], Error>({
    queryKey: ['ordenesCompra'],
    queryFn: ordenesCompraApi.getAll,
  });
};