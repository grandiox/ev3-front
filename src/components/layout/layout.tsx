import { useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { IconArrowLeft } from '@tabler/icons-react'

interface ModulesLayoutProps {
  title: string
  subtitle: string
  children: React.ReactNode
  backUrl?: string
  actions?: React.ReactNode
}

export function ModulesLayout({ title, subtitle, children, backUrl = '/', actions }: ModulesLayoutProps) {
  const navigate = useNavigate()

  const handleVolverClick = () => {
    navigate({ to: backUrl })
  }

  return (
    <>
      <Header>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVolverClick}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <IconArrowLeft className="h-4 w-4" />
          </Button>
          <Search />
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
            <p className='text-muted-foreground'>{subtitle}</p>
          </div>
          {actions}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {children}
        </div>
      </Main>
    </>
  )
} 