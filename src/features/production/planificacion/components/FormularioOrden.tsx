import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CrearOrdenProduccion } from '../types'
import { toast } from 'sonner'
import { toZonedTime } from 'date-fns-tz'
import { useRecetas } from '@/services/api/hooks/useRecetas'
import { useGetMateriasPrimas } from '@/services/api/hooks/useMateriasPrimas'

const formSchema = z.object({
  recetaId: z.number({
    required_error: 'La receta es requerida',
  }),
  volumenProgramado: z.number({
    required_error: 'El volumen es requerido',
  }).min(1, 'El volumen debe ser mayor a 0'),
  fechaProgramada: z.string({
    required_error: 'La fecha es requerida',
  }),
})

interface FormularioOrdenProps {
  onSubmit: (data: CrearOrdenProduccion) => void
  onCancel: () => void
}

export function FormularioOrden({ onSubmit, onCancel }: FormularioOrdenProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volumenProgramado: 0,
    },
  })

  // Hook para recetas
  const { data: recetas = [], isLoading: loadingRecetas } = useRecetas()
  
  // Hook para materias primas
  const { data: materiasPrimasData } = useGetMateriasPrimas({ limit: 1000 })
  const materiasPrimas = materiasPrimasData?.items || []

  // Nueva función para validar stock antes de crear la orden
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Normalizar la fecha a formato UTC antes de enviar
      const fechaLocal = new Date(values.fechaProgramada)
      const fechaUTC = toZonedTime(fechaLocal, 'America/Santiago')
      const valoresNormalizados = { ...values, fechaProgramada: fechaUTC.toISOString() }
      
      // 1. Obtener detalles completos de la receta seleccionada
      const receta = recetas.find((r) => r.id === valoresNormalizados.recetaId)
      if (!receta || !receta.detalles || receta.detalles.length === 0) {
        toast.error('La receta seleccionada no tiene ingredientes definidos.')
        return
      }

      // 2. Validar stock para cada ingrediente
      const faltantes: { nombre: string, requerido: number, disponible: number, unidad: string }[] = []
      for (const det of receta.detalles) {
        // Calcular cantidad requerida según el volumen programado
        // Suponemos que det.cantidad es por volumenFinal de la receta
        const factor = Number(valoresNormalizados.volumenProgramado) / Number(receta.volumenFinal)
        const requerido = Number(det.cantidad) * factor
        const mp = materiasPrimas.find((m) => m.id === det.materiaPrimaId)
        const disponible = mp ? Number(mp.stockActual) : 0
        if (disponible < requerido) {
          faltantes.push({
            nombre: mp ? mp.nombre : `ID ${det.materiaPrimaId}`,
            requerido,
            disponible,
            unidad: det.unidadMedida
          })
        }
      }

      if (faltantes.length > 0) {
        toast.error(
          'No hay suficiente stock para los siguientes insumos: ' +
          faltantes.map(f => `${f.nombre} (Requerido: ${f.requerido} ${f.unidad}, Disponible: ${f.disponible} ${f.unidad})`).join(', ')
        )
        return
      }

      // Si todo está OK, crear la orden
      onSubmit(valoresNormalizados)
    } catch (error) {
      toast.error('Error al validar stock de materias primas')
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="recetaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receta</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={loadingRecetas}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingRecetas ? "Cargando recetas..." : "Seleccionar receta"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingRecetas ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Cargando recetas disponibles...</div>
                  ) : recetas.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No hay recetas disponibles</div>
                  ) : (
                    recetas.map((receta) => (
                      <SelectItem key={receta.id} value={receta.id?.toString() || ''}>
                        {receta.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="volumenProgramado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volumen Programado (L)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fechaProgramada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha Programada</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Crear Orden</Button>
        </div>
      </form>
    </Form>
  )
} 