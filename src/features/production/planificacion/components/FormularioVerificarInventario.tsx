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
import { useRecetas } from '@/services/api/hooks/useRecetas'

const formSchema = z.object({
  recetaId: z.number({
    required_error: 'La receta es requerida',
  }),
  volumenProgramado: z.number({
    required_error: 'El volumen es requerido',
  }).min(1, 'El volumen debe ser mayor a 0'),
})

export type FormularioVerificarInventarioValues = z.infer<typeof formSchema>

interface FormularioVerificarInventarioProps {
  onSubmit: (data: FormularioVerificarInventarioValues) => void
  onCancel: () => void
}

export function FormularioVerificarInventario({ onSubmit, onCancel }: FormularioVerificarInventarioProps) {
  const form = useForm<FormularioVerificarInventarioValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volumenProgramado: 0,
    },
  })

  const { data: recetas = [], isLoading: loadingRecetas } = useRecetas()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Verificar</Button>
        </div>
      </form>
    </Form>
  )
} 