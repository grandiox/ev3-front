import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function UnauthorisedError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>401</h1>
        <span className='font-medium'>¡Ups! Parece que te perdiste la invitación</span>
        <p className='text-muted-foreground text-center'>
          Necesitamos que te identifiques primero <br /> para dejarte pasar a esta fiesta privada 🎉
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Volver Atrás
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>Ir al Inicio</Button>
        </div>
      </div>
    </div>
  )
}
