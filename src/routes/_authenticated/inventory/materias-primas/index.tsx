import { createFileRoute } from '@tanstack/react-router'
import { MateriasPrimas } from '@/features/inventory/materias-primas'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/inventory/materias-primas/')({
  component: () => (
    <ProtectedRoute requiredModule="Inventario">
      <MateriasPrimas />
    </ProtectedRoute>
  ),
}) 