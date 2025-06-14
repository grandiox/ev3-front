import { createFileRoute } from '@tanstack/react-router'
import { ProductosTerminados } from '@/features/inventory/productos-terminados'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/inventory/productos-terminados/')({
  component: () => (
    <ProtectedRoute requiredModule="Inventario">
      <ProductosTerminados />
    </ProtectedRoute>
  ),
}) 