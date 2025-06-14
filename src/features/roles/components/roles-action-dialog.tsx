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
import { useCrearRol, useActualizarRol } from '@/services/api/hooks/useRoles'
import { Rol } from '@/services/api/roles'
import { useEffect } from 'react'

const formSchema = z.object({
  nombre: z.string().min(1, { message: 'El nombre es obligatorio.' }),
  descripcion: z.string().optional(),
})
type RolForm = z.infer<typeof formSchema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Rol | null
}

export function RolesActionDialog({ open, onOpenChange, currentRow }: Props) {
  const isEdit = !!currentRow
  const { mutate: crearRol } = useCrearRol()
  const { mutate: actualizarRol } = useActualizarRol()
  const form = useForm<RolForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { nombre: '', descripcion: '' },
  })

  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({ nombre: currentRow.nombre, descripcion: currentRow.descripcion || '' })
    } else {
      form.reset({ nombre: '', descripcion: '' })
    }
  }, [isEdit, currentRow, form])

  const onSubmit = (values: RolForm) => {
    if (isEdit && currentRow) {
      actualizarRol({ id: currentRow.id, rol: values })
    } else {
      crearRol(values)
    }
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Editar Rol' : 'Nuevo Rol'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza los datos del rol aquí. Haz clic en guardar cuando hayas terminado.'
              : 'Crea un nuevo rol aquí. Haz clic en guardar cuando hayas terminado.'}
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-0.5'>
              <FormField
                control={form.control}
                name='nombre'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nombre del rol'
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
                name='descripcion'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>Descripción</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Descripción (opcional)'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type='submit'>{isEdit ? 'Guardar Cambios' : 'Crear Rol'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 