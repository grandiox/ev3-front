import { z } from 'zod'
import { useForm } from 'react-hook-form'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductoTerminado } from './data/schema'

const estilos = [
  'LAGER', 'PILSNER', 'IPA', 'APA', 'PALE_ALE', 'STOUT', 'PORTER',
  'WHEAT', 'SOUR', 'BELGIAN', 'AMBER', 'RED_ALE', 'BROWN_ALE',
  'GOLDEN_ALE', 'BARLEYWINE', 'BOCK', 'SAISON', 'OTRO'
] as const;

const presentaciones = ['BOTELLA', 'LATA', 'BARRIL', 'GROWLER', 'OTRO'] as const;
const unidadesMedida = ['ml', 'l', 'unidad'] as const;

const formSchema = z.object({
  codigo: z.string().optional(),
  nombre: z.string().min(1, 'El nombre es requerido'),
  estilo: z.enum(estilos, { required_error: 'El estilo es requerido' }),
  presentacion: z.enum(presentaciones, { required_error: 'La presentación es requerida' }),
  capacidad: z.string()
    .min(1, 'La capacidad es requerida')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'La capacidad debe ser un número positivo'),
  unidadMedida: z.enum(unidadesMedida, { required_error: 'La unidad de medida es requerida' }),
  stockMinimo: z.string()
    .min(1, 'El stock mínimo es requerido')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Debe ser un número mayor o igual a 0'),
  descripcion: z.string().max(500, 'Máximo 500 caracteres').optional(),
  precioBase: z.string()
    .min(1, 'El precio base es requerido')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Debe ser un número positivo'),
  imagen: z.string().url('Debe ser una URL válida').optional(),
  notas: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface FormularioProductoTerminadoProps {
  onCancel: () => void
  onSubmit: (data: Partial<ProductoTerminado>) => Promise<void>
  productoExistente?: ProductoTerminado | null
}

export function FormularioProductoTerminado({ onCancel, onSubmit, productoExistente }: FormularioProductoTerminadoProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: productoExistente?.codigo || '',
      nombre: productoExistente?.nombre || '',
      estilo: (productoExistente?.estilo && estilos.some(e => e.toLowerCase() === productoExistente.estilo?.toLowerCase()))
        ? estilos.find(e => e.toLowerCase() === productoExistente.estilo?.toLowerCase()) as (typeof estilos)[number]
        : undefined,
      presentacion: (productoExistente?.presentacion && presentaciones.some(p => p.toLowerCase() === productoExistente.presentacion?.toLowerCase()))
        ? presentaciones.find(p => p.toLowerCase() === productoExistente.presentacion?.toLowerCase()) as (typeof presentaciones)[number]
        : undefined,
      capacidad: productoExistente?.capacidad || '',
      unidadMedida: (productoExistente?.unidadMedida && unidadesMedida.some(u => u.toLowerCase() === productoExistente.unidadMedida?.toLowerCase()))
        ? unidadesMedida.find(u => u.toLowerCase() === productoExistente.unidadMedida?.toLowerCase()) as (typeof unidadesMedida)[number]
        : undefined,
      stockMinimo: productoExistente?.stockMinimo || '',
      descripcion: productoExistente?.descripcion || '',
      precioBase: productoExistente?.precioBase || '',
      imagen: productoExistente?.imagen || '',
      notas: productoExistente?.notas || '',
    },
  })

  const handleSubmit = async (data: FormValues) => {
    await onSubmit(data)
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-w-md mx-auto">
            {/* Código */}
            {productoExistente && (<>
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el código"
                      {...field}
                      disabled={!!productoExistente}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /></>)}
            {/* Nombre */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estilo */}
            <FormField
              control={form.control}
              name="estilo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estilo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione un estilo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {estilos.map((estilo) => (
                        <SelectItem key={estilo} value={estilo}>
                          {estilo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Presentación */}
            <FormField
              control={form.control}
              name="presentacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presentación</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una presentación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {presentaciones.map((presentacion) => (
                        <SelectItem key={presentacion} value={presentacion}>
                          {presentacion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacidad */}
            <FormField
              control={form.control}
              name="capacidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Capacidad"
                      {...field}
                      onChange={e => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unidad de Medida */}
            <FormField
              control={form.control}
              name="unidadMedida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de Medida</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una unidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unidadesMedida.map((unidad) => (
                        <SelectItem key={unidad} value={unidad}>
                          {unidad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stock Mínimo */}
            <FormField
              control={form.control}
              name="stockMinimo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Mínimo</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="Stock mínimo"
                      {...field}
                      onChange={e => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Precio Base */}
            <FormField
              control={form.control}
              name="precioBase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Base</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Precio base"
                      {...field}
                      onChange={e => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del producto"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL de Imagen */}
            <FormField
              control={form.control}
              name="imagen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Imagen</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="URL de la imagen del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notas */}
            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones de acción */}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onCancel} className="min-w-[100px]">
                Cancelar
              </Button>
              <Button type="submit" className="min-w-[120px]">
                {productoExistente ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}