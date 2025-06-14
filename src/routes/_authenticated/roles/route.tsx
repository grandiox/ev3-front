import { createFileRoute } from '@tanstack/react-router'
import Roles from '@/features/roles'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_authenticated/roles')({
  component: () => {
    const user = useAuthStore((state) => state.auth.user)
    if (user?.user_metadata.rol !== 'SuperAdmin') {
      return <div className='p-8 text-center text-destructive text-lg font-semibold'>No tienes acceso a esta sección.</div>
    }
    return (
      <ProtectedRoute requiredModule="Sistema">
        <Roles />
      </ProtectedRoute>
    )
  },
}) 