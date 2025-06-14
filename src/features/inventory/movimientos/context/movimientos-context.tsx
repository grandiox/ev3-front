import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Movimiento } from '../data/schema'

type MovimientosDialogType = 'add' | 'edit' | 'delete'

interface MovimientosContextType {
  open: MovimientosDialogType | null
  setOpen: (str: MovimientosDialogType | null) => void
  currentRow: Movimiento | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Movimiento | null>>
}

const MovimientosContext = React.createContext<MovimientosContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function MovimientosProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<MovimientosDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Movimiento | null>(null)

  return (
    <MovimientosContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </MovimientosContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMovimientos = () => {
  const movimientosContext = React.useContext(MovimientosContext)

  if (!movimientosContext) {
    throw new Error('useMovimientos has to be used within <MovimientosContext>')
  }

  return movimientosContext
} 