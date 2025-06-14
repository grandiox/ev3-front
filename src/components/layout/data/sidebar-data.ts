import {
  IconLayoutDashboard,
  IconBox,
  IconPackages,
  IconUsers,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'
import { useAuthStore } from '@/stores/authStore'
import { getUserEmpresa } from '@/features/auth/types'

export function getSidebarData() : SidebarData {  
  const { user } = useAuthStore.getState().auth
  const empresa = user ? getUserEmpresa(user) : null
  const isSuperAdmin = user?.user_metadata.rol === 'SuperAdmin'

  return {
    user: {
      name: user?.user_metadata.nombre || '',
      email: user?.email || '',
      avatar: user?.user_metadata.avatar || '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: empresa?.nombre || 'Sin empresa',
        logo: Command,
        plan: 'Free',
      }
    ],
    navGroups: [
      {
        title: 'General',
        items: [
          {
            title: 'Inicio',
            url: '/',
            icon: IconLayoutDashboard,
          },
          {
            title: 'Inventario',
            icon: IconBox,
            requiredModule: 'Inventario',
            items: [
              {
                title: 'Dashboard',
                url: '/inventory',
                // icon: IconLayoutDashboard,
                requiredPermissions: ['inventario:read'],
              },
              {
                title: 'Materias Primas',
                url: '/inventory/materias-primas',
                // icon: IconWheat,
                requiredPermissions: ['inventario:read'],
              },
              {
                title: 'Lote Materias Primas',
                url: '/inventory/lotes-materia-prima',
                // icon: IconPackage,
                requiredPermissions: ['inventario:read'],
              },
              {
                title: 'Productos',
                url: '/inventory/productos-terminados',
                // icon: IconBeer,
                requiredPermissions: ['inventario:read'],
              },
              {
                title: 'Lotes de Productos',
                url: '/inventory/lotes-producto',
                // icon: IconPackage,
                requiredPermissions: ['inventario:read'],
              },
              {
                title: 'Movimientos',
                url: '/inventory/movimientos',
                // icon: IconArrowsExchange,
                requiredPermissions: ['inventario:read'],
              },
            ],
          },
          {
            title: 'Producción',
            icon: IconPackages,
            requiredModule: 'Producción',
            items: [
              {
                title: 'Recetas',
                url: '/production/recetas',
                // icon: IconBeer,
                requiredPermissions: ['produccion:read'],
              },
              {
                title: 'Planificación',
                url: '/production/planificacion',
                // icon: IconCalendar,
                requiredPermissions: ['produccion:read'],
              },
            {
              title: 'Lotes de Fabricación',
              url: '/production/lotes-fabricacion',
              // icon: IconBox,
              requiredPermissions: ['produccion:read'],
            }
            ]
          },
          {
            title: 'Comercial',
            icon: IconBox,
            requiredModule: 'Comercial',
            items: [
              {
                title: 'Clientes',
                url: '/commercial/clientes',
                requiredPermissions: ['comercial:read'],
              },
              {
                title: 'Pedidos',
                url: '/commercial/pedidos',
                requiredPermissions: ['comercial:read'],
              },
              {
                title: 'Ventas',
                url: '/commercial/ventas',
                requiredPermissions: ['comercial:read'],
              },
            ]
          }],
      },
        {
          title: 'Administrador',
          items: [
        {
          title: 'Users',
          requiredModule: 'Sistema',
          url: '/users',
          icon: IconUsers,
        },
        ...(isSuperAdmin ? [{
          title: 'Roles',
          requiredModule: 'Sistema',
          url: '/roles' as const,
          icon: IconUsers,
        }] : []),
      ],
    },
  ],
}
}