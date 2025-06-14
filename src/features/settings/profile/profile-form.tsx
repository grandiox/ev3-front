import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetProfile, useActualizarUsuario } from '@/services/api/hooks/useUsuarios'
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
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'

const profileFormSchema = z.object({
  nombre: z
    .string()
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres.',
    })
    .max(30, {
      message: 'El nombre no debe tener más de 30 caracteres.',
    }),
  apellido: z
    .string()
    .min(2, {
      message: 'El apellido debe tener al menos 2 caracteres.',
    })
    .max(30, {
      message: 'El apellido no debe tener más de 30 caracteres.',
    }),
  email: z
    .string({
      required_error: 'Por favor ingresa un correo electrónico.',
    })
    .email('Por favor ingresa un correo electrónico válido.'),
  telefono: z
    .string()
    .nullable()
    .optional(),
  rol: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  const { data: profileData, isLoading } = useGetProfile()
  const updateUsuario = useActualizarUsuario()
  const user = useAuthStore((state) => state.auth.user)
  const isSuperAdmin = user?.user_metadata?.rol === 'SuperAdmin'

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: profileData,
    mode: 'onChange',
  })

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      if (!profileData?.id) {
        toast.error('No se pudo obtener el ID del usuario')
        return
      }

      const updateData = {
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono || undefined,
      }

      await updateUsuario.mutateAsync({
        id: profileData.id,
        usuario: updateData
      })

      toast.success('Perfil actualizado correctamente')
    } catch (error) {
      toast.error('Error al actualizar el perfil')
      console.error('Error al actualizar perfil:', error)
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='nombre'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder='nombre' {...field} disabled={!isSuperAdmin} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='apellido'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input placeholder='apellido' {...field} disabled={!isSuperAdmin} />
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
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder='correo@ejemplo.com' 
                  {...field} 
                  disabled 
                  className="bg-muted cursor-not-allowed"
                />
              </FormControl>
              <FormDescription>
                El correo electrónico no puede ser modificado.
              </FormDescription>
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
                <Input placeholder='+56 9 1234 5678' {...field} value={field.value || ''} disabled={!isSuperAdmin} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='rol'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  value={profileData?.rol || ''}
                  disabled 
                  className="bg-muted cursor-not-allowed"
                />
              </FormControl>
              <FormDescription>
                El rol no puede ser modificado.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={updateUsuario.isPending || !isSuperAdmin}>
          {updateUsuario.isPending ? 'Actualizando...' : 'Actualizar perfil'}
        </Button>
      </form>
    </Form>
  )
}
