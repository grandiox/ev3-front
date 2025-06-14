import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'

type Props = {
  children: ReactNode
  requiredPermissions?: string[]
  requiredModule?: string
}

export function ProtectedRoute({ children, requiredPermissions, requiredModule }: Props) {
  const user = useAuthStore((state) => state.auth.user)
  const accessToken = useAuthStore((state) => state.auth.accessToken)
  const userPerms = user?.permisos?.map((p) => p.nombrePermiso) || []
  const userModules = user?.permisos?.map((p) => p.modulo) || []
  const navigate = useNavigate()

  useEffect(() => {
    if (!accessToken) {
      navigate({ to: '/sign-in', search: { redirect: window.location.pathname } })
    }
  }, [accessToken, navigate])

  if (!accessToken) {
    return null // O un loader si prefieres
  }

  const hasPermission =
    requiredPermissions
      ? requiredPermissions.some((perm) => userPerms.includes(perm))
      : true

  const hasModule =
    requiredModule
      ? userModules.includes(requiredModule)
      : true

  if (!hasPermission || !hasModule) {
    return <NoAccess />
  }

  return <>{children}</>
}

function NoAccess() {
  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <h1>Sin acceso</h1>
      <p>No tienes permisos para ver esta sección.</p>
    </div>
  )
} 