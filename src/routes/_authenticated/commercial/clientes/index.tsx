import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Clientes from '@/features/comercial/clientes'

export const Route = createFileRoute('/_authenticated/commercial/clientes/')({
  component: () => (
    <ProtectedRoute requiredModule="Comercial">
      <Clientes />
    </ProtectedRoute>
  ),
}) 