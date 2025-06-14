import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import ContentSection from '../components/content-section'
import { AccountForm } from './account-form'

export default function SettingsAccount() {
  return (
    <ProtectedRoute requiredPermissions={['empresa:manage']}>
      <ContentSection
        title='Configuración de la Empresa'
        desc='Actualiza la información de tu empresa. Esta información será utilizada en documentos y comunicaciones oficiales.'
      >
        <AccountForm />
      </ContentSection>
    </ProtectedRoute>
  )
}
