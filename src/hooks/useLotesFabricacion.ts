import { useState, useCallback } from 'react';
import { produccionService } from '../services/produccionService';

export const useLotesFabricacion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLoteById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getLoteById(id);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener el lote de fabricación');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const registrarConsumo = useCallback(async (loteId: number, consumo: {
    materiaPrimaId: number;
    loteMateriaPrimaId?: number;
    cantidadConsumida: number;
    unidadMedida?: string;
    etapaProduccion?: string;
    observaciones?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.registrarConsumo(loteId, consumo);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el consumo');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const finalizarLote = useCallback(async (loteId: number, params: {
    cantidadFinal: number;
    rendimientoReal?: number;
    parametrosFinales?: any[];
    observaciones?: string;
    calificacionCalidad?: 'A' | 'B' | 'C' | 'Rechazado';
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.finalizarLote(loteId, params);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al finalizar el lote');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrazabilidad = useCallback(async (loteId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getTrazabilidad(loteId);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener la trazabilidad');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getConsumos = useCallback(async (loteId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getConsumos(loteId);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener los consumos');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getEficiencia = useCallback(async (loteId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getEficiencia(loteId);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener la eficiencia');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrazabilidadInversa = useCallback(async (loteId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getTrazabilidadInversa(loteId);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener la trazabilidad inversa');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getLoteById,
    registrarConsumo,
    finalizarLote,
    getTrazabilidad,
    getConsumos,
    getEficiencia,
    getTrazabilidadInversa
  };
}; 