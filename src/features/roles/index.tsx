import { useGetRoles } from '@/services/api/hooks/useRoles'
import { ModulesLayout } from '@/components/layout/layout'
import { RolesTable } from './components/roles-table'
import { RolesProvider, useRoles } from './context/roles-context'
import { RolesDialogs } from './components/roles-dialogs'
import { RolesPrimaryButtons } from './components/roles-primary-buttons'

function RolesContent() {
  const { data } = useGetRoles()
  const { open, setOpen, currentRow, setCurrentRow } = useRoles()

  return (
    <ModulesLayout
      title="Roles"
      subtitle="Gestione los roles y permisos del sistema"
      actions={<RolesPrimaryButtons />}
    >
      <RolesTable data={data?.data || []} />
      <RolesDialogs open={open} setOpen={setOpen} currentRow={currentRow} setCurrentRow={setCurrentRow} />
    </ModulesLayout>
  )
}

export default function Roles() {
  return (
    <RolesProvider>
      <RolesContent />
    </RolesProvider>
  )
} 