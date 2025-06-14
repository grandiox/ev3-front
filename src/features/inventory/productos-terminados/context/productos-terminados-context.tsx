import React, { createContext, useContext, useState } from 'react'
import { ProductoTerminado } from '../data/schema'

type DialogType = 'add' | 'edit' | null

interface ProductosTerminadosContextType {
  open: DialogType
  setOpen: (open: DialogType) => void
  currentRow: ProductoTerminado | null
  setCurrentRow: (row: ProductoTerminado | null) => void
}

const ProductosTerminadosContext = createContext<ProductosTerminadosContextType | undefined>(undefined)

export function ProductosTerminadosProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<ProductoTerminado | null>(null)

  return (
    <ProductosTerminadosContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProductosTerminadosContext.Provider>
  )
}

export function useProductosTerminados() {
  const context = useContext(ProductosTerminadosContext)
  if (context === undefined) {
    throw new Error('useProductosTerminados must be used within a ProductosTerminadosProvider')
  }
  return context
} 