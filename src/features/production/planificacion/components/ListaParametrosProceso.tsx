import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import type { ParametroProceso } from '@/services/api/parametrosProceso'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormularioParametrosProceso } from './FormularioParametrosProceso'
import { useParametrosProceso } from '@/services/api/hooks/useParametrosProceso'
import { toast } from 'sonner'

const ETAPAS_PRODUCCION = [
  'PREPARACION',
  'MACERADO',
  'COCCION',
  'FERMENTACION',
  'MADURACION',
  'FILTRADO',
  'ENVASADO',
  'CONTROL_CALIDAD'
] as const

interface ListaParametrosProcesoProps {
  parametros: ParametroProceso[]
  isLoading: boolean
}

export function ListaParametrosProceso({ parametros, isLoading }: ListaParametrosProcesoProps) {
  const [etapaFiltro, setEtapaFiltro] = useState<string | null>(null)
  const [parametroEdit, setParametroEdit] = useState<ParametroProceso | null>(null)
  const [parametroDelete, setParametroDelete] = useState<ParametroProceso | null>(null)

  // Obtener hooks de edición y borrado (usando el primer parámetro para IDs)
  const { actualizarParametro, eliminarParametro } = useParametrosProceso(
    parametros[0]?.loteFabricacionId || 0,
    parametros[0]?.loteFabricacion?.ordenProduccionId || 0
  )

  const handleEdit = (param: ParametroProceso) => setParametroEdit(param)
  const handleDelete = (param: ParametroProceso) => setParametroDelete(param)

  const handleEditSubmit = async (data: any) => {
    if (!parametroEdit) return
    try {
      await actualizarParametro({ id: parametroEdit.id, data })
      setParametroEdit(null)
    } catch (e) {
      console.error('Error al actualizar el parámetro', e)
      toast.error('Error al actualizar el parámetro')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!parametroDelete) return
    try {
      await eliminarParametro(parametroDelete.id)
      setParametroDelete(null)
    } catch (e) {
      console.error('Error al eliminar el parámetro', e)
      toast.error('Error al eliminar el parámetro')
    }
  }

  const parametrosFiltrados = etapaFiltro && etapaFiltro !== 'TODAS'
    ? parametros.filter(p => p.etapaProduccion === etapaFiltro)
    : parametros

  if (isLoading) {
    return <div className="text-center py-4">Cargando parámetros...</div>
  }

  if (parametros.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No hay parámetros registrados</div>
  }

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
      <div className="">
        <Label htmlFor="etapa-select" className="mb-2 block">Filtrar por etapa</Label>
        <Select
          value={etapaFiltro || 'TODAS'}
          onValueChange={setEtapaFiltro}
        >
          <SelectTrigger id="etapa-select">
            <SelectValue placeholder="Todas las etapas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODAS">Todas las etapas</SelectItem>
            {ETAPAS_PRODUCCION.map((etapa) => (
              <SelectItem key={etapa} value={etapa}>
                {etapa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
        <span className="text-muted-foreground text-base">
          {parametrosFiltrados.length} parámetro{parametrosFiltrados.length !== 1 && 's'}
        </span>
      </div>
      {/* Filtro */}
      
      {/* Lista */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-4">
          {parametrosFiltrados.map((parametro) => (
            <div
              key={parametro.id}
              className="flex flex-col md:flex-row justify-between gap-2 p-4 rounded-xl border bg-card shadow-sm"
            >
              {/* IZQUIERDA */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-lg mb-1">{parametro.parametro.replace(/_/g, ' ')}</h4>
                <p className="text-xs text-muted-foreground mb-2">{parametro.etapaProduccion}</p>
                <p className="text-sm mb-1">
                  Lote: <span className="font-semibold">{parametro.loteFabricacion.codigoLote}</span>
                </p>
                <p className="text-sm mb-1">
                  Registrado por: <span className="font-semibold">{parametro.usuario.nombre}</span>
                </p>
                {parametro.notas && (
                  <p className="text-xs italic text-muted-foreground mt-1">Notas: {parametro.notas}</p>
                )}
              </div>
              {/* DERECHA */}
              <div className="flex flex-col items-end gap-1 min-w-[140px]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{parametro.valor}</span>
                  <span className="text-base font-medium">{parametro.unidadMedida}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(parametro.fechaMedicion), 'dd/MM/yyyy HH:mm', { locale: es })}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(parametro)}
                    aria-label="Editar parámetro"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(parametro)}
                    aria-label="Eliminar parámetro"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <Badge
                    variant={parametro.enRango ? "success" : "destructive"}
                    className="text-xs px-3 py-1"
                  >
                    {parametro.enRango ? "En rango" : "Fuera de rango"}
                  </Badge>
              </div>
            </div>
          ))}
          {parametrosFiltrados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay parámetros registrados para esta etapa.
            </div>
          )}
        </div>
      </ScrollArea>
      {/* Diálogos igual que antes... */}
      <Dialog open={!!parametroEdit} onOpenChange={open => !open && setParametroEdit(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Parámetro</DialogTitle>
          </DialogHeader>
          {parametroEdit && (
            <FormularioParametrosProceso
              loteFabricacionId={parametroEdit.loteFabricacionId}
              onSubmit={handleEditSubmit}
              onCancel={() => setParametroEdit(null)}
              initialValues={{
                etapaProduccion: parametroEdit.etapaProduccion,
                parametro: parametroEdit.parametro,
                valor: parametroEdit.valor,
                unidadMedida: parametroEdit.unidadMedida,
                notas: parametroEdit.notas || ''
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!parametroDelete} onOpenChange={open => !open && setParametroDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar parámetro?</DialogTitle>
          </DialogHeader>
          <div className="py-4">¿Seguro que deseas eliminar el parámetro <b>{parametroDelete?.parametro}</b>?</div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setParametroDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 