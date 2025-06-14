import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

const ETAPAS_PRODUCCION = [
  'PREPARACION',
  'MACERADO',
  'COCCION',
  'FERMENTACION',
  'MADURACION',
  'FILTRADO',
  'ENVASADO',
  'CONTROL_CALIDAD'
] as const

const PARAMETROS_POR_ETAPA = {
  PREPARACION: [
    'TEMPERATURA_AGUA',
    'PH_AGUA',
    'DUREZA_AGUA',
    'CLORO_RESIDUAL'
  ],
  MACERADO: [
    'TEMPERATURA',
    'PH',
    'TIEMPO_REPOSO',
    'DENSIDAD'
  ],
  COCCION: [
    'TEMPERATURA',
    'TIEMPO_COCCION',
    'PRESION',
    'HUMEDAD'
  ],
  FERMENTACION: [
    'TEMPERATURA',
    'PH',
    'DENSIDAD',
    'GRADO_ALCOHOL',
    'AZUCARES_RESIDUALES'
  ],
  MADURACION: [
    'TEMPERATURA',
    'PRESION',
    'TIEMPO',
    'CO2_DISUELTO'
  ],
  FILTRADO: [
    'PRESION',
    'CAUDAL',
    'TURBIDEZ',
    'TEMPERATURA'
  ],
  ENVASADO: [
    'TEMPERATURA',
    'PRESION_LLENADO',
    'NIVEL_LLENADO',
    'HERMETICIDAD'
  ],
  CONTROL_CALIDAD: [
    'PH_FINAL',
    'GRADO_ALCOHOL_FINAL',
    'AMARGOR',
    'COLOR',
    'TURBIDEZ_FINAL'
  ]
} as const

const UNIDADES_MEDIDA = {
  // Temperatura
  TEMPERATURA: ['CELSIUS', 'FAHRENHEIT'],
  TEMPERATURA_AGUA: ['CELSIUS', 'FAHRENHEIT'],
  
  // pH
  PH: ['PH'],
  PH_AGUA: ['PH'],
  PH_FINAL: ['PH'],
  
  // Presión
  PRESION: ['PRESION_BAR', 'PRESION_PSI'],
  PRESION_LLENADO: ['PRESION_BAR', 'PRESION_PSI'],
  
  // Tiempo
  TIEMPO_REPOSO: ['MINUTOS', 'HORAS'],
  TIEMPO_COCCION: ['MINUTOS', 'HORAS'],
  TIEMPO: ['MINUTOS', 'HORAS'],
  
  // Densidad
  DENSIDAD: ['DENSIDAD_RELATIVA'],
  
  // Alcohol
  GRADO_ALCOHOL: ['GRADO_ALCOHOL'],
  GRADO_ALCOHOL_FINAL: ['GRADO_ALCOHOL'],
  
  // Caudal
  CAUDAL: ['LITROS_HORA', 'ML_MIN'],
  
  // Turbidez
  TURBIDEZ: ['NTU'],
  TURBIDEZ_FINAL: ['NTU'],
  
  // Color
  COLOR: ['EBC'],
  
  // Amargor
  AMARGOR: ['IBU'],
  
  // Otros
  DUREZA_AGUA: ['PPM'],
  CLORO_RESIDUAL: ['PPM'],
  HUMEDAD: ['PORCENTAJE'],
  AZUCARES_RESIDUALES: ['PORCENTAJE'],
  CO2_DISUELTO: ['PPM'],
  NIVEL_LLENADO: ['PORCENTAJE'],
  HERMETICIDAD: ['PORCENTAJE']
} as const

interface FormularioParametrosProcesoProps {
  loteFabricacionId: number
  onSubmit: (data: any) => void
  onCancel: () => void
  initialValues?: {
    etapaProduccion: string
    parametro: string
    valor: string | number
    unidadMedida: string
    notas: string
  }
}

