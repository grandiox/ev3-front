import { createContext, useContext, useState } from 'react'
import { type Venta } from '@/services/api/ventas'

interface VentasContextType {
  open: 'add' | 'edit' | 'view' | null
  setOpen: (open: 'add' | 'edit' | 'view' | null) => void
  currentRow: Venta | null
  setCurrentRow: (row: Venta | null) => void
}

const VentasContext = createContext<VentasContextType | undefined>(undefined)

export function VentasProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<'add' | 'edit' | 'view' | null>(null)
  const [currentRow, setCurrentRow] = useState<Venta | null>(null)

  return (
    <VentasContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </VentasContext.Provider>
  )
}

export function useVentas() {
  const context = useContext(VentasContext)
  if (context === undefined) {
    throw new Error('useVentas must be used within a VentasProvider')
  }
  return context
} 