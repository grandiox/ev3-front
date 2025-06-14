import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Receta } from '@/services/api/recetas'

type RecetasDialogType = 'add' | 'edit' | 'view' | 'delete'

interface RecetasContextType {
  open: RecetasDialogType | null
  setOpen: (str: RecetasDialogType | null) => void
  currentRow: Receta | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Receta | null>>
}

const RecetasContext = React.createContext<RecetasContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function RecetasProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<RecetasDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Receta | null>(null)

  return (
    <RecetasContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RecetasContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRecetas = () => {
  const recetasContext = React.useContext(RecetasContext)

  if (!recetasContext) {
    throw new Error('useRecetas has to be used within <RecetasContext>')
  }

  return recetasContext
} 