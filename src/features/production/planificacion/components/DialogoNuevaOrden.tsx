import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormularioOrden } from './FormularioOrden'
import type { CrearOrdenProduccion } from '../types'

interface DialogoNuevaOrdenProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CrearOrdenProduccion) => void
}

export function DialogoNuevaOrden({
  open,
  onOpenChange,
  onSubmit,
}: DialogoNuevaOrdenProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva Orden de Producción</DialogTitle>
        </DialogHeader>
        <FormularioOrden
          onSubmit={(data) => {
            onSubmit(data)
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
} 