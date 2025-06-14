import { useHasPermission } from '@/hooks/use-has-permission'
import { columns } from './components/materias-primas-columns'
import { MateriasPrimasTable } from './components/materias-primas-table'
import MateriasPrimasProvider from './context/materias-primas-context'
import { materiaPrimaListSchema } from './data/schema'
import { useMateriasPrimas } from './context/materias-primas-context'
import { ModulesLayout } from '@/components/layout/layout'
import { useGetElementosInventario } from '@/services/api/hooks/useInventario'
import { Button } from '@/components/ui/button'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormularioMateriaPrima } from './formulario-materia-prima'
import { useCrearMateriaPrima, useActualizarMateriaPrima } from '@/services/api/hooks/useMateriasPrimas'
import { toast } from 'sonner'
import { MateriaPrima } from './data/schema'

function MateriasPrimasContent() {
  const { data: materiasPrimas, isLoading, refetch } = useGetElementosInventario('MateriaPrima')
  const materiasPrimasList = materiaPrimaListSchema.safeParse(materiasPrimas)
  const { setOpen, open, currentRow, setCurrentRow } = useMateriasPrimas()
  const canWrite = useHasPermission('inventario:write')
  const { mutateAsync: crearMateriaPrima } = useCrearMateriaPrima()
  const { mutateAsync: actualizarMateriaPrima } = useActualizarMateriaPrima()

  const handleSubmit = async (data: Partial<MateriaPrima>) => {
    try {
      if (currentRow?.id) {
        await actualizarMateriaPrima({ id: currentRow.id, materiaPrima: data })
        toast.success('Materia prima actualizada correctamente')
      } else {
        await crearMateriaPrima(data as Omit<MateriaPrima, 'id'>)
        toast.success('Materia prima creada correctamente')
      }
      setOpen(null)
      refetch()
    } catch (error) {
      console.error('Error al guardar materia prima:', error)
      toast.error('Error al guardar la materia prima')
    }
  }

  const handleCancelarForm = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  return (
    <ModulesLayout
      title="Materias Primas"
      subtitle="Gestione las materias primas del inventario"
      actions={
        <div className='flex gap-2'>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <IconRefresh className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setOpen('add')}
            disabled={isLoading || !canWrite}
            variant="default"
            size="sm"
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Nuevo
          </Button>
        </div>
      }
    >

      <MateriasPrimasTable data={materiasPrimasList.data || []} columns={columns} />

      <Dialog 
        open={open === 'add' || open === 'edit'} 
        onOpenChange={(open) => { 
          if (!open) {
            handleCancelarForm();
            setCurrentRow(null);
          }
        }}
      >
        <DialogContent className="p-6 overflow-y-auto flex flex-col max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>
              {open === 'edit' ? 'Editar Materia Prima' : 'Crear Materia Prima'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1">
            <FormularioMateriaPrima
              onCancel={handleCancelarForm}
              onSubmit={handleSubmit}
              materiaPrima={currentRow}
            />
          </div>
        </DialogContent>
      </Dialog>
    </ModulesLayout>
  )
}

export function MateriasPrimas() {
  return (
    <MateriasPrimasProvider>
      <MateriasPrimasContent />
    </MateriasPrimasProvider>
  )
}