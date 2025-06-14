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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type Receta } from '@/services/api/recetas'
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
import { useAuthStore } from '@/stores/authStore'
import { useGetMateriasPrimas } from '@/services/api/hooks/useMateriasPrimas'
import { useCrearReceta, useActualizarReceta } from '@/services/api/hooks/useRecetas'
import { useGetElementosInventario } from '@/services/api/hooks/useInventario'
import { type ProductoTerminado } from '@/services/api/productos-terminados'
import { type MateriaPrima } from '@/services/api/materias-primas'

const parametroTeoricoSchema = z.object({
  valor: z.number().min(0, 'El valor no puede ser negativo'),
  unidad: z.string().min(1, 'Debe seleccionar una unidad de medida'),
})

const parametrosTeoricosSchema = z.object({
  ABV: parametroTeoricoSchema,
  IBU: parametroTeoricoSchema,
})

const detalleRecetaSchema = z.object({
  materiaPrimaId: z.number().min(1, 'Debe seleccionar una materia prima'),
  etapaProduccion: z.string().min(1, 'Debe especificar la etapa de producción'),
  cantidad: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  unidadMedida: z.string().min(1, 'Debe seleccionar una unidad de medida'),
  tiempoAdicion: z.number().min(0, 'El tiempo de adición debe ser un valor positivo'),
  unidadTiempo: z.string().min(1, 'Debe seleccionar una unidad de tiempo'),
  notas: z.string().optional(),
  orden: z.number().min(1, 'El orden de adición es requerido'),
})

const formSchema = z.object({
  nombre: z.string().min(1, 'El nombre de la receta es obligatorio'),
  estilo: z.string().min(1, 'Debe especificar el estilo de la cerveza'),
  productoTerminadoId: z.string().optional(),
  descripcion: z.string().min(1, 'La descripción de la receta es obligatoria'),
  volumenFinal: z.number().min(0.01, 'El volumen final debe ser mayor a 0'),
  unidadVolumen: z.string().min(1, 'Debe seleccionar una unidad de volumen'),
  instrucciones: z.string().min(1, 'Las instrucciones de elaboración son obligatorias'),
  parametrosTeoricos: parametrosTeoricosSchema,
  rendimientoEsperado: z.number().min(0.01).max(100, 'El rendimiento debe estar entre 0.01% y 100%'),
  notas: z.string().optional(),
  detalles: z.array(detalleRecetaSchema).min(1, 'Debe agregar al menos un ingrediente a la receta'),
})

type FormValues = z.infer<typeof formSchema>

interface FormularioRecetaProps {
  receta?: Receta
  onCancel: () => void
  onSuccess: () => void
}

// Función para normalizar los tipos de los campos numéricos
function normalizarReceta(receta?: Receta): FormValues {
  if (!receta) return {
    nombre: '',
    estilo: '',
    productoTerminadoId: '',
    descripcion: '',
    volumenFinal: 0,
    unidadVolumen: 'L',
    instrucciones: '',
    parametrosTeoricos: {
      ABV: { valor: 0, unidad: '%' },
      IBU: { valor: 0, unidad: 'IBU' },
    },
    rendimientoEsperado: 0,
    notas: '',
    detalles: [],
  };

  return {
    nombre: receta.nombre,
    estilo: receta.estilo,
    productoTerminadoId: receta.productoTerminado?.id?.toString() || receta.productoTerminadoId?.toString() || "",
    descripcion: receta.descripcion ?? '',
    volumenFinal: Number(receta.volumenFinal),
    unidadVolumen: receta.unidadVolumen,
    instrucciones: receta.instrucciones ?? '',
    parametrosTeoricos: receta.parametrosTeoricos ?? {
      ABV: { valor: 0, unidad: '%' },
      IBU: { valor: 0, unidad: 'IBU' },
    },
    rendimientoEsperado: Number(receta.rendimientoEsperado ?? 0),
    notas: receta.notas ?? '',
    detalles: (receta.detalles || []).map(det => ({
      materiaPrimaId: Number(det.materiaPrimaId),
      etapaProduccion: det.etapaProduccion,
      cantidad: Number(det.cantidad),
      unidadMedida: det.unidadMedida,
      tiempoAdicion: det.tiempoAdicion != null ? Number(det.tiempoAdicion) : 0,
      unidadTiempo: det.unidadTiempo ?? '',
      notas: det.notas ?? '',
      orden: Number(det.orden),
    })),
  };
}

