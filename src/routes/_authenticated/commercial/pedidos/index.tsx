import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Pedidos from '@/features/comercial/pedidos'

export const Route = createFileRoute('/_authenticated/commercial/pedidos/')({
  component: () => (
    <ProtectedRoute requiredModule="Comercial">
      <Pedidos />
    </ProtectedRoute>
  ),
}) 