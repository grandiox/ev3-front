import { createFileRoute } from '@tanstack/react-router'
import Users from '@/features/users'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/users/')({
  component: () => (
    <ProtectedRoute requiredModule="Sistema">
      <Users />
    </ProtectedRoute>
  ),
})
