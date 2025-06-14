import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { LoteProducto } from '../data/schema'

type LotesProductoDialogType = 'add' | 'edit' | 'delete' | 'view'

interface LotesProductoContextType {
  open: LotesProductoDialogType | null
  setOpen: (str: LotesProductoDialogType | null) => void
  currentRow: LoteProducto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LoteProducto | null>>
}

const LotesProductoContext = React.createContext<LotesProductoContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function LotesProductoProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<LotesProductoDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LoteProducto | null>(null)

  return (
    <LotesProductoContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LotesProductoContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLotesProducto = () => {
  const lotesProductoContext = React.useContext(LotesProductoContext)

  if (!lotesProductoContext) {
    throw new Error('useLotesProducto has to be used within <LotesProductoContext>')
  }

  return lotesProductoContext
} 