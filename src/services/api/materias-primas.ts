import apiClient from "@/lib/api-client";

const PREFIX = '/api/v1/inventario/materias-primas';

export interface MateriaPrima {
  id?: number;
  codigo: string;
  nombre: string;
  tipo: string;
  subtipo: string | null;
  unidadMedida: string;
  stockActual: string;
  stockMinimo: string;
  ubicacionFisica: string | null;
  atributosEspecificos?: unknown | null;
  estado: string;
  notas: string | null;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export const materiasPrimasApi = {
  // Obtener todas las materias primas
  getAll: async (page = 1, limit = 10, estado?: string) => {
    try {
      const response = await apiClient.get(`${PREFIX}`, {
        params: { page, limit, estado }
      });
      // Normalizar la respuesta para que siempre tenga 'items'
      if (Array.isArray(response.data)) {
        return { items: response.data, total: response.data.length, page, limit };
      }
      if (Array.isArray(response.data?.data)) {
        return { items: response.data.data, total: response.data.data.length, page, limit };
      }
      if (Array.isArray(response.data?.items)) {
        return response.data;
      }
      return { items: [], total: 0, page, limit };
    } catch (error: any) {
      console.error('Error al obtener materias primas:', error);
      throw error;
    }
  },

  // Crear una nueva materia prima
  create: async (materiaPrima: any) => {
    try {
      const materiaPrimaFormateada = {
        nombre: materiaPrima.nombre,
        tipo: materiaPrima.tipo,
        subtipo: typeof materiaPrima.subtipo === 'string' ? materiaPrima.subtipo : "",
        unidadMedida: materiaPrima.unidadMedida,
        stockMinimo: Number(materiaPrima.stockMinimo),
        ubicacionFisica: materiaPrima.ubicacionFisica,
        atributosEspecificos: materiaPrima.atributosEspecificos,
        notas: materiaPrima.notas,
      };
      if (!materiaPrimaFormateada.nombre) {
        throw new Error('El nombre es requerido');
      }
      if (!materiaPrimaFormateada.tipo) {
        throw new Error('El tipo es requerido');
      }
      if (!materiaPrimaFormateada.unidadMedida) {
        throw new Error('La unidad de medida es requerida');
      }
      if (materiaPrimaFormateada.stockMinimo === undefined || materiaPrimaFormateada.stockMinimo < 0) {
        throw new Error('El stock mínimo debe ser mayor o igual a 0');
      }

      const response = await apiClient.post(`${PREFIX}`, materiaPrimaFormateada);
      return response.data;
    } catch (error: any) {
      console.error('Error al guardar materia prima:', error);
      if (error.response?.data) {
        console.error('Detalles del error:', error.response.data);
      }
      throw error;
    }
  },

  // Obtener una materia prima por ID
  getById: async (id: number) => {
    try {
      const response = await apiClient.get(`${PREFIX}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener materia prima por ID:', error);
      throw error;
    }
  },

  // Actualizar una materia prima
  update: async (id: number, materiaPrima: Partial<MateriaPrima>) => {
    try {
      // Solo enviar los campos que la API espera y con los tipos correctos
      const materiaPrimaFormateada = {
        nombre: materiaPrima.nombre,
        tipo: materiaPrima.tipo,
        subtipo: materiaPrima.subtipo,
        unidadMedida: materiaPrima.unidadMedida,
        stockMinimo: materiaPrima.stockMinimo !== undefined ? Number(materiaPrima.stockMinimo) : undefined,
        ubicacionFisica: materiaPrima.ubicacionFisica,
        atributosEspecificos: materiaPrima.atributosEspecificos,
        estado: materiaPrima.estado,
        notas: materiaPrima.notas,
      };
      const response = await apiClient.put(`${PREFIX}/${id}`, materiaPrimaFormateada);
      return response.data;
    } catch (error: any) {
      console.error('Error al actualizar materia prima:', error);
      throw error;
    }
  },

  // Eliminar una materia prima
  delete: async (id: number) => {
    try {
      const response = await apiClient.delete(`${PREFIX}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error al eliminar materia prima:', error);
      throw error;
    }
  }
}; 