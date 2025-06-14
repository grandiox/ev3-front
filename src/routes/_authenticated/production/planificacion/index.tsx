import { createFileRoute } from '@tanstack/react-router'
import Planificacion from '@/features/production/planificacion'

export const Route = createFileRoute('/_authenticated/production/planificacion/')({
  component: Planificacion,
}) 