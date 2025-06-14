import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { handleServerError } from '@/utils/handle-server-error';
import { router } from '@/main';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de Solicitud
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = useAuthStore.getState().auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Error in request configuration:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    try {
      handleServerError(error);

      if (error.response) {
        const status = error.response.status;
        const currentPath = window.location.pathname;
        const authStore = useAuthStore.getState();

        switch (status) {
          case 401:
            authStore.auth.reset();
            if (!currentPath.includes('/sign-in')) {
              router.navigate({
                to: '/sign-in',
                search: { redirect: window.location.href }
              });
            }
            break;
          case 403:
            if (!currentPath.includes('/403')) {
              router.navigate({ to: '/403' });
            }
            break;
          case 404:
            if (!currentPath.includes('/404')) {
              router.navigate({ to: '/404' });
            }
            break;
          case 500:
            if (!currentPath.includes('/500')) {
              router.navigate({ to: '/500' });
            }
            break;
          case 503:
            if (!currentPath.includes('/503')) {
              router.navigate({ to: '/503' });
            }
            break;
          default:
            if (status >= 500 && !currentPath.includes('/500')) {
              router.navigate({ to: '/500' });
            }
        }
      } else if (error.request) {
        // No se recibió respuesta del servidor
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/503')) {
          router.navigate({ to: '/503' });
        }
      }
    } catch (e) {
      console.error('Error in response handling:', e);
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/500')) {
        router.navigate({ to: '/500' });
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

export interface ApiResponse<T> {
  success: boolean
    data: T
    pagination?: Pagination
  message?: string
}