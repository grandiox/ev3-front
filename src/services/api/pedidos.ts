import apiClient from '@/lib/api-client';
import { ProductoTerminado } from './productos-terminados';
import { Cliente } from './clientes';

const PREFIX = '/api/v1/comercial/pedidos';

export interface DetallePedido {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
  subtotal: number;
  producto?: ProductoTerminado;
  unidadMedida?: string;
  notas?: string;
}

export interface Pedido {
  id?: number;
  codigo?: string;
  clienteId: number;
  cliente?: Cliente;
  fechaPedido: string;
  fechaEntregaProgramada: string;
  canal: string;
  estado?: string;
  detalles: DetallePedido[];
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

export interface PedidoResponse {
  success: boolean;
  data: Pedido;
}

export interface PedidosResponse {
  success: boolean;
  data: Pedido[];
}

export interface PedidosQueryParams {
  clienteId?: number;
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  busqueda?: string;
  page?: number;
  limit?: number;
}

export const pedidosApi = {
  // Obtener todos los pedidos
  getAll: async (params?: PedidosQueryParams) => {
    try {
      const response = await apiClient.get<PedidosResponse>(PREFIX, { params });
      return response.data;
    } catch (error: unknown) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  },

  // Obtener un pedido por ID
  getById: async (id: number) => {
    try {
      const response = await apiClient.get<PedidoResponse>(`${PREFIX}/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al obtener pedido por ID:', error);
      throw error;
    }
  },

  // Crear un nuevo pedido
  create: async (pedido: Omit<Pedido, 'id' | 'codigo' | 'estado' | 'fechaCreacion' | 'fechaModificacion' | 'empresaId'>) => {
    try {
      const pedidoFormateado = {
        clienteId: Number(pedido.clienteId),
        fechaPedido: pedido.fechaPedido,
        fechaEntregaProgramada: pedido.fechaEntregaProgramada,
        canal: pedido.canal,
        detalles: pedido.detalles.map(detalle => ({
          productoId: Number(detalle.productoId),
          cantidad: Number(detalle.cantidad),
          unidadMedida: detalle.unidadMedida || 'unidades',
          precioUnitario: Number(detalle.precioUnitario),
          descuento: detalle.descuento ? Number(detalle.descuento) : 0,
          subtotal: Number(detalle.subtotal),
          notas: detalle.notas || ''
        })),
        subtotal: Number(pedido.subtotal),
        descuento: Number(pedido.descuento),
        impuestos: Number(pedido.impuestos),
        total: Number(pedido.total),
        usuarioRegistroId: pedido.usuarioRegistroId,
        notas: pedido.notas
      };

      // Validaciones previas
      if (!pedidoFormateado.clienteId || pedidoFormateado.clienteId < 1) {
        throw new Error('El ID de cliente es requerido y debe ser mayor a 0');
      }
      if (!pedidoFormateado.canal) {
        throw new Error('El canal de venta es requerido');
      }
      if (!pedidoFormateado.fechaPedido) {
        throw new Error('La fecha de pedido es requerida');
      }
      if (!pedidoFormateado.fechaEntregaProgramada) {
        throw new Error('La fecha de entrega programada es requerida');
      }
      if (!pedidoFormateado.detalles || pedidoFormateado.detalles.length === 0) {
        throw new Error('El pedido debe tener al menos un detalle');
      }      

      const response = await apiClient.post<PedidoResponse>(PREFIX, pedidoFormateado);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al crear pedido:', error);
      if (typeof error === 'object' && error && 'response' in error && (error as any).response?.data) {
        console.error('Detalles del error:', (error as any).response.data);
      }
      throw error;
    }
  },

  // Actualizar un pedido
  update: async (id: number, pedido: Partial<Pedido>) => {
    try {
      const pedidoFormateado = {
        codigo: pedido.codigo,
        clienteId: Number(pedido.clienteId),
        fechaPedido: pedido.fechaPedido,
        fechaEntregaProgramada: pedido.fechaEntregaProgramada,
        estado: pedido.estado,
        canal: pedido.canal,
        detalles: pedido.detalles?.map(detalle => ({
          productoId: Number(detalle.productoId),
          cantidad: Number(detalle.cantidad),
          unidadMedida: detalle.unidadMedida || 'unidades',
          precioUnitario: Number(detalle.precioUnitario),
          descuento: Number(detalle.descuento) || 0,
          subtotal: Number(detalle.subtotal),
          notas: detalle.notas || ''
        })),
        subtotal: Number(pedido.subtotal),
        descuento: Number(pedido.descuento),
        impuestos: Number(pedido.impuestos),
        total: Number(pedido.total),
        notas: pedido.notas
      };

      const response = await apiClient.put<PedidoResponse>(`${PREFIX}/${id}`, pedidoFormateado);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al actualizar pedido:', error);
      if (typeof error === 'object' && error && 'response' in error && (error as any).response?.data) {
        console.error('Detalles del error:', (error as any).response.data);
      }
      throw error;
    }
  },

  // Eliminar un pedido
  delete: async (id: number) => {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(`${PREFIX}/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al eliminar pedido:', error);
      if (typeof error === 'object' && error && 'response' in error && (error as any).response?.data) {
        console.error('Detalles del error:', (error as any).response.data);
      }
      throw error;
    }
  },

  // Cambiar estado de un pedido
  cambiarEstado: async (id: number, data: { estado: string }) => {
    try {
      const response = await apiClient.patch(`${PREFIX}/${id}/estado`, data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al cambiar estado del pedido:', error);
      if (typeof error === 'object' && error && 'response' in error && (error as any).response?.data) {
        console.error('Detalles del error:', (error as any).response.data);
      }
      throw error;
    }
  }
}; 