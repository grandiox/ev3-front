import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Cliente } from '@/services/api/clientes'

type ClientesDialogType = 'add' | 'edit' | 'view' | 'delete'

interface ClientesContextType {
  open: ClientesDialogType | null
  setOpen: (str: ClientesDialogType | null) => void
  currentRow: Cliente | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Cliente | null>>
}

const ClientesContext = React.createContext<ClientesContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ClientesProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ClientesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Cliente | null>(null)

  return (
    <ClientesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ClientesContext.Provider>
  )
}

export const useClientes = () => {
  const clientesContext = React.useContext(ClientesContext)
  if (!clientesContext) {
    throw new Error('useClientes has to be used within <ClientesProvider>')
  }
  return clientesContext
} 