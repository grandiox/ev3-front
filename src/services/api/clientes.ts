import apiClient, { ApiResponse } from '@/lib/api-client'

const PREFIX = '/api/v1/comercial/clientes'

export interface Cliente {
  id: number
  codigo: string
  nombre: string
  tipo: string
  contacto?: string
  telefono?: string
  email?: string
  direccion?: string
  comuna?: string
  ciudad?: string
  listaPrecios?: string
  condicionPago?: string
  estado?: string
  notas?: string
  // ...otros campos según el modelo real
}

export interface CreateClienteDto {
  codigo?: string
  nombre: string
  tipo: string
  contacto?: string
  telefono?: string
  email?: string
  direccion?: string
  comuna?: string
  ciudad?: string
  listaPrecios?: string
  condicionPago?: string
  estado?: string
  notas?: string
}

export interface UpdateClienteDto extends Partial<CreateClienteDto> {
  id: number
}

export class ClientesError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ClientesError'
  }
}

export const clientesApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Cliente[]>>(`${PREFIX}`)
    return response.data
  },

  getById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<Cliente>>(`${PREFIX}/${id}`)
    return response.data
  },

  create: async (data: CreateClienteDto) => {
    const response = await apiClient.post<ApiResponse<Cliente>>(`${PREFIX}`, data)
    return response.data
  },

  update: async (id: number, data: UpdateClienteDto) => {
    const response = await apiClient.put<ApiResponse<Cliente>>(`${PREFIX}/${id}`, data)
    return response.data
  },

  delete: async (id: number) => {
    await apiClient.delete(`${PREFIX}/${id}`)
  },
} 