'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { User } from '../data/schema'
import { useEliminarUsuario } from '@/services/api/hooks/useUsuarios'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState('')
  const { mutate: eliminarUsuario } = useEliminarUsuario()

  const handleDelete = () => {
    if (value.trim() !== currentRow.nombreUsuario) return

    eliminarUsuario(currentRow.id, {
      onSuccess: () => {
        onOpenChange(false)
      }
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.nombreUsuario}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />{' '}
          Eliminar Usuario
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            ¿Está seguro que desea eliminar al usuario{' '}
            <span className='font-bold'>{currentRow.nombreUsuario}</span>?
            <br />
            Esta acción eliminará permanentemente al usuario con el rol de{' '}
            <span className='font-bold'>
              {currentRow.rol}
            </span>{' '}
            del sistema. Esta acción no se puede deshacer.
          </p>

          <Label className='my-2'>
            Nombre de Usuario:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Ingrese el nombre de usuario para confirmar la eliminación.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>¡Advertencia!</AlertTitle>
            <AlertDescription>
              Por favor tenga cuidado, esta operación no se puede revertir.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Eliminar'
      destructive
    />
  )
}
