import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { LoteFabricacion } from '@/services/api/lotes-fabricacion'

type LotesFabricacionDialogType = 'add' | 'edit' | 'view' | 'delete'

interface LotesFabricacionContextType {
  open: LotesFabricacionDialogType | null
  setOpen: (str: LotesFabricacionDialogType | null) => void
  currentRow: LoteFabricacion | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LoteFabricacion | null>>
}

const LotesFabricacionContext = React.createContext<LotesFabricacionContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function LotesFabricacionProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<LotesFabricacionDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LoteFabricacion | null>(null)

  return (
    <LotesFabricacionContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LotesFabricacionContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLotesFabricacion = () => {
  const lotesFabricacionContext = React.useContext(LotesFabricacionContext)

  if (!lotesFabricacionContext) {
    throw new Error('useLotesFabricacion has to be used within <LotesFabricacionContext>')
  }

  return lotesFabricacionContext
} 