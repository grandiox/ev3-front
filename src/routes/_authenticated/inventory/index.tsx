import { createFileRoute } from '@tanstack/react-router'
import { Inventory } from '@/features/inventory'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/inventory/')({
  component: () => (
    <ProtectedRoute requiredModule="Inventario">
      <Inventory />
    </ProtectedRoute>
  ),
}) 