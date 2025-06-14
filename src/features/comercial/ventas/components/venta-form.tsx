import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useVentas } from '../context/ventas-context'
import { useGetClientesPedido } from '@/services/api/hooks/useClientesPedido'
import { useGetProductosTerminados } from '@/services/api/hooks/useProductosTerminados'
import { toast } from 'sonner'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'

const canales = ['online', 'presencial', 'telefono'] as const
const estados = ['PENDIENTE', 'PAGADA', 'ENTREGADA', 'CANCELADA'] as const

const detalleVentaSchema = z.object({
  productoId: z.number({
    required_error: 'El producto es requerido',
  }),
  cantidad: z.number({
    required_error: 'La cantidad es requerida',
  }).min(0.01, 'La cantidad debe ser mayor a 0'),
  unidadMedida: z.string().min(1, 'La unidad de medida es requerida'),
  precioUnitario: z.number({
    required_error: 'El precio unitario es requerido',
  }).min(0.01, 'El precio debe ser mayor a 0'),
  descuento: z.number().min(0, 'El descuento no puede ser negativo').default(0),
  subtotal: z.number().min(0, 'El subtotal no puede ser negativo'),
  notas: z.string().optional(),
})

const formSchema = z.object({
  codigo: z.string().optional(),
  clienteId: z.number({
    required_error: 'El cliente es requerido',
  }),
  fechaVenta: z.string().min(1, 'La fecha de venta es requerida'),
  canal: z.string().min(1, 'El canal es requerido'),
  estado: z.string().min(1, 'El estado es requerido'),
  notas: z.string().optional(),
  detalles: z.array(detalleVentaSchema).min(1, 'Debe agregar al menos un producto'),
  subtotal: z.number().min(0, 'El subtotal no puede ser negativo'),
  descuento: z.number().min(0, 'El descuento no puede ser negativo').default(0),
  impuestos: z.number().min(0, 'Los impuestos no pueden ser negativos').default(0),
  total: z.number().min(0, 'El total no puede ser negativo'),
})

type FormValues = z.infer<typeof formSchema>

interface VentaFormProps {
  onSubmit: (data: FormValues) => void
  onCancel: () => void
}