export function FormularioReceta({ receta, onCancel, onSuccess }: FormularioRecetaProps) {
  const { user } = useAuthStore((state) => state.auth)
  const { data: materiasPrimasData, isLoading: isLoadingMateriasPrimas } = useGetMateriasPrimas({ limit: 1000 })
  const { data: productosTerminadosData, isLoading: isLoadingProductosTerminados } = useGetElementosInventario('ProductoTerminado')

  // Mutaciones de recetas
  const crearRecetaMutation = useCrearReceta();
  const actualizarRecetaMutation = useActualizarReceta();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: normalizarReceta(receta),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'detalles',
  })

  const onSubmit = async (values: FormValues) => {
    try {
      if (!user || !user.id) {
        toast.error('No se pudo obtener el ID del usuario autenticado');
        return;
      }
      if (!values.detalles || values.detalles.length === 0) {
        toast.error('Debe agregar al menos un detalle a la receta');
        return;
      }
      const materiasPrimasIds = values.detalles.map(detalle => detalle.materiaPrimaId);
      const materiasPrimasUnicas = new Set(materiasPrimasIds);
      if (materiasPrimasIds.length !== materiasPrimasUnicas.size) {
        toast.error('No se pueden agregar materias primas duplicadas en la receta');
        return;
      }

      // Normaliza detalles para que siempre tengan notas:string y, si existe, id:number
      const detalles = values.detalles.map((det, idx) => ({
        ...det,
        id: (receta?.detalles?.[idx]?.id ?? undefined), // solo si existe, si no, omite
        notas: det.notas ?? '', // nunca undefined
      }));

      if (receta?.id) {
        await actualizarRecetaMutation.mutateAsync({
          id: receta.id,
          data: {
            ...values,
            id: receta.id,
            productoTerminadoId: values.productoTerminadoId ? Number(values.productoTerminadoId) : null,
            volumenFinal: String(values.volumenFinal),
            codigo: receta.codigo,
            version: receta.version,
            estado: receta.estado,
            notas: values.notas ?? '',
            detalles,
          }
        });
        toast.success('Receta actualizada correctamente');
      } else {
        await crearRecetaMutation.mutateAsync({
          ...values,
          productoTerminadoId: values.productoTerminadoId ? Number(values.productoTerminadoId) : null,
          volumenFinal: String(values.volumenFinal),
          codigo: '',
          version: '1.0.0',
          estado: 'Borrador',
          notas: values.notas ?? '',
          detalles,
        });
        toast.success('Receta creada correctamente');
      }
      onSuccess();
    } catch (error) {
      toast.error('Error al guardar la receta');
      console.error(error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              if (errors.detalles) {
                toast.error('Debe agregar al menos un detalle a la receta');
              }
            })}
            className="space-y-4 max-w-md mx-auto"
          >
            <FormField
              control={form.control}
              name="productoTerminadoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producto Terminado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un producto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingProductosTerminados ? (
                        <SelectItem value="loading" disabled>Cargando...</SelectItem>
                      ) : (
                        (productosTerminadosData as ProductoTerminado[] || []).map((producto) => (
                          <SelectItem key={producto.id?.toString()} value={producto.id?.toString() || ''}>
                            {producto.nombre} ({producto.estilo})
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
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la receta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estilo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estilo</FormLabel>
                  <FormControl>
                    <Input placeholder="Estilo de la cerveza" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción de la receta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="volumenFinal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volumen Final</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Volumen final" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-40">
                <FormField
                  control={form.control}
                  name="unidadVolumen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidad de Volumen</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione una unidad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="L">Litros (L)</SelectItem>
                          <SelectItem value="ml">Mililitros (ml)</SelectItem>
                          <SelectItem value="hl">Hectolitros (hl)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="instrucciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instrucciones</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Instrucciones de elaboración" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="parametrosTeoricos.ABV.valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ABV (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="ABV (%)" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="parametrosTeoricos.IBU.valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IBU</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="IBU" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="rendimientoEsperado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rendimiento Esperado (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="100" placeholder="Rendimiento esperado (%)" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notas adicionales" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Sección de Detalles */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Detalles de la Receta</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({
                    materiaPrimaId: 1,
                    etapaProduccion: '',
                    cantidad: 0,
                    unidadMedida: 'kg',
                    tiempoAdicion: 1,
                    unidadTiempo: 'min',
                    orden: fields.length + 1,
                  })}
                >
                  <IconPlus className="h-4 w-4 mr-2" />
                  Agregar Detalle
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Materia Prima</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Tiempo</TableHead>
                    <TableHead>Notas</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`detalles.${index}.materiaPrimaId`}
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={v => field.onChange(Number(v))} defaultValue={field.value.toString()}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione materia prima" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {isLoadingMateriasPrimas ? (
                                    <SelectItem value="loading" disabled>Cargando...</SelectItem>
                                  ) : (
                                    (materiasPrimasData?.items || []).map((mp: MateriaPrima) => (
                                      <SelectItem key={mp.id?.toString() || ''} value={mp.id?.toString() || ''}>
                                        {mp.nombre} ({mp.unidadMedida})
                                      </SelectItem>
                                    ))
                                  )}
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
                          name={`detalles.${index}.etapaProduccion`}
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione etapa" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Macerado">Macerado</SelectItem>
                                  <SelectItem value="Hervido">Hervido</SelectItem>
                                  <SelectItem value="Fermentación">Fermentación</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <FormField
                            control={form.control}
                            name={`detalles.${index}.cantidad`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={e => field.onChange(Number(e.target.value))}
                                    className="w-24"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`detalles.${index}.unidadMedida`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-20">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="kg">kg</SelectItem>
                                    <SelectItem value="g">g</SelectItem>
                                    <SelectItem value="L">L</SelectItem>
                                    <SelectItem value="ml">ml</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <FormField
                            control={form.control}
                            name={`detalles.${index}.tiempoAdicion`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={e => field.onChange(Number(e.target.value))}
                                    className="w-20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`detalles.${index}.unidadTiempo`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-20">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="min">min</SelectItem>
                                    <SelectItem value="h">h</SelectItem>
                                    <SelectItem value="días">días</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`detalles.${index}.notas`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} />
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
                          onClick={() => remove(index)}
                          className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {receta ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 