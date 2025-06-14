import apiClient from '@/lib/api-client';

export interface DashboardInventoryData {
  materiaPrima: {
    stockSano: number;
    stockBajo: number;
  };
  lotesPorCaducar: number;
  productosStock: {
    nombre: string;
    estilo: string;
    presentacion: string;
    capacidad: number;
    stock: number;
  }[];
  valoracionInventario?: {
    valorMateriaPrima: number;
    valorProductosTerminados: number;
    valorTotal: number;
    rotacionInventario: number;
  };
  topProductos?: any[];
  metricasCalidad?: {
    lotesEnCuarentena: number;
    productosOptimoConsumo: number;
    tasaMerma: number;
  };
}
export interface DashboardData {
  inventario: {
    stockSano: number;
    stockBajo: number;
    lotesPorCaducar: number;
    productosStock: {
      nombre: string;
      estilo: string;
      presentacion: string;
      capacidad: number;
      stock: number;
    }[];
    valorMateriaPrima: number;
    valorProductosTerminados: number;
    valorTotal: number;
    topProductos: {
      nombre: string;
      estilo: string;
      cantidadVendida: number;
      valorTotal: number;
    }[];
    lotesEnCuarentena: number;
    productosOptimoConsumo: number;
  };
  produccion: {
    totalOrdenes: number;
    ordenesPorEstado: {
      Programada: number;
      'En Preparacion': number;
      'En Proceso': number;
      Pausada: number;
      Finalizada: number;
      Cancelada: number;
    };
    volumenProgramado: string;
    volumenProducido: string;
    eficienciaPromedio: number;
    tiempoPromedioProduccion: number;
  };
  comercial: {
    totalVentas: number;
    totalPedidos: number;
    ingresosTotales: number;
    topClientes: {
      clienteId: number;
      total: number;
    }[];
  };
}

export const dashboardApi = {
  get: async (): Promise<DashboardData> => {
    const response = await apiClient.get('/api/v1/transversal/dashboard');
    return response.data.data;
  },
  getInventory: async (): Promise<DashboardInventoryData> => {
    const response = await apiClient.get('/api/v1/inventario/dashboard');
    return response.data.data;
  },
}; 