import { useState, useCallback } from 'react';
import { produccionService } from '../services/produccionService';
import {
  ParametroProcesoCreateInput,
  ParametroProcesoUpdateInput,
  ParametroValidationInput,
  ParametroRangeInput,
  ParametroBatchValidationInput,
  ParametroBatchCreateInput} from '../types/produccion';

export const useParametrosProceso = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createParametro = useCallback(async (parametro: ParametroProcesoCreateInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.createParametroProceso(parametro);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el parámetro');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getParametros = useCallback(async (params?: {
    loteFabricacionId?: number;
    ordenProduccionId?: number;
    etapa?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getParametrosProceso(params);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener los parámetros');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getParametroById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getParametroProcesoById(id);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener el parámetro');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateParametro = useCallback(async (id: number, parametro: ParametroProcesoUpdateInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.updateParametroProceso(id, parametro);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el parámetro');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteParametro = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.deleteParametroProceso(id);
      return response.success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el parámetro');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateParametro = useCallback(async (input: ParametroValidationInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.validateParametro(input);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al validar el parámetro');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllRanges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getAllParametroRanges();
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener los rangos');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const setRange = useCallback(async (input: ParametroRangeInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.setParametroRange(input);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al establecer el rango');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateBatch = useCallback(async (input: ParametroBatchValidationInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.validateParametroBatch(input);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al validar los parámetros');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBatch = useCallback(async (input: ParametroBatchCreateInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.createParametroBatch(input);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear los parámetros');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getEstadisticas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getEstadisticasGenerales();
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener las estadísticas');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getResumenEtapa = useCallback(async (loteFabricacionId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getResumenEtapa(loteFabricacionId);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener el resumen de etapa');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTendencia = useCallback(async (parametro: string, etapa: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getTendenciaParametro(parametro, etapa);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener la tendencia');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReporteCalidad = useCallback(async (loteFabricacionId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getReporteCalidad(loteFabricacionId);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener el reporte de calidad');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEtapas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getEtapasProduccion();
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener las etapas');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getParametrosByEtapa = useCallback(async (etapa: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getParametrosByEtapaConfig(etapa);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener los parámetros de la etapa');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getParametrosReceta = useCallback(async (recetaId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getParametrosReceta(recetaId);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener los parámetros de la receta');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getParametrosFueraDeRango = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await produccionService.getParametrosFueraDeRango();
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener los parámetros fuera de rango');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createParametro,
    getParametros,
    getParametroById,
    updateParametro,
    deleteParametro,
    validateParametro,
    getAllRanges,
    setRange,
    validateBatch,
    createBatch,
    getEstadisticas,
    getResumenEtapa,
    getTendencia,
    getReporteCalidad,
    getEtapas,
    getParametrosByEtapa,
    getParametrosReceta,
    getParametrosFueraDeRango
  };
}; 