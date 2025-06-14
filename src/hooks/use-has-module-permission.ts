import { useAuthStore } from '@/stores/authStore';
import { useMemo } from 'react';

/**
 * Verifica si el usuario tiene al menos un permiso en uno o varios módulos.
 * @param modules Módulo o lista de módulos a verificar (por ejemplo: 'Inventario' o ['Inventario', 'Producción'])
 * @returns true si el usuario tiene al menos un permiso en alguno de los módulos
 */
export function useHasModulePermission(modules: string | string[]): boolean {
  const user = useAuthStore((state) => state.auth.user);

  return useMemo(() => {
    if (!modules) return false;
    const userModules = user?.permisos?.map((p) => p.modulo) || [];
    const modulesToCheck = Array.isArray(modules) ? modules : [modules];
    return modulesToCheck.some((mod) => userModules.includes(mod));
  }, [modules, user]);
} 