import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { CommandMenu } from '@/components/command-menu'
import SkipToMain from '@/components/skip-to-main'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const { accessToken } = useAuthStore.getState().auth;
    if (!accessToken) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: window.location.pathname,
        },
      });
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className={cn('flex min-h-screen flex-col')}>
      <SkipToMain />
      <div className='flex flex-1'>
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <main className='flex-1'>
            <SearchProvider>
              <Outlet />
              <CommandMenu />
            </SearchProvider>
          </main>
        </SidebarProvider>
      </div>
    </div>
  )
}
