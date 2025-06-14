import apiClient, { ApiResponse } from '@/lib/api-client'

const PREFIX = '/api/v1/produccion/recetas'

interface ParametroTeorico {
  valor: number
  unidad: string
}

interface ParametrosTeoricos {
  ABV: ParametroTeorico
  IBU: ParametroTeorico
}

interface MateriaPrima {
  id: number
  codigo: string
  nombre: string
  tipo: string
  unidadMedida: string
}

interface DetalleReceta {
  id: number
  recetaId: number
  materiaPrimaId: number
  etapaProduccion: string
  cantidad: string
  unidadMedida: string
  tiempoAdicion: number | null
  unidadTiempo: string | null
  notas: string | null
  orden: number
  materiaPrima: MateriaPrima
}


export interface Receta {
  id: number
  codigo: string
  nombre: string
  estilo: string
  descripcion: string
  volumenFinal: number
  unidadVolumen: string
  instrucciones: string
  parametrosTeoricos: ParametrosTeoricos
  rendimientoEsperado: number
  notas: string
  detalles: Array<DetalleReceta>
  version: string
  estado: string
  createdAt: string
  updatedAt: string
  productoTerminadoId: number | null
  productoTerminado?: { id: number; nombre: string; estilo: string }
}

export interface CreateRecetaDto {
  codigo: string
  nombre: string
  estilo: string
  descripcion: string
  volumenFinal: string
  unidadVolumen: string
  instrucciones: string
  parametrosTeoricos: {
    ABV: { valor: number; unidad: string }
    IBU: { valor: number; unidad: string }
  }
  rendimientoEsperado: number
  notas: string
  detalles: Array<{
    materiaPrimaId: number
    etapaProduccion: string
    cantidad: number
    unidadMedida: string
    tiempoAdicion: number
    unidadTiempo: string
    notas: string
    orden: number
  }>
  version: string
  estado: string
  productoTerminadoId: number | null
}

export interface UpdateRecetaDto extends Partial<CreateRecetaDto> {
  id: number
}

export interface UpdateRecetaEstadoDto {
  estado: string
}


export interface CloneRecetaDto {
  nuevaVersion: string;
  descripcion: string;
}

export class RecetasError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'RecetasError'
  }
}

export interface ValidarRecetaResponse {
  esValida: boolean;
  errores: string[];
  advertencias: string[];
}

export interface CalcularCostoRecetaResponse {
  costoTotal: string;
  costoPorLitro: string;
  detallesCosto: Array<{
    materiaPrimaId: number;
    nombre: string;
    cantidad: string;
    costoUnitario: string;
    costoTotal: string;
  }>;
}

export const recetasApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Receta[]>>(`${PREFIX}`)
    return response.data
  },

  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<Receta>>(`${PREFIX}/${id}`)
    return response.data
  },

  create: async (data: CreateRecetaDto) => {
    const response = await apiClient.post<ApiResponse<Receta>>(`${PREFIX}`, data)
    return response.data
  },

  update: async (id: number, data: UpdateRecetaDto) => {
    const response = await apiClient.put<ApiResponse<Receta>>(`${PREFIX}/${id}`, data)
    return response.data
  },

  updateEstado: async (id: number, data: UpdateRecetaEstadoDto) => {
    const response = await apiClient.patch<ApiResponse<Receta>>(`${PREFIX}/${id}/estado`, data)
    return response.data
  },

  delete: async (id: number) => {
    await apiClient.delete(`${PREFIX}/${id}`)
  },

  clone: async (id: number, data: CloneRecetaDto) => {
    const response = await apiClient.post<ApiResponse<Receta>>(`${PREFIX}/${id}/clonar`, data)
    return response.data
  },

  validate: async (id: number) => {
    const response = await apiClient.get<ApiResponse<ValidarRecetaResponse>>(`${PREFIX}/${id}/validar`)
    return response.data
  },

  cost: async (id: number) => {
    const response = await apiClient.get<ApiResponse<CalcularCostoRecetaResponse>>(`${PREFIX}/${id}/costo`)
    return response.data
  },
}
