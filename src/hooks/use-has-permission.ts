import { useAuthStore } from '@/stores/authStore';
import { useMemo } from 'react';

/**
 * Verifica si el usuario tiene al menos uno de los permisos requeridos.
 * @param permissions Permiso o lista de permisos a verificar (por ejemplo: 'inventario:read' o ['inventario:read', 'inventario:write'])
 * @returns true si el usuario tiene al menos uno de los permisos
 */
export function useHasPermission(permissions: string | string[]): boolean {
  const user = useAuthStore((state) => state.auth.user);

  return useMemo(() => {
    if (!permissions) return false;
    const userPerms = user?.permisos?.map((p) => p.nombrePermiso) || [];
    const permsToCheck = Array.isArray(permissions) ? permissions : [permissions];
    return permsToCheck.some((perm) => userPerms.includes(perm));
  }, [permissions, user]);
} 