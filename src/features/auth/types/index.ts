export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Permiso {
  nombrePermiso: string;
  modulo: string;
}

export interface UserMetadata {
  apellido: string;
  email_verified: boolean;
  empresaId: number;
  nombre: string;
  nombreUsuario: string;
  rol: string;
  avatar?: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata: UserMetadata;
  permisos: Permiso[];
  empresa: Empresa;
}

export interface Empresa {
  id: number;
  codigo: string;
  nombre: string;
  razonSocial: string;
  rut: string;
  direccion?: string | null;
  comuna?: string | null;
  ciudad?: string | null;
  pais?: string | null;
  telefono?: string | null;
  email?: string | null;
  estado: string;
  fechaCreacion: Date;
  fechaModificacion?: Date | null;
  notas?: string | null;
}

// Helper functions for User
export const getUserName = (user: User): string => {
  return `${user.user_metadata.nombre} ${user.user_metadata.apellido}`;
};

export const getUserAvatar = (user: User): string => {
  return user.user_metadata.avatar || '/avatars/default.jpg';
};

export const getUserEmpresa = (user: User): Empresa => {
  return user.empresa;
};

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  // token_type: string; // usually 'bearer', add if present
  // user: User; // Sometimes the full user object is also here
}

export interface AuthResponse {
  user: User;
  session: Session;
  // The API response wraps this in a 'data' object, but authService handles that.
  // So, this AuthResponse type should reflect the structure *after* authService unwraps it.
}

export interface AuthError {
  message: string;
  // You can add more specific error details if your API provides them
}