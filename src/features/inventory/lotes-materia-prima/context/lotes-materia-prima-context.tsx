import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { LoteMateriaPrima } from '../data/schema'

type LotesMateriaPrimaDialogType = 'add' | 'edit' | 'delete'

interface LotesMateriaPrimaContextType {
  open: LotesMateriaPrimaDialogType | null
  setOpen: (str: LotesMateriaPrimaDialogType | null) => void
  currentRow: LoteMateriaPrima | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LoteMateriaPrima | null>>
}

const LotesMateriaPrimaContext = React.createContext<LotesMateriaPrimaContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function LotesMateriaPrimaProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<LotesMateriaPrimaDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LoteMateriaPrima | null>(null)

  return (
    <LotesMateriaPrimaContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LotesMateriaPrimaContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLotesMateriaPrima = () => {
  const lotesMateriaPrimaContext = React.useContext(LotesMateriaPrimaContext)

  if (!lotesMateriaPrimaContext) {
    throw new Error('useLotesMateriaPrima has to be used within <LotesMateriaPrimaContext>')
  }

  return lotesMateriaPrimaContext
} 