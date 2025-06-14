import { createFileRoute } from '@tanstack/react-router';
import { LotesProducto } from '@/features/inventory/lotes-producto';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const Route = createFileRoute('/_authenticated/inventory/lotes-producto/')({
  component: () => (
    <ProtectedRoute requiredModule="Inventario">
      <LotesProducto />
    </ProtectedRoute>
  ),
}); 