import { useForm, useFieldArray } from 'react-hook-form'
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
import { Pedido } from '@/services/api/pedidos'
import { Cliente } from '@/services/api/clientes'
import { ProductoTerminado } from '@/services/api/productos-terminados'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { IconPlus } from '@tabler/icons-react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { useGetClientesPedido } from '@/services/api/hooks/useClientesPedido'
import { useGetProductosTerminados } from '@/services/api/hooks/useProductosTerminados'
import { usePedidoForm } from '@/services/api/hooks/usePedidos'
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"

const canalesVenta = [
  { value: 'online', label: 'Online' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'telefono', label: 'Teléfono' },
] as const

const formSchema = z.object({
  clienteId: z.number({
    required_error: 'El cliente es requerido',
  }),
  canal: z.string({
    required_error: 'El canal es requerido',
  }),
  fechaEntregaProgramada: z.string({
    required_error: 'La fecha de entrega programada es requerida',
  }),
  subtotal: z.number().min(0),
  descuento: z.number().min(0),
  impuestos: z.number().min(0),
  total: z.number().min(0),
  notas: z.string().optional(),
  detalles: z.array(
    z.object({
      productoId: z.number({
        required_error: 'El producto es requerido',
      }),
      cantidad: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
      unidadMedida: z.string({
        required_error: 'La unidad de medida es requerida',
      }),
      precioUnitario: z.number().min(0, 'El precio debe ser mayor a 0'),
      descuento: z.number().min(0).optional(),
      subtotal: z.number().min(0),
      notas: z.string().optional(),
    })
  ).min(1, 'Debe agregar al menos un producto'),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  onCancel: () => void
  onSuccess: () => void
  pedido?: Pedido
}

export function FormularioPedido({ onCancel, onSuccess, pedido }: Props) {
  const { data: clientes } = useGetClientesPedido()
  const { data: productos, isLoading: loadingProductos } = useGetProductosTerminados()
  const { auth } = useAuthStore()
  const { user } = auth
  const pedidoFormMutation = usePedidoForm(onSuccess)

  // Asegurarnos de que productos sea un array
  const productosArray = Array.isArray(productos) ? productos : productos?.data || []

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!user?.id) {
      toast.error('No se encontró información del usuario. Por favor, inicia sesión nuevamente.')
      onCancel()
    }
  }, [user, onCancel])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clienteId: pedido?.clienteId || undefined,
      canal: pedido?.canal || '',
      fechaEntregaProgramada: pedido?.fechaEntregaProgramada || new Date().toISOString().split('T')[0],
      subtotal: pedido?.subtotal || 0,
      descuento: pedido?.descuento || 0,
      impuestos: pedido?.impuestos || 0,
      total: pedido?.total || 0,
      notas: pedido?.notas || '',
      detalles: pedido?.detalles?.map(detalle => ({
        productoId: Number(detalle.productoId),
        cantidad: Number(detalle.cantidad),
        unidadMedida: detalle.unidadMedida || 'unidad',
        precioUnitario: Number(detalle.precioUnitario),
        descuento: Number(detalle.descuento) || 0,
        subtotal: Number(detalle.subtotal),
        notas: detalle.notas || ''
      })) || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'detalles',
  })

  const onSubmit = async (_data: FormValues) => {
    try {
      if (!user?.id) {
        throw new Error('No se encontró información del usuario. Por favor, inicia sesión nuevamente.')
      }

      // Obtener los valores más recientes del formulario
      const data = form.getValues();

      // Recalcular subtotales y totales manualmente
      const detallesCalculados = data.detalles.map(detalle => {
        const cantidad = Number(detalle.cantidad) || 0;
        const precioUnitario = Number(detalle.precioUnitario) || 0;
        const descuento = Number(detalle.descuento) || 0;
        const subtotal = (cantidad * precioUnitario) - descuento;
        return {
          productoId: Number(detalle.productoId),
          cantidad,
          unidadMedida: detalle.unidadMedida || 'unidad',
          precioUnitario,
          descuento,
          subtotal,
          notas: detalle.notas || ''
        };
      });

      const subtotal = detallesCalculados.reduce((acc, d) => acc + d.subtotal, 0);
      const descuento = detallesCalculados.reduce((acc, d) => acc + (d.descuento || 0), 0);
      const impuestos = subtotal * 0.19;
      const total = subtotal + impuestos - descuento;

      // Convertir la fecha de YYYY-MM-DD a ISO string
      const fechaEntrega = new Date(data.fechaEntregaProgramada + 'T00:00:00');
      const fechaPedido = new Date();

      const payload = {
        clienteId: data.clienteId,
        canal: data.canal,
        fechaPedido: fechaPedido.toISOString(),
        fechaEntregaProgramada: fechaEntrega.toISOString(),
        subtotal,
        descuento,
        impuestos,
        total,
        notas: data.notas,
        detalles: detallesCalculados.map(detalle => ({
          productoId: Number(detalle.productoId),
          cantidad: Number(detalle.cantidad),
          unidadMedida: 'unidad',
          precioUnitario: Number(detalle.precioUnitario),
          descuento: Number(detalle.descuento),
          subtotal: Number(detalle.subtotal),
          notas: detalle.notas || ''
        })),
      };

      await pedidoFormMutation.mutateAsync(payload);
    } catch (error) {
      console.error('Error en onSubmit:', error);
      toast.error(error instanceof Error ? error.message : 'Error al guardar el pedido');
    }
  }

  // Función para recalcular totales
  const recalcularTotales = () => {
    const detalles = form.getValues('detalles')
    if (!detalles?.length) return

    // Forzar cálculo de subtotales antes de sumar
    detalles.forEach((detalle, index) => {
      const cantidad = Number(detalle.cantidad) || 0
      const precioUnitario = Number(detalle.precioUnitario) || 0
      const descuento = Number(detalle.descuento) || 0
      const subtotal = (cantidad * precioUnitario) - descuento
      form.setValue(`detalles.${index}.subtotal`, Number(subtotal.toFixed(2)))
    })

    const subtotal = detalles.reduce((acc, detalle) => acc + (Number(detalle.cantidad) * Number(detalle.precioUnitario) - (Number(detalle.descuento) || 0)), 0)
    const descuento = detalles.reduce((acc, detalle) => acc + (Number(detalle.descuento) || 0), 0)
    const impuestos = subtotal * 0.19
    const total = subtotal + impuestos - descuento

    form.setValue('subtotal', Number(subtotal.toFixed(2)))
    form.setValue('descuento', Number(descuento.toFixed(2)))
    form.setValue('impuestos', Number(impuestos.toFixed(2)))
    form.setValue('total', Number(total.toFixed(2)))
  }

  // Validar que el descuento no sea mayor que el subtotal del detalle
  const validarDescuento = (index: number) => {
    const detalle = form.getValues(`detalles.${index}`)
    if (!detalle) return

    const cantidad = Number(detalle.cantidad) || 0
    const precioUnitario = Number(detalle.precioUnitario) || 0
    const subtotalDetalle = cantidad * precioUnitario
    const descuento = Number(detalle.descuento) || 0

    if (descuento > subtotalDetalle) {
      form.setValue(`detalles.${index}.descuento`, subtotalDetalle)
      toast.warning('El descuento no puede ser mayor al subtotal del detalle')
    }
  }

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      // Solo recalcula si el cambio es en detalles o en algún campo de detalles
      if (
        name?.startsWith('detalles') &&
        (name.endsWith('cantidad') || name.endsWith('precioUnitario') || name.endsWith('descuento'))
      ) {
        recalcularTotales();
        // Validar solo el detalle que cambió
        const match = name.match(/^detalles\.(\d+)\./);
        if (match) {
          const index = Number(match[1]);
          validarDescuento(index);
        }
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clienteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString() ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientes?.map((cliente: Cliente) => (
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

          <FormField
            control={form.control}
            name="canal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canal de Venta</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un canal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {canalesVenta.map((canal) => (
                      <SelectItem key={canal.value} value={canal.value}>
                        {canal.label}
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
            name="fechaEntregaProgramada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Entrega Programada</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Detalles del Pedido</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  productoId: 0,
                  cantidad: 1,
                  unidadMedida: 'unidad',
                  precioUnitario: 0,
                  descuento: 0,
                  subtotal: 0,
                  notas: ''
                })
              }
            >
              <IconPlus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="mb-4 shadow-sm border border-muted py-1 min-w-[350px]">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-1 w-full">
                    <FormField
                      control={form.control}
                      name={`detalles.${index}.productoId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Producto</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(Number(value))
                              const producto = productosArray.find((p: ProductoTerminado) => p.id === Number(value))
                              if (producto) {
                                form.setValue(`detalles.${index}.precioUnitario`, Number(producto.precioBase) || 0)
                                recalcularTotales()
                              } else {
                                form.setValue(`detalles.${index}.precioUnitario`, 0)
                                recalcularTotales()
                              }
                            }}
                            value={field.value?.toString() ?? ""}
                          >
                            <FormControl>
                              <SelectTrigger  className="w-full" >
                                <SelectValue placeholder="Seleccione un producto" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {loadingProductos ? (
                                <div className="p-2 text-muted-foreground">Cargando productos...</div>
                              ) : productosArray.length === 0 ? (
                                <div className="p-2 text-muted-foreground">No hay productos disponibles</div>
                              ) : (
                                productosArray
                                  .filter((producto: ProductoTerminado) => producto && producto.id !== undefined)
                                  .map((producto: ProductoTerminado) =>
                                    producto && producto.id !== undefined ? (
                                      <SelectItem key={producto.id} value={producto.id.toString()}>
                                        {producto.nombre}
                                      </SelectItem>
                                    ) : null
                                  )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Input oculto para unidadMedida */}
              <input
                type="hidden"
                {...form.register(`detalles.${index}.unidadMedida`)}
                value={form.getValues(`detalles.${index}.unidadMedida`) || 'unidad'}
              />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-destructive hover:bg-destructive/10"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <FormField
                    control={form.control}
                    name={`detalles.${index}.cantidad`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Cantidad</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            step={1}
                            value={field.value ?? ""}
                            onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`detalles.${index}.precioUnitario`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Precio Unitario</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            step={1}
                            value={field.value ?? ""}
                            onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`detalles.${index}.descuento`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Descuento</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step={0.01} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`detalles.${index}.subtotal`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Subtotal</FormLabel>
                        <FormControl>
                          <Input type="text" readOnly value={formatCurrency(field.value)} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <FormField
            control={form.control}
            name="subtotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtotal</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    readOnly
                    {...field}
                    value={formatCurrency(field.value)}
                  />
                </FormControl>
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
                    type="text"
                    readOnly
                    {...field}
                    value={formatCurrency(field.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="impuestos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impuestos (19%)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    readOnly
                    {...field}
                    value={formatCurrency(field.value)}
                  />
                </FormControl>
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
                  <Input
                    type="text"
                    readOnly
                    {...field}
                    value={formatCurrency(field.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
          >
            {pedido?.id ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Form>
  )
} 