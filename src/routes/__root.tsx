import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'
import { useAuthStore } from '@/stores/authStore'

// Constants
const PUBLIC_ROUTES = ['/sign-in', '/sign-up', '/forgot-password', '/otp'] as const
const TOASTER_DURATION = 5000

// Types
type RouteContext = {
  queryClient: QueryClient
}

// Auth redirect logic
const handleAuthRedirect = (currentPath: string) => {
  const { accessToken } = useAuthStore.getState().auth
  const isPublicRoute = PUBLIC_ROUTES.some(route => currentPath.startsWith(route))
  
  if (!accessToken && !isPublicRoute) {
    return {
      shouldRedirect: true,
      redirectTo: '/sign-in'
    }
  }
  
  if (accessToken && isPublicRoute) {
    return {
      shouldRedirect: true,
      redirectTo: '/'
    }
  }
  
  return { shouldRedirect: false }
}

export const Route = createRootRouteWithContext<RouteContext>()({
  beforeLoad: async ({ location }) => {
    const { shouldRedirect, redirectTo } = handleAuthRedirect(location.pathname)
    
    if (shouldRedirect) {
      throw redirect({
        to: redirectTo
      })
    }
  },
  
  component: () => {
    const isDevelopment = import.meta.env.MODE === 'development'
    
    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={TOASTER_DURATION} richColors />
        {isDevelopment && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    )
  },
  
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})