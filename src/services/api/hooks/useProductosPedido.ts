import { useQuery } from '@tanstack/react-query';
import { productosTerminadosApi, type ProductoTerminado } from '../productos-terminados';

export const useGetProductosPedido = () => {
  return useQuery<ProductoTerminado[], Error>({
    queryKey: ['productosPedido'],
    queryFn: () => productosTerminadosApi.getAll({ estado: 'Activo' }),
    select: (data) => data.filter(producto => 
      producto.estado === 'Activo' && 
      Number(producto.stockActual) > 0
    ),
  });
}; 