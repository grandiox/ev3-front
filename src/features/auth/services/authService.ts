import apiClient from '@/lib/api-client';
import { type AuthResponse, type LoginCredentials } from '../types';
import { toast } from 'sonner';

const mostrarToastError = (mensaje: string) => {
  toast.error(mensaje);
};

const handleAuthError = (error: any, defaultMessage: string, specificMessages: Record<number, string>) => {
  if (error.response?.status && specificMessages[error.response.status]) {
    mostrarToastError(specificMessages[error.response.status]);
    throw new Error(specificMessages[error.response.status]);
  }
  if (error.response?.status === 401) {
    mostrarToastError('No autorizado: tu sesión ha expirado o el token es inválido. Por favor, inicia sesión nuevamente.');
    throw new Error('No autorizado: tu sesión ha expirado o el token es inválido.');
  }
  mostrarToastError(defaultMessage);
  throw new Error(defaultMessage);
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<{ data: AuthResponse }>('/api/v1/usuarios/auth/login', credentials);
    return response.data.data;
  } catch (error: any) {
    return handleAuthError(error, 'Error al iniciar sesión. Intenta nuevamente o contacta al administrador.', {
      401: 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.',
      500: 'Error interno del servidor al iniciar sesión.'
    });
  }
};

export const getUserProfile = async (token: string) => {
  try {
    const response = await apiClient.get('/v1/usuarios/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.data) {
      mostrarToastError('No se pudo obtener el perfil del usuario');
      throw new Error('No se pudo obtener el perfil del usuario');
    }
    return response.data;
  } catch (error: any) {
    return handleAuthError(error, 'Error al obtener el perfil del usuario. Intenta nuevamente o contacta al administrador.', {
      401: 'No autorizado: el token es inválido o ha expirado.',
      404: 'No se encontró el perfil del usuario.',
      500: 'Error interno del servidor al obtener el perfil.'
    });
  }
};

export const registerUser = async (data: { email: string; password: string }) => {
  try {
    const response = await apiClient.post('/v1/usuarios/auth/register', data);
    if (!response.data) {
      mostrarToastError('No se pudo registrar el usuario');
      throw new Error('No se pudo registrar el usuario');
    }
    return response.data;
  } catch (error: any) {
    return handleAuthError(error, 'Error al registrar el usuario. Intenta nuevamente o contacta al administrador.', {
      400: 'Datos de registro inválidos. Por favor, verifica la información proporcionada.',
      409: 'El email ya está registrado en el sistema.',
      500: 'Error interno del servidor al registrar el usuario.'
    });
  }
};
