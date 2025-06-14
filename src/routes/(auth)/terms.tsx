import { createFileRoute } from '@tanstack/react-router'
import Terms from '@/features/legal/terms'

export const Route = createFileRoute('/(auth)/terms')({
  component: Terms,
}) 