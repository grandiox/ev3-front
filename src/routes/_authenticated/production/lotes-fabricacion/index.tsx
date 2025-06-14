import { createFileRoute } from '@tanstack/react-router'
import { LotesFabricacion } from '@/features/production/lotes-fabricacion'

export const Route = createFileRoute('/_authenticated/production/lotes-fabricacion/')({
  component: LotesFabricacion,
}) 