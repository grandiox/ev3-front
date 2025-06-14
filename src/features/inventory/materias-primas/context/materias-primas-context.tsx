import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { MateriaPrima } from '../data/schema'

type MateriasPrimasDialogType = 'add' | 'edit' | 'delete'

interface MateriasPrimasContextType {
  open: MateriasPrimasDialogType | null
  setOpen: (str: MateriasPrimasDialogType | null) => void
  currentRow: MateriaPrima | null
  setCurrentRow: React.Dispatch<React.SetStateAction<MateriaPrima | null>>
}

const MateriasPrimasContext = React.createContext<MateriasPrimasContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function MateriasPrimasProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<MateriasPrimasDialogType>(null)
  const [currentRow, setCurrentRow] = useState<MateriaPrima | null>(null)

  return (
    <MateriasPrimasContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </MateriasPrimasContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMateriasPrimas = () => {
  const materiasPrimasContext = React.useContext(MateriasPrimasContext)

  if (!materiasPrimasContext) {
    throw new Error('useMateriasPrimas has to be used within <MateriasPrimasContext>')
  }

  return materiasPrimasContext
} 