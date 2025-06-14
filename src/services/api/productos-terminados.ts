import apiClient from "@/lib/api-client";

const PREFIX = '/api/v1/inventario/productos';

export interface ProductoTerminado {
  id?: number;
  codigo: string;
  nombre: string;
  estilo: string;
  presentacion: string;
  capacidad: string;
  unidadMedida: string;
  stockMinimo: string;
  stockActual: string;
  descripcion?: string | null;
  precioBase?: string;
  estado?: string;
  imagen?: string | null;
  notas?: string | null;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export const productosTerminadosApi = {
  // Obtener todos los productos terminados
  getAll: async (params?: {
    codigo?: string;
    nombre?: string;
    estilo?: string;
    presentacion?: string;
    estado?: string;
    stockBajo?: boolean;
  }) => {
    try {
      const response = await apiClient.get(`${PREFIX}`, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener productos terminados:', error);
      throw error;
    }
  },

  // Obtener productos con stock bajo
  getStockBajo: async () => {
    try {
      const response = await apiClient.get(`${PREFIX}/stock-bajo`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener productos con stock bajo:', error);
      throw error;
    }
  },

  // Obtener productos por caducar
  getPorCaducar: async (diasUmbral?: number) => {
    try {
      const response = await apiClient.get(`${PREFIX}/por-caducar`, {
        params: { diasUmbral }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener productos por caducar:', error);
      throw error;
    }
  },

  // Obtener un producto terminado por ID
  getById: async (id: number) => {
    try {
      const response = await apiClient.get(`${PREFIX}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener producto terminado por ID:', error);
      throw error;
    }
  },

  // Crear un nuevo producto terminado
  create: async (producto: Omit<
    ProductoTerminado,
    'codigo' | 'stockActual'
  >) => {
    try {
      const productoFormateado = {
        nombre: producto.nombre,
        estilo: producto.estilo,
        presentacion: producto.presentacion,
        capacidad: parseInt(producto.capacidad.toString(), 10),
        unidadMedida: producto.unidadMedida,
        stockMinimo: parseInt(producto.stockMinimo.toString(), 10),
        descripcion: producto.descripcion,
        precioBase: parseInt(producto.precioBase?.toString() || '0', 10),
        estado: producto.estado || 'Activo',
        imagen: producto.imagen,
        notas: producto.notas
      };

      if (!productoFormateado.nombre) {
        throw new Error('El nombre es requerido');
      }
      if (!productoFormateado.estilo) {
        throw new Error('El estilo es requerido');
      }
      if (!productoFormateado.presentacion) {
        throw new Error('La presentación es requerida');
      }
      if (!productoFormateado.capacidad || productoFormateado.capacidad <= 0) {
        throw new Error('La capacidad debe ser mayor a 0');
      }
      if (!productoFormateado.unidadMedida) {
        throw new Error('La unidad de medida es requerida');
      }
      if (!productoFormateado.stockMinimo || productoFormateado.stockMinimo < 0) {
        throw new Error('El stock mínimo debe ser mayor o igual a 0');
      }

      const response = await apiClient.post(`${PREFIX}`, productoFormateado);
      return response.data;
    } catch (error: any) {
      console.error('Error al guardar producto terminado:', error);
      if (error.response?.data) {
        console.error('Detalles del error:', error.response.data);
      }
      throw error;
    }
  },

  // Actualizar un producto terminado
  update: async (id: number, producto: Partial<ProductoTerminado>) => {
    try {
      const productoFormateado = {
        nombre: producto.nombre,
        estilo: producto.estilo,
        presentacion: producto.presentacion,
        capacidad: producto.capacidad,
        unidadMedida: producto.unidadMedida,
        stockMinimo: producto.stockMinimo,
        stockActual: producto.stockActual,
        descripcion: producto.descripcion,
        precioBase: producto.precioBase,
        estado: producto.estado,
        imagen: producto.imagen,
        notas: producto.notas
      };

      const response = await apiClient.put(`${PREFIX}/${id}`, productoFormateado);
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar producto terminado:', error);
      throw error;
    }
  },

  // Eliminar un producto terminado
  delete: async (id: number) => {
    try {
      const response = await apiClient.delete(`${PREFIX}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al eliminar producto terminado:', error);
      throw error;
    }
  }
}; 