import { HTMLAttributes, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { loginUser } from '../../services/authService';
import { AuthError, type LoginCredentials } from '../../types';
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
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
import { PasswordInput } from '@/components/password-input'
import { toast } from 'sonner'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Por favor ingresa tu correo electrónico' })
    .email({ message: 'Correo electrónico inválido' }),
  password: z
    .string()
    .min(1, {
      message: 'Por favor ingresa tu contraseña',
    })
    .min(7, {
      message: 'La contraseña debe tener al menos 7 caracteres',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate();
  const { setUser, setAccessToken } = useAuthStore((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // 1. Login con backend
      const loginData: LoginCredentials = {
        email: data.email,
        password: data.password,
      };
      const authResponse = await loginUser(loginData);

      if (!authResponse?.session?.access_token) {
        toast.error('No se recibió un token de acceso válido');
        throw new Error('No se recibió un token de acceso válido');
      }

      setAccessToken(authResponse.session.access_token);
      setUser(authResponse.user);

      // Obtener la ruta de redirección de los parámetros de búsqueda
      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get('redirect') || '/';

      // Redirigir a la ruta guardada o a la ruta principal
      navigate({ to: redirectPath });
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error en el login:', authError);

      // Manejar diferentes tipos de errores
      if (error instanceof Error) {
        toast.error(error.message || 'Error al iniciar sesión');
        form.setError('root.serverError', {
          type: 'manual',
          message: error.message || 'Error al iniciar sesión',
        });
      } else {
        toast.error('Error inesperado al iniciar sesión');
        form.setError('root.serverError', {
          type: 'manual',
          message: 'Error inesperado al iniciar sesión',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder='nombre@ejemplo.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </FormItem>
          )}
        />
        {form.formState.errors.root?.serverError && (
          <p className='text-sm font-medium text-destructive'>
            {form.formState.errors.root.serverError.message}
          </p>
        )}
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>
    </Form>
  )
}
