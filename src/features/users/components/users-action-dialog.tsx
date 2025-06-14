'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { User, UserRole, UserCreate, UserUpdate } from '../data/schema'
import { useCrearUsuario, useActualizarUsuario, useGetRoles } from '@/services/api/hooks/useUsuarios'
import { useAuthStore } from '@/stores/authStore'

const formSchema = z
  .object({
    nombreUsuario: z.string().min(1, { message: 'El nombre de usuario es requerido.' }),
    nombre: z.string().min(1, { message: 'El nombre es requerido.' }),
    apellido: z.string().min(1, { message: 'El apellido es requerido.' }),
    email: z
      .string()
      .min(1, { message: 'El email es requerido.' })
      .email({ message: 'El email no es válido.' }),
    password: z.string().transform((pwd) => pwd.trim()),
    rolId: z.number({ required_error: 'El rol es requerido.' }),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
    telefono: z.string().nullable()
  })
  .superRefine(({ isEdit, password, confirmPassword }, ctx) => {
    if (!isEdit || (isEdit && password !== '')) {
      if (password === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La contraseña es requerida.',
          path: ['password'],
        })
      }

      if (password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La contraseña debe tener al menos 8 caracteres.',
          path: ['password'],
        })
      }

      if (!password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La contraseña debe contener al menos una letra minúscula.',
          path: ['password'],
        })
      }

      if (!password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La contraseña debe contener al menos un número.',
          path: ['password'],
        })
      }

      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Las contraseñas no coinciden.',
          path: ['confirmPassword'],
        })
      }
    }
  })
type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const { mutate: crearUsuario } = useCrearUsuario()
  const { mutate: actualizarUsuario } = useActualizarUsuario()
  const { data: rolesData } = useGetRoles()
  const { user } = useAuthStore((state) => state.auth)
  const isSuperAdmin = user?.user_metadata.rol === 'SuperAdmin'

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          rolId: currentRow.rolId,
          password: '',
          confirmPassword: '',
          isEdit,
          telefono: currentRow.telefono || null
        }
      : {
          nombreUsuario: '',
          nombre: '',
          apellido: '',
          email: '',
          rolId: undefined,
          password: '',
          confirmPassword: '',
          isEdit,
          telefono: null
        },
  })

  const onSubmit = (values: UserForm) => {
    if (isEdit && currentRow) {
      const updateData: UserUpdate = {
        nombreUsuario: values.nombreUsuario,
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email,
        rolId: values.rolId,
        estado: currentRow.estado,
        telefono: values.telefono || undefined,
        ...(values.password ? { password: values.password } : {})
      }
      actualizarUsuario({
        id: currentRow.id,
        usuario: updateData
      })
    } else {
      const createData: UserCreate = {
        nombreUsuario: values.nombreUsuario,
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email,
        rolId: values.rolId,
        estado: 'Activo',
        password: values.password,
        telefono: values.telefono
      }
      crearUsuario(createData)
    }
    form.reset()
    onOpenChange(false)
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Actualiza los datos del usuario aquí. ' : 'Crea un nuevo usuario aquí. '}
            Haz clic en guardar cuando hayas terminado.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='nombreUsuario'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Nombre de Usuario
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='juan_doe'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nombre'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Juan'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='apellido'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Apellido
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Doe'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='juan.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='telefono'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Teléfono
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='+56 9 1234 5678'
                        className='col-span-4'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='rolId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>Rol</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={value => field.onChange(Number(value))}
                      placeholder='Selecciona un rol'
                      className='w-full'
                      items={rolesData?.data.filter(({ nombre }) => {
                        if (!isSuperAdmin) {
                          return nombre.toLowerCase() !== 'superadmin'
                        }
                        return true
                      }).map(({ id, nombre }) => ({
                        label: nombre,
                        value: id,
                      })) || []}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Contraseña
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='ej: S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-left'>
                      Confirmar Contraseña
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder='ej: S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
