import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { OrdenProduccion } from '../types'

type PlanificacionDialogType = 'planificar' | 'verificar' | 'parametros' | 'lista-parametros' | 'validacion'

interface PlanificacionContextType {
  open: PlanificacionDialogType | null
  setOpen: (str: PlanificacionDialogType | null) => void
  currentRow: OrdenProduccion | null
  setCurrentRow: React.Dispatch<React.SetStateAction<OrdenProduccion | null>>
  fechaPreseleccionada: string | null
  setFechaPreseleccionada: React.Dispatch<React.SetStateAction<string | null>>
}

const PlanificacionContext = React.createContext<PlanificacionContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function PlanificacionProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<PlanificacionDialogType>(null)
  const [currentRow, setCurrentRow] = useState<OrdenProduccion | null>(null)
  const [fechaPreseleccionada, setFechaPreseleccionada] = useState<string | null>(null)

  return (
    <PlanificacionContext.Provider 
      value={{ 
        open, 
        setOpen, 
        currentRow, 
        setCurrentRow,
        fechaPreseleccionada,
        setFechaPreseleccionada
      }}
    >
      {children}
    </PlanificacionContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePlanificacion = () => {
  const planificacionContext = React.useContext(PlanificacionContext)

  if (!planificacionContext) {
    throw new Error('usePlanificacion has to be used within <PlanificacionContext>')
  }

  return planificacionContext
} 