export function VentaForm({ onSubmit, onCancel }: VentaFormProps) {
  const { currentRow } = useVentas()
  const { data: clientes = [] } = useGetClientesPedido()
  const { data: productos = [] } = useGetProductosTerminados()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: currentRow?.codigo || '',
      clienteId: currentRow?.cliente?.id || undefined,
      fechaVenta: currentRow?.fechaVenta ? new Date(currentRow.fechaVenta).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      canal: (currentRow?.canal || 'presencial') as typeof canales[number],
      estado: (currentRow?.estado || 'PENDIENTE') as typeof estados[number],
      notas: currentRow?.notas || '',
      detalles: currentRow?.detalles?.map(d => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        unidadMedida: d.unidadMedida || 'UNIDAD',
        precioUnitario: d.precioUnitario,
        descuento: d.descuento || 0,
        subtotal: d.subtotal,
        notas: d.notas,
      })) || [],
      subtotal: currentRow?.subtotal || 0,
      descuento: currentRow?.descuento || 0,
      impuestos: currentRow?.impuestos || 0,
      total: currentRow?.total || 0,
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: 'detalles',
    control: form.control,
  })

  const handleSubmit = async (values: FormValues) => {
    try {
      // Recalcular totales antes de enviar
      const subtotal = calcularSubtotal(values.detalles)
      const total = calcularTotal(subtotal, values.descuento, values.impuestos)
      
      await onSubmit({
        ...values,
        subtotal,
        total,
      })
    } catch (error) {
      console.error('Error al enviar el formulario:', error)
      toast.error('Error al guardar la venta. Por favor, verifique los datos e intente nuevamente.')
    }
  }

  const calcularSubtotal = (detalles: FormValues['detalles']) => {
    return detalles.reduce((acc, detalle) => {
      const subtotalDetalle = (detalle.cantidad * detalle.precioUnitario) - (detalle.descuento || 0)
      return acc + subtotalDetalle
    }, 0)
  }

  const calcularTotal = (subtotal: number, descuento: number, impuestos: number) => {
    return subtotal - descuento + impuestos
  }

  const handleDetalleChange = (index: number, field: keyof FormValues['detalles'][0], value: any) => {
    const detalles = form.getValues('detalles')
    const detalle = detalles[index]
    
    if (field === 'cantidad' || field === 'precioUnitario' || field === 'descuento') {
      const cantidad = field === 'cantidad' ? value : detalle.cantidad
      const precioUnitario = field === 'precioUnitario' ? value : detalle.precioUnitario
      const descuento = field === 'descuento' ? value : (detalle.descuento || 0)
      const subtotal = (cantidad * precioUnitario) - descuento
      
      form.setValue(`detalles.${index}.subtotal`, subtotal)
    }
    
    form.setValue(`detalles.${index}.${field}`, value)
    
    // Recalcular totales
    const nuevosDetalles = form.getValues('detalles')
    const nuevoSubtotal = calcularSubtotal(nuevosDetalles)
    const descuento = form.getValues('descuento')
    const impuestos = form.getValues('impuestos')
    const nuevoTotal = calcularTotal(nuevoSubtotal, descuento, impuestos)
    
    form.setValue('subtotal', nuevoSubtotal)
    form.setValue('total', nuevoTotal)
  }

  const handleAddDetalle = () => {
    append({
      productoId: 0,
      cantidad: 1,
      unidadMedida: 'UNIDAD',
      precioUnitario: 0,
      descuento: 0,
      subtotal: 0,
      notas: '',
    })
  }

  const handleRemoveDetalle = (index: number) => {
    remove(index)
    // Recalcular totales después de eliminar
    const nuevosDetalles = form.getValues('detalles')
    const nuevoSubtotal = calcularSubtotal(nuevosDetalles)
    const descuento = form.getValues('descuento')
    const impuestos = form.getValues('impuestos')
    const nuevoTotal = calcularTotal(nuevoSubtotal, descuento, impuestos)
    
    form.setValue('subtotal', nuevoSubtotal)
    form.setValue('total', nuevoTotal)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Código */}
          {currentRow && (
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Cliente */}
          <FormField
            control={form.control}
            name="clienteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha de Venta */}
          <FormField
            control={form.control}
            name="fechaVenta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Venta</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Canal */}
          <FormField
            control={form.control}
            name="canal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canal</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un canal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {canales.map((canal) => (
                      <SelectItem key={canal} value={canal}>
                        {canal.charAt(0).toUpperCase() + canal.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Estado */}
          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {estados.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado.charAt(0) + estado.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notas */}
          <FormField
            control={form.control}
            name="notas"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Detalles de la Venta */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Detalles de la Venta</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddDetalle}
            >
              <IconPlus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="w-[100px]">Cantidad</TableHead>
                  <TableHead className="w-[100px]">Unidad</TableHead>
                  <TableHead className="w-[150px]">Precio Unit.</TableHead>
                  <TableHead className="w-[100px]">Descuento</TableHead>
                  <TableHead className="w-[150px]">Subtotal</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`detalles.${index}.productoId`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(value) => handleDetalleChange(index, 'productoId', Number(value))}
                              value={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione un producto" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {productos.map((producto) => (
                                  <SelectItem key={producto.id} value={producto.id.toString()}>
                                    {producto.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`detalles.${index}.cantidad`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                {...field}
                                onChange={(e) => handleDetalleChange(index, 'cantidad', parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`detalles.${index}.unidadMedida`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`detalles.${index}.precioUnitario`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                {...field}
                                onChange={(e) => handleDetalleChange(index, 'precioUnitario', parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`detalles.${index}.descuento`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                onChange={(e) => handleDetalleChange(index, 'descuento', parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`detalles.${index}.subtotal`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveDetalle(index)}
                      >
                        <IconTrash className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Totales */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="subtotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtotal</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descuento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descuento</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      field.onChange(value)
                      const subtotal = form.getValues('subtotal')
                      const impuestos = form.getValues('impuestos')
                      const total = calcularTotal(subtotal, value, impuestos)
                      form.setValue('total', total)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="impuestos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impuestos</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      field.onChange(value)
                      const subtotal = form.getValues('subtotal')
                      const descuento = form.getValues('descuento')
                      const total = calcularTotal(subtotal, descuento, value)
                      form.setValue('total', total)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
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