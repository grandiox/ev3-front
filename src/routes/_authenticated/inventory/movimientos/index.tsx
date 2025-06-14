import { createFileRoute } from '@tanstack/react-router';
import Movimientos from '@/features/inventory/movimientos';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const Route = createFileRoute('/_authenticated/inventory/movimientos/')({
  component: () => (
    <ProtectedRoute requiredModule="Inventario">
      <Movimientos />
    </ProtectedRoute>
  ),
}); 