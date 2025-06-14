import Cookies from 'js-cookie'
import { create } from 'zustand'
import { type User as AppUser } from '@/features/auth/types';

const ACCESS_TOKEN = 'auth_token'
const USER_DATA = 'user_data'

interface AuthState {
  auth: {
    user: AppUser | null
    setUser: (user: AppUser | null) => void
    accessToken: string | null
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  // Intentar obtener el token y el usuario de las cookies al inicializar
  const initToken = Cookies.get(ACCESS_TOKEN) || null;
  const initUser = Cookies.get(USER_DATA) ? JSON.parse(Cookies.get(USER_DATA)!) : null;

  return {
    auth: {
      user: initUser,
      setUser: (user: AppUser | null) =>
        set((state) => {
          if (user) {
            // Guardar el usuario en las cookies
            Cookies.set(USER_DATA, JSON.stringify(user), {
              expires: 7, // 7 días
              secure: import.meta.env.PROD,
              sameSite: 'strict'
            });
            // Guardar empresaId en localStorage si existe
            const empresaId = user.user_metadata?.empresaId;
            if (empresaId) {
              localStorage.setItem('empresaId', empresaId.toString());
            }
          } else {
            // Eliminar el usuario de las cookies
            Cookies.remove(USER_DATA);
            // Eliminar empresaId del localStorage
            localStorage.removeItem('empresaId');
          }
          return { ...state, auth: { ...state.auth, user } };
        }),
      accessToken: initToken,
      setAccessToken: (accessToken: string) =>
        set((state) => {
          // Guardar el token en las cookies
          Cookies.set(ACCESS_TOKEN, accessToken, { 
            expires: 7, // 7 días
            secure: import.meta.env.PROD,
            sameSite: 'strict'
          });
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          // Eliminar el token de las cookies
          Cookies.remove(ACCESS_TOKEN);
          return { ...state, auth: { ...state.auth, accessToken: null } }
        }),
      reset: () =>
        set((state) => {
          // Eliminar el token y el usuario de las cookies
          Cookies.remove(ACCESS_TOKEN);
          Cookies.remove(USER_DATA);
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: null },
          }
        })
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)
