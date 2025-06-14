import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AuthLayout from '../auth/auth-layout'

export default function Privacy() {
  return (
    <AuthLayout>
      <Card className='max-w-3xl'>
        <CardHeader>
          <CardTitle className='text-2xl'>Política de Privacidad</CardTitle>
          <CardDescription>
            Última actualización: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className='prose prose-sm max-w-none'>
          <h2>1. Información que Recopilamos</h2>
          <p>
            Recopilamos información que usted nos proporciona directamente, incluyendo:
          </p>
          <ul>
            <li>Información de contacto (nombre, correo electrónico, número de teléfono)</li>
            <li>Información de la cuenta (credenciales de inicio de sesión)</li>
            <li>Información de uso del servicio</li>
          </ul>

          <h2>2. Uso de la Información</h2>
          <p>
            Utilizamos la información recopilada para:
          </p>
          <ul>
            <li>Proporcionar, mantener y mejorar nuestros servicios</li>
            <li>Procesar transacciones y enviar información relacionada</li>
            <li>Enviar comunicaciones técnicas, actualizaciones y mensajes administrativos</li>
            <li>Responder a sus comentarios y preguntas</li>
          </ul>

          <h2>3. Protección de la Información</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger
            la información personal contra el acceso, la divulgación, la alteración o la destrucción no autorizados.
          </p>

          <h2>4. Compartir Información</h2>
          <p>
            No vendemos ni alquilamos su información personal a terceros. Podemos compartir su información
            en las siguientes circunstancias:
          </p>
          <ul>
            <li>Con proveedores de servicios que nos ayudan a operar nuestro negocio</li>
            <li>Para cumplir con obligaciones legales</li>
            <li>Para proteger nuestros derechos y propiedad</li>
          </ul>

          <h2>5. Sus Derechos</h2>
          <p>
            Usted tiene derecho a:
          </p>
          <ul>
            <li>Acceder a su información personal</li>
            <li>Corregir información inexacta</li>
            <li>Solicitar la eliminación de su información</li>
            <li>Oponerse al procesamiento de su información</li>
          </ul>

          <h2>6. Cookies y Tecnologías Similares</h2>
          <p>
            Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web.
            Puede controlar el uso de cookies a través de la configuración de su navegador.
          </p>

          <h2>7. Cambios en la Política de Privacidad</h2>
          <p>
            Podemos actualizar esta política de privacidad de vez en cuando. Le notificaremos cualquier cambio
            publicando la nueva política de privacidad en esta página.
          </p>

          <h2>8. Contacto</h2>
          <p>
            Si tiene preguntas sobre esta política de privacidad, puede contactarnos a través de:
            <br />
            Email: privacidad@cervecerialacantera.com
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
} 