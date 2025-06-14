import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AuthLayout from '../auth/auth-layout'

export default function Terms() {
  return (
    <AuthLayout>
      <Card className='max-w-3xl'>
        <CardHeader>
          <CardTitle className='text-2xl'>Términos de Servicio</CardTitle>
          <CardDescription>
            Última actualización: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className='prose prose-sm max-w-none'>
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos términos y condiciones de uso.
            Si no está de acuerdo con alguno de estos términos, no podrá acceder al sitio.
          </p>

          <h2>2. Uso del Servicio</h2>
          <p>
            El servicio está diseñado para la gestión de inventario y operaciones de la Cervecería La Cantera.
            Usted acepta utilizar el servicio solo para fines legales y de acuerdo con estos términos.
          </p>

          <h2>3. Cuentas de Usuario</h2>
          <p>
            Para acceder a ciertas funciones del servicio, debe registrarse para obtener una cuenta.
            Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.
          </p>

          <h2>4. Propiedad Intelectual</h2>
          <p>
            Todo el contenido incluido en este sitio, como texto, gráficos, logotipos, iconos, imágenes,
            clips de audio, descargas digitales y compilaciones de datos, es propiedad de Cervecería La Cantera
            o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual.
          </p>

          <h2>5. Limitación de Responsabilidad</h2>
          <p>
            En ningún caso Cervecería La Cantera será responsable por daños directos, indirectos,
            incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar el servicio.
          </p>

          <h2>6. Modificaciones del Servicio</h2>
          <p>
            Nos reservamos el derecho de modificar o descontinuar, temporal o permanentemente,
            el servicio (o cualquier parte del mismo) con o sin previo aviso.
          </p>

          <h2>7. Ley Aplicable</h2>
          <p>
            Estos términos se regirán e interpretarán de acuerdo con las leyes de México,
            sin tener en cuenta sus disposiciones sobre conflictos de leyes.
          </p>

          <h2>8. Contacto</h2>
          <p>
            Si tiene alguna pregunta sobre estos Términos de Servicio, puede contactarnos a través de:
            <br />
            Email: contacto@cervecerialacantera.com
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
} 