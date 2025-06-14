import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface DashboardData {
  inventario: {
    stockSano: number
    stockBajo: number
    lotesPorCaducar: number
    productosStock: Array<{
      nombre: string
      estilo: string
      presentacion: string
      capacidad: number
      stock: number
    }>
    valorMateriaPrima: number
    valorProductosTerminados: number
    valorTotal: number
    topProductos: Array<{
      nombre: string
      estilo: string
      cantidadVendida: number
      valorTotal: number
    }>
    lotesEnCuarentena: number
    productosOptimoConsumo: number
  }
  produccion: {
    totalOrdenes: number
    ordenesPorEstado: {
      Programada: number
      'En Preparacion': number
      'En Proceso': number
      Pausada: number
      Finalizada: number
      Cancelada: number
    }
    volumenProgramado: string
    volumenProducido: string
    eficienciaPromedio: number
    tiempoPromedioProduccion: number
  }
  comercial: {
    totalVentas: number
    totalPedidos: number
    ingresosTotales: number
    topClientes: Array<{
      clienteId: number
      total: number
    }>
  }
}

interface DashboardResponse {
  success: boolean
  data: DashboardData
  message: string
}

export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await axios.get('/api/v1/transversal/dashboard')
      return data
    },
  })
} 