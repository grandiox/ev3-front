import { useState } from 'react'
import { Rol } from '@/services/api/roles'
import { RolesActionDialog } from './roles-action-dialog'
import { RolesDeleteDialog } from './roles-delete-dialog'
import { RolesPermisosDialog } from './roles-permisos-dialog'

export type RolesDialogType = 'add' | 'edit' | 'delete' | 'permisos' | null

interface Props {
  open: RolesDialogType
  setOpen: (d: RolesDialogType) => void
  currentRow: Rol | null
  setCurrentRow: (r: Rol | null) => void
}

export function RolesDialogs({ open, setOpen, currentRow, setCurrentRow }: Props) {
  return <>
    <RolesActionDialog open={open === 'add' || open === 'edit'} onOpenChange={() => setOpen(null)} currentRow={open === 'edit' ? currentRow : null} />
    <RolesDeleteDialog open={open === 'delete'} onOpenChange={() => setOpen(null)} currentRow={currentRow} />
    <RolesPermisosDialog open={open === 'permisos'} onOpenChange={() => setOpen(null)} currentRow={currentRow} />
  </>
} 