import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useEliminarRol } from '@/services/api/hooks/useRoles'
import { Rol } from '@/services/api/roles'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Rol | null
}

export function RolesDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const { mutate: eliminarRol } = useEliminarRol()
  const handleDelete = () => {
    if (currentRow) {
      eliminarRol(currentRow.id)
      onOpenChange(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Rol</DialogTitle>
        </DialogHeader>
        <p>¿Seguro que deseas eliminar el rol <b>{currentRow?.nombre}</b>?</p>
        <DialogFooter>
          <Button variant='destructive' onClick={handleDelete}>Eliminar</Button>
          <Button variant='ghost' onClick={() => onOpenChange(false)}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 