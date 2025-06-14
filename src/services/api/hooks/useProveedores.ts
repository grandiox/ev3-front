import { useQuery } from '@tanstack/react-query';
import { proveedoresApi, type Proveedor } from '@/services/api/proveedores';

export const useGetProveedores = () => {
  return useQuery<Proveedor[], Error>({
    queryKey: ['proveedores'],
    queryFn: proveedoresApi.getAll,
  });
};