import { createFileRoute } from '@tanstack/react-router'
import { LotesMateriaPrima } from '@/features/inventory/lotes-materia-prima'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/inventory/lotes-materia-prima/')({
  component: () => (
    <ProtectedRoute requiredModule="Inventario">
      <LotesMateriaPrima />
    </ProtectedRoute>
  ),
}) 