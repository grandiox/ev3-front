import { AxiosError } from 'axios'
// import { toast } from 'sonner'

export function handleServerError(error: unknown) {
  // let errMsg = 'Algo salió mal!'
  // console.error(error)
  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    // errMsg = 'Contenido no encontrado.'
  }

  if (error instanceof AxiosError) {
    // errMsg = error.response?.data.title || 'Algo salió mal!'
  }
  
  // toast.error(errMsg)
}
