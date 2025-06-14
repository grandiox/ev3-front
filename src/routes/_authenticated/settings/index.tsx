import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import SettingsProfile from '@/features/settings/profile'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: () => (
    <ProtectedRoute>
      <SettingsProfile />
    </ProtectedRoute>
  ),
})
