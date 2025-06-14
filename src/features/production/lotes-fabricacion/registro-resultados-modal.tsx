import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoteFabricacion } from '@/services/api/lotes-fabricacion'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useFinalizarLote } from '@/services/api/hooks/useLotesFabricacion'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

const formSchema = z.object({
  cantidadFinal: z.number().min(0, 'La cantidad final debe ser mayor o igual a 0'),
  rendimientoReal: z.number().min(0, 'El rendimiento real debe ser mayor o igual a 0'),
  calificacionCalidad: z.enum(['A', 'B', 'C', 'Rechazado'], {
    required_error: 'La calificación de calidad es requerida'
  }),
  fechaOptimoConsumo: z.date({
    required_error: 'La fecha óptima de consumo es requerida'
  }),
  fechaCaducidad: z.date({
    required_error: 'La fecha de caducidad es requerida'
  }),
  observaciones: z.string().optional()
})

type FormValues = z.infer<typeof formSchema>

interface RegistroResultadosModalProps {
  lote: LoteFabricacion | null
  isOpen: boolean
  onClose: () => void
}

export function RegistroResultadosModal({ lote, isOpen, onClose }: RegistroResultadosModalProps) {
  const { mutateAsync: finalizarLote, isPending } = useFinalizarLote()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cantidadFinal: 0,
      rendimientoReal: 0,
      calificacionCalidad: 'A',
      fechaOptimoConsumo: new Date(),
      fechaCaducidad: new Date(),
      observaciones: ''
    }
  })

  const onSubmit = async (values: FormValues) => {
    if (!lote?.id) {
      return
    }

    try {
      await finalizarLote({ id: lote.id, data: values })
      onClose()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Lote - {lote?.codigoLote}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cantidadFinal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad Final</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rendimientoReal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rendimiento Real (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="calificacionCalidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calificación de Calidad</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full border rounded px-2 py-1">
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="Rechazado">Rechazado</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fechaOptimoConsumo"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha Óptima de Consumo</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccione una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fechaCaducidad"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Caducidad</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccione una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Finalizar Lote'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 