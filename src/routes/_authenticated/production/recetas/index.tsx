import { createFileRoute } from '@tanstack/react-router'
import Recetas from '@/features/production/recetas'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/production/recetas/')({
  component: () => (
    <ProtectedRoute requiredModule="Producción">
      <Recetas />
    </ProtectedRoute>
  ),
}) 