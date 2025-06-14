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
import { MateriaPrima } from './data/schema'
import { toast } from 'sonner'
import { useState } from 'react'

const tipos = ['MALTA', 'LUPULO', 'LEVADURA', 'ADJUNTO', 'OTRO'] as const
const unidadesMedida = ['kg', 'g', 'l', 'ml', 'unidad'] as const

const formSchema = z.object({
  codigo: z.string().optional(),
  nombre: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  tipo: z.enum(tipos, { required_error: 'El tipo es requerido' }),
  subtipo: z.string().max(50, 'Máximo 50 caracteres').optional(),
  unidadMedida: z.string().min(1, 'La unidad de medida es requerida').max(20, 'Máximo 20 caracteres'),
  stockMinimo: z.string().min(1, 'El stock mínimo es requerido'),
  stockActual: z.string().min(1, 'El stock actual es requerido'),
  ubicacionFisica: z.string().max(50, 'Máximo 50 caracteres').optional(),
  atributosEspecificos: z.unknown().optional(),
  notas: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
})

type FormValues = z.infer<typeof formSchema>

interface FormularioMateriaPrimaProps {
  onCancel: () => void
  materiaPrima?: MateriaPrima | null
  onSubmit: (data: Partial<MateriaPrima>) => Promise<void>
}

export function FormularioMateriaPrima({ onCancel, materiaPrima, onSubmit }: FormularioMateriaPrimaProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: materiaPrima?.codigo || '',
      nombre: materiaPrima?.nombre || '',
      tipo: (materiaPrima?.tipo && tipos.some(t => t.toLowerCase() === materiaPrima.tipo?.toLowerCase()))
        ? tipos.find(t => t.toLowerCase() === materiaPrima.tipo?.toLowerCase()) as (typeof tipos)[number]
        : undefined,
      subtipo: materiaPrima?.subtipo || '',
      unidadMedida: materiaPrima?.unidadMedida || 'kg',
      stockMinimo: materiaPrima?.stockMinimo || '',
      stockActual: materiaPrima?.stockActual || '',
      ubicacionFisica: materiaPrima?.ubicacionFisica || '',
      atributosEspecificos: materiaPrima?.atributosEspecificos || '',
      notas: materiaPrima?.notas || '',
    },
  })

  const [atributosEspecificosStr, setAtributosEspecificosStr] = useState('')

  const onSubmitForm = async (values: FormValues) => {
    try {
      let atributosObj = {}
      try {
        atributosObj = atributosEspecificosStr ? JSON.parse(atributosEspecificosStr) : {}
      } catch {
        atributosObj = {}
      }
      if (typeof atributosObj !== 'object' || atributosObj === null || Array.isArray(atributosObj)) {
        atributosObj = {}
      }
      const data = {
        nombre: values.nombre,
        tipo: values.tipo,
        subtipo: values.subtipo,
        unidadMedida: values.unidadMedida,
        stockMinimo: values.stockMinimo,
        stockActual: values.stockActual,
        ubicacionFisica: values.ubicacionFisica,
        atributosEspecificos: atributosObj,
        notas: values.notas,
      }
      await onSubmit(data)
      onCancel()
    } catch (error) {
      console.error('Error al guardar materia prima:', error)
      toast.error('Ha ocurrido un error al guardar la materia prima')
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4 max-w-md mx-auto">
            {/* Código */}
            {materiaPrima && (<>
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
                      disabled={!!materiaPrima}
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
                    <Input placeholder="Nombre de la materia prima" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo */}
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tipos.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subtipo */}
            <FormField
              control={form.control}
              name="subtipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Subtipo de la materia prima" {...field} />
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
                        <SelectValue placeholder="Selecciona una unidad" />
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
                    <Input type="number" step="0.01" placeholder="Stock mínimo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stock Actual */}
            <FormField
              control={form.control}
              name="stockActual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Actual</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Stock actual" {...field} disabled={!!materiaPrima} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ubicación Física */}
            <FormField
              control={form.control}
              name="ubicacionFisica"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación Física</FormLabel>
                  <FormControl>
                    <Input placeholder="Ubicación física" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Atributos Específicos */}
            <div>
              <FormLabel>Atributos Específicos</FormLabel>
              <FormControl>
                <Textarea
                  value={atributosEspecificosStr}
                  onChange={(e) => setAtributosEspecificosStr(e.target.value)}
                  placeholder="Ingrese los atributos específicos en formato JSON"
                  className="font-mono"
                />
              </FormControl>
            </div>

            {/* Notas */}
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

            {/* Botones de acción */}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onCancel} className="min-w-[100px]">
                Cancelar
              </Button>
              <Button type="submit" className="min-w-[120px]">
                {materiaPrima ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 