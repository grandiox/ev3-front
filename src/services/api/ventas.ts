import apiClient from '@/lib/api-client';
import { ProductoTerminado } from './productos-terminados';
import { Cliente } from './clientes';

export interface DetalleVenta {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
  subtotal: number;
  producto?: ProductoTerminado;
  unidadMedida?: string;
  notas?: string;
}

export interface Venta {
  id?: number;
  codigo?: string;
  clienteId: number;
  cliente?: Cliente;
  fechaVenta: string;
  canal: string;
  estado?: string;
  detalles: DetalleVenta[];
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  usuarioRegistroId?: number;
  notas?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  empresaId?: number;
}

export const ventasApi = {
  getAll: async () => apiClient.get('/api/v1/comercial/ventas'),
  getById: async (id: number) => apiClient.get(`/api/v1/comercial/ventas/${id}`),
  create: async (data: Omit<Venta, 'id'>) => apiClient.post('/api/v1/comercial/ventas', data),
  update: async (id: number, data: Partial<Venta>) => apiClient.put(`/api/v1/comercial/ventas/${id}`, data),
  delete: async (id: number) => apiClient.delete(`/api/v1/comercial/ventas/${id}`),
  cambiarEstado: async (id: number, estado: string) => apiClient.patch(`/api/v1/comercial/ventas/${id}/estado`, { estado }),
}; 