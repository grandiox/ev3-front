import { createContext, useContext, useState } from 'react'
import { Rol } from '@/services/api/roles'
import { RolesDialogType } from '../components/roles-dialogs'

interface RolesContextType {
  open: RolesDialogType
  setOpen: (d: RolesDialogType) => void
  currentRow: Rol | null
  setCurrentRow: (r: Rol | null) => void
}

const RolesContext = createContext<RolesContextType | undefined>(undefined)

export function RolesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<RolesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Rol | null>(null)

  return (
    <RolesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RolesContext.Provider>
  )
}

export function useRoles() {
  const ctx = useContext(RolesContext)
  if (!ctx) throw new Error('useRoles debe usarse dentro de <RolesProvider>')
  return ctx
} 