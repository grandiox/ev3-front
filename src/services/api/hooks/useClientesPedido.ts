import { useQuery } from '@tanstack/react-query';
import { clientesApi, type Cliente } from '../clientes';

export const useGetClientesPedido = () => {
  return useQuery<Cliente[], Error>({
    queryKey: ['clientesPedido'],
    queryFn: async () => {
      const response = await clientesApi.getAll();
      return response.data;
    },
    select: (data) => data.filter(cliente => 
      cliente.estado === 'Activo'
    ),
  });
}; 