import { IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useRoles } from '../context/roles-context'

export function RolesPrimaryButtons() {
  const { setOpen } = useRoles()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Nuevo Rol</span> <IconUserPlus size={18} />
      </Button>
    </div>
  )
} 