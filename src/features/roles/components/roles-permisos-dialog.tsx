import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useGetPermisos, useGetPermisosRol, useAsignarPermisoRol, useQuitarPermisoRol } from '@/services/api/hooks/useRoles'
import { Rol } from '@/services/api/roles'
import { Button } from '@/components/ui/button'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Rol | null
}

export function RolesPermisosDialog({ open, onOpenChange, currentRow }: Props) {
  const { data: permisosAll, isLoading: loadingAll } = useGetPermisos()
  const { data: permisosRol, isLoading: loadingRol, refetch } = useGetPermisosRol(currentRow?.id)
  const { mutate: asignarPermiso, isLoading: loadingAsignar } = useAsignarPermisoRol()
  const { mutate: quitarPermiso, isLoading: loadingQuitar } = useQuitarPermisoRol()
  const [selectedPermisos, setSelectedPermisos] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingSave, setPendingSave] = useState<null | { asignar: number[]; quitar: number[] }>(null)
  const [confirmRemove, setConfirmRemove] = useState<null | { permisoId: number }> (null)

  // Inicializar permisos seleccionados al abrir el diálogo
  useEffect(() => {
    if (open && permisosRol?.data) {
      setSelectedPermisos(permisosRol.data.map((p: any) => p.permisoId))
    }
  }, [open, permisosRol?.data])

  const permisosAsignados = permisosRol?.data?.map((p: any) => p.permisoId) || []
  const loading = loadingAll || loadingRol

  // Manejar cambios en los checkboxes con confirmación al desmarcar
  const handleCheckboxChange = (permisoId: number) => {
    const permiso = permisosAll?.data?.find((p: any) => p.id === permisoId)
    if (selectedPermisos.includes(permisoId)) {
      setConfirmRemove({ permisoId })
    } else {
      setSelectedPermisos(prev => [...prev, permisoId])
    }
  }

  // Guardar cambios en la API
  const handleGuardar = useCallback(() => {
    if (!currentRow) return
    const permisosAAsignar = selectedPermisos.filter(id => !permisosAsignados.includes(id))
    const permisosAQuitar = permisosAsignados.filter(id => !selectedPermisos.includes(id))
    if (!permisosAAsignar.length && !permisosAQuitar.length) {
      toast.info('No hay cambios para guardar')
      setSaving(false)
      return
    }
    setPendingSave({ asignar: permisosAAsignar, quitar: permisosAQuitar })
    setConfirmOpen(true)
  }, [selectedPermisos, permisosAsignados, currentRow])

  const handleConfirmSave = async () => {
    if (!currentRow || !pendingSave) return
    setSaving(true)
    setConfirmOpen(false)
    try {
      for (const permisoId of pendingSave.asignar) {
        await new Promise<void>((resolve, reject) => {
          asignarPermiso(
            { id: currentRow.id, permisoId },
            {
              onSuccess: () => resolve(),
              onError: () => reject(),
            }
          )
        })
      }
      for (const permisoId of pendingSave.quitar) {
        await new Promise<void>((resolve, reject) => {
          quitarPermiso(
            { id: currentRow.id, permisoId },
            {
              onSuccess: () => resolve(),
              onError: () => reject(),
            }
          )
        })
      }
      toast.success('Permisos actualizados correctamente')
      refetch()
      onOpenChange(false)
    } catch {
      toast.error('Error al actualizar permisos')
    } finally {
      setSaving(false)
      setPendingSave(null)
    }
  }

  const handleConfirmRemove = () => {
    if (confirmRemove) {
      setSelectedPermisos(prev => prev.filter(id => id !== confirmRemove.permisoId))
      setConfirmRemove(null)
    }
  }

  const handleCancelRemove = () => setConfirmRemove(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permisos de {currentRow?.nombre}</DialogTitle>
        </DialogHeader>
        <div className='space-y-2 max-h-72 overflow-y-auto'>
          {loading ? (
            <div className='text-center text-muted-foreground py-8'>Cargando permisos...</div>
          ) : !permisosAll?.data?.length ? (
            <div className='text-center text-muted-foreground py-8'>No hay permisos disponibles.</div>
          ) : (
            <>
              <label className='flex items-center gap-2 font-semibold mb-2'>
                <input
                  type='checkbox'
                  checked={permisosAll.data.length > 0 && selectedPermisos.length === permisosAll.data.length}
                  indeterminate={selectedPermisos.length > 0 && selectedPermisos.length < permisosAll.data.length}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedPermisos(permisosAll.data.map((p: any) => p.id))
                    } else {
                      setSelectedPermisos([])
                    }
                  }}
                  disabled={saving}
                />
                <span>Marcar todos</span>
              </label>
              {permisosAll.data.map(permiso => (
                <label key={permiso.id} className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={selectedPermisos.includes(permiso.id)}
                    disabled={saving}
                    onChange={() => handleCheckboxChange(permiso.id)}
                  />
                  <span>{permiso.descripcion} <span className='text-xs text-muted-foreground'>({permiso.modulo})</span></span>
                </label>
              ))}
            </>
          )}
          {!loading && permisosAll?.data?.length && !selectedPermisos.length && (
            <div className='text-center text-muted-foreground py-2'>Este rol no tiene permisos asignados.</div>
          )}
        </div>
        <DialogFooter>
          <Button variant='ghost' onClick={() => onOpenChange(false)} disabled={saving}>Cerrar</Button>
          <Button onClick={handleGuardar} disabled={saving || loading}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-destructive'>¿Guardar cambios en los permisos?</AlertDialogTitle>
            <AlertDialogDescription>
              <div className='mb-2'>Esta acción modificará los permisos asignados a este rol. Por favor, revisa los cambios antes de confirmar.</div>
              {pendingSave && (
                <div className='text-left max-h-48 overflow-y-auto'>
                  {pendingSave.asignar.length > 0 && <>
                    <div className='font-semibold mb-1'>Permisos a asignar:</div>
                    <ul className='mb-2 pl-4 list-disc'>
                      {pendingSave.asignar.map(id => {
                        const p = permisosAll?.data?.find((perm: any) => perm.id === id)
                        return <li key={id}>{p ? `${p.descripcion} (${p.modulo})` : `ID ${id}`}</li>
                      })}
                    </ul>
                  </>}
                  {pendingSave.quitar.length > 0 && <>
                    <div className='font-semibold mb-1 text-destructive'>Permisos a quitar:</div>
                    <ul className='mb-2 pl-4 list-disc'>
                      {pendingSave.quitar.map(id => {
                        const p = permisosAll?.data?.find((perm: any) => perm.id === id)
                        return <li key={id}>{p ? `${p.descripcion} (${p.modulo})` : `ID ${id}`}</li>
                      })}
                    </ul>
                  </>}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave} disabled={saving}>Guardar cambios</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Modal de confirmación para quitar permiso individual */}
      <AlertDialog open={!!confirmRemove} onOpenChange={open => { if (!open) setConfirmRemove(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-destructive'>Quitar permiso</AlertDialogTitle>
            <AlertDialogDescription>
              {(() => {
                const permiso = permisosAll?.data?.find((p: any) => p.id === confirmRemove?.permisoId)
                return permiso
                  ? <>¿Estás seguro de quitar el permiso "<b>{permiso.descripcion} ({permiso.modulo})</b>" del rol?</>
                  : '¿Estás seguro de quitar este permiso del rol?'
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelRemove}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove}>Quitar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
} 