export function FormularioParametrosProceso({
  loteFabricacionId,
  onSubmit,
  onCancel,
  initialValues
}: FormularioParametrosProcesoProps) {
  const [etapaProduccion, setEtapaProduccion] = useState<string>(initialValues?.etapaProduccion || '')
  const [parametro, setParametro] = useState<string>(initialValues?.parametro || '')
  const [valor, setValor] = useState<string>(initialValues?.valor?.toString() || '')
  const [unidadMedida, setUnidadMedida] = useState<string>(initialValues?.unidadMedida || '')
  const [notas, setNotas] = useState<string>(initialValues?.notas || '')

  const validarRango = (parametro: string, valor: number, unidad: string) => {
    switch (parametro) {
      case 'PH':
      case 'PH_AGUA':
      case 'PH_FINAL':
        if (valor < 0 || valor > 14) return 'El pH debe estar entre 0 y 14.'
        break
      case 'TEMPERATURA':
      case 'TEMPERATURA_AGUA':
        if (unidad === 'CELSIUS' && (valor < -50 || valor > 150)) return 'La temperatura (°C) debe estar entre -50 y 150.'
        if (unidad === 'FAHRENHEIT' && (valor < -58 || valor > 302)) return 'La temperatura (°F) debe estar entre -58 y 302.'
        break
      case 'PRESION':
      case 'PRESION_LLENADO':
        if ((unidad === 'PRESION_BAR' || unidad === 'PRESION_PSI') && (valor < 0 || valor > 100)) return 'La presión debe estar entre 0 y 100.'
        break
      case 'PORCENTAJE':
      case 'NIVEL_LLENADO':
      case 'HERMETICIDAD':
      case 'AZUCARES_RESIDUALES':
        if (valor < 0 || valor > 100) return 'El porcentaje debe estar entre 0 y 100.'
        break
      case 'DENSIDAD':
        if (valor < 0 || valor > 2) return 'La densidad debe estar entre 0 y 2.'
        break
      case 'AMARGOR':
        if (valor < 0 || valor > 120) return 'El amargor (IBU) debe estar entre 0 y 120.'
        break
      case 'COLOR':
        if (valor < 0 || valor > 80) return 'El color (EBC) debe estar entre 0 y 80.'
        break
      case 'GRADO_ALCOHOL':
      case 'GRADO_ALCOHOL_FINAL':
        if (valor < 0 || valor > 20) return 'El grado de alcohol debe estar entre 0 y 20.'
        break
      default:
        break
    }
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!etapaProduccion || !parametro || !valor || !unidadMedida) {
      toast.error('Por favor complete todos los campos requeridos')
      return
    }

    const valorNum = parseFloat(valor)
    const errorRango = validarRango(parametro, valorNum, unidadMedida)
    if (errorRango) {
      toast.error(errorRango)
      return
    }

    const data = {
      loteFabricacionId,
      etapaProduccion,
      parametro,
      valor: valorNum,
      unidadMedida,
      notas
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="etapaProduccion">Etapa de Producción</Label>
        <Select
          value={etapaProduccion}
          onValueChange={(value) => {
            setEtapaProduccion(value)
            setParametro('')
            setUnidadMedida('')
          }}
          disabled={!!initialValues}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una etapa" />
          </SelectTrigger>
          <SelectContent>
            {ETAPAS_PRODUCCION.map((etapa) => (
              <SelectItem key={etapa} value={etapa}>
                {etapa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="parametro">Parámetro</Label>
        <Select
          value={parametro}
          onValueChange={(value) => {
            setParametro(value)
            setUnidadMedida('')
          }}
          disabled={!etapaProduccion || !!initialValues}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un parámetro" />
          </SelectTrigger>
          <SelectContent>
            {etapaProduccion && PARAMETROS_POR_ETAPA[etapaProduccion as keyof typeof PARAMETROS_POR_ETAPA]?.map((param) => (
              <SelectItem key={param} value={param}>
                {param}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valor">Valor</Label>
          <Input
            id="valor"
            type="number"
            step="0.1"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ingrese el valor"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unidadMedida">Unidad de Medida</Label>
          <Select
            value={unidadMedida}
            onValueChange={setUnidadMedida}
            disabled={!parametro}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione unidad" />
            </SelectTrigger>
            <SelectContent>
              {parametro && UNIDADES_MEDIDA[parametro as keyof typeof UNIDADES_MEDIDA]?.map((unidad) => (
                <SelectItem key={unidad} value={unidad}>
                  {unidad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notas">Notas</Label>
        <Textarea
          id="notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Ingrese notas adicionales"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar
        </Button>
      </div>
    </form>
  )
} 