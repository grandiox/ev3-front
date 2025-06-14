import { useGetUsuarios } from '@/services/api/hooks/useUsuarios'
import { useColumns } from './components/users-columns'
import { UsersTable } from './components/users-table'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import UsersProvider from './context/users-context'
import { ModulesLayout } from '@/components/layout/layout'

export default function Users() {
  const { data } = useGetUsuarios()
  const columns = useColumns()

  return (
    <UsersProvider>
      <ModulesLayout
        title="Usuarios"
        subtitle="Gestione los usuarios del sistema"
        actions={<UsersPrimaryButtons />}
      >
        <UsersTable columns={columns} data={data?.data || []} />
        <UsersDialogs />
      </ModulesLayout>
    </UsersProvider>
  )
}
