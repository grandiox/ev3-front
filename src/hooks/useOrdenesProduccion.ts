import { useState, useCallback } from 'react';
import { produccionService } from '../services/produccionService';
import { 
  OrdenProduccionCreateInput, 
  OrdenProduccionUpdateInput,
  PlanificarProduccionInput} from '../types/produccion';

export const useOrdenesProduccion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrdenes = useCallback(async (params?: {
    recetaId?: number;
    productoTerminadoId?: number;
    estado?: string;
    usuarioResponsableId?: number;
    fechaDesde?: string;
    fechaHasta?: string;
    busqueda?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getOrdenes(params);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener las órdenes de producción');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrdenById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getOrdenById(id);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener la orden de producción');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrden = useCallback(async (orden: OrdenProduccionCreateInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.createOrden(orden);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la orden de producción');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrden = useCallback(async (id: number, orden: OrdenProduccionUpdateInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.updateOrden(id, orden);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la orden de producción');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrden = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.deleteOrden(id);
      return response.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la orden de producción');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrdenesPendientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getOrdenesPendientes();
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener las órdenes pendientes');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrdenesByUsuario = useCallback(async (usuarioId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getOrdenesByUsuario(usuarioId);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener las órdenes del usuario');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getEstadisticas = useCallback(async (params?: { fechaDesde?: string; fechaHasta?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getEstadisticas(params);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener las estadísticas');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const verificarInventario = useCallback(async (params: { recetaId: number; volumenProgramado: number }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.verificarInventario(params);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el inventario');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const planificarProduccion = useCallback(async (input: PlanificarProduccionInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.planificarProduccion(input);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al planificar la producción');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cambiarEstadoOrden = useCallback(async (id: number, params: {
    nuevoEstado: string;
    fechaInicio?: string;
    fechaFinalizacion?: string;
    notas?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.cambiarEstadoOrden(id, params);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar el estado de la orden');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getOrdenes,
    getOrdenById,
    createOrden,
    updateOrden,
    deleteOrden,
    getOrdenesPendientes,
    getOrdenesByUsuario,
    getEstadisticas,
    verificarInventario,
    planificarProduccion,
    cambiarEstadoOrden
  };
}; 