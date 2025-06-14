import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'

export default function MaintenanceError() {
  const navigate = useNavigate()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>503</h1>
        <span className='font-medium'>¡Estamos de remodelación! 🛠️</span>
        <p className='text-muted-foreground text-center'>
          Estamos haciendo algunos ajustes para que todo funcione mejor <br />
          ¡Volveremos más fuertes y brillantes que nunca!
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => navigate({ to: '/' })}>Ver el Progreso</Button>
        </div>
      </div>
    </div>
  )
}
