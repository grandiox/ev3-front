import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Pedido } from '@/services/api/pedidos'

type PedidosDialogType = 'add' | 'edit' | 'view' | 'delete'

interface PedidosContextType {
  open: PedidosDialogType | null
  setOpen: (str: PedidosDialogType | null) => void
  currentRow: Pedido | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Pedido | null>>
}

const PedidosContext = React.createContext<PedidosContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export function PedidosProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<PedidosDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Pedido | null>(null)

  return (
    <PedidosContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PedidosContext.Provider>
  )
}

export const usePedidos = () => {
  const pedidosContext = React.useContext(PedidosContext)
  if (!pedidosContext) {
    throw new Error('usePedidos has to be used within <PedidosProvider>')
  }
  return pedidosContext
} 