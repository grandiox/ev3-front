import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { Textarea } from '@/components/ui/textarea'
import { LoteMateriaPrima } from '../data/schema'
import { useLotesMateriaPrima } from '../context/lotes-materia-prima-context'
import { useGetMateriasPrimas } from '@/services/api/hooks/useMateriasPrimas'
import { useGetProveedores } from '@/services/api/hooks/useProveedores'
import { useGetOrdenesCompra } from '@/services/api/hooks/useOrdenesCompra'
import { toast } from 'sonner'

const formSchema = z.object({
  materiaPrimaId: z.string().min(1, 'La materia prima es requerida'),
  codigoLote: z.string().optional(),
  proveedorId: z.string().min(1, 'El proveedor es requerido'),
  fechaRecepcion: z.string().min(1, 'La fecha de recepción es requerida'),
  fechaProduccion: z.string().optional(),
  fechaCaducidad: z.string().optional(),
  cantidad: z.string().min(1, 'La cantidad es requerida'),
  cantidadDisponible: z.string().min(1, 'La cantidad disponible es requerida'),
  precio: z.string().optional(),
  ordenCompraId: z.string().optional(),
  notas: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface LotesMateriaPrimaFormProps {
  onSubmit: (data: Partial<LoteMateriaPrima>) => Promise<void>
}

export function LotesMateriaPrimaForm({ onSubmit }: LotesMateriaPrimaFormProps) {
  const { currentRow, setOpen } = useLotesMateriaPrima()
  const { data: materiasPrimasData } = useGetMateriasPrimas({ page: 1, limit: 1000 })
  const { data: proveedoresData } = useGetProveedores()
  const { data: ordenesCompraData } = useGetOrdenesCompra()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materiaPrimaId: currentRow?.materiaPrimaId.toString() || '',
      codigoLote: currentRow?.codigoLote || '',
      proveedorId: currentRow?.proveedorId.toString() || '',
      fechaRecepcion: currentRow?.fechaRecepcion
        ? new Date(currentRow.fechaRecepcion).toISOString().split('T')[0]
        : '',
      fechaProduccion: currentRow?.fechaProduccion
        ? new Date(currentRow.fechaProduccion).toISOString().split('T')[0]
        : '',
      fechaCaducidad: currentRow?.fechaCaducidad
        ? new Date(currentRow.fechaCaducidad).toISOString().split('T')[0]
        : '',
      cantidad: currentRow?.cantidad.toString() || '',
      cantidadDisponible: currentRow?.cantidadDisponible.toString() || '',
      precio: currentRow?.precio?.toString() || '',
      ordenCompraId: currentRow?.ordenCompraId?.toString() || '',
      notas: currentRow?.notas || '',
    },
  })

  async function onSubmitForm(values: FormValues) {
    try {
      const data = {
        ...values,
        materiaPrimaId: parseInt(values.materiaPrimaId),
        proveedorId: parseInt(values.proveedorId),
        ordenCompraId: values.ordenCompraId ? parseInt(values.ordenCompraId) : null,
        cantidad: parseFloat(values.cantidad),
        cantidadDisponible: parseFloat(values.cantidadDisponible),
        precio: values.precio ? parseFloat(values.precio) : null,
        fechaProduccion: values.fechaProduccion || null,
        fechaCaducidad: values.fechaCaducidad || null,
      }
      await onSubmit(data)
      setOpen(null)
    } catch (error) {
      console.error('Error al enviar el formulario:', error)
      toast.error('Error al guardar el lote. Por favor, verifique los datos e intente nuevamente.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4 max-w-md mx-auto">
        <FormField
          control={form.control}
          name='materiaPrimaId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Materia Prima</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder='Seleccione una materia prima' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {materiasPrimasData?.items?.map((materiaPrima) => (
                    <SelectItem key={materiaPrima.id} value={materiaPrima.id?.toString() || ''}>
                      {materiaPrima.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        { currentRow?.id && (
        <FormField
          control={form.control}
          name='codigoLote'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código de Lote</FormLabel>
              <FormControl>
                <Input 
                  placeholder='Ingrese el código de lote' 
                  {...field} 
                  disabled={!!currentRow?.id}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        )}
        <FormField
          control={form.control}
          name='proveedorId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder='Seleccione un proveedor' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {proveedoresData?.map((proveedor) => (
                    <SelectItem key={proveedor.id} value={proveedor.id.toString()}>
                      {proveedor.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='fechaRecepcion'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Recepción</FormLabel>
              <FormControl>
                <Input type='date' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='fechaProduccion'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Producción</FormLabel>
              <FormControl>
                <Input type='date' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='fechaCaducidad'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Caducidad</FormLabel>
              <FormControl>
                <Input type='date' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='cantidad'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad</FormLabel>
              <FormControl>
                <Input type='number' step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='cantidadDisponible'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad Disponible</FormLabel>
              <FormControl>
                <Input type='number' step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='precio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input type='number' step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='ordenCompraId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orden de Compra</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder='Seleccione una orden de compra' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ordenesCompraData?.map((orden) => (
                    <SelectItem key={orden.id} value={orden.id.toString()}>
                      {orden.codigo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='notas'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(null)}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {currentRow ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 