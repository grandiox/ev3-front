import { createFileRoute } from '@tanstack/react-router'
import Ventas from '@/features/comercial/ventas'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/commercial/ventas/')({
  component: () => (
    <ProtectedRoute requiredModule="Comercial">
      <Ventas />
    </ProtectedRoute>
  ),
}) 