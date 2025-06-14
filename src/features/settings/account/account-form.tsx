import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/stores/authStore'
import { useActualizarEmpresa } from '@/services/api/hooks/useEmpresas'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const empresaFormSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  razonSocial: z.string().min(2, 'La razón social es requerida'),
  rut: z.string().min(1, 'El RUT es requerido'),
  direccion: z.string().min(1, 'La dirección es requerida'),
  comuna: z.string().min(1, 'La comuna es requerida'),
  ciudad: z.string().min(1, 'La ciudad es requerida'),
  pais: z.string().min(1, 'El país es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Email inválido'),
  estado: z.string().min(1, 'El estado es requerido'),
  notas: z.string().optional(),
})

type EmpresaFormValues = z.infer<typeof empresaFormSchema>

export function AccountForm() {
  const { auth } = useAuthStore()
  const empresaData = auth.user?.empresa
  const empresaId = empresaData?.id
  const updateEmpresa = useActualizarEmpresa()

  const defaultValues: Partial<EmpresaFormValues> = {
    codigo: empresaData?.codigo || '',
    nombre: empresaData?.nombre || '',
    razonSocial: empresaData?.razonSocial || '',
    rut: empresaData?.rut || '',
    direccion: empresaData?.direccion || '',
    comuna: empresaData?.comuna || '',
    ciudad: empresaData?.ciudad || '',
    pais: empresaData?.pais || '',
    telefono: empresaData?.telefono || '',
    email: empresaData?.email || '',
    estado: empresaData?.estado || '',
    notas: empresaData?.notas || '',
  }

  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const onSubmit = async (data: EmpresaFormValues) => {
    try {
      if (!empresaId) {
        toast.error('No se pudo obtener el ID de la empresa')
        return
      }

      await updateEmpresa.mutateAsync({
        id: empresaId,
        empresa: data
      })

      toast.success('Empresa actualizada correctamente')
    } catch (error) {
      toast.error('Error al actualizar la empresa')
      console.error('Error al actualizar empresa:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='codigo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-muted cursor-not-allowed" />
              </FormControl>
              <FormDescription>
                El código de la empresa no puede ser modificado.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='nombre'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='razonSocial'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razón Social</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='rut'
          render={({ field }) => (
            <FormItem>
              <FormLabel>RUT</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='direccion'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='comuna'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comuna</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='ciudad'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='pais'
          render={({ field }) => (
            <FormItem>
              <FormLabel>País</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='telefono'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='estado'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-muted cursor-not-allowed" />
              </FormControl>
              <FormDescription>
                El estado de la empresa no puede ser modificado.
              </FormDescription>
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
        <Button type='submit' disabled={updateEmpresa.isPending}>
          {updateEmpresa.isPending ? 'Actualizando...' : 'Actualizar empresa'}
        </Button>
      </form>
    </Form>
  )
}
